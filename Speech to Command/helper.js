// Listen for messages
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      let processingText = request.greeting;
      let allLinks = document.links;
      let targetUrl;
      console.log(processingText);
      for (let i = 0; i < allLinks.length; i++) {
          console.log(allLinks[i].text);
        // if (allLinks[i].text.toLowerCase().split(' ')[0] === processingText.split(' ')[0]) {
        if (allLinks[i].text.toLowerCase().indexOf(processingText) > -1) {
          console.log(allLinks[i].text.split(' ')[0]);
          console.log(processingText.split(' ')[0]);
          console.log(allLinks[i].href);
          targetUrl = allLinks[i].href;
          //chrome.tabs.create({url: allLinks[i].href});
          console.log(allLinks[i].text);
          break;
        }
      }
        sendResponse({farewell: targetUrl});
    }
);