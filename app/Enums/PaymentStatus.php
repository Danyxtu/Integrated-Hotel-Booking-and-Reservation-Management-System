<?php declare(strict_types=1);

namespace App\Enums;

use BenSampo\Enum\Enum;

/**
 * @method static static OptionOne()
 * @method static static OptionTwo()
 * @method static static OptionThree()
 */
final class PaymentStatus extends Enum
{
    const Pending   = 0;
    const Completed = 1;
    const Cancelled = 2;

    public static function getDescription($value): string
    {
        return match($value){
            self::Pending => 'Pending',
            self::Completed => 'Completed',
            self::Cancelled => 'Cancelled',
            default => parent::getDescription($value),
        };
    }
}
