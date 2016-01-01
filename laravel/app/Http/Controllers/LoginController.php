<?php namespace App\Http\Controllers;

use App\User;
use Illuminate\Support\Str;
use Illuminate\Database\Query\Builder;

class LoginController extends Controller {

    public function chooseService($service) {
        $message = "Logged in via: " . $service;
        
        $action = \Input::get( 'action' );
        
        echo $action;
        
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
        /* $message .= "Connected with: <b>{$provider->id}</b><br />";
        $message .= "As: <b>{$userProfile->displayName}</b><br />";
        $message .= "<pre>" . print_r( $userProfile, true ) . "</pre><br />"; */
                
        $user = User::where('email', '=', $userProfile->email)->first();
        
        if ($user) {
            //$message = 'Google Login Success!';
            \Session::flash('message', $message);

            echo $userProfile->email;
            \Auth::login($user);

            $provider->logout();
            return \Redirect::to('/');
        } else {
            $message = 'Google Login Failed ' . print_r( $userProfile, true );
            \Session::flash('message', $message);

            /* $user = new User;
            $user->name = $userProfile->displayName;
            $user->email = $userProfile->email;
            //$user->status = 0;
            $user->save();
            
            \Auth::login($user); */

            $provider->logout();
            return \Redirect::to('/');
        }
        
        //return \View::make('login.index')->with('login', $message);
    }
}