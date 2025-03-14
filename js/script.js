// Function to toggle between light and dark themes
function toggleTheme() {
  // Get current theme or default to light
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || LIGHT_THEME;

  // Toggle theme
  const newTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;

  // Update HTML attribute
  document.documentElement.setAttribute("data-theme", newTheme);

  // Update button icon
  updateThemeIcon(newTheme);

  // Save preference to localStorage
  localStorage.setItem(STORAGE_KEY, newTheme);

  // Update background for new theme
  const themeBackgrounds = backgrounds.filter((bg) => bg.theme === newTheme);
  const newBackground = themeBackgrounds[0]; // Default to first background of new theme

  if (newBackground) {
    currentBackgroundIndex = backgrounds.indexOf(newBackground);
    applyBackground(newBackground);
    localStorage.setItem(BG_STORAGE_KEY, currentBackgroundIndex);
  }
} // Current background index
let currentBackgroundIndex = 0;

// Function to change background
function changeBackground() {
  // Get current theme
  const currentTheme =
    document.documentElement.getAttribute("data-theme") || LIGHT_THEME;

  // Get all backgrounds for the current theme
  const themeBackgrounds = backgrounds.filter(
    (bg) => bg.theme === currentTheme
  );

  // Get a random background that's different from the current one
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * themeBackgrounds.length);
  } while (
    themeBackgrounds.length > 1 &&
    themeBackgrounds[newIndex] === backgrounds[currentBackgroundIndex]
  );

  // Get the new background
  const newBackground = themeBackgrounds[newIndex];

  // Find the overall index of this background
  currentBackgroundIndex = backgrounds.findIndex(
    (bg) =>
      bg.start === newBackground.start &&
      bg.end === newBackground.end &&
      bg.pattern === newBackground.pattern
  );

  // Apply the new background
  applyBackground(newBackground);

  // Save to localStorage
  localStorage.setItem(BG_STORAGE_KEY, currentBackgroundIndex);

  // Add animation to the button
  bgChangeBtn.querySelector("i").classList.add("rotate-animation");

  // Remove animation after it completes
  setTimeout(() => {
    bgChangeBtn.querySelector("i").classList.remove("rotate-animation");
  }, 1000);
}

// Function to apply a specific background
function applyBackground(background) {
  document.documentElement.style.setProperty(
    "--bg-gradient-start",
    background.start
  );
  document.documentElement.style.setProperty(
    "--bg-gradient-end",
    background.end
  );
  document.documentElement.style.setProperty(
    "--bg-pattern",
    background.pattern
  );
}

// Function to initialize background from saved preference
function initBackground() {
  // Get saved background index from localStorage
  const savedBgIndex = localStorage.getItem(BG_STORAGE_KEY);

  if (savedBgIndex !== null && backgrounds[savedBgIndex]) {
    // Apply saved background
    currentBackgroundIndex = parseInt(savedBgIndex);
    applyBackground(backgrounds[currentBackgroundIndex]);
  } else {
    // Use default background (first one for current theme)
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || LIGHT_THEME;
    const defaultBackground = backgrounds.find(
      (bg) => bg.theme === currentTheme
    );

    if (defaultBackground) {
      currentBackgroundIndex = backgrounds.indexOf(defaultBackground);
      applyBackground(defaultBackground);
    }
  }
}

// Function to update the theme toggle button icon
function updateThemeIcon(theme) {
  // Clear previous icon
  themeToggleBtn.innerHTML = "";

  // Set appropriate icon
  const icon = document.createElement("i");
  icon.className = theme === DARK_THEME ? "fas fa-sun" : "fas fa-moon";
  themeToggleBtn.appendChild(icon);
}

// Function to initialize theme from saved preference
function initTheme() {
  // Get saved theme from localStorage or use system preference as default
  const savedTheme = localStorage.getItem(STORAGE_KEY);

  if (savedTheme) {
    // Apply saved theme
    document.documentElement.setAttribute("data-theme", savedTheme);
    updateThemeIcon(savedTheme);
  } else {
    // Check for system preference
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const defaultTheme = prefersDark ? DARK_THEME : LIGHT_THEME;

    document.documentElement.setAttribute("data-theme", defaultTheme);
    updateThemeIcon(defaultTheme);

    // Save for future visits
    localStorage.setItem(STORAGE_KEY, defaultTheme);
  }
} // DOM Elements
const quoteText = document.getElementById("quote-text");
const authorText = document.getElementById("author");
const tagsElement = document.getElementById("tags");
const categorySelector = document.getElementById("quote-category");
const newQuoteBtn = document.getElementById("new-quote");
const copyQuoteBtn = document.getElementById("copy-quote");
const tweetQuoteBtn = document.getElementById("tweet-quote");
const themeToggleBtn = document.getElementById("theme-toggle-btn");
const bgChangeBtn = document.getElementById("bg-change-btn");

// Track available categories
let availableCategories = [];

// Theme variables
const STORAGE_KEY = "quote-generator-theme";
const BG_STORAGE_KEY = "quote-generator-background";
const DARK_THEME = "dark";
const LIGHT_THEME = "light";

// Background options
const backgrounds = [
  // Gradients - Light Theme
  {
    type: "gradient",
    theme: LIGHT_THEME,
    start: "#667eea",
    end: "#764ba2",
    pattern: "none",
  },
  {
    type: "gradient",
    theme: LIGHT_THEME,
    start: "#4facfe",
    end: "#00f2fe",
    pattern: "none",
  },
  {
    type: "gradient",
    theme: LIGHT_THEME,
    start: "#13547a",
    end: "#80d0c7",
    pattern: "none",
  },
  {
    type: "gradient",
    theme: LIGHT_THEME,
    start: "#ff758c",
    end: "#ff7eb3",
    pattern: "none",
  },
  {
    type: "gradient",
    theme: LIGHT_THEME,
    start: "#f83600",
    end: "#f9d423",
    pattern: "none",
  },
  // Patterns - Light Theme
  {
    type: "pattern",
    theme: LIGHT_THEME,
    start: "#6a85b6",
    end: "#bac8e0",
    pattern:
      "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.2' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
  },
  {
    type: "pattern",
    theme: LIGHT_THEME,
    start: "#3f4c6b",
    end: "#606c88",
    pattern:
      "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.2'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  },

  // Gradients - Dark Theme
  {
    type: "gradient",
    theme: DARK_THEME,
    start: "#1a1a2e",
    end: "#16213e",
    pattern: "none",
  },
  {
    type: "gradient",
    theme: DARK_THEME,
    start: "#0f0c29",
    end: "#302b63",
    pattern: "none",
  },
  {
    type: "gradient",
    theme: DARK_THEME,
    start: "#232526",
    end: "#414345",
    pattern: "none",
  },
  {
    type: "gradient",
    theme: DARK_THEME,
    start: "#000046",
    end: "#1cb5e0",
    pattern: "none",
  },
  {
    type: "gradient",
    theme: DARK_THEME,
    start: "#0f2027",
    end: "#203a43",
    pattern: "none",
  },
  // Patterns - Dark Theme
  {
    type: "pattern",
    theme: DARK_THEME,
    start: "#141e30",
    end: "#243b55",
    pattern:
      "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E\")",
  },
  {
    type: "pattern",
    theme: DARK_THEME,
    start: "#000000",
    end: "#434343",
    pattern:
      "url(\"data:image/svg+xml,%3Csvg width='52' height='26' viewBox='0 0 52 26' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M10 10c0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6h2c0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4 3.314 0 6 2.686 6 6 0 2.21 1.79 4 4 4v2c-3.314 0-6-2.686-6-6 0-2.21-1.79-4-4-4-3.314 0-6-2.686-6-6zm25.464-1.95l8.486 8.486-1.414 1.414-8.486-8.486 1.414-1.414z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
  },
];

// API URLs (multiple options to try)
const apiOptions = [
  "https://api.quotable.io/random", // This one supports tags
  "https://type.fit/api/quotes", // This one doesn't support categories
];

// API for getting available tags (only for Quotable API)
const tagsApiUrl = "https://api.quotable.io/tags";

// Which API we're currently using (0 = first option, 1 = second option)
let currentApiIndex = 0;

// Fallback quotes if all APIs fail
const fallbackQuotes = [
  {
    content: "Life is what happens when you're busy making other plans.",
    author: "John Lennon",
  },
  {
    content:
      "The greatest glory in living lies not in never falling, but in rising every time we fall.",
    author: "Nelson Mandela",
  },
  {
    content: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
  },
  {
    content:
      "Your time is limited, so don't waste it living someone else's life.",
    author: "Steve Jobs",
  },
  {
    content:
      "If life were predictable it would cease to be life, and be without flavor.",
    author: "Eleanor Roosevelt",
  },
  {
    content:
      "If you look at what you have in life, you'll always have more. If you look at what you don't have in life, you'll never have enough.",
    author: "Oprah Winfrey",
  },
  {
    content:
      "If you set your goals ridiculously high and it's a failure, you will fail above everyone else's success.",
    author: "James Cameron",
  },
];

// Track API failures
let apiFailures = 0;
const maxApiRetries = 2;

// Function to fetch available categories/tags
async function fetchCategories() {
  try {
    const response = await fetch(tagsApiUrl);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const tags = await response.json();
    availableCategories = tags;

    // Populate dropdown
    populateCategoryDropdown(tags);
  } catch (error) {
    console.error("Error fetching categories:", error);
    // Fallback categories if API fails
    const fallbackCategories = [
      { name: "Wisdom", slug: "wisdom" },
      { name: "Success", slug: "success" },
      { name: "Happiness", slug: "happiness" },
      { name: "Motivational", slug: "motivational" },
      { name: "Life", slug: "life" },
    ];
    availableCategories = fallbackCategories;
    populateCategoryDropdown(fallbackCategories);
  }
}

// Function to populate the category dropdown
function populateCategoryDropdown(categories) {
  // Sort categories alphabetically
  categories.sort((a, b) => a.name.localeCompare(b.name));

  // Clear dropdown except for "All Categories" option
  while (categorySelector.options.length > 1) {
    categorySelector.remove(1);
  }

  // Add categories to dropdown
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.slug;
    option.textContent = category.name;
    categorySelector.appendChild(option);
  });
}

// Function to fetch a random quote
async function getRandomQuote() {
  try {
    // Show loading state
    quoteText.textContent = "Loading";
    quoteText.classList.add("loading");
    authorText.textContent = "";
    tagsElement.innerHTML = "";

    let data;
    const selectedCategory = categorySelector.value;

    // Try to fetch from the current API option
    if (currentApiIndex === 0) {
      // Quotable API
      let apiUrl = apiOptions[currentApiIndex];

      // Add tag filter if a category is selected
      if (selectedCategory) {
        apiUrl += `?tags=${selectedCategory}`;
      }

      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const rawData = await response.json();

      // Format data for our app
      data = {
        content: rawData.content,
        author: rawData.author,
        tags: rawData.tags || [],
      };
    } else {
      // Type.fit API - doesn't support filtering by category
      const response = await fetch(apiOptions[currentApiIndex]);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // This API returns an array of quotes, so we need to pick one randomly
      const allQuotes = await response.json();

      // If category is selected, try to find quotes matching that category in the text
      // This is a simple workaround since this API doesn't support tags
      let filteredQuotes = allQuotes;

      if (selectedCategory) {
        const categoryName =
          availableCategories.find((cat) => cat.slug === selectedCategory)
            ?.name || selectedCategory;

        filteredQuotes = allQuotes.filter(
          (quote) =>
            quote.text.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            quote.text.toLowerCase().includes(categoryName.toLowerCase())
        );

        // If no quotes match the category, use all quotes
        if (filteredQuotes.length === 0) {
          filteredQuotes = allQuotes;
        }
      }

      const randomQuote =
        filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];

      // Format data for our app
      data = {
        content: randomQuote.text,
        author: randomQuote.author || "Unknown",
        tags: [], // Type.fit API doesn't provide tags
      };
    }

    // Remove loading state
    quoteText.classList.remove("loading");

    // Display the quote with animation
    quoteText.classList.remove("quote-change");
    authorText.classList.remove("quote-change");

    // Trigger reflow to restart animation
    void quoteText.offsetWidth;
    void authorText.offsetWidth;

    // Add animation classes
    quoteText.classList.add("quote-change");
    authorText.classList.add("quote-change");

    // Update quote and author text
    quoteText.textContent = data.content;
    authorText.textContent = `- ${data.author}`;

    // Display tags if available
    displayTags(data.tags);

    // Update tweet button href
    updateTweetButton(data.content, data.author);
  } catch (error) {
    console.error("Error fetching quote:", error);
    quoteText.classList.remove("loading");

    apiFailures++;

    // If we've tried all APIs twice, use fallback quotes
    if (apiFailures > apiOptions.length * maxApiRetries) {
      // Use the fallback quotes
      const randomIndex = Math.floor(Math.random() * fallbackQuotes.length);
      const fallbackQuote = fallbackQuotes[randomIndex];

      // Display the quote with animation
      quoteText.classList.remove("quote-change");
      authorText.classList.remove("quote-change");

      // Trigger reflow to restart animation
      void quoteText.offsetWidth;
      void authorText.offsetWidth;

      // Add animation classes
      quoteText.classList.add("quote-change");
      authorText.classList.add("quote-change");

      quoteText.textContent = fallbackQuote.content;
      authorText.textContent = `- ${fallbackQuote.author}`;

      // Clear tags for fallback quotes
      tagsElement.innerHTML = "";

      // Update tweet button href
      updateTweetButton(fallbackQuote.content, fallbackQuote.author);

      // Show notice that we're using offline quotes
      console.log("Using offline quotes due to API connection issues");
    } else {
      // Try the other API if this one failed
      currentApiIndex = (currentApiIndex + 1) % apiOptions.length;

      quoteText.textContent = `Trying alternative API source... (${
        currentApiIndex + 1
      }/${apiOptions.length})`;

      // Wait a moment before trying again
      setTimeout(getRandomQuote, 1500);
    }
  }
}

// Function to update tweet button with current quote
function updateTweetButton(quote, author) {
  // Truncate quote if too long for Twitter
  const maxLength = 240; // Twitter max is 280, but leaving space for attribution
  let tweetText = quote;

  if (quote.length > maxLength) {
    tweetText = quote.substring(0, maxLength - 3) + "...";
  }

  // Create tweet URL with quote and author
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `"${tweetText}" - ${author}`
  )}`;
  tweetQuoteBtn.setAttribute("href", tweetUrl);
}

// Function to copy quote to clipboard
function copyQuote() {
  // Check if there's a quote to copy
  if (quoteText.textContent && !quoteText.classList.contains("loading")) {
    // Create text to copy (quote + author)
    const textToCopy = `"${quoteText.textContent}" ${authorText.textContent}`;

    // Add tags if present
    const tagElements = document.querySelectorAll(".tag");
    if (tagElements.length > 0) {
      const tags = Array.from(tagElements)
        .map((tag) => tag.textContent)
        .join(", ");
      textToCopy += ` [Tags: ${tags}]`;
    }

    // Copy to clipboard
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        // Visual feedback for successful copy
        const originalBg = copyQuoteBtn.style.backgroundColor;
        copyQuoteBtn.style.backgroundColor = "#28a745";

        // Reset style after 1 second
        setTimeout(() => {
          copyQuoteBtn.style.backgroundColor = originalBg;
        }, 1000);
      })
      .catch((err) => {
        console.error("Error copying text: ", err);
        alert("Failed to copy the quote. Please try again.");
      });
  }
}

// Function to display tags
function displayTags(tags) {
  tagsElement.innerHTML = "";

  if (!tags || tags.length === 0) {
    return;
  }

  tags.forEach((tag) => {
    const tagSpan = document.createElement("span");
    tagSpan.classList.add("tag");
    tagSpan.textContent = tag;

    // Add click event to filter by this tag
    tagSpan.addEventListener("click", () => {
      // Find this tag in the dropdown and select it
      for (let i = 0; i < categorySelector.options.length; i++) {
        if (
          categorySelector.options[i].value === tag.toLowerCase() ||
          categorySelector.options[i].textContent.toLowerCase() ===
            tag.toLowerCase()
        ) {
          categorySelector.selectedIndex = i;
          getRandomQuote(); // Get a new quote with this tag
          break;
        }
      }
    });

    tagsElement.appendChild(tagSpan);
  });
}

// Event Listeners
newQuoteBtn.addEventListener("click", getRandomQuote);
copyQuoteBtn.addEventListener("click", copyQuote);
categorySelector.addEventListener("change", getRandomQuote);
themeToggleBtn.addEventListener("click", toggleTheme);
bgChangeBtn.addEventListener("click", changeBackground);

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  // Initialize theme
  initTheme();

  // Initialize background
  initBackground();

  // First fetch categories, then get a random quote
  fetchCategories().then(() => {
    getRandomQuote();
  });

  // Listen for system theme changes
  if (window.matchMedia) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        const newTheme = e.matches ? DARK_THEME : LIGHT_THEME;
        document.documentElement.setAttribute("data-theme", newTheme);
        updateThemeIcon(newTheme);
        localStorage.setItem(STORAGE_KEY, newTheme);

        // Update background for new theme
        const themeBackgrounds = backgrounds.filter(
          (bg) => bg.theme === newTheme
        );
        if (themeBackgrounds.length > 0) {
          const newBackground = themeBackgrounds[0];
          currentBackgroundIndex = backgrounds.indexOf(newBackground);
          applyBackground(newBackground);
          localStorage.setItem(BG_STORAGE_KEY, currentBackgroundIndex);
        }
      });
  }
});
