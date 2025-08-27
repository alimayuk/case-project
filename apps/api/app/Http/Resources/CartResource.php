<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $subtotalExclVat = 0;
        $vatTotal = 0;

        foreach ($this->items as $item) {
            $itemTotal = $item->qty * $item->unit_price_snapshot;
            $itemVat = $itemTotal * ($item->vat_rate_snapshot / 100);

            $subtotalExclVat += $itemTotal;
            $vatTotal += $itemVat;
        }

        $grandTotal = $subtotalExclVat + $vatTotal;

        return [
            'id' => $this->id,
            'session_key' => $this->session_key,
            'user_id' => $this->user_id,
            'items' => CartItemResource::collection($this->whenLoaded('items')),
            'summary' => [
                'subtotal_excl_vat' => round($subtotalExclVat, 2),
                'vat_total' => round($vatTotal, 2),
                'grand_total' => round($grandTotal, 2)
            ],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at
        ];
    }
}
