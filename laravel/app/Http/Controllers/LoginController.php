<?php namespace App\Http\Controllers;

use App\User;
use Illuminate\Support\Str;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Input;


class LoginController extends Controller {

    public function chooseService($service) {
        $message = "Logged in via: " . $service;
        
        $action = Input::get( 'action' );
                
        // check URL segment
        if ($service == "auth") {
            // process authentication
            try {
                \Hybrid_Endpoint::process();
            }
            catch (Exception $e) {
                // redirect back to http://URL/social/
                return Redirect::route('hybridauth');
            }
            return;
        }
        try {
            // create a HybridAuth object
            $socialAuth = new \Hybrid_Auth(config_path() . '/hybridauth.php');
            // authenticate with Google
            $provider = $socialAuth->authenticate($service);
            // fetch user profile
            $userProfile = $provider->getUserProfile();
        }
        catch(Exception $e) {
            // exception codes can be found on HybBridAuth's web site
            return $e->getMessage(); 
        }
        // access user profile data
        $message .= "Connected with: <b>{$provider->id}</b><br />";
        $message .= "As: <b>{$userProfile->displayName}</b><br />";
        $message .= "<pre>" . print_r( $userProfile, true ) . "</pre><br />";
              
        $user = User::where('email', '=', $userProfile->email)->first();
        
        if (\Auth::attempt(['email' => $userProfile->email])) {
            $user = \Auth::user();
            echo $user;
        }
        
  
        
        //return \Redirect::to('/');
    }
}