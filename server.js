const express = require('express');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let db;
MongoClient.connect(MONGODB_URI)
  .then(client => {
    db = client.db('AuraFlexApp');
    console.log('Connected to MongoDB');
  })
  .catch(err => console.error('MongoDB connection error:', err));

app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// ===== Middleware =====
const authMiddleware = (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

// ===== Auth & App Data APIs =====
app.post('/auth/register', async (req, res) => {
  try {
    const { email, password, name, age, gender, fitnessGoal } = req.body;
    if (!email || !password || !name || !age || !gender || !fitnessGoal) {
      return res.status(400).json({ error: 'All fields required.' });
    }
    if (await db.collection('users').findOne({ email })) {
      return res.status(409).json({ error: 'User already exists.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const userResult = await db.collection('users').insertOne({
      email,
      password: hashed,
      onboardingComplete: true
    });
    const userId = userResult.insertedId;
    await db.collection('profiles').insertOne({
      userId,
      email,
      name,
      age: parseInt(age, 10),
      gender,
      goals: { type: fitnessGoal, calories: 2000, water: 8 },
      macros: { protein: 25, carbs: 50, fat: 25 },
      darkMode: false,
      avatar: 'https://placehold.co/120x120/FFC700/000?text=A' // Default avatar
    });
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Registration failed.' });
  }
});

app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.collection('users').findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, onboardingComplete: user.onboardingComplete });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login error.' });
  }
});
app.get('/api/app-data', authMiddleware, async (req, res) => {
  try {
    const userId = new ObjectId(req.userId);
    
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const profile = await db.collection('profiles').findOne({ userId });
    if (!profile) return res.status(404).json({ error: 'Profile not found.' });
    
    const workouts = await db.collection('workouts').find({ userId }).sort({ date: -1 }).toArray();
    const dailyStats = await db.collection('dailyStats').findOne({ userId }) || { consumed: 0, burned: 0, net: 0, water: 0 };
    
    const foodLogs = await db.collection('foodLogs').find({ 
        userId: userId,
        date: { $gte: startOfDay, $lt: endOfDay }
    }).sort({ date: -1 }).toArray();

    res.json({ profile, workouts, dailyStats, foodLogs });
  } catch (err) {
    console.error('App data error:', err);
    res.status(500).json({ error: 'Failed to fetch app data.' });
  }
});

app.put('/api/profile', authMiddleware, async (req, res) => {
  try {
    const userId = new ObjectId(req.userId);
    const { name, email, macros, goals, avatar } = req.body;

    const updateData = {
        name,
        email,
        macros,
        goals,
        avatar
    };

    const result = await db.collection('profiles').updateOne(
      { userId },
      { $set: updateData }
    );
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Profile not found.' });
    }
    res.json({ message: 'Profile updated successfully.' });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

app.put('/api/daily-stats', authMiddleware, async (req, res) => {
    try {
        const userId = new ObjectId(req.userId);
        const { water } = req.body;

        const result = await db.collection('dailyStats').updateOne(
            { userId },
            { $set: { water: water } },
            { upsert: true }
        );

        res.json({ message: 'Daily stats updated successfully.' });
    } catch (err) {
        console.error('Daily stats update error:', err);
        res.status(500).json({ error: 'Failed to update daily stats.' });
    }
});


// ===== Workout APIs =====
app.get('/api/workouts', authMiddleware, async (req, res) => {
  try {
    const userId = new ObjectId(req.userId);
    const workouts = await db.collection('workouts').find({ userId }).sort({ date: -1 }).toArray();
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workouts.' });
  }
});

app.post('/api/workouts', authMiddleware, async (req, res) => {
  try {
    const userId = new ObjectId(req.userId);
    const workout = { userId, ...req.body, date: new Date(req.body.date) };
    delete workout._id; 
    const result = await db.collection('workouts').insertOne(workout);
    res.status(201).json({ message: 'Workout logged.', insertedId: result.insertedId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log workout.' });
  }
});

app.put('/api/workouts/:id', authMiddleware, async (req, res) => {
    try {
        const userId = new ObjectId(req.userId);
        const workoutId = new ObjectId(req.params.id);
        const { date, exercises, totalVolume, status } = req.body;
        
        const result = await db.collection('workouts').updateOne(
            { _id: workoutId, userId: userId },
            { $set: { date: new Date(date), exercises, totalVolume, status } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'Workout not found or user not authorized.' });
        }
        
        res.json({ message: 'Workout updated successfully.' });
    } catch (err) {
        if (err.name === 'BSONError') {
            return res.status(400).json({ error: 'Invalid workout ID format.' });
        }
        res.status(500).json({ error: 'Failed to update workout.' });
    }
});

app.delete('/api/workouts/:id', authMiddleware, async (req, res) => {
    try {
        const userId = new ObjectId(req.userId);
        const workoutId = new ObjectId(req.params.id);
        const result = await db.collection('workouts').deleteOne({ _id: workoutId, userId: userId });
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Workout not found or user not authorized.' });
        res.json({ message: 'Workout deleted successfully.' });
    } catch (err) {
        if (err.name === 'BSONError') return res.status(400).json({ error: 'Invalid workout ID format.' });
        res.status(500).json({ error: 'Failed to delete workout.' });
    }
});

// ===== AI & Other APIs =====
app.post('/api/analyze', authMiddleware, async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt) return res.status(400).json({ error: 'Prompt is required.' });
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        const aiRes = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        if (!aiRes.ok) throw new Error('AI service error');
        const aiData = await aiRes.json();
        res.json(aiData);
    } catch (err) {
        res.status(500).json({ error: 'Failed to get analysis from AI.' });
    }
});

app.post('/api/food-search', authMiddleware, async (req, res) => {
    try {
        const { foodName, quantity, unit } = req.body;
        const prompt = `Provide a detailed nutritional analysis for ${quantity} ${unit} of "${foodName}". Return ONLY a valid JSON object. The root object should have keys: "foodName", "servingsPerContainer", "servingSize", "calories", and "nutrients". The "nutrients" key should be an object containing these keys (use null if a value is not applicable): "totalFat", "saturatedFat", "transFat", "cholesterol", "sodium", "totalCarbohydrate", "dietaryFiber", "totalSugars", "addedSugars", "protein", "vitaminD", "calcium", "iron", "potassium". Provide all nutrient values in grams (g) or milligrams (mg) or micrograms (mcg) as appropriate.`;
        
        const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        
        const aiRes = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        if (!aiRes.ok) {
            const errorBody = await aiRes.text();
            console.error('Gemini API Error:', errorBody);
            throw new Error(`AI service error: ${aiRes.status}`);
        }

        const aiData = await aiRes.json();
        
        if (!aiData.candidates || !aiData.candidates[0].content || !aiData.candidates[0].content.parts[0].text) {
            throw new Error('Invalid response structure from AI service.');
        }

        let text = aiData.candidates[0].content.parts[0].text.trim();
        
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        
        if (jsonStart === -1 || jsonEnd === 0) {
            throw new Error('No JSON object found in AI response.');
        }

        text = text.substring(jsonStart, jsonEnd);

        try {
            const parsedJson = JSON.parse(text);
            res.json(parsedJson);
        } catch (parseError) {
            console.error('JSON parsing error:', parseError);
            console.error('Raw text from AI:', text);
            throw new Error('Failed to parse nutrition data from AI response.');
        }

    } catch (err) {
        console.error('Nutrition lookup error:', err);
        res.status(500).json({ error: err.message || 'Failed to fetch nutrition data.' });
    }
});

app.post('/api/log-food', authMiddleware, async (req, res) => {
    try {
        const userId = new ObjectId(req.userId);
        const { foodName, servingSize, calories, protein, carbs, fat } = req.body;

        if (!foodName || calories === undefined) {
            return res.status(400).json({ error: 'Missing required food data.' });
        }

        await db.collection('foodLogs').insertOne({
            userId, foodName, servingSize, calories, protein, carbs, fat, date: new Date()
        });

        await db.collection('dailyStats').updateOne(
            { userId },
            { $inc: { consumed: parseFloat(calories) || 0 } },
            { upsert: true }
        );

        res.json({ message: 'Food logged successfully.' });
    } catch (err) {
        console.error('Food log error:', err);
        res.status(500).json({ error: 'Failed to log food.' });
    }
});

// NEW: API Route to delete a food log entry
app.delete('/api/log-food/:id', authMiddleware, async (req, res) => {
    try {
        const userId = new ObjectId(req.userId);
        const logId = new ObjectId(req.params.id);

        // First, find the food log to get its calorie count
        const foodLog = await db.collection('foodLogs').findOne({ _id: logId, userId: userId });
        if (!foodLog) {
            return res.status(404).json({ error: 'Food log not found or user not authorized.' });
        }
        const caloriesToSubtract = foodLog.calories || 0;

        // Delete the log
        await db.collection('foodLogs').deleteOne({ _id: logId, userId: userId });
        
        // Decrement the consumed calories in dailyStats
        await db.collection('dailyStats').updateOne(
            { userId },
            { $inc: { consumed: -caloriesToSubtract } }
        );

        res.json({ message: 'Food log deleted successfully.' });
    } catch (err) {
        if (err.name === 'BSONError') return res.status(400).json({ error: 'Invalid log ID format.' });
        console.error('Delete food log error:', err);
        res.status(500).json({ error: 'Failed to delete food log.' });
    }
});


// ===== Main App Serving =====
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
