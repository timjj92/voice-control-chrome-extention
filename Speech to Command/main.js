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

chrome.browserAction.onClicked.addListener(function () {
      if (!recording) {
        recording = true;
        recognition.start();
        chrome.browserAction.setBadgeText({text: "R"});
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

    function processCommand(transcript) { 
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

      //
    }

    