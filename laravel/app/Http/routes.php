<?php

/*
|--------------------------------------------------------------------------
| Routes File
|--------------------------------------------------------------------------
|
| Here is where you will register all of the routes in an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::resource('/', 'FramesController');
Route::get('/list', 'FramesController@listFrames');
Route::resource('/frame/{id}', 'FrameController');
Route::resource('/image/{id}', 'ImagesController');


/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| This route group applies the "web" middleware group to every route
| it contains. The "web" middleware group is defined in your HTTP
| kernel and includes session state, CSRF protection, and more.
|
 *
 */

    Route::get('auth/logout', 'Auth\AuthController@logout');
    Route::get('auth/google', 'Auth\AuthController@redirectToProvider');
    Route::get('auth/google/callback', 'Auth\AuthController@handleProviderCallback');
