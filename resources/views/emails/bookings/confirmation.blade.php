<!DOCTYPE html>
<html>
<head>
    <title>Booking Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6;">
    <h2>Thank you for your reservation!</h2>
    <p>Dear {{ $booking->customer->first_name }},</p>
    
    <p>Your booking <strong>#{{ $booking->booking_number }}</strong> has been received.</p>
    
    <h3>Booking Details:</h3>
    <ul>
        <li><strong>Room:</strong> {{ $booking->room->roomType->name }}</li>
        <li><strong>Check-in:</strong> {{ $booking->check_in_date->format('M d, Y') }}</li>
        <li><strong>Check-out:</strong> {{ $booking->check_out_date->format('M d, Y') }}</li>
        <li><strong>Total Price:</strong> ₱{{ number_format($booking->total_price, 2) }}</li>
        <li><strong>Status :</strong> Paid</li>
    </ul>

    <p>We look forward to hosting you!</p>
    
    <p>Best regards,<br>LuxStay Team</p>
</body>
</html>