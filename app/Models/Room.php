<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    /** @use HasFactory<\Database\Factories\RoomFactory> */
    use HasFactory;
    
    protected $fillable = [
        'room_number',
        'room_type_id',
        'price_per_night',
        'capacity_adults',
        'capacity_children',
        'status',
    ];

    public function roomType(){
        return $this->belongsTo(RoomType::class);
    }
}
