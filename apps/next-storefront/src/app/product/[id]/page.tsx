import { Product } from '@/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import AddToCartButton from '@/components/AddToCartButton';

async function getProduct(id: string): Promise<Product | null> {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
            {
                next: { revalidate: 60 }
            }
        );

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data || null;
    } catch (error) {
        return null;
    }
}

interface ProductPageProps {
    params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const product = await getProduct(params.id);

    if (!product) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                        src={`/images/products/${product.sku}.jpg`}
                        alt={product.name}
                        width={600}
                        height={600}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-2xl font-bold text-blue-600 mb-4">{product.price} ₺</p>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Ürün Açıklaması</h2>
                        <p className="text-gray-700">
                            {product.name} yüksek kaliteli malzemelerden üretilmiştir.
                        </p>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Varyantlar</h2>
                        <div className="space-y-4">
                            {product.variants?.map((variant) => (
                                <div key={variant.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold">{variant.variant_name}</span>
                                        <span className="text-lg font-bold">
                                            {variant.price_override || product.price} ₺
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">
                                            Stok: {variant.quantity}
                                        </span>
                                        <AddToCartButton
                                            variant={variant}
                                            product={product}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Ürün Bilgileri</h2>
                        <dl className="grid grid-cols-2 gap-4">
                            <div>
                                <dt className="font-semibold">SKU</dt>
                                <dd>{product.sku}</dd>
                            </div>
                            <div>
                                <dt className="font-semibold">KDV Oranı</dt>
                                <dd>%{product.vat_rate}</dd>
                            </div>
                            <div>
                                <dt className="font-semibold">Durum</dt>
                                <dd>{product.status === 1 ? 'Aktif' : 'Pasif'}</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    );
}