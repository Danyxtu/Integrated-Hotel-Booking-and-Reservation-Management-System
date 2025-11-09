<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomType extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price_per_night',
        'capacity_adults',
        'capacity_children',
        'hotel_id',
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }
}
