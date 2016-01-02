<?php

$baseurl = env('APP_URL') . '/login/auth';

//echo $baseurl;

return array(   
    'base_url'   => $baseurl,
    'providers'  => array (
        'Google'     => array (
            'enabled'    => true,
            'keys'       => array ( 
                    'id' => '784232450807-78alg0k101b6u0k42mj9b4ns228dknn8.apps.googleusercontent.com', 
                    'secret' => 'E-k8XAX65-gKR9vgMEyXzrxz'
                ),
            'scope' => "https://www.googleapis.com/auth/userinfo.email"
            )
    ),
);