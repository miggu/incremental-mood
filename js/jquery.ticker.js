// https://codepen.io/kucsatax/pen/DQZegP
$.fn.ticker = function (options) {
  options = $.extend(
    {
      uppercase: true,
      extra: ",.:+=/()-?",
      speed: 30,
    },
    options
  );

  var alph = "ABCDEFGHIJKLÁÓŰÜŐÍÖÉMNOPQRSTUVWXYZ";

  if (!options.uppercase) {
    alph = alph + alph.toLowerCase();
  }
  alph = "01234567890" + alph + options.extra + " ";

  return this.each(function () {
    var k = 1,
      elems = $(this).children(),
      arr = alph.split(""),
      len = 0,
      fill = function (a) {
        console.log(a);
        while (a.length < len) {
          a.push(" ");
        }
        return a;
      },
      texts = $.map(elems, function (elem) {
        var text = $(elem).text();
        len = Math.max(len, text.length);
        return options.uppercase ? text.toUpperCase() : text;
      }),
      target = $("<div>"),
      render = function (print) {
        console.log(print.join(""));
        target.data("prev", print.join(""));
        fill(print);
        print = $.map(print, function (p) {
          return p == " " ? "&#160;" : p;
        });
        return target.html("<span>" + print.join("</span><span>") + "</span>");
      },
      attr = {};

    console.log(texts);

    // $.each(this.attributes, function (i, item) {
    //   target.attr(item.name, item.value);
    // });

    $(this).replaceWith(render(texts[0].split("")));

    setInterval(function () {
      var next = fill(texts[k].split("")),
        prev = fill(target.data("prev").split("")),
        print = prev;

      $.each(next, function (i) {
        if (next[i] == prev[i]) {
          return;
        }
        var index = alph.indexOf(prev[i]),
          j = 0,
          tid = window.setInterval(function () {
            if (next[i] != arr[index]) {
              index = index == alph.length - 1 ? 0 : index + 1;
            } else {
              window.clearInterval(tid);
            }
            print[i] = alph[index];
            render(print);
          }, options.speed);
      });
      k = k == texts.length - 1 ? 0 : k + 1;
    }, 5500);
  });
};

$("#text4").ticker();
