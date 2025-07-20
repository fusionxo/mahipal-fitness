import { AppState } from '../common.js';

const renderProfilePage = () => {
    if (!AppState.isInitialized) return;

    const { profile, workouts, dailyStats, foodLogs } = AppState;

    // Populate header
    document.getElementById('profile-page-avatar').src = profile.avatar || 'https://placehold.co/120x120/FFC700/000?text=A';
    document.getElementById('profile-page-name').textContent = profile.name;
    document.getElementById('profile-page-email').textContent = profile.email;

    // Populate daily stats
    const statsSummary = document.getElementById('daily-stats-summary');
    statsSummary.innerHTML = `
        <div class="bg-[#0D0D0D] p-4 rounded-lg">
            <p class="text-sm text-gray-400">Calories Consumed</p>
            <p class="text-2xl font-bold">${dailyStats.consumed || 0} <span class="text-base font-normal">kcal</span></p>
        </div>
        <div class="bg-[#0D0D0D] p-4 rounded-lg">
            <p class="text-sm text-gray-400">Calories Burned</p>
            <p class="text-2xl font-bold">${dailyStats.burned || 0} <span class="text-base font-normal">kcal</span></p>
        </div>
        <div class="bg-[#0D0D0D] p-4 rounded-lg">
            <p class="text-sm text-gray-400">Water Intake</p>
            <p class="text-2xl font-bold">${dailyStats.water || 0} <span class="text-base font-normal">ml</span></p>
        </div>
        <div class="bg-[#0D0D0D] p-4 rounded-lg">
            <p class="text-sm text-gray-400">Net Calories</p>
            <p class="text-2xl font-bold">${(dailyStats.consumed || 0) - (dailyStats.burned || 0)} <span class="text-base font-normal">kcal</span></p>
        </div>
    `;

    // Populate food logs
    const foodLogList = document.getElementById('food-log-list');
    if (foodLogs && foodLogs.length > 0) {
        foodLogList.innerHTML = foodLogs.map(log => `
            <div class="bg-[#0D0D0D] p-3 rounded-lg flex justify-between items-center">
                <div>
                    <p class="font-semibold">${log.foodName}</p>
                    <p class="text-sm text-gray-400">${log.servingSize}</p>
                </div>
                <span class="font-bold text-yellow-400">${log.calories} kcal</span>
            </div>
        `).join('');
    } else {
        foodLogList.innerHTML = '<p class="text-gray-500">No food logged today.</p>';
    }

    // Populate recent workouts
    const workoutsList = document.getElementById('recent-workouts-list');
    const recentWorkouts = workouts.filter(w => w.status === 'completed').slice(0, 3);
    if (recentWorkouts.length > 0) {
        workoutsList.innerHTML = recentWorkouts.map(w => `
            <div class="bg-[#0D0D0D] rounded-lg">
                <div class="profile-workout-header p-4 cursor-pointer flex justify-between items-center">
                    <div>
                        <p class="font-semibold">${new Date(w.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        <p class="text-sm text-gray-400">${w.exercises.length} exercises - ${w.totalVolume}kg Total Volume</p>
                    </div>
                    <span class="profile-workout-icon text-xl transition-transform">▶</span>
                </div>
                <div class="profile-workout-content hidden p-4 border-t border-gray-700">
                    <ul class="space-y-4">
                        ${w.exercises.map(ex => `
                            <li class="space-y-1">
                                <h4 class="font-semibold text-md">${ex.name}</h4>
                                <ul class="text-sm text-gray-300">
                                    ${ex.sets.map((set, i) => `
                                        <li class="grid grid-cols-3 gap-2 text-center p-1.5 rounded">
                                            <span>Set ${i + 1}</span>
                                            <span>${set.weight}kg x ${set.reps}</span>
                                            <span>Volume: ${set.weight * set.reps}kg</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    } else {
        workoutsList.innerHTML = '<p class="text-gray-500">No completed workouts found.</p>';
    }
};

const setupEventListeners = () => {
    const workoutsList = document.getElementById('recent-workouts-list');
    if (workoutsList) {
        workoutsList.addEventListener('click', (e) => {
            const header = e.target.closest('.profile-workout-header');
            if (header) {
                const content = header.nextElementSibling;
                const icon = header.querySelector('.profile-workout-icon');
                content.classList.toggle('hidden');
                icon.classList.toggle('rotate-90');
            }
        });
    }
};

export default function initializeProfilePage() {
    if (AppState.isInitialized) {
        renderProfilePage();
        setupEventListeners();
    } else {
        document.addEventListener('app-initialized', () => {
            renderProfilePage();
            setupEventListeners();
        }, { once: true });
    }
}
