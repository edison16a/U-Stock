document.addEventListener('DOMContentLoaded', function() {
    const ranks = [
        'Bronze I', 'Bronze II', 'Bronze III',
        'Silver I', 'Silver II', 'Silver III',
        'Gold I', 'Gold II', 'Gold III',
        'Platinum I', 'Platinum II', 'Platinum III',
        'Diamond I', 'Diamond II', 'Diamond III', 'Diamond IV', 'Diamond V',
        'Champion I', 'Champion II', 'Champion III', 'Champion IV', 'Champion V',
        'Elite', 'Max'
    ];
    const rankImages = {
        'Bronze I': 'bronze1.png',
        'Bronze II': 'bronze1.png',
        'Bronze III': 'bronze1.png',
        'Silver I': 'silver1.png',
        'Silver II': 'silver1.png',
        'Silver III': 'silver1.png',
        'Gold I': 'gold1.png',
        'Gold II': 'gold1.png',
        'Gold III': 'gold1.png',
        'Platinum I': 'platinum1.png',
        'Platinum II': 'platinum1.png',
        'Platinum III': 'platinum1.png',
        'Diamond I': 'diamond1.png',
        'Diamond II': 'diamond1.png',
        'Diamond III': 'diamond1.png',
        'Diamond IV': 'diamond1.png',
        'Diamond V': 'diamond1.png',
        'Champion I': 'champion1.png',
        'Champion II': 'champion1.png',
        'Champion III': 'champion1.png',
        'Champion IV': 'champion1.png',
        'Champion V': 'champion1.png',
        'Elite': 'elite.png',
        'Max': 'elite.png'
    };

    const requirements = {
        'Bronze I': { stockPrice: 0, increaseGainPrice: 0 },
        'Bronze II': { stockPrice: 150, increaseGainPrice: 55 },
        'Bronze III': { stockPrice: 400, increaseGainPrice: 65 },
        'Silver I': { stockPrice: 800, increaseGainPrice: 75 },
        'Silver II': { stockPrice: 1500, increaseGainPrice: 90 },
        'Silver III': { stockPrice: 2500, increaseGainPrice: 105 },
        'Gold I': { stockPrice: 4000, increaseGainPrice: 120 },
        'Gold II': { stockPrice: 6000, increaseGainPrice: 140 },
        'Gold III': { stockPrice: 8000, increaseGainPrice: 165 },
        'Platinum I': { stockPrice: 10000, increaseGainPrice: 195 },
        'Platinum II': { stockPrice: 13000, increaseGainPrice: 225 },
        'Platinum III': { stockPrice: 17000, increaseGainPrice: 260 },
        'Diamond I': { stockPrice: 22000, increaseGainPrice: 300 },
        'Diamond II': { stockPrice: 28000, increaseGainPrice: 375 },
        'Diamond III': { stockPrice: 35000, increaseGainPrice: 450 },
        'Diamond IV': { stockPrice: 42000, increaseGainPrice: 525 },
        'Diamond V': { stockPrice: 50000, increaseGainPrice: 650 },
        'Champion I': { stockPrice: 60000, increaseGainPrice: 800 },
        'Champion II': { stockPrice: 75000, increaseGainPrice: 950 },
        'Champion III': { stockPrice: 90000, increaseGainPrice: 1150 },
        'Champion IV': { stockPrice: 120000, increaseGainPrice: 1400 },
        'Champion V': { stockPrice: 160000, increaseGainPrice: 1700 },
        'Elite': { stockPrice: 250000, increaseGainPrice: 2000 },
        'Max': { stockPrice: 'Max Rank Reached', increaseGainPrice: 'Max Rank Reached'}
    };

    const currentRankElement = document.getElementById('currentRank');
    const currentRankImageElement = document.getElementById('currentRankImage');
    const rankUpButton = document.getElementById('rankUpButton');
    const progressBars = document.querySelectorAll('.progress-bar div');

    chrome.storage.local.get(['rank', 'stockPrice', 'increaseGainPrice'], function(data) {
        if (!data.rank) {
            chrome.storage.local.set({ rank: 'Bronze I' }, function() {
                updateRank('Bronze I');
            });
        } else {
            updateRank(data.rank);
        }

        if (!data.stockPrice) {
            chrome.storage.local.set({ stockPrice: 0 });
        }

        if (!data.increaseGainPrice) {
            chrome.storage.local.set({ increaseGainPrice: 0 });
        }

        updateProgressBars(data.stockPrice || 0, data.increaseGainPrice || 0);
    });

    function updateRank(rank) {
        currentRankElement.textContent = `Current Rank: ${rank}`;
        currentRankImageElement.style.backgroundImage = `url(${rankImages[rank]})`;
        const nextRank = getNextRank(rank);
        if (nextRank) {
            const nextRequirements = requirements[nextRank];
            document.querySelectorAll('.progress-text')[0].textContent = `Reach $${nextRequirements.stockPrice} stock price`;
            document.querySelectorAll('.progress-text')[1].textContent = `Reach $${nextRequirements.increaseGainPrice} max gain`;
        }
    }

    function getNextRank(rank) {
        const currentIndex = ranks.indexOf(rank);
        if (currentIndex < 0 || currentIndex >= ranks.length - 1) {
            return null; // No next rank available
        }
        return ranks[currentIndex + 1];
    }

    function updateProgressBars(stockPrice, increaseGainPrice) {
        const currentRank = currentRankElement.textContent.replace('Current Rank: ', '');
        const currentRequirements = requirements[currentRank];

        const stockPriceProgress = (stockPrice / currentRequirements.stockPrice) * 100;
        const increaseGainPriceProgress = (increaseGainPrice / currentRequirements.increaseGainPrice) * 100;

        progressBars[0].style.width = `${Math.min(stockPriceProgress, 100)}%`;
        progressBars[1].style.width = `${Math.min(increaseGainPriceProgress, 100)}%`;
    }

    rankUpButton.addEventListener('click', function() {
        chrome.storage.local.get(['rank', 'stockPrice', 'increaseGainPrice'], function(data) {
            const currentRankIndex = ranks.indexOf(data.rank);
            const nextRank = ranks[currentRankIndex + 1];

            if (nextRank && checkRequirements(data.stockPrice, data.increaseGainPrice, data.rank)) {
                chrome.storage.local.set({ rank: nextRank }, function() {
                    updateRank(nextRank);
                });
            } else if (data.rank == "Elite"){
                alert('You are already at the highest rank! Try getting on the leaderbord');
            } else {
                alert('Requirements Not Met')
            }
        });
    });

    function checkRequirements(stockPrice, increaseGainPrice, rank) {
        const nextRank = ranks[ranks.indexOf(rank) + 1];
        if (nextRank) {
            const nextRequirements = requirements[nextRank];
            return stockPrice >= nextRequirements.stockPrice && increaseGainPrice >= nextRequirements.increaseGainPrice;
        }
        return false;
    }

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'local') {
            if (changes.stockPrice) {
                updateProgressBars(changes.stockPrice.newValue, changes.increaseGainPrice ? changes.increaseGainPrice.newValue : 0);
            }
            if (changes.increaseGainPrice) {
                updateProgressBars(changes.stockPrice ? changes.stockPrice.newValue : 0, changes.increaseGainPrice.newValue);
            }
        }
    });

    // Initial update
    chrome.storage.local.get('rank', function(data) {
        if (data.rank) {
            updateRank(data.rank);
        }
    });

    document.getElementById('closeRankedButton').addEventListener('click', () => {
        document.body.style.display = 'none';
    });
});
