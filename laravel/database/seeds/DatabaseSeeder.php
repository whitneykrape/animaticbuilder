<?php

use App\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(UserTableSeeder::class);
    }
    

}

class UserTableSeeder extends Seeder {
	public function run()
	{
		User::create([
			'name' => 'Form Krape',
			'email' => 'formfunctionio@gmail.com',
			'password' => bcrypt('McZWcemu4viz3N'),
		]);
	}
}
