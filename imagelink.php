<?php
// Animatic Builder v1.40 I'm adding more of a comment here to test my git connection. Fun stuff.
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

$foundimages = getImages($path);
echo json_encode($foundimages);

foreach ($foundimages as $value) {
 $sqladdimage = "INSERT INTO ab_imagerepositoryideas (image) VALUES ('$value')";
 $animatic->query($sqladdimage);
}
?>
