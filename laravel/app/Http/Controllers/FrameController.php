<?php namespace App\Http\Controllers;

use App\Frames;
use Session;

class FrameController extends Controller {

    public function __construct(Frames $frames)
    {
        $this->frames = $frames;
    }

    public function index()
    {
    }

    public function destroy($id)
    {
        $frames->where('id', '=', $id)->delete();
    }

    public function create()
    {
    }
    
    public function update($id)
    {
        $frames->where('id', '=', $id)->update();
    }

    public function store()
    {
    }
}
