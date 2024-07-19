
// Add event listener for the settings button

  document.getElementById('settingsButton').addEventListener('click', function() {
    openOverlayPopup('settings.html');
    // Add your settings button functionality here
  });
  

  // Add event listener for the leaderboard button

  document.getElementById('leaderboardButton').addEventListener('click', function() {
    openOverlayPopup('leaderboard.html');
    // Add your leaderboard button functionality here
  });

  document.getElementById('ranksButton').addEventListener('click', function() {
    openOverlayPopup('ranked.html');
    // Add your leaderboard button functionality here
  });
  
  function openOverlayPopup(popupUrl) {
    // Create a new div element to hold the overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '1000';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.id = 'overlayPopup';
    // Create an iframe to load the popup content
    const iframe = document.createElement('iframe');
    iframe.src = chrome.runtime.getURL(popupUrl);
    iframe.style.border = 'none';
    iframe.style.width = '300px';
    iframe.style.height = '400px';
    iframe.style.borderRadius = '10px';
    overlay.appendChild(iframe);
    // Append the overlay to the body
    document.body.appendChild(overlay);
    // Add an event listener to close the overlay when the close button is clicked
    iframe.onload = function() {
      const closeButton = iframe.contentWindow.document.getElementById('closeSettingsButton') || iframe.contentWindow.document.getElementById('closeLeaderboardButton') || iframe.contentWindow.document.getElementById('closeRankedButton');
      if (closeButton) {
        closeButton.addEventListener('click', function() {
          document.body.removeChild(overlay);
          chrome.storage.local.get(['stockPrice', 'maxGain', 'increaseGainPrice'], function(data) {
            let stockPrice = data.stockPrice || 100;
            let maxGain = data.maxGain || 45;
            let increaseGainPrice = data.increaseGainPrice || 150;
          updatePopup(stockPrice, increaseGainPrice)
          updateIncreaseGainButton(increaseGainPrice)
          updateMaxGain(maxGain, increaseGainPrice)

          chrome.action.setBadgeText({ text: formatBadgeText(stockPrice) });

          function formatBadgeText(price) {
              if (price >= 1000 && price <= 10000 ) {
                // Convert to thousands with one decimal place
                const formattedPrice = (price / 1000).toFixed(1) + 'K';
                return formattedPrice;
              } else if (price >= 10000 && price <= 999999) {
                  // Convert to thousands with one decimal place
                  const formattedPrice = Math.floor(price / 1000) + 'K';
                  return formattedPrice;
                } else if (price >= 999999 && price <= 10000000) {
                  // Convert to thousands with one decimal place
                  const formattedPrice = (price / 1000000).toFixed(1) + 'M';
                  return formattedPrice;
                } else if (price >= 10000000 && price <= 100000000) {
                  // Convert to thousands with one decimal place
                  const formattedPrice = Math.floor(price / 1000000) + 'M';
                  return formattedPrice;
                } else {
                return '$' + price;
              }
            }




          drawGraph()


          })
        });
      }
    };
  }

// Function to update popup HTML with current stock price and graph
function updatePopup(stockPrice, increaseGainPrice) {
  document.getElementById('stockPrice').textContent = '$' + stockPrice;
  updateIncreaseGainButton(increaseGainPrice);
  drawGraph();
}

// Function to update the increase gain button text
function updateIncreaseGainButton(increaseGainPrice) {
  const increaseGainButton = document.getElementById('increaseGainButton');
  increaseGainButton.textContent = `Increase Stock Gain ($${increaseGainPrice})`;
}

// Function to draw a basic graph based on stock price
function drawGraph() {
  chrome.storage.local.get('stockPriceHistory', function(data) {
    const stockPriceHistory = data.stockPriceHistory || [];
    const canvas = document.getElementById('stockGraph');
    const ctx = canvas.getContext('2d');
    const graphHeight = canvas.height - 20;
    const graphWidth = canvas.width - 20;
    let minPrice = Number.POSITIVE_INFINITY;
    let maxPrice = Number.NEGATIVE_INFINITY;
    const offsetY = 20;   // Offset to shift the graph up

    // Find min and max prices in history
    stockPriceHistory.forEach(price => {
      if (price < minPrice) minPrice = price;
      if (price > maxPrice) maxPrice = price;
    });

    // Ensure minPrice is at least 10 (or your desired minimum)
    minPrice = Math.min(minPrice, 10);
    console.log(minPrice)
    // Add some padding to maxPrice for better visualization
    maxPrice = maxPrice * 1.1; // Increase by 10% for some padding

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.lineTo(10, canvas.height - 10);
    ctx.lineTo(canvas.width - 10, canvas.height - 10);
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Draw stock price history
    if (stockPriceHistory.length > 1) {
      ctx.beginPath();
      ctx.moveTo(10, canvas.height - 10 - offsetY);

      stockPriceHistory.forEach((price, index) => {
        const x = (index / (stockPriceHistory.length - 1)) * graphWidth + 10;
        const y = ((price - minPrice) / (maxPrice - minPrice)) * (graphHeight - offsetY) + offsetY;



        ctx.lineTo(x, canvas.height - y - 10);

      });


      
      ctx.strokeStyle = 'green';
      ctx.stroke();
    }
  });
}

// Function to increase max gain
function increaseMaxGain() {
  chrome.storage.local.get(['stockPrice', 'maxGain', 'increaseGainPrice'], function(data) {
    let stockPrice = data.stockPrice || 100;
    let maxGain = data.maxGain || 45;
    let increaseGainPrice = data.increaseGainPrice || 150;

    if (stockPrice >= increaseGainPrice) {
      stockPrice -= increaseGainPrice;
      maxGain += 10;
      maxLoss = Math.ceil(0.65 * maxGain);
      increaseGainPrice += 50;

      chrome.action.setBadgeText({ text: formatBadgeText(stockPrice) });

      function formatBadgeText(price) {
          if (price >= 1000 && price <= 10000 ) {
            // Convert to thousands with one decimal place
            const formattedPrice = (price / 1000).toFixed(1) + 'K';
            return formattedPrice;
          } else if (price >= 10000 && price <= 999999) {
              // Convert to thousands with one decimal place
              const formattedPrice = Math.floor(price / 1000) + 'K';
              return formattedPrice;
            } else if (price >= 999999 && price <= 10000000) {
              // Convert to thousands with one decimal place
              const formattedPrice = (price / 1000000).toFixed(1) + 'M';
              return formattedPrice;
            } else if (price >= 10000000 && price <= 100000000) {
              // Convert to thousands with one decimal place
              const formattedPrice = Math.floor(price / 1000000) + 'M';
              return formattedPrice;
            } else {
            return '$' + price;
          }
        }

      chrome.storage.local.set({
        'stockPrice': stockPrice,
        'maxGain': maxGain,
        'increaseGainPrice': increaseGainPrice,
        'maxLoss': maxLoss
      }, function() {
        updatePopup(stockPrice, increaseGainPrice);
        updateMaxGain(maxGain, increaseGainPrice);
        console.log(`Max gain increased to: ${maxGain}`);
      });
    } else {
      alert("Not enough stock value to increase max gain!");
    }
  });
}

// Function to update max gain display
function updateMaxGain(maxGain, increaseGainPrice) {
  document.getElementById('maxGain').textContent = 'Current Max Stock Gain is ' + maxGain;
}

// Initialize popup with initial stock price, max gain, and graph
chrome.storage.local.get(['stockPrice', 'stockPriceHistory', 'maxGain', 'increaseGainPrice'], function(data) {
  const stockPrice = data.stockPrice || 100; // Default to 100 if not set
  const maxGain = data.maxGain || 45; // Default max gain if not set
  const increaseGainPrice = data.increaseGainPrice || 150; // Default increase price if not set
  updatePopup(stockPrice, increaseGainPrice);
  updateMaxGain(maxGain, increaseGainPrice);
});

// Add event listener to the button
document.getElementById('increaseGainButton').addEventListener('click', increaseMaxGain);

// Receive message from background.js and update popup HTML
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === 'updateStockPrice') {
    updatePopup(message.stockPrice);
  }
});
