chrome.webNavigation.onHistoryStateUpdated.addListener(async function(details) {
  if (details.url.startsWith("https://github.com/PartnerPage/Apps/pull/") || details.url.startsWith("https://github.com/PartnerPage/Backend/pull/")) {
    chrome.scripting.executeScript({
      target: { tabId: details.tabId, allFrames: true },
      files: ['contentScript.js'],
    });
  }
});