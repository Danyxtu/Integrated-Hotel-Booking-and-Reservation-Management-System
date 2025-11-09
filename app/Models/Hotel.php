<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hotel extends Model
{
    protected $fillable = [
        'name',
        'description',
        'address',
        'city',
        'country',
        'cover_image_url',
    ];

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

}
