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
        'image_path',
        'rating',
    ];

    protected $appends = ['image_url'];

    public function rooms()
    {
        return $this->hasMany(Room::class);
    }

    public function getImageUrlAttribute()
    {
        if (!$this->image_path) {
            return null;
        }

        // Use the s3 disk to get the URL
        return Storage::disk('public')->url($this->image_path);
    }
}
