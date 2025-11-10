<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Hotel extends Model
{

    /**
     * The attributes that are mass assignable.
     */
    use HasFactory;
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
