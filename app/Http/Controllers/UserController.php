<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User; // Import the User model
use App\Models\Customer; // Import the Customer model
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function showAllCustomers(){
        $customers = Customer::with('user')->get(); // Eager load user relationship
        return Inertia::render('Admin/GuestsUsers/AllCustomers', [
            'customers' => $customers,
        ]);
    }

    public function showAllAdmins(){
        $admins = User::where('role', 'admin')->get();
        return Inertia::render('Admin/GuestsUsers/Admins', [
            'admins' => $admins,
            'loggedInUserId' => auth()->id(), // Pass logged in user ID for frontend checks
        ]);
    }

    public function showAllStaff(){
        return Inertia::render('Admin/GuestsUsers/Staff');
    }
    public function showAllRoles(){
        return Inertia::render('Admin/GuestsUsers/Roles');
    }

    public function storeAdmin(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', \Illuminate\Validation\Rules\Password::defaults()],
        ]);

        User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'admin',
        ]);

        return back()->with('success', 'Admin user created successfully.');
    }

    public function deleteUser(User $user)
    {
        // Prevent deletion of the only admin account
        if ($user->role === 'admin' && User::where('role', 'admin')->count() === 1) {
            return back()->with('error', 'Cannot delete the last admin account.');
        }

        // Prevent deletion of the currently logged-in admin account
        if ($user->role === 'admin' && $user->id === auth()->id()) {
            return back()->with('error', 'Cannot delete your own admin account.');
        }

        $user->delete();

        return back()->with('success', 'User deleted successfully.');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
