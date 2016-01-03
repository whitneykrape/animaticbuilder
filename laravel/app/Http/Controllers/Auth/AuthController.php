<?php

namespace App\Http\Controllers\Auth;

use App\User;
use Validator;
use Socialite;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Foundation\Auth\AuthenticatesAndRegistersUsers;

class AuthController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Registration & Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users, as well as the
    | authentication of existing users. By default, this controller uses
    | a simple trait to add these behaviors. Why don't you explore it?
    |
    */

    use AuthenticatesAndRegistersUsers, ThrottlesLogins;

    /**
     * Create a new authentication controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest', ['except' => 'getLogout']);
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => 'required|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|confirmed|min:6',
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return User
     */
    protected function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => bcrypt($data['password']),
        ]);
    }
    
    /**
     * Redirect the user to the Google authentication page.
     *
     * @return Response
     */
    public function redirectToProvider()
    {
        return Socialite::driver('google')->redirect();
    }
    
   public function getLogout()
    {
    	Auth::logout();

	Session::flush();

        return redirect('/');
    }

    /**
     * Obtain the user information from Google.
     *
     * @return Response
     */
    public function handleProviderCallback()
    {
        $userProfile = Socialite::driver('google')->user();
        
        print_r($userProfile->email);

        $user = User::where('email', '=', $userProfile->email)->first();
        
        print_r($user);
        
        if ($user) {
            $message = 'Google Login Success!';
            \Session::flash('message', $message);

            echo $userProfile->email;
            \Auth::login($user, true);
            
            \Session::save('user', $user);

            //$provider->logout();
            //return \Redirect::to('/');
        } else {
            $message = 'Google Login Failed ' . print_r( $userProfile, true );
            \Session::flash('message', $message);

            /* $user = new User;
            $user->name = $userProfile->displayName;
            $user->email = $userProfile->email;
            //$user->status = 0;
            $user->save();
            
            \Auth::login($user); */

            //$provider->logout();
            //return \Redirect::to('/');
        }
    }
}
