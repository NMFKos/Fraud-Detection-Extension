function ensureSendMessage(tabId, message, callback){
    chrome.tabs.sendMessage(tabId, {ping: true}, function(response){
      if(response && response.pong) { // Content script ready
        chrome.tabs.sendMessage(tabId, message, callback);
      } else { // No listener on the other end
        chrome.tabs.executeScript(tabId, {file: "content.js"}, function(){
          if(chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError);
            throw Error("Unable to inject script into tab " + tabId);
          }
          // OK, now it's injected and ready
          chrome.tabs.sendMessage(tabId, message, callback);
        });
      }
    });
  }
  chrome.action.onClicked.addListener((tab) =>{
    chrome.scripting.executeScript(tab.id, {file: "content.js"});
  });