<?php

namespace App\Http\Controllers\Admin;

use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Passenger/Index');
    }

}
