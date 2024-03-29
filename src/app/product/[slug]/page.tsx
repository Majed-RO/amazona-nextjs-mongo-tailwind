import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import AddToCart from './components/AddToCart';
import db from '@/utils/db';
import Product from '@/models/Product';
import { cache } from 'react';

export async function generateMetadata({
	params
}: {
	params: { slug: string };
}): Promise<Metadata> {
	const { slug } = params;

	const product = await getProduct(slug);

	return { title: product?.name };
}
/* 
https://beta.nextjs.org/docs/data-fetching/caching
*/
const getProduct = cache(async (slug: string, ignoreFound = false) => {
	await db.connect();

	let product = null;
	try {
		product = await Product.findOne({
			slug
		}).lean();
	} catch (error) {
		console.log('error2', error);
	}

	await db.disconnect();

	// if (!product && !ignoreFound) {
	if (!product) {
		return notFound();
	}

	// return db.convertDoCToObj(product);
	return product ? db.convertDoCToObj(product) : product;
});

export default async function ProductScreen({
	params
}: {
	params: { slug: string };
}) {
	const product = await getProduct(params.slug);

	return (
		<>
			<div className="py-2">
				<Link href={'/'}>back to products</Link>
			</div>
			<div className="grid md:grid-cols-4 md:gap-3">
				<div className="md:col-span-2">
					<Image
						src={product?.image}
						alt={product?.name}
						width={640}
						height={640}
					/>
				</div>
				<div>
					<ul>
						<li>
							<h1 className="text-lg">
								{product?.name}
							</h1>
						</li>
						<li>
							Category:{' '}
							{product?.category}
						</li>
						<li>Brand: {product?.brand}</li>
						<li>
							{product?.rating} of{' '}
							{product?.numReviews}{' '}
							reviews
						</li>
						<li>
							Description:{' '}
							{product?.description}
						</li>
					</ul>
				</div>
				<div>
					<div className="card p-5">
						<div className="mb-2 flex justify-between">
							<div>Price</div>
							<div>
								$
								{product?.price}
							</div>
						</div>
						<div className="mb-2 flex justify-between">
							<div>Status</div>
							<div>
								{product.countInStock >
								0
									? 'In stock'
									: 'Unavailable'}
							</div>
						</div>
						<AddToCart product={product} />
					</div>
				</div>
			</div>
		</>
	);
}
