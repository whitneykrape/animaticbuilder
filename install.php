<?php 
// Animatic Builder v1.40
// http://www.gnu.org/licenses/gpl-3.0.txt Licensed under the GPL. Credit where credit is due. Developed by Whitney Krape
$framecheck = '';
$imagecheck = '';
$connect = 'connect.php';
$currenturl = $_SERVER['HTTP_HOST'];

 if(isset($_POST['user'])) { $user = htmlentities($_POST['user']); }
 else { $user = 'root'; }
 if(isset($_POST['password'])) { $password = htmlentities($_POST['password']); }
 if(isset($_POST['database'])) { $database = htmlentities($_POST['database']); }
 
 if (isset($user) && isset($database) && !isset($animatic)) {
  $configFile = 'connect.php';
  $writeTo = fopen($configFile, 'w') or die('<li>Error, could not create config file.</li>');
  $contentsConfig = "
   <?php
   // Animatic Builder v1.40
   // http://www.gnu.org/licenses/gpl-3.0.txt Licensed under the GPL. Credit where credit is due. Developed by Whitney Krape";
  $contentsConfig .= "
   \$user = '$user';
   \$password = '$password';
   \$database = '$database';
   \$url = '$currenturl';";
  $contentsConfig .= "
  if (!\$animatic = new mysqli(\$url,\$user,\$password,\$database))
	{
	 die('<li>Error: Whoops, could not connect to database.</li>');
	 echo '<li>Browser offline.</li>';
	}
	?>";
  fwrite($writeTo, $contentsConfig);        
  fclose($writeTo);
 } else {
?>
<!DOCTYPE html>
<html>
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
if (file_exists($connect)) {
 require $connect;
 $connect = 'succeed';

// Create table in my_db database
$buildshots = 'CREATE TABLE ab_framesidea
(
 ID int NOT NULL AUTO_INCREMENT,
 PRIMARY KEY(ID),
 shotid int NOT NULL DEFAULT "0",
 title varchar(20) DEFAULT "Title",
 shotduration bigint (7) NOT NULL DEFAULT "1000",
 datemodified varchar(23),
 image varchar(50) DEFAULT "blackbackground.gif",
 description varchar(255) DEFAULT "Click here to add a shot description."
)';

$buildimages = 'CREATE TABLE ab_imagerepositoryidea
(
 ID int NOT NULL AUTO_INCREMENT,
 PRIMARY KEY(ID),
 image varchar(31) UNIQUE
)';

if (!$animatic->query($buildshots)) {
 echo '<li>Could not create: Sequence table. <img src="./structure/ab_loadwarning.png" alt="Warning"/></li>';
 $framecheck = 'failed ' . mysqli_error($animatic);
} else {
 echo '<li>Shots Table Created. <img src="./structure/ab_loaddone.png" alt="Done"/></li>';
 $framecheck = 'succeed';
};

if (!$animatic->query($buildimages)) {
 echo '<li>Could not create: Images table. <img src="./structure/ab_loadwarning.png" alt="Warning"/></li>';
 $imagecheck = 'failed ' . mysqli_error($animatic);
} else {
 echo '<li>Images Table Created. <img src="./structure/ab_loaddone.png" alt="Done"/></li>';
 $imagecheck = 'succeed';
};

$animatic->close();
} else {
 echo '<li>Config file corrupt or does not exist. <img src="./structure/ab_loadwarning.png" alt="Warning"/></li><li>Username: <input id="user" name="user"/></li><li>Password: <input id="password" name="password"/></li><li>Database: <input id="database" name="database"/></li>';
}
?>
<li id="action">Error.</li>
</ul>

<script src="./structure/jquery-1.4.2.min.js" type="text/javascript"></script>
<script type="text/javascript">
var framecheck = "<?php echo $framecheck; ?>";
var imagecheck = "<?php echo $imagecheck; ?>";
var connect = '<?php echo $connect; ?>';
var user = '';
var password = '';
var database = '';
detectexists = RegExp('exists', 'g');
detectfailed = RegExp('failed', 'g');

frameexists = framecheck.match(detectexists);
imageexists = imagecheck.match(detectexists);
framefailed = framecheck.match(detectfailed);
imagefailed = imagecheck.match(detectfailed);

if (connect != 'succeed') {
 $('#action').fadeIn().html('Click here to set config. <img src="./structure/ab_loadnext.png" alt="Next"/>').bind('click', function () {
  user = $('#user').val();
  password = $('#password').val();
  database = $('#database').val();
   
  $.post('install.php', {
   'user' :  user,
   'password' : password,   
   'database' : database,
  });         
  
  setTimeout("location.href='install.php'", [1]);
 });
} else if (frameexists && imageexists) {
 $('#action').fadeIn().html('Tables exist, click to continue. <img src="./structure/ab_loadnext.png" alt="Next"/>').bind('click', function () {
  setTimeout("location.href='filmsystem.php'", [1]);
 });
} else if (framefailed && imagefailed) {
 $('#action').fadeIn().html('Click here to set config. <img src="./structure/ab_loadnext.png" alt="Next"/>').bind('click', function () {
  user = $('#user').val();
  password = $('#password').val();
  database = $('#database').val();
   
  $.post('install.php', {
   'user' :  user,
   'password' : password,   
   'database' : database,
  });
  
  setTimeout("location.href='install.php'", [1]);
 });
} else {
 $('#action').fadeIn().html('Ready, click to continue. <img src="./structure/ab_loadnext.png" alt="Next"/>').bind('click', function () {
  setTimeout("location.href='filmsystem.php'", [1]);
 });
}
</script>
</body>
</html>
<?php } ?>
