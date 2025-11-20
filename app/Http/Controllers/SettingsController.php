<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function showGeneralSettings()
    {
        return Inertia::render('Admin/Settings/General');
    }

    public function showPricingAndRates()
    {
        return Inertia::render('Admin/Settings/PricingAndRates');
    }

    public function showEmailTemplates()
    {
        return Inertia::render('Admin/Settings/EmailTemplates');
    }

    public function showIntegrations()
    {
        return Inertia::render('Admin/Settings/Integrations');
    }
}
