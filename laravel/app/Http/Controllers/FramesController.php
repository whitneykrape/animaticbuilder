<?php namespace App\Http\Controllers;

use App\Frames;
use App\SessionStore;
use Illuminate\Support\Str;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Session;

class FramesController extends Controller {

    public function __construct(Frames $frames)
    {
        $this->frames = $frames;	
    }

    public function index()
    {
        $user = \Auth::user();
        
        if ($user) {
            $frames = \DB::table('frames')->where('user_id', '=', $user->id)->get();

            return view('welcome', compact('frames')); 
        } else {
            $frames = 'Not logged in.';
            
            return view('welcome', compact('frames')); 
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
