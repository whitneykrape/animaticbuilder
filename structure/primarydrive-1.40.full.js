// Animatic Builder v1.40
// http://www.gnu.org/licenses/gpl-3.0.txt Licensed under the GPL. Credit where credit is due. Developed by Whitney Krape
// Refomatting data <
var formatDuration = function(unformattedDuration) {
 var leadingzeros = '';
 var formatting = /(\d+)(\d{3})/;
 var minutes = '';
 var length = '00000000';
 
 timeformat = length + unformattedDuration;
 timeformat = timeformat.match(formatting);
 
 seconds = timeformat[1];
 if (seconds >= 60) {
  minutes = Math.floor(seconds/60);
 }
 seconds = (seconds - (minutes * 60)) + '';
 if (seconds.length < 2) {
  seconds = '0' + seconds;
 }
 timeformat = length + (minutes + ':' + seconds + '.' + timeformat[2]);
 timeformat = timeformat.slice(6);
 return  timeformat;
};

maxValue = function (array) {
 mxm = array[0];
 for (i=0; i<array.length; i++) {
  if (array[i]>mxm) {
   mxm = array[i];
  }
 }
 return mxm;
};
// >
// Declare the basics
// The duration of the current frame
var currentframeduration = '';
// The actual window size
var windowcalc = $('body').width()+16;
 
 // CALLED UP BY ORDER OF APPEARENCE <
 // More basics
var playback = '';
var windowcalc = '';
var currentframe = '';
var imagetitle = '';
var selectedframe = '';
var localCache = '';
var durations = [];
var sequenceLength = $('li.shot').length;
var meta = '';
var currentmeta = '';
var cachestatus = '';
var localstatus = '';

if (navigator.onLine) {

$('#action').fadeIn().html('Skip caching. <img src="./structure/ab_loadnext.png" alt="Next"/>').bind('click', function () {
 cachestatus = 'ready';
 primarydrive();
});
	
// Listeners for all possible events
 var cache = window.applicationCache;
 var cacheStatusValues = [];
  cacheStatusValues[0] = 'uncached';
  cacheStatusValues[1] = 'idle';
  cacheStatusValues[2] = 'checking';
  cacheStatusValues[3] = 'downloading';
  cacheStatusValues[4] = 'updateready';
  cacheStatusValues[5] = 'obsolete';
 
 cache.addEventListener('checking', function(e) {
   $('#cache').fadeIn().html('Checking Manifest. <img id="working" src="./structure/ab_loadworking.gif" alt="working"/>');
  }
 , false);
 
 cache.addEventListener('progress', function(e) {
   $('#cache').fadeIn().html('Downloading Manifest. <img id="working" src="./structure/ab_loadworking.gif" alt="working"/>');
  }
 , false);
 
 cache.addEventListener('downloading', function(e) {
   $('#cache').fadeIn().html('Downloading Manifest. <img id="working" src="./structure/ab_loadworking.gif" alt="working"/>');
  }
 , false);
 
 cache.addEventListener('noupdate', function(e) {
   $('#cache').fadeIn().html('Cache up to date. <img src="./structure/ab_loaddone.png" alt="Done"/>');
    cachestatus = 'ready';
	 primarydrive();
  }
 , false);
 
 cache.addEventListener('error', function(e) {
   $('#cache').fadeIn().html('Cache error, may not be offline ready. <img src="./structure/ab_loadwarning.png" alt="Warning"/>');
    cachestatus = 'error';
  }
 , false);
 
 cache.addEventListener('updateready', function(e) {
   if (cacheStatusValues[cache.status] != 'idle') {
    cache.swapCache();
    // log('Swapped/updated the Cache Manifest.');
    $('#cache').fadeIn().html('Cache downloaded. <img src="./structure/ab_loaddone.png" alt="Done"/>');
    cachestatus = 'ready';
	 primarydrive();
   }
  }
 , false);
 
 cache.addEventListener('cached', function(e) {
   $('#cache').fadeIn().html('Cache up to date. <img src="./structure/ab_loaddone.png" alt="Done"/>');
    cachestatus = 'ready';
	 primarydrive();
  }
 , false);
 
 if (localStorage.getItem('meta')) {
  meta = localStorage.getItem('meta');
  $('#localdata').fadeIn().html('Local Data set. <img src="./structure/ab_loaddone.png" alt="Done"/>');
  localstatus = 'ready';
 } else {
  $('#localdata').fadeIn().html('Local Data does not exist, setting. <img src="./structure/ab_loadworking.gif" alt="Loading"/>');
  $.get('downlink.php', function(data) {
   localStorage.setItem('meta', data);
	$('#localdata').fadeIn().html('Local Data does not exist, set. <img src="./structure/ab_loaddone.png" alt="Done"/>');
  });
  localstatus = 'ready';
  primarydrive();
 }
 
 if (meta && localStorage.getItem('baselinemeta')) {
  currentmeta = localStorage.getItem('baselinemeta');
  // console.log(meta);
  // console.log(currentmeta);
  if(meta === currentmeta) {
   $('#localdata').fadeIn().html('Sequence is unchanged. <img src="./structure/ab_loaddone.png" alt="Done"/>');
   localstatus = 'ready';
	primarydrive();
  } else {
   $('#localdata').fadeIn().html('Sequence changed, scanning for updates. <img id="working" src="./structure/ab_loadworking.gif" alt="Loading"/>');
   // Scanner
   // Find which one is longer
   if (meta.length > currentmeta.length) {
    var checkLength = meta;
   } else {
    var checkLength = currentmeta;
   }
   
   // All the regex to get to each shot
   checkStripInfo = RegExp('({.*?})', 'g');
   checkStripTrailing = RegExp('[^0-9]', 'g');
   cuttoEntries = RegExp('.({.*?}).', 'g');
   
   checkLength = checkLength.replace(checkStripInfo, '1');
   checkLength = checkLength.replace(checkStripTrailing, '');
   checkLength = checkLength.length;
   
   var meta = meta.replace(cuttoEntries, '$1');
   var currentmeta = currentmeta.replace(cuttoEntries, '$1');
   var sourceentry = "";
   var checkentry = "";
   for (i=0; i<checkLength; i++) {
    selectMetaData = RegExp('."ID":"[0-9]*","shotid":"' + i + '",(?:"[0-9a-zA-Z]*":"[0-9a-zA-Z\ \-\:\_\.\+\;\,]*".){5}');
    
    sourceentry = meta.match(selectMetaData) + '';
    checkentry = currentmeta.match(selectMetaData) + '';
    if (sourceentry === 'null') {
     $('li#scan ul').append('<li>Delete shot: ' + i + '</li>');
     
     $.post('uplink.php', {
      'action' : 'removeframesync',
      'shotid' : i
     });
    } else if (checkentry === 'null') {
     $('li#scan ul').append('<li>Creating shot: ' + i + '</li>');
     var enter = '';
     var metaData = [];
     for (it=0; it<=7; it++) {
      selectShotData = RegExp('(?:"[0-9a-zA-Z]*":"([0-9a-zA-Z\ \-\:\_\.\+\;\,]+?)".){' + it + '}');
      cleanUpImage = RegExp('(.*)/');
      enter = sourceentry.match(selectShotData);
       metaData[it] = enter[1];
     }
     
     $.post('uplink.php', {
      'action' : 'addframesync',
      'shotid' : metaData[2],
      'title' : metaData[3],
      'shotduration' : metaData[4],
      'image' : metaData[6].replace(cleanUpImage, ''),
      'description' : metaData[7]
     });
    } else if (sourceentry != checkentry) { 
     $('li#scan ul').append('<li>Updating/Creating shot: ' + i + '</li>');
     var enter = '';
     var metaData = [];
     for (it=0; it<=7; it++) {
      selectShotData = RegExp('(?:"[0-9a-zA-Z]*":"([0-9a-zA-Z\ \-\:\_\.\+\;\,]+?)".){' + it + '}');
      cleanUpImage = RegExp('(.*)/');
      enter = sourceentry.match(selectShotData);
       metaData[it] = enter[1];
     }
     
     $.post('uplink.php', {
      'shotid' : metaData[2],
      'title' : metaData[3],
      'shotduration' : metaData[4],
      'image' : metaData[6].replace(cleanUpImage, ''),
      'description' : metaData[7]
     });
    }
    
    if (i == (checkLength-1)) {
     localStorage.clear('currentmeta');
     $.get('downlink.php', function(data) {
       localStorage.setItem('meta', data);
       // console.log(data);
     });
     $('#localdata').fadeIn().html('Finished updating. <img src="./structure/ab_loaddone.png" alt="Done"/>');
 	  localstatus = 'ready';
    } else {
	  localstatus = 'processing';
	 }
   }
  }
 }
 primarydrive();
} else {
 localstatus = 'ready';
 cachestatus = 'ready';
 $('#cache').fadeIn().html('Cache Unchecked. <img src="./structure/ab_loadwarning.png" alt="Warning"/>');
 primarydrive();
}

function primarydrive() {
// console.log(localstatus);
// console.log(cachestatus);
 if (localstatus === 'ready' && cachestatus === 'ready') {
  $('#datawrapper').fadeOut();
  // Initialize package functions. THESE ARE THE MAIN ENGINES <
  // Used for the vingette
  optionMenus();
  // Make sure the layout is fluid
  windowFramed();
  // Get the data, start the show
  loadSequenceEngine();
  // >
 }
}
  
  // Whenever the window is resized readjust
  $(window).resize( function(){
   windowFramed();
   $('#imagedialog').dialog('close');
   $('#optionsmenu').dialog('close');
  });
 
  // The scrollEngine, creates a jQuery UI silder for scrolling through the frames <
  $('#timeline').slider({
   animate: false,
   slide: sequenceScroll,
   step: 0.0001,
   change: sequenceScroll,
   max: sequenceLength-1
  });
  
  // Increment the slide forwards, snapping to the next frame, using the change: option.
  $('#previous').click(function() {
   $('#vignette').fadeOut(150);
   clearTimeout(playback);
   currentframe = $('#timeline').slider('value');
   currentframeFloor = Math.floor(currentframe);
   $('#play').css({ display: 'block' });
   $('#pause').css({ display: 'none' });
   if (currentframe <= 0) {} else if ( currentframe != currentframeFloor) { 
    $('#timeline').slider('value', currentframeFloor);
   } else {
    $('#timeline').slider('value', currentframeFloor-1);
   }
  });
  // Increment the slide backwards, snapping to the previous frame, using the change: option.
  $('#next').click(function() {
   $('#vignette').fadeOut(150);
   clearTimeout(playback);
   currentframe = $('#timeline').slider('value');
   currentframeCeiling = Math.ceil(currentframe);
   rawframes = $('li.shot').length-1;
   $('#play').css({ display: 'block' });
   $('#pause').css({ display: 'none' });
   if (currentframe >= rawframes) {} else if ( currentframe != currentframeCeiling) { 
    $('#timeline').slider('value', currentframeCeiling);
   } else {
    $('#timeline').slider('value', currentframeCeiling+1);
   }
  });
  // Play.
  $('#play').click( function() {
   currentframe = Math.floor($('#timeline').slider('value'));
   reindex = currentframe;
   $('#vignette').fadeIn(150);
   rawframes = $('li.shot').length;
   
   allDurations();
   playFrom();
   
   $('#play').css({ display: 'none' });
   $('#pause').css({ display: 'block' });
  });
  // Pause.
  
  $('#pause').click(function (){
   clearTimeout(playback);
   $('#vignette').fadeOut(150);
   $('#play').css({ display: 'block' });
   $('#pause').css({ display: 'none' });
  });
  // Return to beginning.
  $('#beginning').click(function() {
   clearTimeout(playback);
   $('#vignette').fadeOut(150);
   $('#play').css({ display: 'block' });
   $('#pause').css({ display: 'none' });
   $('#timeline').slider('value', 0);
  });
  // Go to the end.
  $('#end').click(function() {
   clearTimeout(playback);
   $('#vignette').fadeOut(150);
   $('#play').css({ display: 'block' });
   $('#pause').css({ display: 'none' });
   sequenceLength = $('li.shot').length-1;
   $('#timeline').slider('value', sequenceLength);
  });
  
  $('#optionsmenu').dialog({
   autoOpen: false, 
   width: '80%',
   closeText: '',
   modal: true
  });
  
  $('#options').click(function() {
   $('#optionsmenu').dialog('open');
  });
  // > 
 
 
 // The AJAX uploader <
  $('#imagedialog').dialog({ 
   autoOpen: false, 
   width: '100%',
   open: function(e, ui) {
   var uploaderHeight = $('#imageviewer #imageselection').height();
   var uploaderSpace = $('#imageviewer').height();
   var imageStack = Math.abs(uploaderHeight - uploaderSpace);
   modifyimage = '';
   selectedimageindex = '';
   
    $('#imageviewer #slider').slider({
     value: imageStack,
     max: imageStack,
     min: 0,
     slide: function(e, ui) { 
      var scrollStack = imageStack - ui.value;
      $('#imageviewer #imageselection').css('top', '-' + scrollStack + 'px');
     },
     change: function(e, ui) { 
      var scrollStack = imageStack - ui.value;
      $('#imageviewer #imageselection').css('top', '-' + scrollStack + 'px');
     },
     orientation: 'vertical'
    });
   },
   closeText: '',
   modal: true
  });
  
  $('#scanupload').click(function(){
   $('li.uploadedimage').remove();
   loadLocalImages();
  });
  
  $('#deleteimage').click(function(){
   $('li.uploadedimage:eq(' + selectedindex + ')').remove();
   deleteImage();
  });
  
   new AjaxUpload($('#uploadimage'), {
    action: 'uplink.php',  
    // Name of the file input box  
    name: 'uploadfile',
    onSubmit: function(file, ext){
     if (! (ext && /^(jpg|png|jpeg|gif)$/.test(ext))){  
        // check for valid file extension  
      $('#cache').text('Only JPG, PNG or GIF files are allowed');  
      return false;  
     }  
     $('#cache').text('Uploading...');
    },  
    onComplete: function(file, response){  
     // On completion clear the status.
     $('#cache').text('');  
     // Add uploaded file to list.
     if(response === 'success'){
      $('<li class="uploadedimage"></li>').appendTo('ul#imageselection').html('<img src="./uploads/' + file + '" alt="Missing ' + file + '" /> <p class="selectimage">' + file + ' </p>')
     } else{
      $('<li class="uploaderror"></li>').appendTo('ul#imageselection').text(file);
     } 
    }
   });
  // >
  
 // Device Specific <
  // When hovering over the filmstrip pan the element with the mousewheel.
  $('ul#shotlist').hover().mousewheel(function(event, delta) {
   currentframe = $('#timeline').slider('value');
   if (delta > 0) {
    $('#timeline').slider('value',  currentframe + (delta * 0.3));
   } else if (delta < 0) {
    $('#timeline').slider('value',  currentframe + (delta * 0.3));
   }
   return false;
  });
  
  $('li#imageviewer').hover().mousewheel(function(event, delta) {
   currentslide = $('#imageviewer #slider').slider('value');
   if (delta > 0) {
    $('#imageviewer #slider').slider('value',  currentslide + (delta * 30));
   } else if (delta < 0) {
    $('#imageviewer #slider').slider('value',  currentslide + (delta * 30));
   }
   return false;
  });
  
  // iPhone Specific <
  $().bind('touchmove', function(event) {
   event.preventDefault();
  }, false); 
  
  window.onorientationchange = function() {
   var orientation = window.orientation;
   switch(orientation) {
   case 0:
    $('ul#playback_menu li').css({ });
   break;  
   case 90:
    $('ul#playback_menu li').css({ margin: '0 1%' });
   break;
   case -90:
    $('ul#playback_menu li').css({ margin: '0 1%' });
   break;  
   }
  }
  
  document.getElementById('shotlist').addEventListener('touchstart', function(event) {
   xtouchorgin = event.changedTouches[0].pageX;
  }, false); 
   
  document.getElementById('shotlist').addEventListener('touchmove', function(event) {
   event.preventDefault();
   xtouchdestination = event.changedTouches[0].pageX;
   currentframe = $('#timeline').slider('value');
   eq = Math.abs(xtouchorgin - xtouchdestination);
   if (xtouchorgin > xtouchdestination) { 
    $('#timeline').slider('value', currentframe + (eq * 0.0008));
   } else if (xtouchorgin < xtouchdestination) {
    $('#timeline').slider('value', currentframe - (eq * 0.0008));
   }
  }, false); 
    
  document.getElementById('imageselection').addEventListener('touchstart', function(event) {
   event.preventDefault();
   setTimeout('tapImage()', 300);
  }, false);
  
  $('li.uploadedimage').live('touchstart', function(event) {
   modifyimage = $(this).children('p').text();
   selectedimageindex = $('li.uploadedimage').index(this);
   
   $('li.uploadedimage').removeClass('select');
   $(this).addClass('select');
  }, false);
  
  document.getElementById('imageviewer').addEventListener('touchstart', function(event) {
   ytouchorgin = event.changedTouches[0].pageY;
  }, false);
  
  document.getElementById('imageviewer').addEventListener('touchmove', function(event) {
   event.preventDefault();
   ytouchdestination = event.changedTouches[0].pageY;
   currentslide = $('#imageviewer #slider').slider('value');
   eq = Math.abs(ytouchorgin - ytouchdestination);
   if (ytouchorgin < ytouchdestination) { 
    $('#imageviewer #slider').slider('value', currentslide + (eq * 0.05));
   } else if (ytouchorgin > ytouchdestination) {
    $('#imageviewer #slider').slider('value', currentslide - (eq * 0.05));
   }
  }, false); 
  // >
 // >
 
  function windowFramed() {
   // Refine as the window is resized
   windowcalc = $('body').width()+16;
   horizonwidthcalc = Math.ceil((520 / windowcalc) * 100);
   horizonpaddingcalc = Math.floor((100 - ((520 / windowcalc) * 100)) / 2);
   // The filmstrip is centered with a defined width, add padding to fill in the rest of the screen.
   $('div#horizon').css({
    width: horizonwidthcalc + '%',
    padding: '0px ' + horizonpaddingcalc + '%'
   });
  }
  
  // Scroll the slider.
  function sequenceScroll(event, ui) {
   $('ul#shotlist').animate({left: - ui.value * 500 }, 0);
    currentframe = $('#timeline').slider('value');
    currentframeRounded = Math.round(currentframe)
    
    var currentTime = 0;
   $('p.shotduration:lt(' + (currentframeRounded+1) +')').each( function(i,e) {
    currentTime += Math.abs($(this).text().replace(/[^0-9]/g, ''));
   });
   
   if (currentframeRounded > -1) {
    $('#timeline a.ui-slider-handle').html(currentframeRounded + '<span>' + formatDuration(currentTime) + '</span>');
   } else {
    $('#timeline a.ui-slider-handle').html(0);
   }
  };
  
  // This goes to downlink.php and pulls every shot down then expands it from JSON into the series of shots.
  function loadSequenceEngine() {
   if (navigator.onLine) {
    $.get('downlink.php', function(data) {
     data = $.parseJSON(data);
     $.each(data.sequence.meta, function(i, item) {
      $('ul#shotlist').append( '<li class="shot" id="s' + item.shotid + '"> \
      <img src="./uploads/' + item.image + '" alt="' + item.image + '" /> \
      <div class="frame meta"> \
      <p class="read fourth title">' + item.title + '</p> \
      <p class="read fourth shotduration">' + formatDuration(item.shotduration) + '</p> \
      <p class="read fourth shotid" id="' + item.ID + '">' + item.shotid + '</p> \
      <p class="read fourth time">' + item.datemodified + '</p> \
      <p class="read description">' + item.description + '</p> \
      </div> \
      </li>' );
     });
     
     allDurations();
     
     $('li.shot img').live('touchstart', function(event) {
      $('span.ui-icon-closethick').unbind('touchstart.tapOpenDialog');
      event.preventDefault();
      // Add class, and set the timer.
      addImageto = $(this).parent()
      addImageto.addClass('tap');
      tapOpen();                     
     }, false);
     
     sliderEngine();
     frameAddRemoveEngine();
     frameReadEngine();
     timelineMarkers();
     imageUploaderOpen();
     imageUploadSelect();
     $('#timeline').slider('value', 0);
     loadLocalImages();
    });
    $('#filmwrapper').fadeIn();
   } else {
   // If offline then pull from the localStorage
     if (localStorage.getItem('meta')) {
      var storedsequence = $.parseJSON(localStorage.getItem('meta'));
      
      $.each(storedsequence.sequence.meta, function(i, item) {
       $('ul#shotlist').append( '<li class="shot" id="s' + item.shotid + '"> \
       <img src="./uploads/' + item.image + '" alt="' + item.image + '" /> \
       <div class="frame meta"> \
       <p class="read fourth title">' + item.title + '</p> \
       <p class="read fourth shotduration">' + formatDuration(item.shotduration) + '</p> \
       <p class="read fourth shotid" id="' + item.ID + '">' + item.shotid + '</p> \
       <p class="read fourth time">' + item.datemodified + '</p> \
       <p class="read description">' + item.description + '</p> \
       </div> \
       </li>' );
      });
     }
     
     allDurations();
    
     $('li.shot img').live('touchstart', function(event) {
      $('span.ui-icon-closethick').unbind('touchstart.tapOpenDialog');
      event.preventDefault();
      // Add class, and set the timer.
      addImageto = $(this).parent()
      addImageto.addClass('tap');
      tapOpen();
     }, false);
     
     sliderEngine();
     frameAddRemoveEngine();
     frameReadEngine();
     timelineMarkers();
     imageUploaderOpen();
     imageUploadSelect();
     loadLocalImages();
     setTimeout(function () {$('#timeline').slider('value', 0)}, 1);
     $('#filmwrapper').fadeIn();
   }
  };
 
                                                 
 
 // UI functions <
 function optionMenus() {
  $('#vigette_level').toggle(
   function () {
    $('#vigette_level').removeClass().addClass('up').text('Show Background');
    $('#vignette').css({ background: 'url(./structure/ab_vingette_heavy.png) center repeat-y' });
   },
   function () {
    $('#vigette_level').removeClass().addClass('down').text('Hide Background');
    $('#vignette').css({ background: 'url(./structure/ab_vingette_light.png) center repeat-y' });
   }
  );
  
  $('#toggle_meta').toggle(
   function() {
    $('div.frame.meta').hide();
    $('span#slidemeta').css({ background: '#141618 url(./structure/ab_down_ui.png) center no-repeat' });
    $('#toggle_meta').removeClass().addClass('up').text('Show Frame Data');
   },
   function() {
    $('div.frame.meta').show();
    $('span#slidemeta').css({ background: '#141618 url(./structure/ab_up_ui.png) center no-repeat' });
    $('#toggle_meta').removeClass().addClass('down').text('Hide Frame Data');
   }
  );
  
  $('#clear_local').click( function () {
   localStorage.clear();
  });
 }
 
 function timelineMarkers() {
  $('ul#timelinemarkers').empty();
  totalMarkers = $('li.shot').length;
  if (totalMarkers) {
   markers = (totalMarkers-1) + '';
   if (markers < 5) {
    markers = (markers.length);
   } else if (markers > 6) {
    markers = (markers.length*5);
   }
   writeMarkers = Math.round(totalMarkers/markers);
   spacingMultiplyer = (100/markers);
   
   for (i=0; i <= markers; i++) {
    $('ul#timelinemarkers').append('<li style=" left:' + (i*spacingMultiplyer) + '%"><span>' + (i*writeMarkers) + '</span></li>');
   };
  }
 }
 // >
 
 
 // Device Specifc <
 function tapOpen() {
  // If the class isn't there, just do nothing
  setTimeout('addImageto.removeClass("tap");', 300);
    
  $('li.shot img').bind('touchstart.tapOpenDialog', function(event) {
   if ($(this).parent().hasClass('tap')) {
   selectedframe = $(this).parent().attr('id').replace('s', '');
   
   $('#imagedialog').dialog('open');
   };
  }, false);
 };
 
 function tapImage() {
  $('li.uploadedimage img').bind('touchstart.tapSelectImage', function(event) {
   imagetitle = $(this).attr('alt').replace('Missing ', '');
   thisinto = 'image';
   $('#imagedialog').dialog('close');
   $('li.shot#s' + selectedframe + ' img').replaceWith('<img src="./uploads/' + imagetitle + '" alt="Missing ' + imagetitle + '" title="Click to change frame image" />');
   outputEngine();
  }, false);
 };
 // >
 
 function playFrom() {
  playback = setTimeout('playFrom()', durations[reindex]);
  if (currentframe != rawframes && reindex == currentframe) {
   reindex = reindex+1;
   $('#timeline').slider('value', Math.floor(currentframe));
  } else if (currentframe != rawframes && reindex > 0) {
   reindex = reindex+1;
   $('#timeline').slider('value', Math.floor(currentframe+1));
  }
  
  if (reindex == rawframes) { 
   clearTimeout(playback);
   $('#vignette').fadeOut(600);
   $('#play').css({ display: 'block' });
   $('#pause').css({ display: 'none' });
  }
 }
 
  
 function sliderEngine() {
  $('ul#shotlist').sortable({
   placeholder: 'shot_placeholder',
   forcePlaceHolderSize: true,
   start: function(event, ui) {
    originalIndex = ui.item.prevAll().length;
   },
   update: function(event, ui) {
    thisinto = 'updateallids';
    newIndex = ui.item.prevAll().length;
     if (newIndex > originalIndex) {
     $('li.shot p.read.fourth.shotid:lt(' + newIndex + ')').each( function (index) {
     $(this).text(index);
     });
     // console.log('(' + originalIndex + ' > Rows <= ' + newIndex + ') - 1.');
    } else if (newIndex < originalIndex) {
     $('li.shot p.read.fourth.shotid:gt(' + newIndex + ')').each( function (index) {
     $(this).text(newIndex+index+1);
     });
     // console.log('(' + newIndex + ' >= Rows < ' + originalIndex + ') + 1.');
    }
    $('li.shot p.read.fourth.shotid:eq(' + newIndex + ')').text(newIndex);
    outputEngine();
   }
  });
  sequenceLength = $('li.shot').length;
  currentframe = $('#timeline').slider('value');
  $('#timeline').slider('option', 'max', sequenceLength -1);
  $('ul#shotlist').width(sequenceLength * 500);
  if ( sequenceLength == 0) { $('ul#welcomeMenu').css({'top': 0}); }
  else if ( sequenceLength > 0) { $('ul#welcomeMenu').css({'top': -9999}); }
 }
  
 // FrameEngine <
 function frameAddRemoveEngine() {
  // Need add note system to insert.
  // Shot form switcher only activates the delete action on the entry that needs deleting.
  $('#removeframe').click(function () {
   currentframe = $('#timeline').slider('value');
   currentframe = Math.round(currentframe);
   thisinto = 'addremove';
   thisaction = 'removeframe';
   $('li.shot:gt(' + currentframe + ')').each(function (index) {
    $(this).attr('id', 's' + (currentframe + index));
    $(this).children('div.frame.meta').children('p.shotid').text(currentframe + index);
   });
   $('li.shot').eq(currentframe).remove();
   sliderEngine();
   clearTimeout(playback);
   outputEngine();
   timelineMarkers();
   imageUploaderOpen();
   if (currentframe == 0) {
    $('#timeline').slider('value', currentframe);
   } else {
    $('#timeline').slider('value', currentframe-1);
   }
  });
  
 $('#addframe').click(function () {
  currentframe = $('#timeline').slider('value');
  currentframe = Math.round(currentframe);
  thisinto = 'addremove';
  thisaction = 'addframe';
  rawframes = $('li.shot').length;
  defaultFrameRecord = '';
  var lastid = [];
  
  if (rawframes == 0) { 
   $('ul#shotlist').append( '<li class="shot" id="s"> \
   <img src="./uploads/blackbackground.gif" alt="Double click here to add an image." /> \
   <div class="frame meta"> \
   <p class="read fourth title">Title</p> \
   <p class="read fourth shotduration">' + formatDuration(1000) + '</p> \
   <p class="read fourth shotid" id="1"> 0 </p> \
   <p class="read fourth time">Timestamp</p> \
   <p class="read description">Click here to add a shot description.</p> \
   </div> \
   </li>' );
  } else {
   $('li.shot div.frame.meta p.read.fourth.shotid').each( function (i) {
    lastid[i] = parseInt($(this).attr('id'));
   });
   lastid = maxValue(lastid);
   
   $('li.shot').eq(currentframe).after( '<li class="shot" id="s"> \
   <img src="./uploads/blackbackground.gif" alt="Double click here to add an image." /> \
   <div class="frame meta"> \
   <p class="read fourth title">Title</p> \
   <p class="read fourth shotduration">' + formatDuration(1000) + '</p> \
   <p class="read fourth shotid" id="' + (lastid+1) + '">' + (currentframe+1) + '</p> \
   <p class="read fourth time">Timestamp</p> \
   <p class="read description">Click here to add a shot description.</p> \
   </div> \
   </li>' );
  }
  
  $('li.shot:gt(' + currentframe + ')').each(function (i) {
   $(this).attr('id', 's' + (currentframe + i+1));
   $(this).children('div.frame.meta').children('p.shotid').text(currentframe + i+1);
  });
  // Engines
  sliderEngine();
  // Move forward After all this.
  $('#timeline').slider('value', currentframe+1);
  outputEngine();
  frameReadEngine();
  timelineMarkers();
  imageUploaderOpen();
  });
 }
 // >
  
 function outputEngine() {
  sequenceLength = $('li.shot').length-1;
  currentframe = Math.round(currentframe);
  if (navigator.onLine) {
   // NEED ANOTHER RegExp TO MOVE FRAMES!
   if (thisinto == 'title') {
    $.post('uplink.php', {
     'title' : thisvalue,
     'shotid' : selectedframe
    });
   } else if (thisinto == 'shotduration') {
    thisvalue = thisvalue.replace(/[^0-9]/g, '');
    $.post('uplink.php', {
     'shotduration' : thisvalue,
     'shotid' : selectedframe
    });
   } else if (thisinto == 'description') {
    $.post('uplink.php', {
     'description' : thisvalue,                                                                                       
     'shotid' : selectedframe
    });
   } else if (thisinto == 'addremove') {
    $.post('uplink.php', {
     'shotid' :  currentframe,
     'action' : thisaction
    });
   } else if (thisinto == 'image') {
    $.post('uplink.php', {
     'shotid' :  selectedframe,
     'image' : imagetitle
    });
   } else if (thisinto == 'deleteimage') {
    $.post('uplink.php', {
     'image' : imagetitle,
     'action' : thisinto
    });
   } else if (thisinto == 'updateallids') {
    $.post('uplink.php', {                                                                                                                                                                             
     'shotid' : newIndex,
     'originalid' : originalIndex,
     'action' : thisinto
    });
   }
  }
   if (localStorage.getItem('meta')) {
    localCache = localStorage.getItem('meta');
   } else {
    createLocal();
   }
   selectMetaData = RegExp('("shotid":"' + selectedframe + '".*?"' + thisinto + '":")(.*?)"', 'g');
   if (thisinto == 'title') {
    localCacheAlter = localCache.replace(selectMetaData, '$1' + thisvalue + '"');
   } else if (thisinto == 'shotduration') {
    thisvalue = thisvalue.replace(/[^0-9]/g, '');
    localCacheAlter = localCache.replace(selectMetaData, '$1' + thisvalue + '"');
   } else if (thisinto == 'description') {
    localCacheAlter = localCache.replace(selectMetaData, '$1' + thisvalue + '"');
   } else if (thisinto == 'addremove') {
    if (thisaction == 'removeframe') {
     selectFrameRecord = RegExp('(."ID":"[0-9]*","shotid":"' + currentframe + '",(?:"[0-9a-zA-Z]*":"[0-9a-zA-Z\ \-\:\_\.]*".){5})', 'g');
     localCacheAlter = localCache.replace(selectFrameRecord, '');
     for (i=currentframe;i<=sequenceLength;i++) {
      reindex = i-1;
      updateFrameRecords = RegExp('(."ID":"[0-9]*","shotid":")' + i + '("(?:.*?)})', 'g');
      localCacheAlter = localCacheAlter.replace(updateFrameRecords, '$1' + reindex + '$2');
     }
     cleanUp01 = RegExp('(\\[,)');
     cleanUp02 = RegExp('\}(,*?)\\]');
     localCacheAlter = localCacheAlter.replace(cleanUp01, '[');
     localCacheAlter = localCacheAlter.replace(cleanUp02, '}]');
    } else if (thisaction == 'addframe') {
     if (sequenceLength <= 0) {
      selectFrameRecord = RegExp('[\[\{]', 'g');
      replaceFrameRecord = '{"ID":"0","shotid":"' + currentframe + '","title":"Title","shotduration":"1000","datemodified":"Timestamp","image":"./uploads/blackbackground.gif","description":"Click here to add a shot description."}';
      localCacheAlter = localCache.replace(selectFrameRecord, '$1' + replaceFrameRecord);
     } else {
      selectFrameRecord = RegExp('(."ID":"[0-9]*","shotid":"' + (currentframe-1) + '",(?:"[0-9a-zA-Z]*":"[0-9a-zA-Z\ \-\:\_\.]*".){5})', 'g');
      replaceFrameRecord = ',{"ID":"0","shotid":"' + currentframe + '","title":"Title","shotduration":"1000","datemodified":"Timestamp","image":"./uploads/blackbackground.gif","description":"Click here to add a shot description."}';
      localCacheAlter = localCache;
      for (i=sequenceLength;i>=currentframe;i--) {
       reindex = i+1;
       updateFrameRecords = RegExp('(."ID":"[0-9]*","shotid":")' + i + '("(?:.*?)})', 'g');
       localCacheAlter = localCacheAlter.replace(updateFrameRecords, '$1' + reindex + '$2');
      }
      localCacheAlter = localCacheAlter.replace(selectFrameRecord, '$1' + replaceFrameRecord);
     }
    }
   } else if (thisinto == 'image') {
    localCacheAlter = localCache.replace(selectMetaData, '$1' + imagetitle + '"');
   } else if (thisinto == 'deleteimage') {
   	  it = 'ui';
   } else if (thisinto == 'updateallids') {
    localCacheAlter = localCache;
    placeholdOriginalIndex = RegExp('(."ID":"[0-9]*","shotid":")' + originalIndex + '("(?:.*?)})', 'g');
    updateOriginalIndex = RegExp('(."ID":"[0-9]*","shotid":")' + -1 + '("(?:.*?)})', 'g');
    updateNewIndex = RegExp('(."ID":"[0-9]*","shotid":")' + newIndex + '("(?:.*?)})', 'g');
    localCacheAlter = localCacheAlter.replace(placeholdOriginalIndex, '$1' + -1 + '$2');
    localCacheAlter = localCacheAlter.replace(updateNewIndex, '$1' + originalIndex + '$2');
    localCacheAlter = localCacheAlter.replace(updateOriginalIndex, '$1' + newIndex + '$2');
   }
   // console.log(localCacheAlter);
   localStorage.setItem('meta', localCacheAlter);
 }
  
 function frameReadEngine() {
  // MASSIVE SPEED IMPROVEMENT FROM CREATE DESTORY OF INPUT FIELDS
  $('p.read.fourth.shotduration').bind('click', function(){
   staticText = $(this).text();
   $(this).replaceWith('<input class="read fourth shotduration" value="' + staticText + '"/>');
   $('.read.fourth.shotduration').focus();
   
   $('p.read.fourth.shotduration').unbind();
   frameWriteEngine();
  });
  
  $('p.read.fourth.title').bind('click', function(){
   staticText = $(this).text();
   $(this).replaceWith('<input class="read fourth title" value="' + staticText + '"/>');
   $('.read.fourth.title').focus();
   
   $('p.read.fourth.title').unbind();
   frameWriteEngine();
  });
  
  $('p.read.description').bind('click', function(){
   staticText = $(this).text();
   $(this).replaceWith('<textarea class="read description">' + staticText + '</textarea>');
   $('.read.description').focus();
   
   $('p.read.description').unbind();
   frameWriteEngine();
  });
 }
  
 function frameWriteEngine() {
  $('input.read.shotduration').bind('focusout blur', function () {
   selectedframe = $(this).parent().parent().attr('id').replace('s', '');
   thisinto = $(this).attr('class').replace('read fourth ', '');
   thisvalue = $(this).val();
   currentduration = thisvalue.replace(/[^0-9]/g, '');
   $(this).replaceWith('<p class="read fourth shotduration">' + formatDuration(currentduration) + '</p>');
   outputEngine();
   
   $('input.read.shotduration').unbind();
   frameReadEngine();
  });
  
  $('input.read.title').bind('focusout blur', function () {
   selectedframe = $(this).parent().parent().attr('id').replace('s', '');
   thisvalue = $(this).val();
   thisinto = $(this).attr('class').replace('read fourth ', '');
   $(this).replaceWith('<p class="read fourth title">' + thisvalue + '</p>');
   outputEngine();
   
   $('input.read.title').unbind();
   frameReadEngine();
  });
  
  $('textarea.read').bind('focusout blur', function () {
   selectedframe = $(this).parent().parent().attr('id').replace('s', '');
   thisvalue = $(this).val();
   thisinto = $(this).attr('class').replace('read ', '');
   $(this).replaceWith('<p class="read description">' + thisvalue + '</p>');
   outputEngine();
   
   $('textarea.read').unbind();
   frameReadEngine();
  });
 }
  
 function imageUploaderOpen() {
  $('li.shot img').bind('dblclick', function(){
   selectedframe = $(this).parent().attr('id').replace('s', '');
                         
   $('#imagedialog').dialog('open');
  });           
 }
  
 function imageUploadSelect() {
  $('li.uploadedimage img').bind('click', function() {
   imagesource = $(this).attr('src');
   imagetitle = $(this).attr("alt").replace("Missing ", "");
   thisinto = 'image';
   $('#imagedialog').dialog('close');
   $('li.shot#s' + selectedframe + ' img').replaceWith('<img src=' + imagesource + ' alt="Missing ' + imagetitle + '" title="Click to change frame image" />');
   
   imageUploaderOpen();
   outputEngine();
  });
  
  $('li.uploadedimage').live('click', function(){
   modifyimage = $(this).children('p').text();
   selectedimageindex = $('li.uploadedimage').index(this);
   
   $('li.uploadedimage').removeClass('select');
   $(this).addClass('select');
  });
 }
  
 function loadLocalImages() {
  $.get('imagelink.php', function(data) {
   localStorage.setItem('imagedatabase', data);
   imagedatabase = $.parseJSON(data);
   
   $.each(imagedatabase, function(i, item) {
    $('<li class="uploadedimage"></li>').appendTo('#imageselection').html('<img src="./uploads/' + item + '" alt="Missing ' + item + '" title="Add ' + item + ' to selected frame" /> <p class="selectimage">' + item + '</p>');
   });
   imageUploadSelect();
  });
 }
  
 function deleteImage() {
  thisinto = 'deleteimage';
  // Check and replace if any frames have this image.
  outputEngine();
 }
 
 function allDurations() {
  $('p.shotduration').each(function(i, c){
   durations[i] = $(c).text().replace(/[^0-9]/g, '');
  });
 }
 
 function createLocal() {
  var enter = '';
  var formeddata = '[';
  var formedLocalData = [];
  cleanUp = RegExp('(},$)');
  for (i=0; i<=(sequenceLength-1); i++) {
   sourceentry = $('li.shot:eq(' + i + ')').html();
   createLocalData = RegExp('(?:src="(.*?)")(?:(?:.*?)title">(.*?)</p>)(?:(?:.*?)shotduration">(.*?)</p>)(?:(?:.*?)id="(.*?)")(?:(?:.*?)time">(.*?)</p>)(?:(?:.*?)description">(.*?)</p>)');
   enter = sourceentry.match(createLocalData);
   formeddata += '{"ID":"' + enter[4] + '","shotid":"' + i + '","title":"' + enter[2] + '","shotduration":"' + enter[3].replace(/[^0-9]/g, '') + '","datemodified":"' + enter[5] + '","image":"' + enter[1] + '","description":"' + enter[6] + '"},'
  }
  formeddata = formeddata.replace(cleanUp, '}]');
  localCache = formeddata;
  localStorage.setItem('meta', localCache);
 }
 
 // var userAgent = navigator.userAgent.toString().toLowerCase();
 // if ((userAgent.indexOf('safari') != -1) && !(userAgent.indexOf('chrome') != -1)) {
 //  console.log('We should be on Safari only!');
 // }
