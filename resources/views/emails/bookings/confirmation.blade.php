<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Booking Confirmation</title>
</head>
@php
    $payment = $booking->payment;
    $checkIn  = $booking->check_in_date->format('M d, Y');
    $checkOut = $booking->check_out_date->format('M d, Y');
    $nights   = max($booking->check_out_date->diffInDays($booking->check_in_date), 1);
    $baseUrl  = config('app.url', url('/'));
    $hotelName = config('app.name', 'LuxStay');
    $hotelAddress = config('mail.from.address', '123 Ocean Drive, Paradise City');
@endphp
<body style="margin:0; padding:0; font-family:'Helvetica Neue', Arial, sans-serif; background-color:#f4f6fb;">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding:30px 15px;">
                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; border-radius:18px; overflow:hidden; box-shadow:0 20px 60px rgba(31,41,55,0.12);">
                    <tr>
                        <td style="background:linear-gradient(135deg,#2563eb,#7c3aed); padding:35px 30px; color:#ffffff; text-align:center;">
                            <h1 style="margin:0; font-size:28px; letter-spacing:0.5px;">LuxStay Reservation Confirmed</h1>
                            <p style="margin:12px 0 0; font-size:16px; opacity:0.9;">Booking Reference: <strong>#{{ $booking->booking_number }}</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px 30px 10px;">
                            <p style="font-size:18px; color:#111827; margin:0 0 16px;">
                                Hi {{ $booking->customer->first_name }},
                            </p>
                            <p style="font-size:16px; color:#4b5563; margin:0 0 24px; line-height:1.7;">
                                Thank you for choosing LuxStay. We're thrilled to welcome you! Below are the details of your upcoming stay. Please review them carefully and reach out if anything needs to be updated.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 30px 30px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                <tr>
                                    <td style="background-color:#f8fafc; border-radius:14px; padding:24px;">
                                        <h3 style="margin:0 0 18px; color:#111827; font-size:20px;">Stay Overview</h3>
                                        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:16px; color:#374151;">
                                            <tr>
                                                <td style="padding:6px 0; width:45%; color:#6b7280;">Room Type</td>
                                                <td style="padding:6px 0;"><strong>{{ $booking->room->roomType->name }}</strong></td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0; color:#6b7280;">Check-in</td>
                                                <td style="padding:6px 0;"><strong>{{ $checkIn }} (from 2:00 PM)</strong></td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0; color:#6b7280;">Check-out</td>
                                                <td style="padding:6px 0;"><strong>{{ $checkOut }} (until 12:00 PM)</strong></td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0; color:#6b7280;">Nights</td>
                                                <td style="padding:6px 0;"><strong>{{ $nights }}</strong></td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0; color:#6b7280;">Guests</td>
                                                <td style="padding:6px 0;">
                                                    <strong>{{ $booking->customer->first_name }} {{ $booking->customer->last_name }}</strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0; color:#6b7280;">Total Amount</td>
                                                <td style="padding:6px 0;"><strong style="font-size:20px;">₱{{ number_format($booking->total_price, 2) }}</strong></td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 30px 30px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                <tr>
                                    <td style="width:50%; padding-right:12px;">
                                        <div style="border:1px solid #e5e7eb; border-radius:14px; padding:20px;">
                                            <p style="margin:0 0 8px; font-size:14px; letter-spacing:1px; color:#9ca3af; text-transform:uppercase;">Booking Status</p>
                                            <p style="margin:0; font-size:22px; font-weight:600; color:#111827;">{{ $booking->status }}</p>
                                        </div>
                                    </td>
                                    <td style="width:50%; padding-left:12px;">
                                        <div style="border:1px solid #e5e7eb; border-radius:14px; padding:20px;">
                                            <p style="margin:0 0 8px; font-size:14px; letter-spacing:1px; color:#9ca3af; text-transform:uppercase;">Payment</p>
                                            <p style="margin:0; font-size:16px; color:#374151;">
                                                Method: <strong>{{ optional($payment)->payment_method ?? 'Pay on Arrival' }}</strong><br/>
                                                Status: <strong>{{ optional($payment)->status ?? 'Pending' }}</strong>
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    @if(optional($payment)->status === 'Pending')
                        <tr>
                            <td style="padding:0 30px 30px;">
                                <div style="background-color:#fffbeb; border:1px solid #f59e0b33; border-radius:14px; padding:20px;">
                                    <h4 style="margin:0 0 12px; color:#92400e; font-size:18px;">Next Steps</h4>
                                    <p style="margin:0; color:#92400e; font-size:16px; line-height:1.7;">
                                        Your reservation is locked in. Please complete the payment upon arrival or follow the instructions sent separately by our team. If you have already paid, kindly disregard this reminder.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    @endif
                    <tr>
                        <td style="padding:0 30px 30px;">
                            <div style="border:1px solid #e5e7eb; border-radius:14px; padding:22px;">
                                <h4 style="margin:0 0 10px; color:#111827; font-size:18px;">Need anything else?</h4>
                                <p style="margin:0 0 18px; color:#4b5563; font-size:16px; line-height:1.7;">
                                    Our concierge team is available 24/7. Simply reply to this email or reach us using the button below.
                                </p>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 30px 40px; text-align:center; border-top:1px solid #f3f4f6;">
                            <p style="margin:20px 0 6px; font-size:16px; color:#6b7280;">We look forward to welcoming you to LuxStay.</p>
                            <p style="margin:0; font-size:14px; color:#9ca3af;">{{ $hotelName }} • {{ $hotelAddress }}</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>