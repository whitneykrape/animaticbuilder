<?php namespace App\Http\Controllers;

use App\Frames;
use Session;

class FramesController extends Controller {

    public function __construct(Frames $frames)
    {
        $this->frames = $frames;
    }

    public function index()
    {
        $user = \Auth::user();
        
        if (\Auth::check()) {
            $frames = \DB::table('frames')->where('user_id', '=', $user->id)->get();

            return view('welcome', compact('frames')); 
        } else {
            $frames = 'Not logged in.';
            
            return view('welcome', compact('frames')); 
        }
 
    }

    public function destroy($id)
    {
    }

    public function create()
    {
        $all = \Input::all();
    }

    public function update($id)
    {
        $images->where('id', '=', $id)->update();
    }
    
    public function listFrames()
    {
        $user = \Auth::user();

        $frames = \DB::table('frames')->where('user_id', '=', $user->id)->get();
        
        return $frames;
    }

    public function store()
    {
    }
}
