<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Frames extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'shotid', 'user_id', 'name', 'duration', 'image', 'description'
    ];
}
