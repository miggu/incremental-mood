/* Miguel Gomez & Claudia Mate */

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
    .then(fn)
    .catch(console.error);
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
function faceChangeExpression(img, newFace, faceNumber) {
  flipbook(img, {
    end: 4,
    loop: false,
    fps: 4,
    mobileStep: 1,
    images: "img/face/" + faceNumber + "/" + newFace + "/%2d.png",
  });
}

function createMan(companyCode) {

  // creates minibox
  const createInfoBox = ({ ticker, results: [{ o: lastPrice }] }) => {
    const response = document.createElement("div");
    response.classList.add("response");

    const change = (Math.random() * 10 - 5).toFixed(2);

    response.innerHTML = `<span class='company-symbol'>${ticker}</span>
     </span><br> ${lastPrice} <span class=${
      change > 0 ? `ba` : `ab`
    }>${change}</span><br>NASDAQ`;
    man.appendChild(response);
  };

  const suitNumber = randomizer(3),
    tieNumber = randomizer(5),
    faceNumber = randomizer(5);


    const man = document.createElement("div");
  man.classList.add("man");
  man.style.background =
    "url('img/tie/" +
    tieNumber +
    ".png'),url('img/suit/" +
    suitNumber +
    ".png')";

  const face = document.createElement("img");
  face.classList.add("face");

  //  this is how we added the jquery moving face
  // man.appendChild(faceImg[0]);
  man.appendChild(
    flipbook(face, {
      class: "face",
      end: 4,
      loop: false,
      fps: 4,
      mobileStep: 1,
      images: "img/face/" + faceNumber + "/" + "ab" + "/%2d.png",
    })
  );

  //  man.appendChild(getQuote("AAPL", createResponseDiv)); won't work as this will return a promise
  getQuote(companyCode, createInfoBox);
  root.appendChild(man);

  let value;
  setInterval(() => {
    const randomDelta = (randomIncrement(2) - 1).toFixed(2);

    value = randomDelta > 0 ? `ab` : `ba`;

    man.classList.contains(value)
      ? () => {}
      : (function () {
          man.classList.add(value);
          faceChangeExpression(face, value, faceNumber);
          man.classList.remove(value[1] + value[0]);
        })();
  }, 3000);

  return { man, face, faceNumber };
}

document.addEventListener("DOMContentLoaded", () => {
  root.style.height = `${window.innerHeight}px`;

  createMan(getRandomSP500());

  prepareSearch();
});
