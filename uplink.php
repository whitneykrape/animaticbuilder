<?php
// Animatic Builder v1.40
// http://www.gnu.org/licenses/gpl-3.0.txt Licensed under the GPL. Credit where credit is due. Developed by Whitney Krape
$connect = 'connect.php';

if (file_exists($connect)) {
 require $connect;
}

 // Binds the time, for when a shot is added and updated.
 date_default_timezone_set('America/New_York');
 $currenttime = date('j m Y - H:i');
 $uploaddir = './uploads/';
 
 // Check what information we are getting.
 if(isset($_POST['shotid'])) { $shotid = htmlentities($animatic->real_escape_string($_POST['shotid'])); }
 if(isset($_POST['originalid'])) { $originalid = htmlentities($animatic->real_escape_string($_POST['originalid'])); }
 if(isset($_POST['action'])) { $action = htmlentities($animatic->real_escape_string($_POST['action'])); }
 if(isset($_POST['title'])) { $title = htmlentities($animatic->real_escape_string($_POST['title'])); }
 if(isset($_POST['shotduration'])) { $shotduration = htmlentities($animatic->real_escape_string($_POST['shotduration'])); }
 if(isset($_POST['description'])) { $description = htmlentities($animatic->real_escape_string($_POST['description'])); }
 if(isset($_POST['image'])) { $image = htmlentities($animatic->real_escape_string($_POST['image'])); }
 // Grabs the noteid, only for deleting the note.
 // if(isset($_POST['noteid'])) { $noteid = htmlentities($animatic->real_escape_string($_POST['noteid'])); }
 // Grabs the note from the textarea. Only needed when adding or updating a note.
 // if(isset($_POST['note'])) { $note = htmlentities($animatic->real_escape_string($_POST['note'])); }
 if(isset($_POST['action'])) { $action = htmlentities($animatic->real_escape_string($_POST['action'])); }
 else { $action = "disabled"; }
 if(isset($_POST['image'])) { $imageinsert = htmlentities($animatic->real_escape_string($_POST['image'])); }
 if(isset($_FILES['uploadfile']['name'])) { 
  $imageupload = $uploaddir . basename($_FILES['uploadfile']['name']);
  $imagename = basename($_FILES['uploadfile']['name']); 
 }

// Shot Entry. Checks if a post has the added name then builds a query and executes.
// This needs to check the current shotid and keep it inline. It does.
if (($action === 'addframesync') && isset($shotid) && isset($title) && isset($shotduration) && isset($description) && isset($image)) {
 $squpdateshots = "UPDATE ab_framesidea SET shotid=shotid+1 WHERE shotid >= $shotid";
 $sqladdshots = "INSERT INTO ab_framesidea (shotid, title, shotduration, description, image, datemodified) VALUES ('$shotid','$title','$shotduration','$description','$image','$currenttime')";
 if (!$animatic->query($squpdateshots)) {
  die('Error: ' . mysqli_error($animatic));
 }
 if (!$animatic->query($sqladdshots)) {
  die('Error: ' . mysqli_error($animatic));
 }
} else if (($action === 'addframe') && isset($shotid)) {
 $squpdateshots = "UPDATE ab_framesidea SET shotid=shotid+1 WHERE shotid >= $shotid";
 $sqladdshots = "INSERT INTO ab_framesidea (shotid, datemodified) VALUES ('$shotid','$currenttime')";
 if (!$animatic->query($squpdateshots)) {
  die('Error: ' . mysqli_error($animatic));
 }
 if (!$animatic->query($sqladdshots)) {
  die('Error: ' . mysqli_error($animatic));
 }
}

// Update the respective shotids due to drag and drop
if (isset($originalid) && isset($shotid) && ($action === 'updateallids')) {
 if ($shotid > $originalid) {
  $placehold = "UPDATE ab_framesidea SET shotid=-1 WHERE shotid = $originalid";
  if (!$animatic->query($placehold)) {
   die('Error: ' . mysqli_error($animatic));
  }
  $squpdateshots = "UPDATE ab_framesidea SET shotid=shotid-1 WHERE shotid <= $shotid AND shotid > $originalid";
  if (!$animatic->query($squpdateshots)) {
   die('Error: ' . mysqli_error($animatic));
  }
  $reindex = "UPDATE ab_framesidea SET shotid=$shotid WHERE shotid = -1";
  if (!$animatic->query($reindex)) {
   die('Error: ' . mysqli_error($animatic));
  }
 } else if ($shotid < $originalid) {
  $placehold = "UPDATE ab_framesidea SET shotid=-1 WHERE shotid = $originalid";
  if (!$animatic->query($placehold)) {
   die('Error: ' . mysqli_error($animatic));
  }
  $squpdateshots = "UPDATE ab_framesidea SET shotid=shotid+1 WHERE shotid >= $shotid AND shotid < $originalid";
  if (!$animatic->query($squpdateshots)) {
   die('Error: ' . mysqli_error($animatic));
  }
  $reindex = "UPDATE ab_framesidea SET shotid=$shotid WHERE shotid = -1";
  if (!$animatic->query($reindex)) {
   die('Error: ' . mysqli_error($animatic));
  }
 }
}

// Shot Updating. Checks if a post has the added name then builds a query and executes.
// This needs to check the current shotid and keep it inline.
if(isset($title) || isset($shotduration) || isset($description) || (isset($title) && isset($shotduration) && isset($description) && isset($image))) {
 if(isset($title)) {
  $sqlupdate = "UPDATE ab_framesidea SET title='$title', datemodified='$currenttime' WHERE shotid='$shotid'";
 } else if (isset($shotduration)) { 
  $sqlupdate = "UPDATE ab_framesidea SET shotduration='$shotduration', datemodified='$currenttime' WHERE shotid='$shotid'";
 } else if (isset($description)) { 
  $sqlupdate = "UPDATE ab_framesidea SET datemodified='$currenttime', description='$description' WHERE shotid='$shotid'";
 } else if (isset($title) && isset($shotduration) && isset($description) && isset($image)) { 
  $sqlupdate = "UPDATE ab_framesidea SET title='$title', shotduration='$shotduration', description='$description', datemodified='$currenttime', image='$image'  WHERE shotid='$shotid'";
 }
 if (!$animatic->query($sqlupdate)) {
  die('Error: ' . mysqli_error($animatic));
 }
}

// Shot Deleting. Checks if a post has the added name then builds a series of queries and executes.
// This needs to check the current shotid and keep it inline.
if (isset($shotid) && ($action === 'removeframe')) {
 $sqldeleteshot = "DELETE FROM ab_framesidea WHERE shotID = $shotid";
 // $sqldeletenotes = "DELETE FROM ab_animaticnotes WHERE shotID = $shotid";
 $squpdateshots = "UPDATE ab_framesidea SET shotid=shotid-1 WHERE shotid >= $shotid";
 // $sqlupdatenotes = "UPDATE ab_animaticnotes SET shotid=shotid-1 WHERE shotid >= $shotid";
 if (!$animatic->query($sqldeleteshot)) {
  die('Error: ' . mysqli_error($animatic));
 }
 // if (!$animatic->query($sqldeletenotes)) {
 //  die('Error: ' . mysqli_error($animatic));
 // }
 if (!$animatic->query($squpdateshots)) {
  die('Error: ' . mysqli_error($animatic));
 }
 // if (!$animatic->query($sqlupdatenotes)) {
 //  die('Error: ' . mysqli_error($animatic));
 // }
} else if (isset($shotid) && ($action === 'removeframesync')) {
 $sqldeleteshot = "DELETE FROM ab_framesidea WHERE shotID = $shotid";
 if (!$animatic->query($sqldeleteshot)) {
  die('Error: ' . mysqli_error($animatic));
 }
 if (!$animatic->query($squpdateshots)) {
  die('Error: ' . mysqli_error($animatic));
 }
}

if (isset($shotid) && isset($imageinsert)) {
 $sqlinsertimage = "UPDATE ab_framesidea SET image='$imageinsert' WHERE shotid='$shotid'";
 if (!$animatic->query($sqlinsertimage)) {
  die('Error: ' . mysqli_error($animatic));
 }
}

if (isset($imageupload)) {
 $sqladdimage = "INSERT INTO ab_imagerepositoryidea (image) VALUES ('$imagename')";
 if (!$animatic->query($sqladdimage)) {
  die('Error: ' . mysqli_error($animatic));
 }
 if (move_uploaded_file($_FILES['uploadfile']['tmp_name'], $imageupload)) {  
   echo "success";  
 } else {  
     echo "error"; 
 }
}

if ($action === 'deleteimage') {
 $sqldeleteimage = "DELETE FROM ab_imagerepositoryidea WHERE image='$imageinsert'";
 if (!$animatic->query($sqldeleteimage)) {
  die('Error: ' . mysqli_error($animatic));
 }
  $deleteimage = unlink($uploaddir . $imageinsert);
  if($deleteimage == "1"){
      echo "The file was deleted successfully.";
  } else { 
   echo "There was an error trying to delete the file."; }
}

// The connection is open, close it.
if(isset($animatic)) { $animatic->close(); }
?>
