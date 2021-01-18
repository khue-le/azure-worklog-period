chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  period = request.period;
});

const workLogUrl = "https://paypense.timehub.7pace.com/api-internal/rest/worklogs?api-version=3.1-beta";
var workLog = null;
var headers = null;
var period = 1;

function workLogsPeriod() {
  if (!workLog || !headers || !period || period < 2) {
    return;
  }

  let clonedPeriod = period < 5 ? period : 5;
  period = 1;

  for (let i = 0; i < clonedPeriod - 1; i++) {
    workLog.timestamp = addDays(workLog.timestamp, 1);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", workLogUrl, true);
    setHeaders(xhr);
    xhr.send(JSON.stringify(workLog));
  }

  workLog = null;
  headers = null;
}

var allowedHeaders = ["Content-Type", "X-Custom-Header", "Token", "Accept", "Authorization"];

function setHeaders(xhr) {
  headers.forEach((header) => {
    if (!allowedHeaders.includes(header.name)) return;
    xhr.setRequestHeader(header.name, header.value);
  });
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

chrome.webRequest.onBeforeRequest.addListener(
  function (info) {
    var decoder = new TextDecoder("utf-8");
    workLog = JSON.parse(decoder.decode(info.requestBody.raw[0].bytes));
  },
  { urls: ["https://*.timehub.7pace.com/api-internal/rest/worklogs*"] },
  // { urls: ["<all_urls>"] },
  ["requestBody"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  function (data) {
    headers = data.requestHeaders;
    workLogsPeriod();
    return { requestHeaders: data.requestHeaders };
  },
  {
    //Filter
    urls: ["https://*.timehub.7pace.com/api-internal/rest/worklogs*"],
    types: ["xmlhttprequest"],
  },
  ["requestHeaders", "blocking"]
);
