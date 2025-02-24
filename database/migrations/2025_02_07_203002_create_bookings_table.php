<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('schedule_id')->constrained()->cascadeOnDelete();
            $table->string('seat_numbers');
            $table->date('booking_date');
            $table->string('qr_code')->nullable();
            $table->string('status')->nullable()->default('pending');
//            $table->foreignId('promotion_id')->nullable()->constrained()->cascadeOnDelete();
            $table->string('payment_status')->default('pending');
            $table->string("booking_code");
            $table->decimal("total_fare");
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
