// =======================
// DOM ELEMENTS
// =======================
const summarizeBtn = document.getElementById('summarizeBtn');
const saveNotesBtn = document.getElementById('saveNotesBtn');
const notesTextarea = document.getElementById('notesTextarea');
const resultsSection = document.getElementById('resultsSection');
const resultsContainer = document.getElementById('resultsContainer');
const successAlert = document.getElementById('successAlert');
const errorAlert = document.getElementById('errorAlert');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const darkModeToggle = document.getElementById('darkModeToggle');

// =======================
// API CONFIG
// =======================
const API_BASE_URL = 'http://localhost:8080';

// =======================
// INIT
// =======================
document.addEventListener('DOMContentLoaded', () => {
  loadNotes();
  loadDarkModePreference();
});

// =======================
// EVENT LISTENERS
// =======================
summarizeBtn.addEventListener('click', handleSummarize);
saveNotesBtn.addEventListener('click', handleSaveNotes);
darkModeToggle.addEventListener('click', toggleDarkMode);

// =======================
// DARK MODE
// =======================
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  chrome.storage.local.set({ darkMode: isDarkMode });
  updateToggleIcon(isDarkMode);
}

function updateToggleIcon(isDarkMode) {
  const slider = darkModeToggle.querySelector('.toggle-slider');
  slider.textContent = isDarkMode ? '🌙' : '☀️';
}

function loadDarkModePreference() {
  chrome.storage.local.get(['darkMode'], (result) => {
    if (result.darkMode) {
      document.body.classList.add('dark-mode');
      updateToggleIcon(true);
    } else {
      updateToggleIcon(false);
    }
  });
}

// =======================
// SUMMARIZE CONTENT
// =======================
async function handleSummarize() {
  try {
    summarizeBtn.disabled = true;
    summarizeBtn.innerHTML = '⏳ Summarizing...';
    hideAlerts();

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.url.startsWith('http')) {
      throw new Error('Please open a valid webpage');
    }

    const [{ result }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => window.getSelection().toString() || document.body.innerText
    });

    if (!result || result.trim() === '') {
      throw new Error('No content found on page');
    }

    showProcessingResult();

    const response = await fetch(`${API_BASE_URL}/api/research/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: result,
        operation: 'summarize'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to summarize');
    }

    const summaryText = await response.text();
    displaySummaryResult(summaryText);
    showSuccess('Summary generated successfully');

  } catch (error) {
    console.error(error);
    showError(error.message);
    showErrorResult(error.message);
  } finally {
    summarizeBtn.disabled = false;
    summarizeBtn.innerHTML = '✨ Summarize';
  }
}

// =======================
// SAVE NOTES (LOCAL + DB)
// =======================
async function handleSaveNotes() {
  const notes = notesTextarea.value.trim();

  if (!notes) {
    showError('Please enter notes before saving');
    return;
  }

  saveNotesBtn.disabled = true;
  saveNotesBtn.innerHTML = '💾 Saving...';

  try {
    // 1️⃣ Save locally (Chrome storage)
    await chrome.storage.local.set({ researchNotes: notes });

    // 2️⃣ Save to backend (MySQL)
    const response = await fetch(`${API_BASE_URL}/api/research/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: notes,
        operation: 'save'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save notes to database');
    }

    showSuccess('Notes saved to database successfully');

  } catch (error) {
    console.error(error);
    showError(error.message);
  } finally {
    saveNotesBtn.disabled = false;
    saveNotesBtn.innerHTML = '💾 Save Notes';
  }
}

// =======================
// LOAD SAVED NOTES
// =======================
function loadNotes() {
  chrome.storage.local.get(['researchNotes'], (result) => {
    if (result.researchNotes) {
      notesTextarea.value = result.researchNotes;
    }
  });
}

// =======================
// UI HELPERS
// =======================
function showProcessingResult() {
  resultsContainer.innerHTML = `
    <div class="result-card">
      <strong>⏳ Processing...</strong>
    </div>`;
  resultsSection.classList.add('active');
}

function displaySummaryResult(text) {
  resultsContainer.innerHTML = `
    <div class="result-card">
      <h3>📊 Summary</h3>
      <p>${text.replace(/\n/g, '<br>')}</p>
    </div>`;
  resultsSection.classList.add('active');
}

function showErrorResult(message) {
  resultsContainer.innerHTML = `
    <div class="result-card error-card">
      <h3>❌ Error</h3>
      <p>${message}</p>
    </div>`;
  resultsSection.classList.add('active');
}

function showSuccess(message) {
  hideAlerts();
  successMessage.textContent = message;
  successAlert.classList.add('show');
  setTimeout(() => successAlert.classList.remove('show'), 3000);
}

function showError(message) {
  hideAlerts();
  errorMessage.textContent = message;
  errorAlert.classList.add('show');
  setTimeout(() => errorAlert.classList.remove('show'), 4000);
}

function hideAlerts() {
  successAlert.classList.remove('show');
  errorAlert.classList.remove('show');
}
