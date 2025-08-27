<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartItemResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'cart_id' => $this->cart_id,
            'product_variant_id' => $this->product_variant_id,
            'qty' => $this->qty,
            'unit_price_snapshot' => $this->unit_price_snapshot,
            'vat_rate_snapshot' => $this->vat_rate_snapshot,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'variant' => new ProductVariantResource($this->whenLoaded('variant')),
        ];
    }
}
