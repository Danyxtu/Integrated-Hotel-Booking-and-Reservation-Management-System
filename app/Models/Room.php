<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'room_number',
        'status',
        'room_type_id',
        'hotel_id' 
    ];

    public function hotel()
    {
        return $this->belongsTo(Hotel::class);
    }

    // Room belongs to a room type
    public function room_type()
    {
        return $this->belongsTo(RoomType::class);
    }
}
