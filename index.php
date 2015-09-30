<!DOCTYPE html>
<html>
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
<ul class="checks" id="inital">
<?php
$connect = 'connect.php';
$framecheck = '';
$imagecheck = '';
$currenturl = $_SERVER['HTTP_HOST'];
$currentfolder = $currenturl . dirname($_SERVER['PHP_SELF']);

if (!mysqli_connect_errno() && file_exists($connect)) {
 require $connect;
 $connect = 'succeed';
	
 $framecheck = 'SELECT * FROM ab_framesidea LIMIT 0,1';
 $imagecheck =  'SELECT * FROM ab_imagerepositoryidea LIMIT 0,1';
 
 if (!$animatic->query($framecheck)) {
  echo '<li>Error: Sequence table does not exist. <img src="./structure/ab_loadwarning.png" alt="Warning"/></li>';
  $framecheck = 'failed';
 } else {
  $framecheck = 'succeed';
  echo '<li class="tablecheck">Frame Table Exists. <img src="./structure/ab_loaddone.png" alt="Done"/></li>';
 }
 
 if (!$animatic->query($imagecheck)) {
  echo '<li>Error: Image table does not exist. <img src="./structure/ab_loadwarning.png" alt="Warning"/></li>';
  $imagecheck = 'failed';
 } else {
  $imagecheck = 'succeed';
  echo '<li class="tablecheck">Image table exists. <img src="./structure/ab_loaddone.png" alt="Done"/></li>';
 }
 
 if ($imagecheck == 'succeed' && $imagecheck == 'succeed') {
  $cacheList = array();
  $paths = array('./uploads/', './structure/', './');
  foreach($paths as $pathe) {
   $files = scandir($pathe);
   foreach($files as $file) {
    if (preg_match('/\.(jpg|png|jpeg|gif|ico|css|js|php)$/i',$file)) {
     $cacheList[] = $pathe . $file;
    }
   }
  }
  
  $manifestFile = 'animaticbuilder.manifest';
  $writeTo = fopen($manifestFile, 'w') or die('<li>Error, could not create manifest. <img src="./structure/ab_loadwarning.png" alt="Warning"/></li>');
  $contentsCache = "CACHE MANIFEST\nCACHE:\n";
  foreach($cacheList as $toCache) {
   $contentsCache .= $toCache . "\n";
  }
  $contentsCache .= "NETWORK:\nhttp://" . $currentfolder . "/";
  fwrite($writeTo, $contentsCache);                                                                                                                          
  fclose($writeTo);
 }
} else {
 echo '<li>Config file corrupt or does not exist. <img src="./structure/ab_loadwarning.png" alt="Warning"/></li><li>Username: <input id="user" name="user"/></li><li>Password: <input id="password" name="password"/></li><li>Database: <input id="database" name="database"/></li>';
}
?>
<li id="install"></li>
<li id="data"></li>
<li id="action">Error.</li>
</ul>

<script src="./structure/jquery-1.4.2.min.js" type="text/javascript"></script>
<script type="text/javascript">
var framecheck = '<?php echo $framecheck; ?>';
var imagecheck = '<?php echo $imagecheck; ?>';
var connect = '<?php echo $connect; ?>';
var url = '<?php echo $currenturl; ?>';

if (connect === 'succeed') {
 if (localStorage.getItem('meta')) {
  $.get('downlink.php', function(data) {
   localStorage.setItem('baselinemeta', data);
  });
 }
 
 setTimeout("location.href='filmsystem.php'", [1]);
} else {
 var user = '';
 var password = '';
 var database = '';
 
 $('#action').fadeIn().html('Click here to set config. <img src="./structure/ab_loadnext.png" alt="Next"/>').bind('click', function () {
  user = $('#user').val();
  password = $('#password').val();
  database = $('#database').val();
   
  $.post('install.php', {
   'user' :  user,
   'password' : password,   
   'database' : database,
   'url' : url
  });                                            
              
  setTimeout("location.href='install.php'", [1]);
 });             
}                  
</script>
</body>
</html>

