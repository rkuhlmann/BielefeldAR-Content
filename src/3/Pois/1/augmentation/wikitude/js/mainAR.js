var trackable_rhedaMarker02 = new RTTrackable("marker1");
var audioaroff = new RTImage("assets/audioaroff.png",1,options_audioaroff,trackable_rhedaMarker02);
var audioARon = new RTImage("assets/audioARon.png",1,options_audioARon,trackable_rhedaMarker02);
var sound = new AR.Sound("assets/audio.mp3");
sound.load();
audioaroff.onClickAdditions=function(){
  sound.play();
  audioARon.addToCam();
  audioaroff.removeFromCam();
};

audioARon.onClickAdditions=function(){
  sound.pause();
  audioaroff.addToCam();
  audioARon.removeFromCam();
};

sound.onFinishedPlaying=function(){
  audioaroff.addToCam();
  audioARon.removeFromCam();
}
audioaroff.addToCam();  

var World = {
    switchContentToInfo: function() {
      sound.pause();
      audioARon.removeFromCam();
      audioaroff.removeFromCam();
    },
    switchContentToAR: function() {
      audioaroff.addToCam();
    },
    turnEverythingOff: function() {
      sound.pause();
      audioARon.removeFromCam();
      audioaroff.removeFromCam();
    }
};