/* Miguel Gomez & Claudia Mate */

var oldValue = "inicio";

var height = $(window).height();

var newFace;

function randomizer(n) {
  return Math.floor(Math.random() * n + 1);
}

//  attaches a click event on the company name and subsequently prepares the field for jquery-live-search-example
function prepareSearch() {
  $(".company_profile").bind("click", function () {
    $(this).fadeOut(function () {
      $("<div/>", {
        id: "jquery-live-search-example",
        class: "myClass",
        html: '<input type="text" name="q">',
      }).prependTo("#response"); // end of creating div and prepending

      // now we can activate the live search

      $('#jquery-live-search-example input[name="q"]')
        .liveSearch({ url: "ajax/search.php" + "?q=" })
        .focus();
    });
  });
}

// this function accepts newFace (String), and the posible values can be "ab" or "ba"//
function faceChangeExpression(newFace, oldFace) {
  $("#face").flipbook({
    end: 4,
    loop: false,
    fps: 4,
    mobileStep: 1,
    images: "img/face/" + oldFace + "/" + newFace + "/%2d.png",
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

  console.log("oldvalue =" + oldValue);
  console.log("newvalue =" + newValue);
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

  const faceDiv = $("<div/>", $.extend({}, { class: "face-wrapper" })).append(
    faceImg
  );

  const createResponseDiv = () =>
    $("<div/>", { class: "response" }).html(
      "<span class='company_profile'>" +
        Name +
        " (<span class='company-symbol'>" +
        symbol +
        "</span>) </span><br> " +
        LastTradePriceOnly +
        " <span class=" +
        signClass +
        ">" +
        Change_PercentChange +
        "</span><br>" +
        StockExchange
    );
  prepareSearch();

  $("<div/>", { class: "man positive-value" })
    .appendTo("#wrapper")
    .css("height", height)
    .css(
      "background",
      "url('img/tie/" + tie + ".png'),url('img/suit/" + suit + ".png')"
    )
    .append(faceDiv)
    .append(createResponseDiv());
}

$(document).ready(function () {
  createMan("GOOG");
});

document
  .getElementsByClassName("operator")[0]
  .addEventListener("click", function () {
    createMan("GOOG");
  });
