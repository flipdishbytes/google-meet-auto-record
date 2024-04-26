chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (tab.url.includes("meet.google.com") && changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: {tabId: tab.id},
      files: ['contentScript.js']
    });
  }
});
