// public/js/pages/calculator.js

function initializeCalculators() {
    const calculateBmiBtn = document.getElementById('calculate-bmi');
    const calculateBmrBtn = document.getElementById('calculate-bmr');

    if (calculateBmiBtn) {
        calculateBmiBtn.addEventListener('click', () => {
            const weight = parseFloat(document.getElementById('bmi-weight').value);
            const height = parseFloat(document.getElementById('bmi-height').value);
            const resultEl = document.getElementById('bmi-result');
            if (weight > 0 && height > 0) {
                const bmi = (weight / ((height / 100) ** 2)).toFixed(1);
                let category = '';
                if (bmi < 18.5) category = 'Underweight';
                else if (bmi < 24.9) category = 'Normal weight';
                else if (bmi < 29.9) category = 'Overweight';
                else category = 'Obesity';
                resultEl.innerHTML = `<p class="text-2xl font-bold">${bmi}</p><p class="text-gray-400">${category}</p>`;
            } else {
                resultEl.innerHTML = `<p class="text-red-400">Please enter valid weight and height.</p>`;
            }
        });
    }

    if (calculateBmrBtn) {
        calculateBmrBtn.addEventListener('click', () => {
            const age = parseInt(document.getElementById('bmr-age').value);
            const gender = document.getElementById('bmr-gender').value;
            const weight = parseFloat(document.getElementById('bmr-weight').value);
            const height = parseFloat(document.getElementById('bmr-height').value);
            const resultEl = document.getElementById('bmr-result');
            if (age > 0 && weight > 0 && height > 0) {
                let bmr = 0;
                if (gender === 'male') {
                    bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
                } else {
                    bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
                }
                resultEl.innerHTML = `<p class="text-2xl font-bold">${bmr.toFixed(0)}</p><p class="text-gray-400">calories/day</p>`;
            } else {
                resultEl.innerHTML = `<p class="text-red-400">Please fill all fields correctly.</p>`;
            }
        });
    }
}

// Run the initialization function for this page
initializeCalculators();
