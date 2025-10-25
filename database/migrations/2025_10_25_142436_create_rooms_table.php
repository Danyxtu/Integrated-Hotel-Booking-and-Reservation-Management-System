<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('rooms', function (Blueprint $table) {
            $table->id('room_id');
            $table->string('room_number', 20)->unique();
            $table->string('room_type', 20);
            $table->decimal('price', 11, 2);
            $table->text('description')->nullable();
            $table->dateTime('created_at')->useCurrent();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
