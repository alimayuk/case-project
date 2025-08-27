<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddCartItemRequest extends FormRequest
{
    public function rules()
    {
        return [
            'session_key' => 'required|string|exists:carts,session_key',
            'product_variant_id' => 'required|exists:product_variants,id',
            'qty' => 'required|integer|min:1'
        ];
    }
}
