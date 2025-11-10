<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'amount',
        'provider',
        'provider_id',
        'status',
        'booking_id',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
