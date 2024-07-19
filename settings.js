document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('usernameInput');
    const imageUrlInput = document.getElementById('imageUrlInput');
    const imagePreview = document.getElementById('imagePreview');
  
    // Load saved settings
    chrome.storage.local.get(['Username', 'Img', 'stockPrice', 'maxGain', 'increaseGainPrice'], result => {
      if (result.Username) {
        usernameInput.value = result.Username;
      }
      if (result.Img) {
        imageUrlInput.value = result.Img;
        imagePreview.style.backgroundImage = `url(${result.Img})`;
      }
    });
  
    // Show image preview when URL is pasted
    imageUrlInput.addEventListener('input', () => {
      const url = imageUrlInput.value;
      imagePreview.style.backgroundImage = `url(${url})`;
    });
  
    // Save settings
    document.getElementById('saveButton').addEventListener('click', () => {
      const username = usernameInput.value;
      const imgUrl = imageUrlInput.value;
  
      chrome.storage.local.set({
        'Username': username,
        'Img': imgUrl
      }, () => { 
      });
    });
  
    document.getElementById('resetStockPriceButton').addEventListener('click', () => {
      chrome.storage.local.set({
        'stockPrice': 100
      });
    });
  
    document.getElementById('resetMaxGain').addEventListener('click', () => {
      chrome.storage.local.set({
        'maxGain': 45,
        'increaseGainPrice': 150
      });
    });
  
    document.getElementById('closeSettingsButton').addEventListener('click', () => {
      document.body.style.display = 'none';
    });
  });
  