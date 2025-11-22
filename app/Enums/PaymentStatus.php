<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static Pending()
 * @method static static Completed()
 * @method static static Cancelled()
 * @method static static Refunded()
 */
final class PaymentStatus extends Enum
{
    const Pending   = 'Pending';
    const Completed = 'Completed';
    const Cancelled = 'Cancelled';
    const Refunded  = 'Refunded';

    public static function getDescription($value): string
    {
        return match($value){
            self::Pending => 'Pending',
            self::Completed => 'Completed',
            self::Cancelled => 'Cancelled',
            self::Refunded => 'Refunded',
            default => parent::getDescription($value),
        };
    }
}
