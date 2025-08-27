<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCartItemRequest extends FormRequest
{
    public function rules()
    {
        return [
            'qty' => 'required|integer|min:0'
        ];
    }
}
