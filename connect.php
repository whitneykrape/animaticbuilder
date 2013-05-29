
   <?php
   // Animatic Builder v1.40
   // http://www.gnu.org/licenses/gpl-3.0.txt Licensed under the GPL. Credit where credit is due. Developed by Whitney Krape
   $user = 'root';
   $password = 'root';
   $database = 'animaticbuilder';
   $url = 'localhost';
  if (!$animatic = new mysqli($url,$user,$password,$database))
	{
	 die('<li>Error: Whoops, could not connect to database.</li>');
	 echo '<li>Browser offline.</li>';
	}
	?>