chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if(request.ping) { sendResponse({pong: true}); return; }
        if (request.action === "getSelectedText") {
        var selectedText = window.getSelection().toString();
        sendResponse({selectedText: selectedText});
        }
        else if (request.action === "Report") {
            var selectedText = window.getSelection().toString();
            sendResponse({selectedText: selectedText});
        }
});

