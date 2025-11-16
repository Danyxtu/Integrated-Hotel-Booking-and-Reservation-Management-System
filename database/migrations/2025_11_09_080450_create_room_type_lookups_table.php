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
        Schema::create('room_type_lookups', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->decimal('default_price', 10, 2);
            $table->text('default_description');
            $table->integer('default_capacity_adults');
            $table->integer('default_capacity_children');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('room_type_lookups');
    }
};
