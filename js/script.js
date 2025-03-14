// DOM Elements
const quoteText = document.getElementById("quote-text");
const authorText = document.getElementById("author");
const newQuoteBtn = document.getElementById("new-quote");
const copyQuoteBtn = document.getElementById("copy-quote");
const tweetQuoteBtn = document.getElementById("tweet-quote");

// API URLs (multiple options to try)
const apiOptions = [
  "https://api.quotable.io/random",
  "https://type.fit/api/quotes",
];

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

// Function to fetch a random quote
async function getRandomQuote() {
  try {
    // Show loading state
    quoteText.textContent = "Loading";
    quoteText.classList.add("loading");
    authorText.textContent = "";

    let data;

    // Try to fetch from the current API option
    if (currentApiIndex === 0) {
      // Quotable API
      const response = await fetch(apiOptions[currentApiIndex]);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      data = await response.json();

      // Format data for our app
      data = {
        content: data.content,
        author: data.author,
      };
    } else {
      // Type.fit API
      const response = await fetch(apiOptions[currentApiIndex]);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // This API returns an array of quotes, so we need to pick one randomly
      const allQuotes = await response.json();
      const randomQuote =
        allQuotes[Math.floor(Math.random() * allQuotes.length)];

      // Format data for our app
      data = {
        content: randomQuote.text,
        author: randomQuote.author || "Unknown",
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

// Event Listeners
newQuoteBtn.addEventListener("click", getRandomQuote);
copyQuoteBtn.addEventListener("click", copyQuote);

// Initialize with a random quote when the page loads
document.addEventListener("DOMContentLoaded", getRandomQuote);
