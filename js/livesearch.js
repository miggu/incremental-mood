jQuery.fn.liveSearch = function (conf, createInfoBox) {
  var config = jQuery.extend(
    {
      url: "/search-results.php?q=",
      id: "jquery-live-search",
      duration: 400,
      typeDelay: 500,
      loadingClass: "loading",
      onSlideUp: function () {},
      uptadePosition: false,
    },
    conf
  );

  var liveSearch = jQuery("#" + config.id);

  // Create live-search if it doesn't exist
  if (!liveSearch.length) {
    liveSearch = jQuery('<div id="' + config.id + '"></div>')
      .appendTo(document.body)
      .hide()
      .slideUp(0);

    // Close live-search when clicking outside it
    jQuery(document.body).click(function (event) {
      var clicked = jQuery(event.target);
      if (
        !(
          clicked.is("#" + config.id) ||
          clicked.parents("#" + config.id).length ||
          clicked.is("input")
        )
      ) {
        liveSearch.slideUp(config.duration, function () {
          config.onSlideUp();
        });
      }
    });
  }

  return this.each(function () {
    var input = jQuery(this).attr("autocomplete", "off");
    var liveSearchPaddingBorderHoriz =
      parseInt(liveSearch.css("paddingLeft"), 10) +
      parseInt(liveSearch.css("paddingRight"), 10) +
      parseInt(liveSearch.css("borderLeftWidth"), 10) +
      parseInt(liveSearch.css("borderRightWidth"), 10);

    // Re calculates live search's position
    var repositionLiveSearch = function () {
      var tmpOffset = input.offset();
      var inputDim = {
        left: tmpOffset.left,
        top: tmpOffset.top,
        width: 250,
        height: input.outerHeight(),
      };

      inputDim.topPos = inputDim.top + inputDim.height;
      inputDim.totalWidth = inputDim.width - liveSearchPaddingBorderHoriz;

      liveSearch.css({
        position: "absolute",
        left: inputDim.left + "px",
        top: inputDim.topPos + "px",
        width: inputDim.totalWidth + "px",
      });
    };

    // Shows live-search for this input
    var showLiveSearch = function () {
      // Always reposition the live-search every time it is shown
      // in case user has resized browser-window or zoomed in or whatever
      repositionLiveSearch();

      // We need to bind a resize-event every time live search is shown
      // so it resizes based on the correct input element
      $(window).unbind("resize", repositionLiveSearch);
      $(window).bind("resize", repositionLiveSearch);

      liveSearch.slideDown(config.duration);
    };

    // Hides live-search for this input
    var hideLiveSearch = function () {
      liveSearch.slideUp(config.duration, function () {
        config.onSlideUp();
      });
    };

    input
      // On focus, if the live-search is empty, perform an new search
      // If not, just slide it down. Only do this if there's something in the input
      .focus(function () {
        if (this.value !== "") {
          // Perform a new search if there are no search results
          if (liveSearch.html() == "") {
            this.lastValue = "";
            input.keyup();
          }
          // If there are search results show live search
          else {
            // HACK: In case search field changes width onfocus
            setTimeout(showLiveSearch, 1);
          }
        }
      })
      // Auto update live-search onkeyup
      .keyup(function () {
        // Don't update live-search if it's got the same value as last time
        if (this.value != this.lastValue) {
          input.addClass(config.loadingClass);

          var q = this.value;

          // Stop previous ajax-request
          if (this.timer) {
            clearTimeout(this.timer);
          }

          // Start a new ajax-request in X ms
          this.timer = setTimeout(function () {
            jQuery.get(config.url + q, function ({ data }) {
              const fromDatatoHtml = (data) =>
                data
                  .filter(({ name = "" }) => name.includes(q))
                  .map(
                    ({ name, symbol }) =>
                      `<li class="liveresult__result"><a href="#" symbol=${symbol}>${name}</a></li>`
                  )
                  .join("");
              input.removeClass(config.loadingClass);
              // Show live-search if results and search-term aren't empty
              if (data.length && q.length) {
                liveSearch.html(fromDatatoHtml(data));
                showLiveSearch();
                // here i activate all the links so they can later query the Company
                addLinksForAPI();
              } else {
                hideLiveSearch();
              }
            });
          }, config.typeDelay);

          this.lastValue = this.value;
        }
      });

    var addLinksForAPI = function () {
      $("#jquery-live-search li a").bind("click", function () {
        console.log("me clickaste");
        getQuote($(this).attr("symbol")).then(createInfoBox);
        liveSearch.slideUp(config.duration, function () {
          config.onSlideUp();
        });
      });
    };
  });
};

//  attaches a click event on the company name and subsequently prepares the field for jquery-live-search
function prepareSearch(createInfoBox) {
  root.addEventListener("click", function ({ target, target: { className } }) {
    if (className !== "company-symbol") return;

    $(target).fadeOut(function () {
      $("<div/>", {
        class: "search-location",
        html: '<input type="text" name="q">',
      }).insertAfter($(target)); // end of creating div and prepending

      // now we can activate the live search

      $('.search-location input[name="q"]')
        .liveSearch({ url: "companies.json" + "?q=" }, createInfoBox)
        .focus();
    });
  });
}
