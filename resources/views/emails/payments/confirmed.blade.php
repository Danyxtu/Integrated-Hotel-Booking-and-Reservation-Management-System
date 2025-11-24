<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Payment Confirmed</title>
</head>
@php
    $booking = $payment->booking;
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
                        <td style="background:linear-gradient(135deg,#059669,#047857); padding:35px 30px; color:#ffffff; text-align:center;">
                            <h1 style="margin:0; font-size:28px; letter-spacing:0.5px;">Payment Confirmed</h1>
                            <p style="margin:12px 0 0; font-size:16px; opacity:0.9;">Booking Reference: <strong>#{{ $booking->booking_number }}</strong></p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px 30px 10px;">
                            <p style="font-size:18px; color:#111827; margin:0 0 16px;">
                                Hi {{ $booking->customer->first_name }},
                            </p>
                            <p style="font-size:16px; color:#4b5563; margin:0 0 24px; line-height:1.7;">
                                Great news! Your payment for booking #{{ $booking->booking_number }} has been confirmed by our administration team. Your reservation is now fully confirmed and secured.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 30px 30px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                                <tr>
                                    <td style="background-color:#f8fafc; border-radius:14px; padding:24px;">
                                        <h3 style="margin:0 0 18px; color:#111827; font-size:20px;">Payment Details</h3>
                                        <table width="100%" cellpadding="0" cellspacing="0" style="font-size:16px; color:#374151;">
                                            <tr>
                                                <td style="padding:6px 0; width:45%; color:#6b7280;">Payment ID</td>
                                                <td style="padding:6px 0;"><strong>#{{ $payment->id }}</strong></td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0; color:#6b7280;">Amount Paid</td>
                                                <td style="padding:6px 0;"><strong style="font-size:20px; color:#059669;">₱{{ number_format($payment->amount, 2) }}</strong></td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0; color:#6b7280;">Payment Method</td>
                                                <td style="padding:6px 0;"><strong>{{ $payment->payment_method ?? 'N/A' }}</strong></td>
                                            </tr>
                                            <tr>
                                                <td style="padding:6px 0; color:#6b7280;">Status</td>
                                                <td style="padding:6px 0;"><strong style="color:#059669;">Confirmed</strong></td>
                                            </tr>
                                            @if($payment->payment_date)
                                            <tr>
                                                <td style="padding:6px 0; color:#6b7280;">Payment Date</td>
                                                <td style="padding:6px 0;"><strong>{{ $payment->payment_date->format('M d, Y h:i A') }}</strong></td>
                                            </tr>
                                            @endif
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
                                    <td style="background-color:#f8fafc; border-radius:14px; padding:24px;">
                                        <h3 style="margin:0 0 18px; color:#111827; font-size:20px;">Booking Details</h3>
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
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:0 30px 30px;">
                            <div style="background-color:#ecfdf5; border:1px solid #10b98133; border-radius:14px; padding:20px;">
                                <h4 style="margin:0 0 12px; color:#047857; font-size:18px;">What's Next?</h4>
                                <p style="margin:0; color:#047857; font-size:16px; line-height:1.7;">
                                    Your booking is now fully confirmed! We look forward to welcoming you. If you have any special requests or need to make changes to your reservation, please contact us at least 24 hours before your check-in date.
                                </p>
                            </div>
                        </td>
                    </tr>
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

