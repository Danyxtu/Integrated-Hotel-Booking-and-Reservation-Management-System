<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'room_id',
        'check_in_date',
        'check_out_date',
        'total_price',
        'status',
        'payment_id',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
