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

        // 1. Get Supabase config values
        $baseUrl = config('filesystems.disks.supabase.url');
        $bucket = config('filesystems.disks.supabase.bucket');

        // 2. Manually construct the URL (Most Reliable for Supabase)
        if ($baseUrl && $bucket) {
            $path = ltrim($this->image_path, '/');

            // Clean up: If the path accidentally starts with the bucket name, remove it to avoid duplication
            if (str_starts_with($path, $bucket . '/')) {
                $path = substr($path, strlen($bucket) + 1);
            }

            // Format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
            return rtrim($baseUrl, '/') . '/' . $bucket . '/' . $path;
        }

        // 3. Last Resort Fallback (If config is missing)
        // We return the raw path instead of calling $disk->url() to prevent the "undefined method" error
        return $this->image_path;
    }
}
