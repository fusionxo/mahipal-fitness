import { AppState, showToast } from '../common.js';

// --- MODULE STATE ---
let newAvatarData = null; // To hold the new Base64 image data

// --- DOM CACHE ---
const dom = {};

const cacheDom = () => {
    // Forms
    dom.profileForm = document.getElementById('profile-form');
    dom.goalsForm = document.getElementById('goals-form');

    // Profile Accordion
    dom.profileAccordionHeader = document.getElementById('profile-accordion-header');
    dom.profileAccordionContent = document.getElementById('profile-accordion-content');
    dom.profileAccordionIcon = document.getElementById('profile-accordion-icon');

    // Goals Accordion
    dom.goalsAccordionHeader = document.getElementById('goals-accordion-header');
    dom.goalsAccordionContent = document.getElementById('goals-accordion-content');
    dom.goalsAccordionIcon = document.getElementById('goals-accordion-icon');

    // Profile Form Inputs
    dom.profileAvatarPreview = document.getElementById('profile-avatar-preview');
    dom.profileAvatarInput = document.getElementById('profile-avatar-input');
    dom.profileNameInput = document.getElementById('profile-name-input');
    dom.profileEmailInput = document.getElementById('profile-email-input');
    dom.profileProteinInput = document.getElementById('profile-protein-input');
    dom.profileCarbsInput = document.getElementById('profile-carbs-input');
    dom.profileFatInput = document.getElementById('profile-fat-input');

    // Goals Form Inputs
    dom.goalsCaloriesInput = document.getElementById('goals-calories-input');
    dom.goalsWaterInput = document.getElementById('goals-water-input');
    dom.goalsTypeInput = document.getElementById('goals-type-input');
};

// --- RENDER/POPULATE FUNCTIONS ---
const populateForms = () => {
    if (!AppState.isInitialized) return;
    const { profile } = AppState;

    // Populate Profile Form
    dom.profileAvatarPreview.src = profile.avatar || 'https://placehold.co/120x120/FFC700/000?text=A';
    dom.profileNameInput.value = profile.name || '';
    dom.profileEmailInput.value = profile.email || '';
    dom.profileProteinInput.value = profile.macros.protein || 0;
    dom.profileCarbsInput.value = profile.macros.carbs || 0;
    dom.profileFatInput.value = profile.macros.fat || 0;

    // Populate Goals Form
    dom.goalsCaloriesInput.value = profile.goals.calories || 2000;
    dom.goalsWaterInput.value = profile.goals.water || 8;
    dom.goalsTypeInput.value = profile.goals.type || 'maintain';
};

// --- API & EVENT HANDLERS ---
const handleAvatarChange = () => {
    const file = dom.profileAvatarInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
        // Show preview and store the Base64 data
        dom.profileAvatarPreview.src = reader.result;
        newAvatarData = reader.result;
    };
    reader.readAsDataURL(file);
};

const handleSave = async (e) => {
    e.preventDefault();
    const saveButton = e.submitter;
    const originalButtonText = saveButton.innerHTML;

    saveButton.disabled = true;
    saveButton.innerHTML = 'Saving...';

    const protein = parseInt(dom.profileProteinInput.value, 10);
    const carbs = parseInt(dom.profileCarbsInput.value, 10);
    const fat = parseInt(dom.profileFatInput.value, 10);
    if (protein + carbs + fat !== 100) {
        showToast('Macro percentages must add up to 100.', true);
        saveButton.disabled = false;
        saveButton.innerHTML = originalButtonText;
        return;
    }

    const payload = {
        name: dom.profileNameInput.value,
        email: dom.profileEmailInput.value,
        macros: { protein, carbs, fat },
        goals: {
            calories: parseInt(dom.goalsCaloriesInput.value, 10),
            water: parseInt(dom.goalsWaterInput.value, 10),
            type: dom.goalsTypeInput.value,
        },
        // Include the new avatar data if it exists, otherwise use the old one
        avatar: newAvatarData || AppState.profile.avatar,
    };

    try {
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${AppState.token}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error('Failed to save settings.');
        
        AppState.profile = { ...AppState.profile, ...payload };
        newAvatarData = null; // Reset after successful save
        
        // Update header avatar immediately
        document.getElementById('header-avatar-img').src = AppState.profile.avatar;

        saveButton.innerHTML = 'Saved!';
        setTimeout(() => {
            saveButton.disabled = false;
            saveButton.innerHTML = originalButtonText;
        }, 2000);

    } catch (error) {
        showToast(error.message, true);
        saveButton.disabled = false;
        saveButton.innerHTML = originalButtonText;
    }
};

const toggleAccordion = (content, icon) => {
    content.classList.toggle('hidden');
    icon.classList.toggle('rotate-90');
};

const setupEventListeners = () => {
    dom.profileForm.addEventListener('submit', handleSave);
    dom.goalsForm.addEventListener('submit', handleSave);
    dom.profileAvatarInput.addEventListener('change', handleAvatarChange);

    dom.profileAccordionHeader.addEventListener('click', () => {
        toggleAccordion(dom.profileAccordionContent, dom.profileAccordionIcon);
    });
    dom.goalsAccordionHeader.addEventListener('click', () => {
        toggleAccordion(dom.goalsAccordionContent, dom.goalsAccordionIcon);
    });
};

// --- INITIALIZATION ---
export default function initializeSettingsPage() {
    if (AppState.isInitialized) {
        cacheDom();
        populateForms();
        setupEventListeners();
    } else {
        document.addEventListener('app-initialized', () => {
            cacheDom();
            populateForms();
            setupEventListeners();
        }, { once: true });
    }
}
