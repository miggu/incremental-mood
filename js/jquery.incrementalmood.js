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
];

const getRandomSP500 = () => sp500[randomizer(sp500.length)][0];

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
function faceChangeExpression(newFace, oldFace) {
  console.log("claudia");
  // $("#face").flipbook({
  //   end: 4,
  //   loop: false,
  //   fps: 4,
  //   mobileStep: 1,
  //   images: "img/face/" + oldFace + "/" + newFace + "/%2d.png",
  // });
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
  /////

  var suit = randomizer(3),
    tie = randomizer(5),
    face = randomizer(4);

  var newFace;
  var signClass = "";

  var newValue = change > 0;

  // this will make the percentage red or green assigning a class later on
  var signClass = newValue ? "positive-value" : "negative-value";

  var newFace = newValue == "+" ? "ba" : "ab";

  oldValue = newValue;

  if (oldValue != newValue) {
    console.log("oldvalue", oldValue, "newValue", newValue);
    faceChangeExpression(newValue ? "ba" : newFace, face);
  }
  const faceImg = $("<img/>", { class: "face" }).flipbook({
    class: "face",
    end: 4,
    loop: false,
    fps: 4,
    mobileStep: 1,
    images: "img/face/" + face + "/" + "ab" + "/%2d.png",
  });

  const man = document.createElement("div");
  man.classList.add("man");
  man.classList.add("positive-value");
  man.style.background =
    "url('img/tie/" + tie + ".png'),url('img/suit/" + suit + ".png')";

  const faceDiva = document.createElement("img");
  faceDiva.classList.add("face");

  man.appendChild(faceImg[0]);
  //  man.appendChild(getQuote("AAPL", createResponseDiv)); won't work as this will return a promise
  getQuote(companyCode, createResponseDiv);
  root.appendChild(man);
}

document.addEventListener("DOMContentLoaded", () => {
  root.style.height = `${window.innerHeight}px`;
  
  createMan(getRandomSP500());
  prepareSearch();
});
