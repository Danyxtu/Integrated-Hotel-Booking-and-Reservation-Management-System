<?php

namespace App\Enums;

enum RoomStatus: string
{
    case Available = 'Available';
    case Occupied = 'Occupied';
    case Cleaning = 'Cleaning';
    case Maintenance = 'Maintenance';
}
