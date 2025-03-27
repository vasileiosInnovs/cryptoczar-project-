

function fetchCryptoData() {
    const url = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h&locale=en";
    
    fetch(url)
        .then(response => response.json()) // Convert response to JSON
        .then(data => {
            const tableBody = document.getElementById("cryptoTableBody");
            tableBody.innerHTML = ""; // Clear existing table content

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

// Fetch data every 30 seconds
fetchCryptoData();
setInterval(fetchCryptoData, 30000);


document.addEventListener('DOMContentLoaded', function() {
  const amountInput = document.getElementById("amount");
  const fromCrypto = document.getElementById("fromCrypto");
  const toCurrency = document.getElementById("toCurrency");
  const resultDisplay = document.querySelector(".result");
  const errorDisplay = document.querySelector(".error");
  const convertBtn = document.querySelector(".convert");
  const loadingElement = document.getElementById("loading");

  initConverter();

  function initConverter() {
      fetch('https://api.coingecko.com/api/v3/simple/supported_vs_currencies')
          .then(function(response) {
              if (!response.ok) {
                  throw new Error('Failed to fetch supported currencies');
              }
              return response.json();
          })
          .then(function(vsCurrencies) {
              return fetch('https://api.coingecko.com/api/v3/exchange_rates')
                  .then(function(response) {
                      if (!response.ok) {
                          throw new Error('Failed to fetch exchange rates');
                      }
                      return response.json();
                  })
                  .then(function(data) {
                      return {
                          vsCurrencies: vsCurrencies,
                          rates: data.rates
                      };
                  });
          })
          .then(function(data) {
              populateCurrencyDropdowns(data.rates, data.vsCurrencies);
              
              convertBtn.disabled = false;
              loadingElement.style.display = 'none';
              
              convertBtn.addEventListener("click", convertCurrency);
          })
          .catch(function(error) {
              console.error("Initialization error:", error);
              errorDisplay.textContent = "Failed to load currency data. Please refresh the page.";
              loadingElement.textContent = "Failed to load data";
          });
  }

  function populateCurrencyDropdowns(rates, vsCurrencies) {
      fromCrypto.innerHTML = '';
      toCurrency.innerHTML = '';
      
      const cryptoOptions = Object.entries(rates)
          .filter(function([_, rate]) {
              return rate.type === 'crypto';
          })
          .sort(function(a, b) {
              return a[1].name.localeCompare(b[1].name);
          });
      
      cryptoOptions.forEach(function([key, rate]) {
          const option = document.createElement('option');
          option.value = key;
          option.textContent = rate.name + ' (' + key.toUpperCase() + ')';
          fromCrypto.appendChild(option);
      });
      
      vsCurrencies.sort().forEach(function(currency) {
          const option = document.createElement('option');
          option.value = currency;
          y
          try {
              const currencyName = new Intl.DisplayNames(['en'], {type: 'currency'}).of(currency);
              option.textContent = currencyName ? currencyName + ' (' + currency.toUpperCase() + ')' : currency.toUpperCase();
          } catch (e) {
              option.textContent = currency.toUpperCase();
          }
          
          toCurrency.appendChild(option);
      });
      
      fromCrypto.value = 'btc';
      toCurrency.value = 'usd';
  }

  function convertCurrency() {
      const amount = parseFloat(amountInput.value);
      const fromCurrencyId = fromCrypto.value;
      const toCurrencyCode = toCurrency.value;
     
      resultDisplay.textContent = '';
      errorDisplay.textContent = '';
      
      if (isNaN(amount)) {
          errorDisplay.textContent = "Please enter a valid amount";
          return;
      }
      
      if (amount <= 0) {
          errorDisplay.textContent = "Amount must be greater than 0";
          return;
      }
      
      fetch('https://api.coingecko.com/api/v3/exchange_rates')
          .then(function(response) {
              if (!response.ok) {
                  throw new Error('Failed to fetch exchange rates');
              }
              return response.json();
          })
          .then(function(data) {
              const rates = data.rates;
              s
              if (!rates[fromCurrencyId] || !rates[toCurrencyCode]) {
                  throw new Error("Selected currencies not available");
              }
              
              const fromRate = rates[fromCurrencyId].value;
              const toRate = rates[toCurrencyCode].value;
              
          
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
              
              const fromName = fromCrypto.options[fromCrypto.selectedIndex].text;
              const toName = toCurrency.options[toCurrency.selectedIndex].text;
              
              resultDisplay.textContent = formattedAmount + ' ' + fromName + ' = ' + formattedResult + ' ' + toName;
          })
          .catch(function(error) {
              console.error("Conversion error:", error);
              errorDisplay.textContent = "An error occurred during conversion. Please try again.";
          });
  }
});


  const API_KEY = "add4c8b134724a6d9ebd90930a86980b";
  const url = "https://newsapi.org/v2/everything?q=";

  document.addEventListener('DOMContentLoaded', () => {
      fetchCryptoNews("cryptocurrency");
  });

  function reload() {
      location.reload();
  } 

  function fetchCryptoNews(query) {
      fetch(`${url}${query}&apiKey=${API_KEY}`)
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
              cardsContainer.innerHTML = "<p>Failed to load news. Please try again later.</p>";
          });
  }

  function bindData(articles) {
      const cardsContainer = document.getElementById("cards-container");
      const newsCardTemplate = document.getElementById("template-news-card");

      cardsContainer.innerHTML = "";

      if (!articles || !Array.isArray(articles)) {
          console.error("No articles found or invalid data format");
          cardsContainer.innerHTML = "<p>No news found. Please try again later.</p>";
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