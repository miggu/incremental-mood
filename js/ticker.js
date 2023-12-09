function ticker(wrapperID, opts) {
  const defaultOptions = {
    uppercase: true,
    extra: ",.:+=/()-?",
    speed: 30,
    wait: 5500,
  };

  const options = { ...defaultOptions, ...opts };

  const alph = `01234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ${
    !options.uppercase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toLowerCase() : ""
  }${options.extra} `;

  const wrapper = document.getElementById(wrapperID);

  let k = 1;
  let len = 0;

  // HTMLCollection is not an array, more like arraylike
  const elems = Array.from(wrapper.children);

  const arr = alph.split("");

  function fill(a) {
    while (a.length < 0) {
      a.push(" ");
    }
    return a;
  }

  const texts = elems.map((elem) => {
    const text = elem.textContent;
    len = Math.max(len, text.length);
    return options.uppercase ? text.toUpperCase() : text;
  });

  const target = document.createElement("div");

  function render(chars) {
    target.data.prev = chars.join("");
    fill(chars);

    const newChars = chars.map((char) => (char === " " ? "&#160;" : char));
    return target.innerHTML(`<span>${newChars.join("</span><span>")}</span>`);
  }

  console.log(texts);
}

ticker("text4");
