<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;


Route::post('/cart', [CartController::class, 'create']);
Route::get('/cart', [CartController::class, 'show']);
Route::middleware('cart.rate_limit:5,1')->group(function () {
    Route::post('/cart/items', [CartController::class, 'addItem']);
    Route::patch('/cart/items/{id}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);
});

Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}/other-colors', [ProductController::class, 'otherColors']);
Route::get('products/{id}/variants', [ProductController::class, 'getVariants']);
