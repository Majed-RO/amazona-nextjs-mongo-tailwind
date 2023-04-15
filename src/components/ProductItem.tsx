/* eslint-disable @next/next/no-img-element */
import AddToCart from '@/app/product/[slug]/components/AddToCart';
import { Product } from '@/utils/interfaces';
import Link from 'next/link';

export default function ProductItem({ product }: { product: Product }) {
	return (
		<div className="card">
			<Link href={`/product/${product.slug}`}>
				<img
					src={product.image}
					alt={product.name}
					className="rounded shadow"
				/>
			</Link>

			<div className="flex flex-col items-center justify-center p-5">
				<Link href={`/product/${product.slug}`}>
					<h2 className="text-lg">
						{product.name}
					</h2>
				</Link>
				<p className="mb-2">{product.brand}</p>
				<p>${product.price}</p>
				<AddToCart product={product} redirect={false} />
			</div>
		</div>
	);
}
