import { AppState, showToast, updateGlobalState, API_BASE_URL } from '../common.js';

// --- MODULE STATE ---
let logFoodState = {
    currentData: null,
};

// --- DOM CACHE ---
const dom = {};

const cacheDom = () => {
    dom.foodSearchBtn = document.getElementById('food-search-btn');
    dom.foodSearchResults = document.getElementById('food-search-results');
    dom.logFoodModal = document.getElementById('log-food-modal');
    dom.logFoodBtnDesktop = document.getElementById('log-food-btn-desktop');
    dom.closeLogFoodModalBtn = document.getElementById('close-log-food-modal');
    dom.logFoodStep1 = document.getElementById('log-food-step-1');
    dom.logFoodSearchForm = document.getElementById('log-food-search-form');
    dom.logFoodName = document.getElementById('log-food-name');
    dom.logFoodQuantity = document.getElementById('log-food-quantity');
    dom.logFoodUnit = document.getElementById('log-food-unit');
    dom.getNutritionBtn = document.getElementById('log-food-get-nutrition-btn');
    dom.logFoodStep2 = document.getElementById('log-food-step-2');
    dom.logFoodResults = document.getElementById('log-food-results');
    dom.logFoodBackBtn = document.getElementById('log-food-back-btn');
    dom.logFoodConfirmBtn = document.getElementById('log-food-confirm-btn');
};

// --- RENDER FUNCTIONS ---
const createNutrientRow = (label, amount, unit = 'g', indent = false, isBold = true) => {
    if (amount === null || amount === undefined) return '';
    const boldClass = isBold ? 'font-bold' : '';
    const indentClass = indent ? 'pl-4' : '';
    return `
        <div class="nutrient-row flex justify-between ${indentClass}">
            <span class="${boldClass}">${label}</span>
            <span class="${boldClass}">${amount}${unit}</span>
        </div>
    `;
};

const renderNutritionLabel = (data, container) => {
  const { foodName, servingSize, calories, nutrients } = data;
  if (!nutrients) {
    container.innerHTML = `<div class="text-red-500">No detailed nutrient data available.</div>`;
    return;
  }
  container.innerHTML = `
    <div class="nutrition-label">
        <h1 class="nutrition-title">Nutrition Facts</h1>
        <div class="serving-info">
            <span>Serving size</span>
            <span>${servingSize || 'N/A'}</span>
        </div>
        <div class="calories-info">
            <span>Amount per serving</span>
            <h2>Calories</h2>
            <h3>${calories || 'N/A'}</h3>
        </div>
        <div class="line thick"></div>
        <div class="daily-value-text text-right font-bold">% Daily Value*</div>
        <div class="line medium"></div>
        ${createNutrientRow('Total Fat', nutrients.totalFat)}
        ${createNutrientRow('Saturated Fat', nutrients.saturatedFat, 'g', true)}
        ${createNutrientRow('Trans Fat', nutrients.transFat, 'g', true)}
        ${createNutrientRow('Cholesterol', nutrients.cholesterol, 'mg')}
        ${createNutrientRow('Sodium', nutrients.sodium, 'mg')}
        ${createNutrientRow('Total Carbohydrate', nutrients.totalCarbohydrate)}
        ${createNutrientRow('Dietary Fiber', nutrients.dietaryFiber, 'g', true)}
        ${createNutrientRow('Total Sugars', nutrients.totalSugars, 'g', true)}
        ${createNutrientRow('Includes Added Sugars', nutrients.addedSugars, 'g', true, false)}
        ${createNutrientRow('Protein', nutrients.protein)}
        <div class="line thick"></div>
        <p class="footnote">*Values are estimates and may not be fully accurate.</p>
    </div>
  `;
};

// --- MODAL & LOGIC ---
const toggleModal = (show) => {
    if (show) {
        dom.logFoodStep1.classList.remove('hidden');
        dom.logFoodStep2.classList.add('hidden');
        dom.logFoodSearchForm.reset();
        logFoodState.currentData = null;
        dom.logFoodModal.classList.remove('hidden');
        dom.logFoodModal.classList.add('flex');
    } else {
        dom.logFoodModal.classList.add('hidden');
        dom.logFoodModal.classList.remove('flex');
    }
};

const getNutritionInfo = async (foodName, quantity, unit, button, resultsContainer) => {
    if (!foodName) {
        showToast('Please enter a food name.', true);
        return;
    }
    const originalButtonText = button.innerHTML;
    button.disabled = true;
    button.innerHTML = '<div class="loader mx-auto"></div>';
    resultsContainer.innerHTML = '';

    try {
        const res = await fetch(`${API_BASE_URL}/api/food-search`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${AppState.token}` },
            body: JSON.stringify({ foodName, quantity, unit })
        });
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || 'Failed to fetch data.');
        }
        const data = await res.json();
        renderNutritionLabel(data, resultsContainer);
        return data;
    } catch (error) {
        showToast(error.message, true);
        resultsContainer.innerHTML = `<div class="text-red-500">${error.message}</div>`;
        return null;
    } finally {
        button.disabled = false;
        button.innerHTML = originalButtonText;
    }
};

const handleConfirmLog = async () => {
    if (!logFoodState.currentData) {
        showToast('No food data to log.', true);
        return;
    }
    const { foodName, servingSize, calories, nutrients } = logFoodState.currentData;
    const payload = {
        foodName,
        servingSize,
        calories: calories || 0,
        protein: parseFloat(nutrients.protein) || 0,
        carbs: parseFloat(nutrients.totalCarbohydrate) || 0,
        fat: parseFloat(nutrients.totalFat) || 0,
    };

    try {
        const res = await fetch(`${API_BASE_URL}/api/log-food`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${AppState.token}` },
            body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error('Failed to log food.');
        
        await updateGlobalState(); 
        
        showToast('Food logged successfully!');
        toggleModal(false);

    } catch (error) {
        showToast(error.message, true);
    }
};

// --- EVENT HANDLERS ---
const setupEventListeners = () => {
    dom.foodSearchBtn.addEventListener('click', async () => {
        const name = document.getElementById('food-search-name').value;
        const qty = document.getElementById('food-search-quantity').value;
        const unit = document.getElementById('food-search-unit').value;
        await getNutritionInfo(name, qty, unit, dom.foodSearchBtn, dom.foodSearchResults);
    });

    dom.logFoodBtnDesktop.addEventListener('click', () => toggleModal(true));
    dom.closeLogFoodModalBtn.addEventListener('click', () => toggleModal(false));
    dom.logFoodModal.addEventListener('click', (e) => {
        if (e.target === dom.logFoodModal) toggleModal(false);
    });

    dom.logFoodSearchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = await getNutritionInfo(
            dom.logFoodName.value,
            dom.logFoodQuantity.value,
            dom.logFoodUnit.value,
            dom.getNutritionBtn,
            dom.logFoodResults
        );
        if (data) {
            logFoodState.currentData = data;
            dom.logFoodStep1.classList.add('hidden');
            dom.logFoodStep2.classList.remove('hidden');
        }
    });

    dom.logFoodBackBtn.addEventListener('click', () => {
        dom.logFoodStep2.classList.add('hidden');
        dom.logFoodStep1.classList.remove('hidden');
        logFoodState.currentData = null;
    });
    dom.logFoodConfirmBtn.addEventListener('click', handleConfirmLog);
};

// --- INITIALIZATION ---
export default function initializeFoodPage() {
    cacheDom();
    setupEventListeners();
}
