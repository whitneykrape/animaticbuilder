<?php

use App\User;
use App\Sequences;
use App\Frames;
use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Model::unguard();

        $this->call(UserTableSeeder::class);
        $this->call(SequencesTableSeeder::class);
        $this->call(FramesTableSeeder::class);

        Model::reguard();
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

class SequencesTableSeeder extends Seeder {
	public function run()
	{
		Sequences::create([
			'name' => 'Short Film',
			'description' => 'None, for the moment.',
		]);
	}
}

class FramesTableSeeder extends Seeder {
	public function run()
	{
		Frames::create([
			'user_id' => 1,
                        'sequence' => 1,
			'shotid' => '0',
			'name' => 'Shot 1?',
                        'duration' => '00:01.000',
                        'name' => 'Shot 1',
                        'image' => 'this.jpg',
                        'description' => 'this.jpg',
		]);
                
		Frames::create([
			'user_id' => 1,
                        'sequence' => 1,
			'shotid' => '1',
			'name' => 'Shot 1?',
                        'duration' => '00:01.000',
                        'name' => 'Shot 2',
                        'image' => 'this.jpg',
                        'description' => 'this.jpg',
		]);
	}
}
