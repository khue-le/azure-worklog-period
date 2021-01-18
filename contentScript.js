MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

var observer = new MutationObserver(function (mutations, observer) {
  displayPeriodInput();
});

// define what element should be observed by the observer
// and what types of mutations trigger the callback
observer.observe(document, {
  subtree: true,
  attributes: true,
  //...
});

function displayPeriodInput() {
  if (
    !document.getElementById("nk-period") &&
    document.getElementsByClassName("timeframe-duration") &&
    document.getElementsByClassName("timeframe-duration")[0]
  ) {
    // Create a new element
    var label = document.createElement("label");
    label.setAttribute("class", "ms-Label root-313");
    label.innerHTML = "Period";

    // Insert the new node before the reference node
    document.getElementsByClassName("timeframe-duration")[0].after(label);

    // Create a new element
    var input = document.createElement("input");
    input.setAttribute("id", "nk-period");
    input.setAttribute("type", "number");
    input.setAttribute("class", "timeframe-duration is-timeEntry");

    input.addEventListener("input", function (e) {
      chrome.runtime.sendMessage({ period: e.target.value });
    });

    // Insert the new node before the reference node
    label.after(input);
  }
}
