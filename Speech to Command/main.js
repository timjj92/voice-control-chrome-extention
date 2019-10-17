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
// console.log(recording);

chrome.browserAction.onClicked.addListener(function () {
      if (!recording) {
        // chrome.tabs.create({url: 'http://www.google.com'});
        recording = true;
        recognition.start();
        console.log(recording);
      } 
      else {
        recording = false;
        recognition.stop();
        // alert(transcript);
        console.log(recording);
      }
    });

    let allTargets = {
      'google': 'http://www.google.com',
      'facebook': 'http://www.facebook.com',
      'youtube': 'http://www.youtube.com'
    }

    function processCommand(transcript) { 
      transcript = transcript.toLowerCase();
      console.log(transcript);
      if (transcript.indexOf('go to') === 0) {
  
        let targetUrl = transcript.slice(6);
        console.log(targetUrl);
        chrome.tabs.create({url: allTargets[targetUrl]});
      }
    }

    