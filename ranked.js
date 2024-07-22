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
        'Bronze I': { stockPrice: 0, maxGain: 0 },
        'Bronze II': { stockPrice: 150, maxGain: 55 },
        'Bronze III': { stockPrice: 400, maxGain: 75 },
        'Silver I': { stockPrice: 800, maxGain: 90 },
        'Silver II': { stockPrice: 1500, maxGain: 120 },
        'Silver III': { stockPrice: 2500, maxGain: 140 },
        'Gold I': { stockPrice: 4000, maxGain: 165 },
        'Gold II': { stockPrice: 6000, maxGain: 185 },
        'Gold III': { stockPrice: 8000, maxGain: 225 },
        'Platinum I': { stockPrice: 10000, maxGain: 260 },
        'Platinum II': { stockPrice: 13000, maxGain: 290 },
        'Platinum III': { stockPrice: 17000, maxGain: 330 },
        'Diamond I': { stockPrice: 22000, maxGain: 375 },
        'Diamond II': { stockPrice: 28000, maxGain: 410 },
        'Diamond III': { stockPrice: 35000, maxGain: 450 },
        'Diamond IV': { stockPrice: 42000, maxGain: 525 },
        'Diamond V': { stockPrice: 50000, maxGain: 650 },
        'Champion I': { stockPrice: 60000, maxGain: 800 },
        'Champion II': { stockPrice: 75000, maxGain: 950 },
        'Champion III': { stockPrice: 90000, maxGain: 1150 },
        'Champion IV': { stockPrice: 120000, maxGain: 1400 },
        'Champion V': { stockPrice: 160000, maxGain: 1700 },
        'Elite': { stockPrice: 250000, maxGain: 2000 },
        'Max': { stockPrice: 'Max Rank Reached', maxGain: 'Max Rank Reached' }
    };

    const currentRankElement = document.getElementById('currentRank');
    const currentRankImageElement = document.getElementById('currentRankImage');
    const rankUpButton = document.getElementById('rankUpButton');
    const progressBars = document.querySelectorAll('.progress-bar div');

    chrome.storage.local.get(['rank', 'stockPrice', 'maxGain'], function(data) {
        if (!data.rank) {
            chrome.storage.local.set({ rank: 'Bronze I' }, function() {
                updateRank('Bronze I');
            });
        } else {
            updateRank(data.rank);
        }

        if (data.stockPrice === undefined) {
            chrome.storage.local.set({ stockPrice: 0 });
        }

        if (data.maxGain === undefined) {
            chrome.storage.local.set({ maxGain: 0 });
        }

        updateProgressBars(data.stockPrice || 100, data.maxGain || 45);
    });

    function updateRank(rank) {
        currentRankElement.textContent = `Current Rank: ${rank}`;
        currentRankImageElement.style.backgroundImage = `url(${rankImages[rank]})`;
        const nextRank = getNextRank(rank);
        if (nextRank) {
            const nextRequirements = requirements[nextRank];
            document.querySelectorAll('.progress-text')[0].textContent = `Reach $${nextRequirements.stockPrice} stock price`;
            document.querySelectorAll('.progress-text')[1].textContent = `Reach $${nextRequirements.maxGain} max gain`;
        }
        chrome.storage.local.get(['rank', 'stockPrice', 'maxGain', 'buttonGain'], function(data) {
        updateProgressBars(data.stockPrice, data.maxGain);
        })
    }

    function getNextRank(rank) {
        const currentIndex = ranks.indexOf(rank);
        if (currentIndex < 0 || currentIndex >= ranks.length - 1) {
            return null; // No next rank available
        }
        return ranks[currentIndex + 1];
    }

    function updateProgressBars(stockPrice, maxGain) {
        const currentRank = currentRankElement.textContent.replace('Current Rank: ', '');
        const nextRank = getNextRank(currentRank);

        chrome.storage.local.get(['rank', 'stockPrice', 'maxGain'], function(data) {
            if (nextRank) {
                const nextRequirements = requirements[nextRank];
                const stockPriceProgress = (stockPrice / nextRequirements.stockPrice) * 100;
                const maxGainProgress = (maxGain / nextRequirements.maxGain) * 100;
                console.log(maxGain)
                console.log(nextRequirements.maxGain)
                console.log((maxGain / nextRequirements.maxGain) * 100)

                progressBars[0].style.width = `${Math.min(stockPriceProgress, 100)}%`;
                progressBars[1].style.width = `${Math.min(maxGainProgress, 100)}%`;
                
            } else {
                progressBars[0].style.width = '100%';
                progressBars[1].style.width = '100%';
            }
        });
    }

    rankUpButton.addEventListener('click', function() {
        chrome.storage.local.get(['rank', 'stockPrice', 'maxGain', 'buttonGain'], function(data) {
            const currentRankIndex = ranks.indexOf(data.rank);
            const nextRank = ranks[currentRankIndex + 1];
            let buttonGain = data.buttonGain || 10;

            updateProgressBars(data.stockPrice || 100, data.maxGain || 45);

            if (nextRank && checkRequirements(data.stockPrice, data.maxGain, data.rank)) {
                chrome.storage.local.set({ rank: nextRank }, function() {
                    updateRank(nextRank);
                });

                buttonGain += 0.5;
                console.log('set button gain to' + buttonGain)
                chrome.storage.local.set({buttonGain: buttonGain})


            } else if (data.rank === "Elite") {
                alert('You are already at the highest rank! Try getting on the leaderboard.');
            } else {
                alert('Requirements Not Met');
            }
        });
    });

    function checkRequirements(stockPrice, maxGain, rank) {
        const nextRank = ranks[ranks.indexOf(rank) + 1];
        if (nextRank) {
            const nextRequirements = requirements[nextRank];
            return stockPrice >= nextRequirements.stockPrice && maxGain >= nextRequirements.maxGain;
        }
        return false;
    }

    chrome.storage.onChanged.addListener(function(changes, namespace) {
        if (namespace === 'local') {
            if (changes.stockPrice || changes.maxGain) {
                chrome.storage.local.get(['stockPrice', 'maxGain'], function(data) {
                    updateProgressBars(data.stockPrice || 0, data.maxGain || 0);
                });
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
