/* Miguel Gomez & Claudia Mate */

var oldValue = "inicio";

const sp500 = [
  ["AMZN", "Amazon"],
  ["GOOG", "Google"],
  ["ADBE", "Adobe"],
  ["MCD", "Macdonalds"],
  ["IBM", "IBM"],
  ["MSFT", "Amazon"],
  ["EBAY", "Amazon"],
  ["DPZ", "Domino's Pizza"],
  ["DLTR", "Dolar tree"],
  ["META", "META"],
  ["TSLA", "Tesla"],
  ["MNST", "Monster Beverage Corporation"],
];

const getRandomSP500 = () => sp500[randomizer(sp500.length + 1)][0];
const randomIncrement = (value) => Math.random() * value;

function randomizer(n) {
  return Math.floor(Math.random() * n + 1);
}
//move this function to the private closure
function getQuote(quote, fn = () => {}) {
  return fetch(
    `https://api.polygon.io/v2/aggs/ticker/${quote}/prev?adjusted=true&apiKey=DIxVAYuZEg9psGM2t4qQiEqcsIIgZUoJ `
  )
    .then((res) => res.json())
    .then(fn);
}

//  attaches a click event on the company name and subsequently prepares the field for jquery-live-search-example
function prepareSearch() {
  root.addEventListener("click", function ({ target, target: { className } }) {
    if (className !== "company_profile") return;
    function setPrice({ results: [{ o: lastPrice }] }) {
      console.log("from set price ", lastPrice);
    }

    getQuote("AAPL", setPrice);
    $(target).fadeOut(function () {
      $("<div/>", {
        id: "jquery-live-search-example",
        class: "myClass",
        html: '<input type="text" name="q">',
      }).insertAfter($(this)); // end of creating div and prepending

      // now we can activate the live search

      $('#jquery-live-search-example input[name="q"]')
        .liveSearch({ url: "ajax/search.php" + "?q=" })
        .focus();
    });
  });
}

// this function accepts newFace (String), and the posible values can be "ab" or "ba"//
function faceChangeExpression($face, newFace, faceNumber) {
  $face.flipbook({
    end: 4,
    loop: false,
    fps: 4,
    mobileStep: 1,
    images: "img/face/" + faceNumber + "/" + newFace + "/%2d.png",
  });
}

function createMan(companyCode) {
  const data = {
    query: {
      results: {
        quote: {
          Name: "Apple INC",
          LastTradePriceOnly: 173.97,
          symbol: "AAPL",
          Change: (Math.random() * 10 - 5).toFixed(2),
          Change_PercentChange: (Math.random() * 10 - 5).toFixed(2),
          StockExchange: "NASDAQ",
        },
        Change: "basura",
      },
    },
  };

  const createResponseDiv = ({ ticker, results: [{ o: lastPrice }] }) => {
    const response = document.createElement("div");
    response.classList.add("response");
    response.innerHTML = `<!--<span class='company_profile'>${Name}--><span class='company-symbol'>${ticker}</span>
     </span><br> ${lastPrice} <span class=${signClass}>${Change_PercentChange}</span><br>${StockExchange}`;
    man.appendChild(response);
  };

  var Name = data.query.results.quote.Name,
    LastTradePriceOnly = data.query.results.quote.LastTradePriceOnly,
    symbol = data.query.results.quote.symbol,
    change = data.query.results.quote.Change,
    Change_PercentChange = data.query.results.quote.Change_PercentChange,
    StockExchange = data.query.results.quote.StockExchange;

  var suitNumber = randomizer(3),
    tieNumber = randomizer(5),
    faceNumber = randomizer(5);

  var newFace;
  var signClass = "";

  var newValue = change > 0;

  // this will make the percentage red or green assigning a class later on
  var signClass = newValue ? "positive-value" : "negative-value";

  var newFace = newValue == "+" ? "ba" : "ab";

  oldValue = newValue;

  if (oldValue != newValue) {
    faceChangeExpression(newValue ? "ba" : newFace, face);
  }
  const faceImg = $("<img/>", { class: "face" }).flipbook({
    class: "face",
    end: 4,
    loop: false,
    fps: 4,
    mobileStep: 1,
    images: "img/face/" + faceNumber + "/" + "ab" + "/%2d.png",
  });

  const man = document.createElement("div");
  man.classList.add("man");
  man.style.background =
    "url('img/tie/" +
    tieNumber +
    ".png'),url('img/suit/" +
    suitNumber +
    ".png')";

  const faceDiva = document.createElement("img");
  faceDiva.classList.add("face");

  man.appendChild(faceImg[0]);
  //  man.appendChild(getQuote("AAPL", createResponseDiv)); won't work as this will return a promise
  getQuote(companyCode, createResponseDiv);
  root.appendChild(man);

  return { man, faceImg, faceNumber };
}

document.addEventListener("DOMContentLoaded", () => {
  root.style.height = `${window.innerHeight}px`;

  let value;
  const { man, faceImg, faceNumber } = createMan(getRandomSP500());

  setInterval(() => {
    const randomDelta = (randomIncrement(2) - 1).toFixed(2);

    value = randomDelta > 0 ? `ab` : `ba`;

    console.log(man.classList.contains(value));

    man.classList.contains(value)
      ? () => {}
      : (function () {
          man.classList.add(value);
          faceChangeExpression(faceImg, value, faceNumber);
          man.classList.remove(value[1] + value[0]);
        })();
  }, 3000);

  prepareSearch();
});
