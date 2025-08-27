<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $cacheKey = 'products_' . md5(serialize($request->all()));

        $products = Cache::remember($cacheKey, 60, function () use ($request) {
            $query = Product::with('variants')
                ->when($request->query('status'), fn($q, $status) => $q->where('status', $status))
                ->when($request->query('query'), fn($q, $search) => $q->where(
                    fn($q2) =>
                    $q2->where('name', 'like', "%{$search}%")
                        ->orWhere('sku', 'like', "%{$search}%")
                ));

            if ($request->sort) {
                $sorts = explode(',', $request->sort);
                foreach ($sorts as $sort) {
                    $direction = 'asc';
                    if (str_starts_with($sort, '-')) {
                        $direction = 'desc';
                        $sort = substr($sort, 1);
                    }
                    $query->orderBy($sort, $direction);
                }
            }

            return $query->paginate($request->per_page ?? 20);
        });

        return response()->json($products);
    }

    public function otherColors($id)
    {
        $product = Product::findOrFail($id);

        // aynı ürün grubundaki diğer ürünleri bul
        $pos = strrpos($product->sku, '-');
        if ($pos === false) {
            return ProductResource::collection(collect());
        }
        $baseSku = substr($product->sku, 0, $pos);

        // sonrasında diğer ürünleri bul
        $otherProducts = Product::where('id', '!=', $product->id)
            ->where('sku', 'like', $baseSku . '-%')
            ->where('status', 1)
            ->get();

        return ProductResource::collection($otherProducts);
    }

    public function getVariants($id)
    {
        $id = Product::find($id);
        $variants = $id->variants()->get();
        if ($variants->isEmpty()) {
            return response()->json([
                'code' => 'VARIANTS_NOT_FOUND',
                'message' => 'Variants not found',
                'fields' => []
            ], 404);
        }

        return response()->json([
            'data' => $variants
        ]);
    }
}
