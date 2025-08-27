<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'variant_name' => $this->variant_name,
            'quantity' => $this->quantity,
            'price_override' => $this->price_override,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
