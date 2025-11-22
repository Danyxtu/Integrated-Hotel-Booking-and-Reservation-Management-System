<?php

namespace App\Models;

use App\Enums\RoomStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    /** @use HasFactory<\Database\Factories\RoomFactory> */
    use HasFactory;
    
    protected $fillable = [
        'room_number',
        'room_type_id',
        'status',
    ];

    protected $casts = [
        'status' => RoomStatus::class,
    ];

    public function roomType(){
        return $this->belongsTo(RoomType::class);
    }
}
