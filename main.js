try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}
catch(e) {
  console.error(e);
  $('.no-browser-support').show();
  $('.app').hide();
}

/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
var transcript;

recognition.onresult = function(event) {

  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far. 
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  transcript = event.results[current][0].transcript;
  console.log(transcript); 
  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  // if(!mobileRepeatBug) {
  //   noteContent += transcript;
  //   noteTextarea.val(noteContent);
  // }
  processCommand(transcript);
  
};

recognition.onstart = function() { 
  console.log("onstart activated");
}

recognition.onerror = function(event) {
  console.log(event.error);
}

let recording = false;

chrome.browserAction.onClicked.addListener(function(tab) {
  if (!recording) {
    recording = true;
    recognition.start();
    chrome.browserAction.setBadgeText({text: "L"});
    console.log(recording);
  } 
  else {
    recording = false;
    recognition.stop();
    chrome.browserAction.setBadgeText({text: ""});
    console.log(recording);
  }
});

let allTargets = {
  'google': 'http://www.google.com',
  'facebook': 'http://www.facebook.com',
  'youtube': 'http://www.youtube.com',
  'codesmith': 'https://codesmith.io',
  'espn': 'https://www.espn.com/',
  'twitter': 'https://twitter.com/home',
  'instagram': 'https://www.instagram.com/'
}

async function processCommand(transcript) { 
  transcript = transcript.toLowerCase();
  
  // Navigate to a webpage
  if (transcript.indexOf('go to') === 0) {
    let targetUrl = transcript.slice(6);
    if (allTargets[targetUrl]) {
      chrome.tabs.create({url: allTargets[targetUrl]});
    } else {
      chrome.tabs.create({url: 'http://www.' + targetUrl + '.com'});
    }
  } 

  // Search/Google keyword
  if (transcript.indexOf('google') === 0 || transcript.indexOf('search') === 0) {
    let targetUrl = transcript.slice(7);
    targetUrl = targetUrl.split(' ').join('+');
    chrome.tabs.create({url: 'https://www.google.com/search?q=' + targetUrl});
  }

  // Shop
  if (transcript.indexOf('shop for') === 0) {
    let targetUrl = transcript.slice(9);
    targetUrl = targetUrl.split(' ').join('+');
    chrome.tabs.create({url: 'https://www.amazon.com/s?k=' + targetUrl});
  }

  // Play
  if (transcript.indexOf('play') === 0) {
    let targetUrl = transcript.slice(5);
    targetUrl = targetUrl.split(' ').join('+');
    chrome.tabs.create({url: 'https://www.youtube.com/results?search_query=' + targetUrl});
  }

  if (transcript.indexOf('youtube') === 0) {
    let targetUrl = transcript.slice(8);
    targetUrl = targetUrl.split(' ').join('+');
    chrome.tabs.create({url: 'https://www.youtube.com/results?search_query=' + targetUrl});
  }

  //check email 
  if (transcript.indexOf('check email') === 0) {
    chrome.tabs.create({url: 'https://www.gmail.com'});
  }

  //open calendar / schedule
  if (transcript.indexOf('calendar') === 0 || transcript.indexOf('schedule') === 0) {
    chrome.tabs.create({url: 'https://calendar.google.com/calendar/r'});
  }

  //open google maps 
  if (transcript.indexOf('where is') === 0) {
    let targetUrl = transcript.slice(9);
    targetUrl = targetUrl.split(' ').join('+');
    chrome.tabs.create({url: 'https://www.google.com/maps/search/?api=1&query=' + targetUrl});
  }

  // Go to link
  // chrome.tabs.query({ currentWindow: true, active: true}, function(tabs){
  //   console.log("im opening tab");
  //   console.log(tabs);
  //   console.log(tabs[0].id);
  //   chrome.tabs.onUpdated.addListener(function (tabId , info) {
  //     if (info.status === 'complete') {
  //       chrome.tabs.sendMessage(tabs[0].id, {greeting: "targetUrl"}, function(response){
  //         console.log(response.farewell);
  //       });
  //     }
  //   });
  // });


  // chrome.tabs.get()
  if (transcript.indexOf('open') === 0) {
    let targetUrl = transcript.slice(5);
    console.log(targetUrl);
    chrome.tabs.query({ currentWindow: true, active: true}, function(tabs){
      console.log(tabs[0]);
      console.log(tabs[0].id);
      if(tabs[0].status === 'complete'){
        console.log("i am sending message");
        chrome.tabs.sendMessage(tabs[0].id, {greeting: targetUrl}, function(response){
          chrome.tabs.update(tabs[0].id, {url: response.farewell});
          // chrome.tabs.create({url: response.farewell});
          console.log(response.farewell);
        });
      }
    });
  }
    //       // ...if it matches, send a message specifying a callback too
    //       //chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
    
    function getAllLinks(){
      // await console.log(tabs);
      let allLinks = document.links;
      console.log(allLinks);
    }

  //   
  // for (let i = 0; i < allLinks.length; i++) {
  //   if (allLinks[i].text.split(' ')[0] === targetUrl.split(' ')[0]) {
  //     console.log(allLinks[i].text.split(' ')[0]);
  //     console.log(targetUrl.split(' ')[0]);
  //     chrome.tabs.create({url: allLinks[i].href});
  //     console.log(allLinks[i].href);

//     }
//   }
// }
}

// getAllLinks();

// function onError(error) {
//   console.error('Error: ${error}');
// }

// function sendMessageToTabs(tabs) {
//   for (let tab of tabs) {
//     chrome.tabs.sendMessage(
//       tab.id,
//       {greeting: "Hi from background script"}
//     ).then(response => {
//       console.log("Message from the content script:");
//       console.log(response.response);
//     }).catch(onError);
//   }
// }
