<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RoomTypeLookup extends Model
{

    use HasFactory;
    protected $fillable = [
        'name',
        'default_price',
        'default_description',
        'default_capacity_adults',
        'default_capacity_children',
    ];

    public function roomType()
    {
        return $this->hasMany(RoomType::class, 'lookup_id');
    }

}
