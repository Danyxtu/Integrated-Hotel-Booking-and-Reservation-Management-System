<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoomType extends Model
{
    protected $fillable = [
        'hotel_id',
        'lookup_id',
        'name',
        'description',
        'price_per_night',
        'capacity_adults',
        'capacity_children',
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    public function roomTypeLookup()
    {
        return $this->belongsTo(RoomTypeLookup::class, 'lookup_id');
    }

    public function rooms(){
        return $this->hasMany(Room::class);
    }
}
