<?php
// Animatic Builder v1.40
// http://www.gnu.org/licenses/gpl-3.0.txt Licensed under the GPL. Credit where credit is due. Developed by Whitney Krape
$connect = 'connect.php';

if (file_exists($connect)) {
 require $connect;
}
 
$path = 'uploads/';
function getImages($path) {
 $found = Array();
 $images = scandir($path); // Get a list of all files in the directory.
 foreach($images as $image) {
  if (preg_match('/\.(jpg|png|jpeg|gif)$/i',$image)) {
   // $file ends with the regex condition, case insensitive.
   $found[] = $image;
  }
 }
 return $found;
}

if (isset($_POST['action'])) {
 $foundimages = getImages($path);
 echo json_encode($foundimages);
 
 foreach ($foundimages as $value) {
  $sqladdimage = "INSERT INTO ab_imagerepositoryidea (image) VALUES ('$value')";
  if (!$animatic->query($sqladdimage)) {
   die('Error: ' . mysqli_error($animatic));
  }
 }
} else {
 $shotsarray = array();
 // Grab everything from the database and organize it by the user defined shotid NOT the unique ID.
 $shotsloop = $animatic->query("SELECT * FROM ab_framesidea ORDER BY shotid");
 // Echo out a jSON formatted list.
 echo '{"sequence":{"meta":';
 // The database loop.
 if ($shotsloop) {
  while ($row = $shotsloop->fetch_assoc())
  {                         
   $shotsarray[] = $row;
  }
  
  $jsonshots = json_encode($shotsarray);
  
  echo $jsonshots . "\n";
  
 // Might need a flush command.
 $shotsloop->close(); }
 
 echo "}}";
}
?>
