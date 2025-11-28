<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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
        'image_data', // Changed from image_path
        'rating',
    ];

    // Removed protected $appends = ['image_url'];

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function getImageUrlAttribute()
    {
        // Return base64 encoded image data directly
        return $this->image_data ? 'data:image/jpeg;base64,' . base64_encode($this->image_data) : null;
    }
}
