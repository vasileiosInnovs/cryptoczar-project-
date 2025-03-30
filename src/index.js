document.addEventListener("DOMContentLoaded", function () {
    fetchCryptoData();
    initConverter();
    fetchCryptoNews();
});

setInterval(fetchCryptoData, 30000);

let lastCryptoData = null;
let lastFetchTime = 0;

async function fetchCryptoData() {
    const now = Date.now();
    if (lastCryptoData && now - lastFetchTime < 60000) {
        console.log("Using cached crypto data");
        return updateCryptoTable(lastCryptoData);
    }

    try {
        const response = await fetchWithRetry("https://cryptoczar-project.onrender.com/crypto-data");
        lastCryptoData = response;
        lastFetchTime = Date.now();
        updateCryptoTable(response);
    } catch (error) {
        console.error("Error fetching cryptocurrency data:", error);
    }
}

function fetchCryptoData() {
    const url = "https://cryptoczar-project.onrender.com/crypto-data";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Fetched Crypto Data:", data);

            const tableBody = document.getElementById("cryptoTableBody");
            tableBody.innerHTML = ""; 

            data.forEach(coin => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${coin.market_cap_rank}</td>
                    <td>
                        <img src="${coin.image}" alt="${coin.name}"> ${coin.name} (${coin.symbol.toUpperCase()})
                    </td>
                    <td>$${coin.current_price.toLocaleString()}</td>
                    <td>$${coin.market_cap.toLocaleString()}</td>
                    <td>$${(coin.fully_diluted_valuation || "N/A").toLocaleString()}</td>
                    <td>$${coin.high_24h.toLocaleString()}</td>
                    <td>$${coin.low_24h.toLocaleString()}</td>
                    <td>${coin.total_supply ? coin.total_supply.toLocaleString() : "N/A"}</td>
                    <td>${coin.max_supply ? coin.max_supply.toLocaleString() : "N/A"}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error("Error fetching cryptocurrency data:", error);
        });
    }

    async function fetchWithRetry(url, retries = 3, delay = 2000) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    if (response.status === 429 && attempt < retries) {
                        console.warn(`Rate limited. Retrying in ${delay}ms...`);
                        await new Promise(res => setTimeout(res, delay));
                        continue;
                    }
                    throw new Error(`HTTP Error ${response.status}`);
                }
                return await response.json();
            } catch (error) {
                console.error(`Attempt ${attempt} failed:`, error);
            }
        }
        throw new Error(`Failed to fetch ${url} after ${retries} retries`);
    }

function initConverter() {
    const amountInput = document.getElementById("amount");
    const fromCrypto = document.getElementById("fromCrypto");
    const toCurrency = document.getElementById("toCurrency");
    const convertBtn = document.getElementById("convert-currency");
    const resultDisplay = document.querySelector("#output output"); 

    /* fetch('https://cryptoczar-project.onrender.com/supported-currencies')
        .then(response => response.json())
        .then(vsCurrencies => {
            return fetch('https://cryptoczar-project.onrender.com/exchange_rates')
                .then(response => response.json())
                .then(data => ({
                    vsCurrencies: vsCurrencies,
                    rates: data.rates
                }));
        })
                    .then(data => {
                        populateCurrencyDropdowns(data.rates, data.vsCurrencies);
                        convertBtn.addEventListener("click", () => convertCurrency(amountInput, fromCrypto, toCurrency, resultDisplay));
                    })
                    .catch(error => {
                        console.error("Initialization error:", error);
                        resultDisplay.textContent = "Failed to load currency data. Please refresh the page.";
                    });
        } */

    fetch('https://cryptoczar-project.onrender.com/supported-currencies')
    .then(response => {
        console.log("Supported currencies response:", response.status, response.statusText);
        return response.json();
    })
    .then(vsCurrencies => {
        console.log("Supported currencies data:", vsCurrencies); // Debugging

        return fetch('https://cryptoczar-project.onrender.com/exchange_rates')
            .then(response => {
                console.log("Exchange rates response:", response.status, response.statusText);
                return response.json();
            })
            .then(data => {
                console.log("Exchange rates data:", data); // Debugging

                return {
                    vsCurrencies: vsCurrencies,
                    rates: data.rates
                };
            });
    })
    .then(data => {
        console.log("Final fetched data:", data); // Debugging
        populateCurrencyDropdowns(data.rates, data.vsCurrencies);
        convertBtn.addEventListener("click", () => convertCurrency(amountInput, fromCrypto, toCurrency, resultDisplay));
    })
    .catch(error => {
        console.error("Initialization error:", error);
        resultDisplay.textContent = "Failed to load currency data. Please refresh the page.";
    });
}

    
    function populateCurrencyDropdowns(rates, vsCurrencies) {
        fromCrypto.innerHTML = '<option value="">Cryptocurrency</option>';
        toCurrency.innerHTML = '<option value="">Currency</option>';

        Object.entries(rates)
            .filter(([_, rate]) => rate?.type === 'crypto')
            .sort((a, b) => a[1].name.localeCompare(b[1].name))
            .forEach(([key, rate]) => {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = `${rate.name} (${key.toUpperCase()})`;
                fromCrypto.appendChild(option);
            });


        vsCurrencies.sort().forEach(currency => {
            const option = document.createElement('option');
            option.value = currency;

            try {
                const currencyName = new Intl.DisplayNames(['en'], { type: 'currency' }).of(currency);
                option.textContent = currencyName ? `${currencyName} (${currency.toUpperCase()})` : currency.toUpperCase();
            } catch (e) {
                option.textContent = currency.toUpperCase();
            }

            toCurrency.appendChild(option);
        });
    }

    function convertCurrency(amountInput, fromCrypto, toCurrency, resultDisplay) {
        const amount = parseFloat(amountInput.value);
        const fromCurrencyId = fromCrypto.value;
        const toCurrencyCode = toCurrency.value;

        resultDisplay.textContent = '';

        if (!fromCurrencyId || !toCurrencyCode) {
            resultDisplay.textContent = "Please select both a cryptocurrency and a currency.";
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            resultDisplay.textContent = "Please enter a valid amount greater than 0.";
            return;
        }

        fetch('https://cryptoczar-project.onrender.com/exchange_rates')
            .then(response => response.json())
            .then(data => {
                const rates = data.rates;

                if (!rates[fromCurrencyId] || !rates[toCurrencyCode]) {
                    throw new Error("Selected currencies not available");
                }

                const fromRate = rates[fromCurrencyId]?.value || 1;
                const toRate = rates[toCurrencyCode]?.value || 1;

                const btcAmount = amount / fromRate;
                const convertedAmount = btcAmount * toRate;

                const formattedAmount = new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8
                }).format(amount);

                const formattedResult = new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 8
                }).format(convertedAmount);

                resultDisplay.textContent = `${formattedAmount} ${fromCrypto.options[fromCrypto.selectedIndex].text} = ${formattedResult} ${toCurrency.options[toCurrency.selectedIndex].text}`;
            })
            .catch(error => {
                console.error("Conversion error:", error);
                resultDisplay.textContent = "An error occurred during conversion. Please try again.";
            });
    }
    

/* function reload() {
    location.reload();
} */

function fetchCryptoNews() {
    const url = "https://cryptoczar-project.onrender.com/crypto-news";
    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => bindData(data.articles))
        .catch((error) => {
            console.error("Error fetching news:", error);
            const cardsContainer = document.getElementById("cards-container");
            cardsContainer.innerHTML =
                "<p>🚨 Failed to load news. Please try again later.</p>";
        });
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");
    cardsContainer.innerHTML = "";

    if (!articles || !Array.isArray(articles) || articles.length === 0) {
        console.error("No articles found or invalid data format");
        cardsContainer.innerHTML = "<p>⚠️ No news found. Please try again later.</p>";
        return;
    }

    articles.forEach((article) => {
        if (!article.urlToImage) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const newsImg = cardClone.querySelector("#news-img");
    const newsTitle = cardClone.querySelector("#news-title");
    const newsSource = cardClone.querySelector("#news-source");
    const newsDesc = cardClone.querySelector("#news-desc");

    newsImg.src = article.urlToImage;
    newsImg.alt = article.title || "News image";
    newsTitle.textContent = article.title;
    newsDesc.textContent = article.description || "No description available";

    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Europe/Moscow",
    });

    newsSource.textContent = `${article.source?.name || "Unknown source"} · ${date}`;

    cardClone.firstElementChild.addEventListener("click", () => {
        if (article.url) {
            window.open(article.url, "_blank");
        }
    });
}
 