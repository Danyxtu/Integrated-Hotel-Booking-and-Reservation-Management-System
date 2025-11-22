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
        Schema::table('room_types', function (Blueprint $table) {
            $table->integer('capacity_adults')->unsigned()->after('price');
            $table->integer('capacity_children')->unsigned()->after('capacity_adults');
            $table->text('amenities')->nullable()->after('capacity_children');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('room_types', function (Blueprint $table) {
            $table->dropColumn(['capacity_adults', 'capacity_children', 'amenities']);
        });
    }
};
