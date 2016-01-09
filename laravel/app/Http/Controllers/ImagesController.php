<?php namespace App\Http\Controllers;

use App\Images;
use Session;

class ImagesController extends Controller {

    public function __construct(Images $images)
    {
        $this->images = $images;
    }

    public function index()
    {
    	
    }

    public function destroy($id)
    {
        $images->where('id', '=', $id)->delete();
    }

    public function create()
    {
    }
    
    public function update($id)
    {
        $images->where('id', '=', $id)->update();
    }

    public function store()
    {
    }
}
