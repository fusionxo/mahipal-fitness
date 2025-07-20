import { AppState, showToast, refreshAppState } from '../common.js';

// --- MODULE STATE & DOM ---
let macrosChart = null;
let hydrationChart = null;
const dom = {};

// --- CACHE DOM ELEMENTS ---
const cacheDom = () => {
    const ids = ['welcome-message', 'goal-calories-header', 'consumed-card', 'consumed-calories-card', 'goal-calories-card', 'burned-calories-card', 'net-calories-card', 'progress-bar', 'progress-percentage', 'progress-text', 'macrosChart', 'macros-legend', 'hydration-total', 'hydrationChart', 'minus-glass-btn', 'glass-count', 'plus-glass-btn', 'activity-streak', 'consumed-food-modal', 'close-consumed-food-modal', 'consumed-food-list'];
    ids.forEach(id => {
        const key = id.replace(/-(\w)/g, (_, p1) => p1.toUpperCase());
        dom[key] = document.getElementById(id);
    });
};

// --- RENDER FUNCTIONS ---
const updateDOM = () => {
    if (!AppState.isInitialized) return;
    const { profile, dailyStats, foodLogs } = AppState;

    dom.welcomeMessage.textContent = `Welcome back, ${profile.name.split(' ')[0]}!`;
    dom.goalCaloriesHeader.textContent = `${profile.goals.calories} Kcal`;
    dom.consumedCaloriesCard.innerHTML = `${dailyStats.consumed || 0} <span class="text-sm font-normal">kcal</span>`;
    dom.goalCaloriesCard.innerHTML = `${profile.goals.calories} <span class="text-sm font-normal">kcal</span>`;
    dom.burnedCaloriesCard.innerHTML = `${dailyStats.burned || 0} <span class="text-sm font-normal">kcal</span>`;
    dom.netCaloriesCard.innerHTML = `${(dailyStats.consumed || 0) - (dailyStats.burned || 0)} <span class="text-sm font-normal">kcal</span>`;

    const progressPercentage = profile.goals.calories > 0 ? Math.min(Math.round(((dailyStats.consumed || 0) / profile.goals.calories) * 100), 100) : 0;
    dom.progressBar.style.width = `${progressPercentage}%`;
    dom.progressPercentage.textContent = `${progressPercentage}%`;
    dom.progressText.textContent = `${dailyStats.consumed || 0} / ${profile.goals.calories} kcal`;

    updateHydrationUI(dailyStats.water || 0);
    renderMacrosChart(foodLogs || []);
    renderHydrationChart();
};

const renderMacrosChart = (foodLogs) => {
    const ctx = dom.macrosChart?.getContext('2d');
    if (!ctx) return;

    const totalProtein = foodLogs.reduce((sum, log) => sum + (log.protein || 0), 0);
    const totalCarbs = foodLogs.reduce((sum, log) => sum + (log.carbs || 0), 0);
    const totalFat = foodLogs.reduce((sum, log) => sum + (log.fat || 0), 0);
    const totalMacros = totalProtein + totalCarbs + totalFat;

    let dataPoints = [totalProtein, totalCarbs, totalFat];
    if (totalMacros === 0) {
        dataPoints = [1];
    }

    const data = {
        labels: ['Protein', 'Carbs', 'Fat'],
        datasets: [{
            data: dataPoints,
            backgroundColor: totalMacros === 0 ? ['#374151'] : ['#3478F6', '#FF9500', '#FFC700'],
            borderColor: '#1C1C1E',
            borderWidth: 5,
            cutout: '80%'
        }]
    };

    if (macrosChart) macrosChart.destroy();
    macrosChart = new Chart(ctx, { type: 'doughnut', data, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } } });
    
    dom.macrosLegend.innerHTML = data.labels.map((label, i) => {
        const value = label === 'Protein' ? totalProtein : label === 'Carbs' ? totalCarbs : totalFat;
        const color = totalMacros === 0 ? '#374151' : data.datasets[0].backgroundColor[i];
        return `
            <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg flex items-center justify-center" style="background-color: ${color}20;">
                        <div class="w-3 h-3 rounded-full" style="background-color: ${color};"></div>
                    </div>
                    <div><p class="text-sm text-gray-400">${label}</p></div>
                </div>
                <p class="font-semibold">${value.toFixed(1)}g</p>
            </div>`;
    }).join('');
};

const renderHydrationChart = () => {
    const ctx = dom.hydrationChart?.getContext('2d');
    if (!ctx) return;
    if (hydrationChart) hydrationChart.destroy();
    
    const labels = ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', 'Now'];
    const dataPoints = labels.map((_, i) => {
        const progress = i / (labels.length - 1);
        return Math.round(progress * ((AppState.dailyStats.water || 0) / 250));
    });

    hydrationChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Hydration',
                data: dataPoints,
                fill: true,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderColor: 'rgba(255, 255, 255, 0.5)',
                tension: 0.4,
                pointRadius: 0
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            scales: { y: { display: false }, x: { display: false } },
            plugins: { legend: { display: false } }
        }
    });
};

const renderConsumedFoodModal = () => {
    const { foodLogs } = AppState;
    if (!foodLogs || foodLogs.length === 0) {
        dom.consumedFoodList.innerHTML = '<p class="text-gray-500 text-center">No food logged yet today.</p>';
        return;
    }
    dom.consumedFoodList.innerHTML = foodLogs.map(log => `
        <div class="bg-[#0D0D0D] p-3 rounded-lg">
            <div class="flex justify-between items-center">
                <div>
                    <p class="font-semibold">${log.foodName}</p>
                    <p class="text-sm text-gray-400">${log.servingSize}</p>
                </div>
                <span class="font-bold text-yellow-400">${log.calories} kcal</span>
            </div>
            <div class="text-xs text-gray-400 grid grid-cols-3 gap-2 mt-2 text-center">
                <span>Protein: ${log.protein.toFixed(1)}g</span>
                <span>Carbs: ${log.carbs.toFixed(1)}g</span>
                <span>Fat: ${log.fat.toFixed(1)}g</span>
            </div>
        </div>
    `).join('');
};

// --- HYDRATION LOGIC ---
const updateHydrationUI = (currentMl) => {
    const glasses = Math.round(currentMl / 250);
    const standardizedMl = glasses * 250;
    
    dom.hydrationTotal.innerHTML = `${standardizedMl} <span class="text-lg font-normal">ml</span>`;
    dom.glassCount.textContent = glasses;
    
    AppState.dailyStats.water = standardizedMl;
    renderHydrationChart();
};

const handleHydrationUpdate = async (amount) => {
    let currentMl = AppState.dailyStats.water || 0;
    const newMl = Math.max(0, currentMl + amount);

    updateHydrationUI(newMl);

    try {
        const response = await fetch('/api/daily-stats', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AppState.token}`
            },
            body: JSON.stringify({ water: newMl })
        });
        if (!response.ok) throw new Error('Failed to save hydration data.');
        console.log("Hydration data saved to DB.");
    } catch (error) {
        showToast(error.message, true);
        updateHydrationUI(currentMl); // Revert UI on error
    }
};

// --- EVENT HANDLERS ---
const setupEventListeners = () => {
    dom.plusGlassBtn.onclick = () => handleHydrationUpdate(250);
    dom.minusGlassBtn.onclick = () => handleHydrationUpdate(-250);

    dom.consumedCard.addEventListener('click', () => {
        renderConsumedFoodModal();
        dom.consumedFoodModal.classList.remove('hidden');
        dom.consumedFoodModal.classList.add('flex');
    });
    dom.closeConsumedFoodModal.addEventListener('click', () => {
        dom.consumedFoodModal.classList.add('hidden');
        dom.consumedFoodModal.classList.remove('flex');
    });
    dom.consumedFoodModal.addEventListener('click', (e) => {
        if (e.target === dom.consumedFoodModal) {
            dom.consumedFoodModal.classList.add('hidden');
            dom.consumedFoodModal.classList.remove('flex');
        }
    });
};

// --- INITIALIZATION ---
export default function initializeHomePage() {
    if (AppState.isInitialized) {
        cacheDom();
        updateDOM();
        setupEventListeners();
    } else {
        document.addEventListener('app-initialized', () => {
            cacheDom();
            updateDOM();
            setupEventListeners();
        }, { once: true });
    }
}
