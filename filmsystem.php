<!DOCTYPE html>
<html manifest="animaticbuilder.manifest">
<!--
Animatic Builder v1.40
http://www.gnu.org/licenses/gpl-3.0.txt Licensed under the GPL. Credit where credit is due. Developed by Whitney Krape
-->
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />  

<link rel="stylesheet" href="./structure/style.css" type="text/css" media="projection,screen,handheld" /> 

<meta name="viewport" content="width=device-width, initial-scale=0.5, maximum-scale=0.8, user-scalable=yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="robots" content="noindex, nofollow">

<title>Animatic Builder</title>
</head>
<body>
<div id="datawrapper">
 <ul class="checks" id="inital">
  <li id="cache">Allow offline data? (Click pop-up to allow.) <img src="./structure/ab_loadwarning.png" alt="Warning"/></li>
  <li id="localdata"></li>
  <li id="scan"><ul></ul></li>
  <li id="action">Error.</li>
 </ul>
</div>

<div id="filmwrapper">
 <div id="vignette"></div>
 
 <ul id="imagedialog" title="Animatic Builder - Image Selection">
  <li id="choose">Click on an image to apply it or select an image by name and choose an option.</li>
  <li class="options"><a id="uploadimage" title="Upload a New Image"></a></li>
  <li class="options"><a id="deleteimage" title="Delete Selected Image"></a></li>
  <!--<li class="options" id="deleteall">Delete all images.</li>-->
  <li class="options"><a id="scanupload" title="Re-Scan the uploads directory"></a></li>
  <li id="imageviewer">
   <ul id="imageselection">
   </ul>
   <div id="slider"></div>
  </li>
 </ul>
 
 <ul id="optionsmenu" title="Animatic Builder - Options Menu">
  <li><a id="vigette_level" class="down">Hide Background</a></li>
  <li><a id="toggle_meta" class="down">Hide Frame Data</a></li>
  <li><a id="clear_local" class="down">Clear all localStorage</a></li>
 </ul>
 
 
 <div id="horizon">
  <ul id="shotlist">
  </ul>
 </div>
 
 <ul id="playback_menu">
  <li><a id="beginning" title="Go to Beginning of Sequence"></a></li>
  <li><a id="previous" title="Previous Frame"></a></li>
  <li><a id="removeframe" title="Remove Frame"></a></li>
  <li><ul id="playpause">
   <li><a id="play" title="Play from Current Frame"></a></li>
   <li><a id="pause" title="Pause"></a></li>
  </ul></li>
  <li><a id="addframe" title="Add Frame"></a></li>
  <li><a id="next" title="Next Frame"></a></li>
  <li><a id="end" title="Go to End of Sequence"></a></li>
  <li><a id="options" title="Open Options"></a></li>
 </ul>
 
 <div id="timelineback">
  <div id="timeline">
   <ul id="timelinemarkers"></ul>
  </div>
 </div>
 
 <ul id="welcomeMenu">
  <li>Welcome to Animatic Builder.</li>
  <li>Add a frame using the menu below to begin.<br /><br />
  Or to learn more, there is a <a href="">handy tutorial here.</a></li>
 </ul>
</div>


<script src="./structure/jquery-1.4.2.min.js" type="text/javascript"></script>
<script src="./structure/jquery-ui-1.8.2.custom.min.js" type="text/javascript"></script>
<script src="./structure/ajaxupload.js" type="text/javascript"></script>
<script src="./structure/jquery.mousewheel.min.js" type="text/javascript" ></script>
<script src="./structure/primarydrive-1.40.full.js" type="text/javascript"></script>
</body>
</html>
