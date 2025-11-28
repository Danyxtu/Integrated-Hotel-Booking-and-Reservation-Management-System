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
        
        // If using Supabase storage, construct the public URL
        $disk = Storage::disk('supabase');
        $baseUrl = config('filesystems.disks.supabase.url');
        
        if ($baseUrl) {
            // Ensure the path doesn't have a leading slash for proper URL construction
            $path = ltrim($this->image_path, '/');
            return rtrim($baseUrl, '/') . '/' . $path;
        }
        
        // Fallback to storage URL if no base URL is configured
        return $disk->url($this->image_path);
    }
}
