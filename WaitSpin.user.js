// ==UserScript==
// @name        WaitSpin
// @namespace   WaitSpin
// @description WARNING: THIS IS IN ALPHA STATE. Displays a visual feedback while the browser waits for the response of a request loads a new page.
// @include     *
// @version     0.107
// @grant       none
// @copyright   marcel@codeministry.ch
// @author      marcel@codeministry.ch
// @downloadURL https://github.com/suterma/WaitSpin/raw/master/WaitSpin.user.js
// @updateURL   https://github.com/suterma/WaitSpin/raw/master/WaitSpin.user.js
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/spin.js/2.3.2/spin.min.js
// ==/UserScript==

// ---------------------------------------
// Changelog
// 1.0.6 Cleanup, Implementing of official mozilla progess events
// 1.0.7 Rename to WaitSpin, move from gist to it's own repo
// ---------------------------------------


// Resolve possible jQuery conflicts
var jQ310 = $.noConflict(true);

// ---------------------------------------
// Spinning methods
// ---------------------------------------

function getOpts(){
  var opts = {
    lines: 17 // The number of lines to draw
  , length: 1 // The length of each line
  , width: 14 // The line thickness
  , radius: 32 // The radius of the inner circle
  , scale: 0.7 // Scales overall size of the spinner
  , corners: 1 // Corner roundness (0..1)
  , color: '#888' // #rgb or #rrggbb or array of colors
  , opacity: 0.25 // Opacity of the lines
  , rotate: 0 // The rotation offset
  , direction: 1 // 1: clockwise, -1: counterclockwise
  , speed: 0.4 // Rounds per second
  , trail: 60 // Afterglow percentage
  , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
  , zIndex: 10002 // The z-index 
  , className: 'spinner' // The CSS class to assign to the spinner
  , top: '50%' // Top position relative to parent
  , left: '50%' // Left position relative to parent
  , shadow: false // Whether to render a shadow
  , hwaccel: false // Whether to use hardware acceleration
  , position: 'absolute' // Element positioning
  };
  return opts;
}

function stopSpin(){
  if (typeof submitinSpinner !== 'undefined')    {
      submitinSpinner.stop();
      submitinSpinner = null;
  }
  console.log('Spinner stopped');
}

function spinOverFocused(){
  console.log('Spin over focused');
  // halt previous spin, if running
  //stopSpin();
  
  // Get the focused element
  var focused = jQ310(':focus');
  
  if (focused){  
    console.log('focused found: ' +focused);
    
    focused.wrap( "<span id='spinnertargetid'></span>" );
    var target = document.getElementById('spinnertargetid');
 
    submitinSpinner = new Spinner(getOpts()).spin(target);
    //alert('test3');
  }
}

function spinOverClicked(e){
  //TODO the current code below should spin over the clicked event, but does not
  //As workaround, spin at the position
  //console.log('redirect to spinOverFocused');
  //spinOverFocused();
  //return false;
  spinAtPosition(e);
  return false;
  
  console.log('Spin over ' + e.currentTarget.nodeName);
  // halt previous spin, if running
  //stopSpin();

  var spinnertarget = 
    jQ310('<span/>', {   
    id: 'spinnertargetid',
    class: '',
    text: ''
});//.appendTo('#mySelector');
  //spinnertarget.appendTo(e.currentTarget);
  console.log('having ' + spinnertarget);
  e.currentTarget.append(spinnertarget);
  //TODO the log below is not reached
  console.log('appended ' + spinnertarget);
  var spinnertarget = document.getElementById('spinnertargetid');  
 
  submitinSpinner = new Spinner(getOpts()).spin(spinnertarget);
  alert('Spinning over ' + spinnertarget);
}

// Spins at the given position
function spinAtGivenPosition(posx, posy){
  // halt previous spin, if running
  stopSpin();
  
    //remove previous spinner target
  //jQ310('#spinnertargetid').remove();
  
 // var spinnertargetid = 'spinnertargetid';
  console.log('spinAtGivenPosition stopped');
  
var spinnertarget = 
    jQ310('<span/>', {   
    id: 'spinnertargetid',
    class: '',
    text: ''
});//.appendTo('#mySelector');
  spinnertarget.appendTo('body');
  spinnertarget.css({position:"absolute", left:posx, top:posy});
  
  //spinnertarget.after("<span id='spinnerplaceholder'></span>");//.wrap("<span id='spinnerplaceholderparent'></span>");
  var target = document.getElementById('spinnertargetid');  
  submitinSpinner = new Spinner(getOpts()).spin(target);  
  submitinSpinner.css({position:"absolute", left:posx, top:posy});
    console.log('spinAtGivenPosition created');

}

// Spins at the position of an event
function spinAtPosition(event){
  console.log('spin at x: ' + event.pageX + " y: " + event.pageY );
  spinAtGivenPosition(event.pageX, event.pageY);
}

// ---------------------------------------
// Spinning events
// ---------------------------------------

//Spin at each submit
jQ310( "form" ).submit(function( event ) {
  spinOverFocused();
  return true;
});

//handle all clicks to (real) anchors (not linking to self)
//Does handle all
//jQ310('a').click(function(e) {
//Does not start with a pound sign
//jQ310('a[href^="#"]').click(function(e) {
//contains a real link (see http://stackoverflow.com/a/11676993/79485)
jQ310('a[href]:not([href^="mailto\\:"], [href$="\\#"])').click(function(e) {
  console.log('real link');
  
    if (
        e.ctrlKey || 
        e.shiftKey || 
        e.metaKey || // apple
        (e.button && e.button == 1) // middle click, >IE9 + everyone else
    ){
        console.log('... but opening in new window, so keep calm.');
        return;
    }
  
  //spinOverClicked(e);
	spinAtPosition(e);
});

//Stop spin when the user navigates away from the browser tab anyway
jQ310(window).blur(function(e) {
  console.log('windows blur');
  stopSpin();
});

//TODO Probably later use for something?
//$(window).focus(function(e) {
//    // Do Focus Actions Here
//});

// Handle AJAX. 
// See http://stackoverflow.com/a/28303226/79485
// and https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Monitoring_progress
var oldXHR = window.XMLHttpRequest;

function newXHR() {
    var realXHR = new oldXHR();
    // realXHR.addEventListener("readystatechange", function() {
        // console.log('readyState: ' + realXHR.readyState);       
        // // readyState1 is the first state, even before the request is sent
        // if(realXHR.readyState==1){            
            // spinOverFocused();
        // }
      
        // // readyState4 is the final state (we do not test success (would be  && realXHR.status==200))
        // if(realXHR.readyState==4){            
            // stopSpin();
        // }
    // }, false);
    realXHR.addEventListener("loadend", function() {
        console.log("The transfer finished (although we don't know if it succeeded or not).");
        stopSpin();        
    }, false);
    realXHR.addEventListener("loadstart", function() {
        console.log("The transfer progress has begun.");
        spinOverFocused();        
    }, false);  
    return realXHR;
}
window.XMLHttpRequest = newXHR;
