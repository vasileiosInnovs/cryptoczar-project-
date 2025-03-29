document.addEventListener("DOMContentLoaded", function () {
    fetchCryptoData();
    initConverter();
})

function fetchCryptoData() {
    const url = "https://cryptoczar-project.onrender.com/crypto-data";
    
    fetch(url)
        .then(response => response.json()) 
        .then(data => {
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


function initConverter() {
    const amountInput = document.getElementById("amount");
    const fromCrypto = document.getElementById("fromCrypto");
    const toCurrency = document.getElementById("toCurrency");
    const convertBtn = document.getElementById("convert-currency");
    const resultDisplay = document.querySelector("#output output"); 

    fetch('https://cryptoczar-project.onrender.com/supported-currencies')
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
    postButton.addEventListener("click", function () {
        const userText = outputElement.textContent;

        if (!userText || userText.startsWith("❌") || userText.startsWith("🔄")) {
            apiResponseDisplay.textContent = "No valid conversion result to post.";
            return;
        }

        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ result: userText })
        })
        .then(response => response.json())
        .then(data => {
            apiResponseDisplay.textContent = "✅ API Response: " + JSON.stringify(data);

            // Append the posted data to a list on the page
            const listItem = document.createElement("li");
            listItem.textContent = ` Posted: ${userText} (${new Date().toLocaleString()})`;
            resultList.appendChild(listItem);
        })
        .catch(error => {
            console.error("Error posting data:", error);
            apiResponseDisplay.textContent = " Failed to send data. Please check your connection and API settings.";
        });
    }); 
  
});




const url = "https://newsapi.org/v2/everything?q=";
const query = "bitcoin%20OR%20ethereum%20OR%20dogecoin%20OR%20solana%20OR%20tetherOR%20cryptocurrency&pageSize=10";

document.addEventListener("DOMContentLoaded", () => {
    fetchCryptoNews();
});

function reload() {
    location.reload();
}

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
 