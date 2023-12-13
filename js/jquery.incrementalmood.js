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

const getRandomSP500 = (companies) =>
  companies[randomizer(companies.length - 1)][0];

const randomIncrement = (value) => Math.random() * value;

function randomizer(n) {
  return Math.floor(Math.random() * n + 1);
}
//move this function to the private closure
function getQuote(quote) {
  return fetch(
    `https://api.polygon.io/v2/aggs/ticker/${quote}/prev?adjusted=true&apiKey=DIxVAYuZEg9psGM2t4qQiEqcsIIgZUoJ `
  )
    .then((res) => res.json())
    .catch(console.error);
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
  const man = document.createElement("div");
  man.classList.add("man");
  // creates minibox

  let infoBox = document.createElement("div");
  infoBox.classList.add("info-box");
  man.appendChild(infoBox);

  const updateInfoBox = ({ ticker, results: [{ o: lastPrice }] }, $infoBox) => {
    if ($infoBox) {
      infoBox = $infoBox[0];
    }

    const change = (Math.random() * 10 - 5).toFixed(2);

    infoBox.innerHTML = `<span class='company-symbol'>${ticker}</span>
     </span><br> ${lastPrice} <span class=${
      change > 0 ? `ba` : `ab`
    }>${change}</span><br>NASDAQ`;
  };

  const suitNumber = randomizer(3),
    tieNumber = randomizer(5),
    faceNumber = randomizer(5);

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
  getQuote(companyCode).then(updateInfoBox);
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

  return { man, face, faceNumber, updateInfoBox };
}

document.addEventListener("DOMContentLoaded", () => {
  root.style.height = `${window.innerHeight}px`;

  const { updateInfoBox } = createMan(getRandomSP500(sp500));

  prepareSearch(updateInfoBox);
});
