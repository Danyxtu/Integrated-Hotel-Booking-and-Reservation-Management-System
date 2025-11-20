<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static Pending()
 * @method static static Confirmed()
 * @method static static Cancelled()
 * @method static static CheckedIn()
 * @method static static CheckedOut()
 * @method static static NoShow()
 * @method static static Expired()
 */
final class BookingStatus extends Enum
{
    const Pending     = 0;
    const Confirmed   = 1;
    const Cancelled   = 2;
    const CheckedIn   = 3;
    const CheckedOut  = 4;
    const NoShow      = 5;
    const Expired     = 6;

    public static function getDescription($value): string
    {
        return match ($value) {
            self::Pending     => 'Pending',
            self::Confirmed   => 'Confirmed',
            self::Cancelled   => 'Cancelled',
            self::CheckedIn   => 'Checked In',
            self::CheckedOut  => 'Checked Out',
            self::NoShow      => 'No Show',
            self::Expired     => 'Expired',
            default => parent::getDescription($value),
        };
    }
}
