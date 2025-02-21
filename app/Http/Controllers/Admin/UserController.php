<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('email', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('phone', 'LIKE', "%{$searchTerm}%");
            });
        }
        $passengers = $query->latest()->paginate(8);
        return Inertia::render('Admin/Passenger/Index', [
            'passengers' => $passengers,
        ]);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return response()->json([
            'user' => $user
        ]);
    }

    public function store(Request $request): RedirectResponse
    {

        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|phone:KE|min:10|max:13',
            'address' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', Rules\Password::defaults()],
            'user_type' => ['required', 'string']
        ]);

        $image = 'images/default.png';
        if ($request->hasFile('image')) {
            $image = $request->file('image')->store('images', 'public');
        }

        $user = User::create([
            'name' => $request->name,
            'phone' => $request->phone,
            'address' => $request->address,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'user_type' => $request->user_type,
            'image' => $image,
        ]);

        event(new Registered($user));
        return redirect()->intended("/admin/users")->with('success', 'User created successfully.');
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        dd("ok");
        $request->validate([]);
    }

    public function destroy(User $user): RedirectResponse
    {
        $authUser = Auth::user();
        if ($authUser->user_type !== 'admin') {
            return redirect()->withErrors("You are not allowed to delete user");
        }
        $user->delete();
        return redirect()->intended("/admin/users")->with('error', 'User deleted successfully.');
    }


}
