// public/js/login.js

const API_BASE_URL = 'https://mahipal-fitness.onrender.com'; // Replace with your actual Render URL

class AuthManager {
  constructor() {
    this.curStep = 1;
    this.tempCredentials = null;
    this.onboardingData = {};
    this.cacheElements();
    this.bindEvents();
    this.showScreen('signup');
    this.updateStep();
  }

  cacheElements() {
    this.screens = {
      signup: document.getElementById('signup-screen'),
      signin: document.getElementById('signin-screen'),
      onboarding: document.getElementById('onboarding-screen'),
    };
    this.forms = {
      signup: document.getElementById('signup-form'),
      signin: document.getElementById('signin-form'),
      onboard: document.getElementById('onboarding-form'),
    };
    this.links = {
      toSignin: document.getElementById('show-signin'),
      toSignup: document.getElementById('show-signup'),
    };
    this.buttons = {
      next: document.getElementById('next-btn'),
      back: document.getElementById('back-btn'),
    };
    this.toast = document.getElementById('toast');
  }

  bindEvents() {
    this.links.toSignin.addEventListener('click', e => { e.preventDefault(); this.showScreen('signin'); });
    this.links.toSignup.addEventListener('click', e => { e.preventDefault(); this.showScreen('signup'); });
    this.forms.signup.addEventListener('submit', e => this.handleSignup(e));
    this.forms.signin.addEventListener('submit', e => this.handleSignin(e));
    this.buttons.next.addEventListener('click', () => this.handleNext());
    this.buttons.back.addEventListener('click', () => this.handleBack());
  }

  showScreen(key) {
    Object.values(this.screens).forEach(s => s.classList.add('hidden'));
    this.screens[key].classList.remove('hidden');
  }

  handleSignup(e) {
    e.preventDefault();
    const email = this.forms.signup.email.value.trim();
    const password = this.forms.signup.password.value;
    if (!email || !password) {
      this.showToast('Email & password required', 'error');
      return;
    }
    this.tempCredentials = { email, password };
    this.showToast('Now let’s complete your profile.', 'success');
    setTimeout(() => this.showScreen('onboarding'), 300);
  }

  async handleSignin(e) {
    e.preventDefault();
    const email = this.forms.signin.email.value.trim();
    const password = this.forms.signin.password.value;
    if (!email || !password) {
      this.showToast('Email & password required', 'error');
      return;
    }
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify({ email, password })
      });
      const text = await res.text();
      if (!res.ok) {
        if (text.trim().startsWith('<')) throw new Error(`Server error: ${res.status}`);
        const err = JSON.parse(text).error;
        throw new Error(err || `Server error: ${res.status}`);
      }
      const data = JSON.parse(text);
      localStorage.setItem('authToken', data.token);
      if (data.onboardingComplete) window.location.href = '/';
      else {
        this.showToast('Welcome! Complete your profile.', 'success');
        setTimeout(() => this.showScreen('onboarding'), 300);
      }
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  handleNext() {
    if (!this.validateStep()) return;
    this.collectData();
    if (this.curStep < 5) {
      this.curStep++;
      this.updateStep();
    } else {
      this.finishRegistration();
    }
  }

  handleBack() {
    if (this.curStep > 1) {
      this.curStep--;
      this.updateStep();
    }
  }

  updateStep() {
    document.querySelectorAll('.step').forEach((el,i) => el.classList.toggle('active', i+1 === this.curStep));
    document.querySelectorAll('.form-step').forEach((el,i) => el.classList.toggle('active', i+1 === this.curStep));
    this.buttons.back.style.display = this.curStep === 1 ? 'none' : 'block';
    this.buttons.next.textContent = this.curStep === 5 ? 'Finish' : 'Next';
    if (this.curStep === 5) this.populateReview();
  }

  validateStep() {
    const stepEl = document.querySelector(`.form-step[data-step="${this.curStep}"]`);
    const fields = stepEl.querySelectorAll('[required]');
    for (let f of fields) {
      if (!f.value.trim()) {
        this.showToast('Please fill out all fields.', 'error');
        return false;
      }
    }
    return true;
  }

  collectData() {
    const stepEl = document.querySelector(`.form-step[data-step="${this.curStep}"]`);
    stepEl.querySelectorAll('input, select').forEach(inp => {
      this.onboardingData[inp.name] = inp.value.trim();
    });
  }

  populateReview() {
    const rv = document.getElementById('review-content');
    rv.innerHTML = `
      <div class="review-item"><span>Name</span><span>${this.onboardingData.name}</span></div>
      <div class="review-item"><span>Age</span><span>${this.onboardingData.age}</span></div>
      <div class="review-item"><span>Gender</span><span>${this.onboardingData.gender}</span></div>
      <div class="review-item"><span>Goal</span><span>${this.onboardingData.fitnessGoal}</span></div>
    `;
  }

  async finishRegistration() {
    if (!this.tempCredentials) {
      this.showToast('Unexpected error. Please sign up again.', 'error');
      return;
    }
    const payload = { ...this.tempCredentials, ...this.onboardingData };
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type':'application/json' },
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      if (!res.ok) {
        if (text.trim().startsWith('<')) throw new Error(`Server error: ${res.status}`);
        const err = JSON.parse(text).error;
        throw new Error(err || `Server error: ${res.status}`);
      }
      const data = JSON.parse(text);
      localStorage.setItem('authToken', data.token);
      this.showToast('Welcome aboard!', 'success');
      setTimeout(() => window.location.href = '/', 500);
    } catch (err) {
      this.showToast(err.message, 'error');
    }
  }

  showToast(msg, type='info') {
    this.toast.textContent = msg;
    this.toast.className = `toast show ${type}`;
    setTimeout(() => this.toast.classList.remove('show', type), 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => new AuthManager());
