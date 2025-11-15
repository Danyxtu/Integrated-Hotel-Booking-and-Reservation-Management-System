<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Room extends Model
{
    protected $fillable = [
        'roonm_number',
        'status',
        'room_type_id'
    ];

    public function roomType(){
        
    }
}
