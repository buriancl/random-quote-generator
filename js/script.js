// DOM Elements
const quoteText = document.getElementById("quote-text");
const authorText = document.getElementById("author");
const tagsElement = document.getElementById("tags");
const categorySelector = document.getElementById("quote-category");
const newQuoteBtn = document.getElementById("new-quote");
const copyQuoteBtn = document.getElementById("copy-quote");
const tweetQuoteBtn = document.getElementById("tweet-quote");

// Track available categories
let availableCategories = [];

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

// Initialize the app
document.addEventListener("DOMContentLoaded", () => {
  // First fetch categories, then get a random quote
  fetchCategories().then(() => {
    getRandomQuote();
  });
});
