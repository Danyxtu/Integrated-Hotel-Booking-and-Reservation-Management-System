<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RoomType extends Model
{
    /** @use HasFactory<\Database\Factories\RoomTypeFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'capacity_adults',
        'capacity_children',
        'amenities',
        'image_path',
        'rating',
    ];

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }
}
