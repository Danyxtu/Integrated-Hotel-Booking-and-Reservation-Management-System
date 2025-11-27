<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OTPPasswordReset;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class OTPPasswordResetController extends Controller
{
    /**
     * Display the form to request an OTP.
     */
    public function create()
    {
        return Inertia::render('Auth/ForgotPassword');
    }

    /**
     * Handle the request to send an OTP.
     */
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();
        
        // Generate OTP
        $otp = rand(100000, 999999);
        
        $user->otp_code = $otp;
        $user->otp_expires_at = Carbon::now()->addMinutes(10);
        $user->save();

        // Send Email
        Mail::to($user->email)->send(new OTPPasswordReset($otp));

        // Redirect to the OTP entry page, passing the email so the user doesn't have to re-enter it
        return redirect()->route('password.otp.verify', ['email' => $user->email]);
    }

    /**
     * Display the form to verify OTP and reset password.
     */
    public function createVerify(Request $request)
    {
        return Inertia::render('Auth/ResetPasswordOTP', [
            'email' => $request->query('email'),
        ]);
    }

    /**
     * Handle the password reset with OTP.
     */
    public function storeReset(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|numeric',
            'password' => 'required|confirmed|min:8',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user->otp_code != $request->otp) {
            return back()->withErrors(['otp' => 'Invalid OTP provided.']);
        }

        if (Carbon::parse($user->otp_expires_at)->isPast()) {
            return back()->withErrors(['otp' => 'OTP has expired. Please request a new one.']);
        }

        // Reset Password
        $user->forceFill([
            'password' => Hash::make($request->password),
            'otp_code' => null,
            'otp_expires_at' => null,
        ])->save();

        return redirect()->route('login')->with('status', 'Password has been reset successfully!');
    }
}