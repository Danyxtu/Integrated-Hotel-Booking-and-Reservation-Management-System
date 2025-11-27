<!DOCTYPE html>
<html>
<head>
    <title>Password Reset OTP</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #2d3748; text-align: center;">Password Reset Request</h2>
        <p>Hello,</p>
        <p>We received a request to reset the password for your account. Please use the following One-Time Password (OTP) to complete the process:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; background-color: #f3f4f6; padding: 10px 20px; border-radius: 8px; color: #4a5568;">
                {{ $otp }}
            </span>
        </div>

        <p>This OTP is valid for 10 minutes.</p>
        <p>If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
        
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        
        <p style="font-size: 12px; color: #718096; text-align: center;">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </p>
    </div>
</body>
</html>
