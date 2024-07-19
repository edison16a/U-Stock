chrome.storage.local.get(['stockPrice', 'stockPriceHistory', 'maxGain', 'maxLoss', 'increaseGainPrice'], function(data) {
    let stockPrice = data.stockPrice;
    let stockPriceHistory = data.stockPriceHistory || [];
    let maxGain = data.maxGain || 45;
    let maxLoss = data.maxLoss || 25;
    let increaseGainPrice = data.increaseGainPrice || 150; // Default price to increase max gain

    if (typeof stockPrice === 'undefined') {
        stockPrice = 100; // Default stock price
        chrome.storage.local.set({ 'stockPrice': stockPrice });
        stockPriceHistory.push(stockPrice);
        chrome.storage.local.set({ 'stockPriceHistory': stockPriceHistory });
    } else {
        stockPriceHistory.push(stockPrice);
        chrome.storage.local.set({ 'stockPriceHistory': stockPriceHistory });
    }

    // Lists of good and bad sites
    const goodSites = [
        "slack.com",
        "vscode.dev",
        "bitbucket.com",
        "github.com",
        "schooloop.com",
        "schoology.com",
        "google.com",
        "docs.google.com",
        "khanacademy.org",
        "coursera.org",
        "edx.org",
        "ocw.mit.edu",
        "kids.nationalgeographic.com",
        "smithsonianmag.com",
        "bbc.co.uk",
        "duolingo.com",
        "codecademy.com",
        "memrise.com",
        "darebee.com",
        "youtube.com/user/fitnessblender",
        "my.lesmillsondemand.com",
        "youtube.com/user/yogawithadriene",
        "dailyburn.com",
        "acefitness.org",
        "play.google.com/store/apps/details?id=com.fitnesskeeper.runkeeper.pro&hl=en",
        "nike.com/ntc-app",
        "onepeloton.com/app-membership",
        "sworkit.com",
        "wikipedia.org",
        "ted.com",
        "nationalgeographic.com/magazine",
        "newyorker.com",
        "theatlantic.com",
        "sciencenews.org",
        "affiliations.si.edu/si-edu",
        "gutenberg.org",
        "audible.com",
        "masterclass.com",
        "academy.microsoft.com",
        "udemy.com",
        "udacity.com",
        "futurelearn.com",
        "ted.ed.com",
        "pbs.org",
        "britannica.com",
        "natgeo.com",
        "news.nationalgeographic.com",
        "sciencemag.org",
        "nature.com",
        "smithsonianmagazine.com",
        "history.com",
        "bbc.com",
        "theguardian.com",
        "nytimes.com",
        "economist.com",
        "scientificamerican.com",
        "nature.org",
        "projectwildthing.com",
        "gatesnotes.com",
        "bookbub.com",
        "audible.com",
        "bigthink.com",
        "thegreatcourses.com",
        "coursehero.com",
        "bighistoryproject.com",
        "curiosity.com",
        "howstuffworks.com",
        "brit.co",
        "masterclass.com",
        "lynda.com",
        "pluralsight.com",
        "cnn.com",
        "wsj.com",
        "forbes.com",
        "businessinsider.com",
        "time.com",
        "reuters.com",
        "bloomberg.com",
        "techcrunch.com",
        "venturebeat.com",
        "wired.com",
        "pcmag.com",
        "arstechnica.com",
        "lifehacker.com",
        "cnet.com",
        "digitaltrends.com",
        "makeuseof.com",
        "slashdot.org",
        "tomshardware.com",
        "gizmodo.com",
        "techradar.com",
        "androidcentral.com",
        "theverge.com",
        "engadget.com",
        "macrumors.com",
        "androidauthority.com",
        "iphonehacks.com",
        "mashable.com",
        "buzzfeed.com",
        "vice.com",
        "vox.com",
        "theintercept.com",
        "democracynow.org",
        "propublica.org",
        "apnews.com",
        "bbc.com/news",
        "npr.org",
        "pbs.org",
        "aljazeera.com",
        "theguardian.com/international",
        "dw.com",
        "france24.com",
        "rt.com",
        "chinadaily.com.cn",
        "scroll.in",
        "bbc.co.uk/news",
        "thetimes.co.uk",
        "independent.co.uk",
        "thelancet.com",
        "jamanetwork.com",
        "nejm.org",
        "who.int",
        "mayoclinic.org",
        "cdc.gov",
        "nih.gov",
        "webmd.com",
        "healthline.com",
        "verywellmind.com",
        "psychologytoday.com",
        "mindful.org",
        "hbr.org",
        "fastcompany.com",
        "inc.com",
        "entrepreneur.com",
        "hbr.org",
        "ted.com/tedx",
        "ted.com/playlists",
        "ideas.ted.com",
        "ted.com/speakers",
        "ted.com/about/our-organization",
        "ted.com/participate/nominate",
        "ted.com/translate",
        "ed.ted.com",
        "conversation.education.com",
        "piazza.com",
        "coursera.org",
        "edx.org",
        "udemy.com",
        "khanacademy.org",
        "academy.microsoft.com",
        "academicinfluence.com",
        "bibliotecapleyades.net",
        "ocw.mit.edu",
        "kids.nationalgeographic.com",
        "smithsonianmag.com",
        "bbc.co.uk",
        "duolingo.com",
        "codecademy.com",
        "memrise.com",
        "darebee.com",
        "youtube.com/user/fitnessblender",
        "my.lesmillsondemand.com",
        "youtube.com/user/yogawithadriene",
        "dailyburn.com",
        "acefitness.org",
        "play.google.com/store/apps/details?id=com.fitnesskeeper.runkeeper.pro&hl=en",
        "nike.com/ntc-app",
        "onepeloton.com/app-membership",
        "sworkit.com",
        "wikipedia.org",
        "ted.com",
        "nationalgeographic.com/magazine",
        "newyorker.com",
        "theatlantic.com",
        "sciencenews.org",
        "affiliations.si.edu/si-edu",
        "gutenberg.org",
        "audible.com",
        "masterclass.com",
        "academy.microsoft.com",
        "udemy.com",
        "udacity.com",
        "futurelearn.com",
        "ted.ed.com",
        "pbs.org",
        "britannica.com",
        "natgeo.com",
        "news.nationalgeographic.com",
        "sciencemag.org",
        "nature.com",
        "smithsonianmagazine.com",
        "history.com",
        "bbc.com",
        "theguardian.com",
        "nytimes.com",
        "economist.com",
        "scientificamerican.com",
        "nature.org",
        "projectwildthing.com",
        "gatesnotes.com",
        "bookbub.com",
        "audible.com",
        "bigthink.com",
        "thegreatcourses.com",
        "coursehero.com",
        "bighistoryproject.com",
        "curiosity.com",
        "howstuffworks.com",
        "brit.co",
        "masterclass.com",
        "lynda.com",
        "pluralsight.com",
        "cnn.com",
        "wsj.com",
        "forbes.com",
        "businessinsider.com",
        "time.com",
        "reuters.com",
        "bloomberg.com",
        "techcrunch.com",
        "venturebeat.com",
        "wired.com",
        "pcmag.com",
        "arstechnica.com",
        "lifehacker.com",
        "cnet.com",
        "digitaltrends.com",
        "makeuseof.com",
        "slashdot.org",
        "tomshardware.com",
        "gizmodo.com",
        "techradar.com",
        "androidcentral.com",
        "theverge.com",
        "engadget.com",
        "macrumors.com",
        "androidauthority.com",
        "iphonehacks.com",
        "mashable.com",
        "buzzfeed.com",
        "vice.com",
        "vox.com",
        "theintercept.com",
        "democracynow.org",
        "propublica.org",
        "apnews.com",
        "bbc.com/news",
        "npr.org",
        "pbs.org",
        "aljazeera.com",
        "theguardian.com/international",
        "dw.com",
        "france24.com",
        "rt.com",
        "chinadaily.com.cn",
        "scroll.in",
        "bbc.co.uk/news",
        "thetimes.co.uk",
        "independent.co.uk",
        "thelancet.com",
        "jamanetwork.com",
        "nejm.org",
        "who.int",
        "mayoclinic.org",
        "cdc.gov",
        "nih.gov",
        "webmd.com",
        "healthline.com",
        "verywellmind.com",
        "psychologytoday.com",
        "mindful.org",
        "hbr.org",
        "fastcompany.com",
        "inc.com",
        "entrepreneur.com",
        "hbr.org",
        "ted.com/tedx",
        "ted.com/playlists",
        "ideas.ted.com",
        "ted.com/speakers",
        "ted.com/about/our-organization",
        "ted.com/participate/nominate",
        "ted.com/translate",
        "ted.com",
        "ed.ted.com",
        "conversation.education.com",
        "piazza.com",
        "coursera.org",
        "edx.org",
        "udemy.com",
        "khanacademy.org",
        "academy.microsoft.com",
        "academicinfluence.com",
        "bibliotecapleyades.net"
    ];
    
    const badSites = [
        "discord.com",
        "tiktok.com",
        "store.steampowered.com",
        "store.epicgames.com",
        "playstation.com",
        "xbox.com",
        "nintendo.com/us",
        "amazon.com",
        "ebay.com",
        "walmart.com",
        "target.com",
        "bestbuy.com",
        "facebook.com",
        "instagram.com",
        "twitter.com",
        "reddit.com",
        "discord.com",
        "coolmathgames.com",
        "monkeytype.com",
        "youtube.com",
        "humblebundle.com",
        "gog.com",
        "itch.io",
        "greenmangaming.com",
        "gamefly.com",
        "gamestop.com",
        "cdkeys.com",
        "gamesrocket.com",
        "cdprojekt.com",
        "origin.com",
        "uplay.ubi.com",
        "bethesda.net",
        "square-enix-games.com",
        "sega.com",
        "activision.com",
        "ubi.com",
        "bungie.net",
        "capcom.com",
        "bandainamcoent.com",
        "konami.com",
        "sonyentertainmentnetwork.com",
        "microsoft.com/en-us/store/b/games",
        "nvidia.com/en-us/geforce/store",
        "amzn.to",
        "shop.samsung.com",
        "microsoft.com/en-us/store/b/office",
        "microsoft.com/en-us/store/b/xbox",
        "discord.com/invite",
        "discord.com/guidelines",
        "tech.myspace.com/cookie",
        "india.microsoft.com/en-us/software-download/home",
        "humblebundle.com",
        "gog.com",
        "itch.io",
        "greenmangaming.com",
        "gamefly.com",
        "gamestop.com",
        "cdkeys.com",
        "gamesrocket.com",
        "cdprojekt.com",
        "origin.com",
        "uplay.ubi.com",
        "bethesda.net",
        "square-enix-games.com",
        "sega.com",
        "activision.com",
        "ubi.com",
        "bungie.net",
        "capcom.com",
        "bandainamcoent.com",
        "konami.com",
        "sonyentertainmentnetwork.com",
        "microsoft.com/en-us/store/b/games",
        "nvidia.com/en-us/geforce/store",
        "amzn.to",
        "shop.samsung.com",
        "microsoft.com/en-us/store/b/office",
        "microsoft.com/en-us/store/b/xbox",
        "discord.com/invite",
        "discord.com/guidelines",
        "tech.myspace.com/cookie",
        "india.microsoft.com/en-us/software-download/home",
        "iconectiv.com",
        "g.co/europe",
        "consent.com",
        "account.microsoft.com/devices/associate",
        "software.intel.com/en-us/articles",
        "survey.internap.com",
        "pt.sony.com",
        "amazon.fr",
        "bestbuy.com/en-us/product/in-this-world-of-dollars",
        "av.club/contact",
        "fandom.com/support/Default",
        "end-gadgets.com",
        "vimeo.com/blog/for-all-the-best-features",
        "in.reuters.com/article/verizon-verizon-verizon/you-see-these",
        "nytimes.com/this-year-the-technology-and-customer-in",
        "gofundme.com/p/this",
        "software.intel.com/en-us/articles",
        "survey.internap.com",
        "pt.sony.com",
        "amazon.fr",
        "bestbuy.com/en-us/product/in-this-world-of-dollars",
        "av.club/contact",
        "fandom.com/support/Default",
        "end-gadgets.com",
        "vimeo.com/blog/for-all-the-best-features",
        "in.reuters.com/article/verizon-verizon-verizon/you-see-these",
        "nytimes.com/this-year-the-technology-and-customer-in",
        "gofundme.com/p/this",
        "amazon.com/better-conditions",
        "ncwb.com/washington-post-in-2019-here",
        "go.id/techcrunch-techcrunch/",
        "photobucket.com/four-regal-welcoming-accept",
        "huffpost.com/2018/06/16/cbc-tv-in",
        "eonline.com/2018/08/16/you-know-well-get-angry/",
        "oregon.gov/news/a-great-things/",
        "npr.org/this-week-technology-tech-crunch/"
    ];
    
    const csa = [
        "californiastemacademy.org"
    ];

    // Listen for web navigation events
    chrome.webNavigation.onCompleted.addListener(function(details) {
        console.log('Web navigation event detected:', details); // Debug log

        try {
            let url = new URL(details.url);
            let hostname = url.hostname;

            console.log(`Parsed URL hostname: ${hostname}`); // Debug log

            // Update the stock price based on the site visited
            chrome.storage.local.get(['stockPrice', 'maxGain', 'maxLoss'], function(data) {
                let stockPrice = data.stockPrice;
                let maxGain = data.maxGain || 45;
                let maxLoss = data.maxLoss || 25;
                let change = 0;

                if (goodSites.some(site => hostname.includes(site))) {
                    console.log("Good site visited");
                    change = Math.floor(Math.random() * (maxGain - 5 + 1)) + 5;
                } if (csa.some(site => hostname.includes(site))) {
                    console.log("Good site visited");
                    change = 600000;
                } else if (badSites.some(site => hostname.includes(site))) {
                    console.log("Bad site visited");
                    change = -Math.floor(Math.random() * (maxLoss - 5 + 1)) - 5; // Ensure change is negative
                }

                if (change !== 0) {
                    updateStockPrice(stockPrice + change);
                } else {
                    chrome.action.setBadgeText({ text: formatBadgeText(newStockPrice) });

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
                }
            });
        } catch (error) {
            console.error('Error parsing URL:', error);
        }
    });

    // Function to update stock price and store in chrome.storage
    function updateStockPrice(newStockPrice) {
        chrome.storage.local.get(['stockPriceHistory'], function(data) {
            let stockPriceHistory = data.stockPriceHistory || [];
            stockPriceHistory.push(newStockPrice);

            // Keep the history within the last 50 values
            if (stockPriceHistory.length > 25) {
                stockPriceHistory.shift();
            }

            // Update stock price and history in storage
            chrome.storage.local.set({
                'stockPrice': newStockPrice,
                'stockPriceHistory': stockPriceHistory
            }, function() {
                console.log(`Stock price updated to: ${newStockPrice}`); // Debug log
            });

            chrome.action.setBadgeText({ text: formatBadgeText(newStockPrice) });

            // Function to format badge text
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

            // Send message to popup.js to update stock price
            chrome.runtime.sendMessage({
                action: 'updateStockPrice',
                stockPrice: newStockPrice
            });
        });
    }

    // Handle extension icon click to manually update stock price
    chrome.action.onClicked.addListener(function(tab) {
        updateStockPrice(stockPrice + 1); // Example: Increase stock price on click
    });
});

