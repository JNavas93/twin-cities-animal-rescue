// Twin Cities Animal Rescue - Touchstone 4

const interestOptions = [
  { value: "volunteer", label: "General Volunteering" },
  { value: "foster", label: "Fostering" },
  { value: "adoption", label: "Adoption Information" },
  { value: "events", label: "Adoption Events" },
  { value: "transport", label: "Animal Transport" }
];

const storageKeys = {
  interests: "tcarSavedInterests",
  name: "tcarVisitorName"
};

function getSelectedInterests() {
  return Array.from(document.querySelectorAll('input[name="tracker-interest"]:checked'))
    .map((checkbox) => checkbox.value);
}

function displaySavedInterests(values) {
  const output = document.getElementById("saved-interests");
  if (!output) return;

  if (values.length === 0) {
    output.textContent = "No interests saved yet.";
    return;
  }

  const labels = values.map((value) => {
    const match = interestOptions.find((option) => option.value === value);
    return match ? match.label : value;
  });
  output.textContent = `Saved interests: ${labels.join(", ")}`;
}

function saveVolunteerInterests() {
  const selected = getSelectedInterests();
  const feedback = document.getElementById("tracker-feedback");

  if (selected.length === 0) {
    feedback.textContent = "Please choose at least one interest before saving.";
    return;
  }

  localStorage.setItem(storageKeys.interests, JSON.stringify(selected));
  displaySavedInterests(selected);
  feedback.textContent = "Your interests were saved on this device.";
}

function loadVolunteerInterests() {
  const saved = JSON.parse(localStorage.getItem(storageKeys.interests) || "[]");
  saved.forEach((value) => {
    const checkbox = document.querySelector(`input[name="tracker-interest"][value="${value}"]`);
    if (checkbox) checkbox.checked = true;
  });
  displaySavedInterests(saved);
}

function showError(fieldId, message) {
  const error = document.getElementById(`${fieldId}-error`);
  if (error) error.textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".error-message").forEach((item) => {
    item.textContent = "";
  });
}

function validateContactForm(event) {
  const form = event.currentTarget;
  const name = form.elements.name;
  const email = form.elements.email;
  const experience = form.elements.experience;
  const message = form.elements.message;
  let isValid = true;

  clearErrors();

  if (name.value.trim().length < 2) {
    showError("name", "Please enter at least 2 characters for your name.");
    isValid = false;
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    showError("email", "Please enter a valid email address.");
    isValid = false;
  }

  if (experience.value.trim().length < 10) {
    showError("experience", "Please enter at least 10 characters about your experience with pets.");
    isValid = false;
  }

  if (message.value.trim().length < 10) {
    showError("message", "Please enter a message of at least 10 characters.");
    isValid = false;
  }

  if (!isValid) {
    event.preventDefault();
    document.getElementById("form-status").textContent = "Please correct the highlighted information before submitting.";
    return;
  }

  event.preventDefault();
  localStorage.setItem(storageKeys.name, name.value.trim());
  document.getElementById("form-status").textContent = "Thank you. Your form is ready for the rescue team.";
}

function loadSavedName() {
  const nameField = document.getElementById("name");
  const savedName = localStorage.getItem(storageKeys.name);
  if (nameField && savedName && !nameField.value) {
    nameField.value = savedName;
  }
}

function initializePage() {
  const saveButton = document.getElementById("save-interests");
  if (saveButton) {
    saveButton.addEventListener("click", saveVolunteerInterests);
    loadVolunteerInterests();
  }

  const contactForm = document.getElementById("interest-form");
  if (contactForm) {
    contactForm.addEventListener("submit", validateContactForm);
    loadSavedName();
  }
}

document.addEventListener("DOMContentLoaded", initializePage);
