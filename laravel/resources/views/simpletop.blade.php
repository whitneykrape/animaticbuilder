<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<meta name="apple-mobile-web-app-capable" content="yes">

	<title>@yield('title') Animatic Buildert</title>
	
	<meta name="title" content="Animatic Builder">

    <link rel="shortcut icon" href="{{ URL::to('/') }}/favicon_(2).ico">
	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="{{ URL::to('/') }}/feframe/css/bootstrap.min.css">


	<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
	<!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
	<!--[if lt IE 9]>
		<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
		<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
	<![endif]-->
</head>
@if (!Auth::check())
<body id="admin" class="loggedout">
@else 
<body id="admin" class="loggedin">
@endif
	@yield('content')
</body>
</html>
