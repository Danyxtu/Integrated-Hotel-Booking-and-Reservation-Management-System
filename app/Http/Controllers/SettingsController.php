<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Setting; // Import the Setting model

class SettingsController extends Controller
{
    public function showGeneralSettings()
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        // Default values for settings if not found in DB
        $defaultSettings = [
            'hotel_name'            => 'LuxStay Hotel',
            'hotel_address'         => '123 Main St, Anytown USA',
            'contact_email'         => 'info@luxstay.com',
            'contact_phone'         => '+1 (555) 123-4567',
            'website_url'           => 'https://www.luxstay.com',
            'default_check_in_time' => '15:00',
            'default_check_out_time' => '11:00',
            'min_stay_duration'     => '1',
            'max_stay_duration'     => '30',
            'booking_cut_off_hours' => '24',
            'cancellation_policy'   => 'Free cancellation up to 24 hours before check-in.',
        ];

        // Merge existing settings with defaults
        $settings = array_merge($defaultSettings, $settings);

        return Inertia::render('Admin/Settings/General', [
            'settings' => $settings,
        ]);
    }

    public function showPricingAndRates()
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        $defaultPricingSettings = [
            'global_discount_percentage' => '0',
            'default_tax_rate'           => '10',
            'weekend_surcharge_percentage' => '0',
            'currency_symbol'            => '$',
        ];

        $settings = array_merge($defaultPricingSettings, $settings);

        return Inertia::render('Admin/Settings/PricingAndRates', [
            'settings' => $settings,
        ]);
    }

    public function showEmailTemplates()
    {
        $settings = Setting::pluck('value', 'key')->toArray();

        $defaultEmailTemplateSettings = [
            'email_booking_confirmation_subject' => 'Your Booking Confirmation - LuxStay Hotel',
            'email_booking_confirmation_body'    => "Dear {guest_name},\n\nYour booking at LuxStay Hotel has been confirmed. Your booking number is {booking_number}.\n\nCheck-in: {check_in_date}\nCheck-out: {check_out_date}\nRoom Type: {room_type}\nTotal Price: {total_price}\n\nWe look forward to welcoming you!\n\nBest regards,\nLuxStay Hotel",
            'email_cancellation_subject'         => 'Your Booking Cancellation - LuxStay Hotel',
            'email_cancellation_body'            => "Dear {guest_name},\n\nYour booking {booking_number} at LuxStay Hotel has been cancelled.\n\nWe hope to see you again soon.\n\nBest regards,\nLuxStay Hotel",
        ];

        $settings = array_merge($defaultEmailTemplateSettings, $settings);

        return Inertia::render('Admin/Settings/EmailTemplates', [
            'settings' => $settings,
        ]);
    }

    public function showIntegrations()
    {
        return Inertia::render('Admin/Settings/Integrations');
    }

    public function updateGeneralSettings(Request $request)
    {
        // Define validation rules based on the settings fields.
        // Adjust rules as needed for specific data types (e.g., numeric for durations)
        $validatedData = $request->validate([
            'hotel_name'            => 'required|string|max:255',
            'hotel_address'         => 'nullable|string|max:500',
            'contact_email'         => 'required|email|max:255',
            'contact_phone'         => 'nullable|string|max:20',
            'website_url'           => 'nullable|url|max:255',
            'default_check_in_time' => 'required|date_format:H:i',
            'default_check_out_time' => 'required|date_format:H:i',
            'min_stay_duration'     => 'required|integer|min:1',
            'max_stay_duration'     => 'required|integer|min:1|gte:min_stay_duration',
            'booking_cut_off_hours' => 'required|integer|min:0',
            'cancellation_policy'   => 'nullable|string',
        ]);

        foreach ($validatedData as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return back()->with('success', 'General settings updated successfully.');
    }

    public function updatePricingAndRates(Request $request)
    {
        $validatedData = $request->validate([
            'global_discount_percentage' => 'required|numeric|min:0|max:100',
            'default_tax_rate'           => 'required|numeric|min:0|max:100',
            'weekend_surcharge_percentage' => 'required|numeric|min:0|max:100',
            'currency_symbol'            => 'required|string|max:5',
        ]);

        foreach ($validatedData as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return back()->with('success', 'Pricing and Rates settings updated successfully.');
    }

    public function updateEmailTemplates(Request $request)
    {
        $validatedData = $request->validate([
            'email_booking_confirmation_subject' => 'required|string|max:255',
            'email_booking_confirmation_body'    => 'required|string',
            'email_cancellation_subject'         => 'required|string|max:255',
            'email_cancellation_body'            => 'required|string',
        ]);

        foreach ($validatedData as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        return back()->with('success', 'Email templates updated successfully.');
    }
}
