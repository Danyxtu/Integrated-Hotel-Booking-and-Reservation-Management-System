<?php

namespace App\Models;

use App\Models\Booking; // Import the Booking model
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\PaymentStatus;

class Payment extends Model
{
    /** @use HasFactory<\Database\Factories\PaymentFactory> */
    use HasFactory;

    protected $fillable = [
        'booking_id',
        'amount',
        'payment_date',
        'status',
        'payment_method',
    ];

    protected $casts = [
        'status' => PaymentStatus::class,
        'payment_date' => 'datetime',
    ];

    /**
     * Get the booking that owns the payment.
     */
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
