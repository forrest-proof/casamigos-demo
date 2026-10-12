const state = {
  use: null,
};

const totalSteps = 5;
let currentStep = 1;

const stepEls = Array.from(document.querySelectorAll('.step[data-step]'));
const progressFill = document.getElementById('progressFill');
const stepLabel = document.getElementById('stepLabel');
const backBtn = document.getElementById('backBtn');
const nextBtn = document.getElementById('nextBtn');
const navRow = document.querySelector('.nav-row');

function showStep(step) {
  stepEls.forEach(el => {
    el.classList.toggle('active', el.dataset.step === String(step));
  });
  currentStep = step;

  if (step === 'confirm') {
    navRow.style.display = 'none';
    progressFill.style.width = '100%';
    stepLabel.textContent = 'Complete';
    return;
  }
  navRow.style.display = 'flex';

  progressFill.style.width = `${(step / totalSteps) * 100}%`;
  stepLabel.textContent = `Step ${step} of ${totalSteps}`;
  backBtn.disabled = step === 1;
  nextBtn.style.display = step === totalSteps ? 'none' : 'inline-block';

  if (step === totalSteps) {
    renderReview();
  }
}

function val(id) {
  return document.getElementById(id).value.trim();
}

function validateStep(step) {
  if (step === 1) {
    if (!val('market')) {
      alert('Please tell us which market the Surf Truck is going to.');
      return false;
    }
    const start = val('startDate');
    const end = val('endDate');
    if (!start || !end) {
      alert('Please provide both a first and last date.');
      return false;
    }
    if (new Date(end) < new Date(start)) {
      alert('The last date must be on or after the first date.');
      return false;
    }
  }
  if (step === 2 && !state.use) {
    alert('Please select how the Surf Truck will be used.');
    return false;
  }
  if (step === 4) {
    if (!val('pocName') || !val('pocEmail') || !val('pocPhone')) {
      alert('Please provide the point of contact\'s name, email and phone number.');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(val('pocEmail'))) {
      alert('Please enter a valid email address.');
      return false;
    }
  }
  return true;
}

nextBtn.addEventListener('click', () => {
  if (!validateStep(currentStep)) return;
  if (currentStep < totalSteps) showStep(currentStep + 1);
});

backBtn.addEventListener('click', () => {
  if (currentStep > 1) showStep(currentStep - 1);
});

// Usage selection + contextual questions
function applyUseVisibility() {
  document.getElementById('usageDetails').hidden = !state.use;
  document.querySelectorAll('#usageDetails [data-use]').forEach(el => {
    el.hidden = !el.dataset.use.split(',').includes(state.use);
  });
  document.getElementById('eventNameLabel').textContent =
    state.use === 'Commercial Blitzing' ? 'Campaign / route name (optional)' : 'Event name';
}

document.querySelectorAll('.asset-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.asset-card').forEach(c => c.classList.remove('selected'));
    card.classList.add('selected');
    state.use = card.dataset.use;
    applyUseVisibility();
  });
});

function daysBetween(startStr, endStr) {
  return Math.round((new Date(endStr) - new Date(startStr)) / 86400000) + 1;
}

function renderReview() {
  const start = val('startDate');
  const end = val('endDate');
  const days = daysBetween(start, end);

  document.getElementById('rvMarket').textContent = val('market') || '—';
  document.getElementById('rvDates').textContent = `${start} → ${end}`;
  document.getElementById('rvDuration').textContent = `${days} day${days > 1 ? 's' : ''}`;
  document.getElementById('rvUse').textContent = state.use || '—';
  document.getElementById('rvContact').textContent = `${val('pocName') || '—'} (${val('pocEmail') || '—'})`;
  document.getElementById('rvPhone').textContent = val('pocPhone') || '—';
}

document.getElementById('submitBtn').addEventListener('click', () => {
  document.getElementById('confirmEmail').textContent = val('pocEmail') || 'your email';
  document.getElementById('confirmTime').textContent = new Date().toLocaleString();
  showStep('confirm');
});

showStep(1);
