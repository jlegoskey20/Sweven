// DOM Elements
const userInput = document.getElementById("userInput");
const feedback = document.getElementById("feedback");
const analyzeBtn = document.getElementById("analyzeBtn");
const saveBtn = document.getElementById("saveBtn");
const lessonInput = document.getElementById("lessonInput");
const translateBtn = document.getElementById("translateBtn");
const output = document.getElementById("output");

// Store writing style data
let userStyleData = null;

// Function to count words
const countWords = (text) => {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
};

// Monitor word count for the writing style input
userInput.addEventListener("input", () => {
  const wordCount = countWords(userInput.value);
  feedback.textContent = `Word count: ${wordCount}`;

  // Enable or disable the analyze button based on word count
  if (wordCount >= 10000) {
    analyzeBtn.disabled = false;
    feedback.style.color = "green"; // Green feedback for valid word count
  } else {
    analyzeBtn.disabled = true;
    feedback.style.color = "red"; // Red feedback for insufficient word count
  }
});

// Check if a writing style is saved in localStorage
const loadSavedStyle = () => {
  const savedStyle = localStorage.getItem("userStyleData");
  if (savedStyle) {
    userStyleData = JSON.parse(savedStyle); // Load saved writing style
    output.innerHTML = `<strong>Saved Writing Style Loaded!</strong> You can now translate lessons.`;
    translateBtn.disabled = false; // Enable translate button if style is loaded
  }
};

// Call loadSavedStyle when the page loads
window.onload = loadSavedStyle;

// Analyze user's writing style
analyzeBtn.addEventListener("click", async () => {
  const text = userInput.value;

  // Check if the user input is empty
  if (!text.trim()) {
    output.innerHTML = `<strong>Error:</strong> Please enter some text to analyze.`;
    return;
  }

  // Call AI API to analyze writing style
  try {
    const response = await fetch("https://api.example.com/analyze-style", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    if (!response.ok) {
      throw new Error("Failed to analyze writing style.");
    }

    const data = await response.json();

    userStyleData = data.style; // Save the analyzed style
    output.innerHTML = `<strong>Writing Style Saved!</strong> ${data.message}`;
    saveBtn.disabled = false; // Enable save button
    translateBtn.disabled = false; // Enable translation feature
  } catch (error) {
    output.innerHTML = `<strong>Error:</strong> Could not analyze writing style. Please try again later.`;
  }
});

// Save the user's writing style to localStorage
saveBtn.addEventListener("click", () => {
  if (!userStyleData) {
    output.innerHTML = `<strong>Error:</strong> Please analyze your writing style first.`;
    return;
  }

  try {
    // Save the user style data to localStorage
    localStorage.setItem("userStyleData", JSON.stringify(userStyleData));
    output.innerHTML = `<strong>Writing Style Saved!</strong> You can now use it later.`;
    saveBtn.disabled = true; // Disable the save button after saving
  } catch (error) {
    output.innerHTML = `<strong>Error:</strong> Could not save writing style. Please try again later.`;
  }
});

// Translate a lesson into the user's writing style
translateBtn.addEventListener("click", async () => {
  const lessonText = lessonInput.value;

  if (!userStyleData) {
    output.innerHTML = `<strong>Error:</strong> Please analyze your writing style first.`;
    return;
  }

  // Call AI API to translate lesson into user's style
  try {
    const response = await fetch("https://api.example.com/translate-lesson", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lesson: lessonText,
        styleData: userStyleData
      })
    });

    if (!response.ok) {
      throw new Error("Failed to translate lesson.");
    }

    const data = await response.json();

    output.innerHTML = `<strong>Translated Lesson:</strong><br>${data.translatedLesson}`;
  } catch (error) {
    output.innerHTML = `<strong>Error:</strong> Could not translate the lesson. Please try again later.`;
  }
});
