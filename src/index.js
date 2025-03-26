



/* let input = document.getElementById("amount"); */

/* let apiKey = 'CG-Xh4DDgZTeeRMYxbwe7yUfa5T'; */

/* let fromCryptoCurrency = document.getElementById("fromCrypto");
let toCurrency = document.getElementById("toCurrency");

function createOption(currency, defaultCode, element) {
  const option = document.createElement("option");
  option.classList.add("select-option");
  option.value = currency.name;
  if (currency.name === defaultCode) {
    option.selected = true;
  }
  option.text = ` ${currency.unit} - ${currency.name}`;
  element.appendChild(option);
}

function addCurrency() {
    const fromCryptoCurrency = document.getElementById("fromCrypto");
    const toCurrency = document.getElementById("toCurrency")

    const result = currencies.forEach((currency) => {
    const optionFrom = document.createElement("option");
    optionFrom.classList.add("select-option");
    optionFrom.value = currency.name;
    if (currency.type === "crypto") {
      optionFrom.selected = true;
    }
    optionFrom.text = `${currency.unit} - ${currency.name}`;

    fromCurrency.appendChild(optionFrom);

    const optionTO = document.createElement("option");
    optionTO.classList.add("select-option");
    optionTO.value = currency.name;
    if (currency.type === "fiat") {
      optionTO.selected = true;
    }
    optionTO.text = `${currency.unit} - ${currency.name}`;
    toCurrency.appendChild(optionTO);
  });
} */
/* addCurrency();

const convertBtn = document.querySelector(".convert");
convertBtn.addEventListener("click", () => {
  convertCurrency();
});
 */
/* function convertCurrency() {
  const fromCurrrencyCode = document.getElementById("fromCrypto").value;
  const toCurrencyCode = document.getElementById("toCurrency").value;
  const result = document.querySelector(".result");
  const error = document.querySelector(".error"); */

  /* console.log(fromCurrrencyCode);
  console.log(toCurrencyCode); */

  /* const amount = input.value;

  if (amount !== "" && parseFloat(amount) >= 1) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${fromCurrrencyCode}&vs_currencies=${toCurrencyCode}`;
    const options = {
        method: 'GET',
        headers: {accept: 'application/json', 'x-cg-demo-api-key': 'CG-Xh4DDgZTeeRMYxbwe7yUfa5T'}
    };

    fetch(url, options)
        .then(res => res.json())
        .then(data => {
            if (data[fromCurrrencyCode] && data[fromCurrrencyCode][toCurrencyCode]){
                const conversionRate = data[fromCurrrencyCode][toCurrencyCode]
            }
        })

  .      catch(err => console.error(err));
    

     const conversionResult = (amount * data.conversion_rate).toFixed(2);
        const formattedResult = conversionResult.replace(
          /\B(?=(\d{3})+(?!\d))/g,
          ","
        );

        result.innerHTML = `${amount} ${fromCurrrencyCode} = ${formattedResult} ${toCurrencyCode}`;
        amount.innerHTML = " ";
      }
      .catch(() => {
        error.textContent = "An error occured, please try again later ";
      });
  } else {
    alert("Please enter an amount");
  }
}  */


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