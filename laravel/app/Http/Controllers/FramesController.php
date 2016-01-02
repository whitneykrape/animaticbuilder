<?php namespace App\Http\Controllers;

use App\Frames;

class FramesController extends Controller {

    public function __construct(Frames $frames)
    {
        $this->frames = $frames;
    }

    public function index()
    {
        $user = \Auth::user();
        
        dd($user);
        
        if (\Auth::check()) {
            $frames = \DB::table('frames')->where('user_id', '=', $user->id)->get();

            return view('welcome', compact('frames', 'user')); 
        } else {
            $frames = 'Not logged in.';
            
            return view('welcome', compact('frames', 'user')); 
        }
 
    }

    public function destroy($id)
    {
        $frames->where('id', '=', $id)->delete();
    }

    public function create()
    {
    }

    public function store()
    {
    }
}
