import ProductItem from '@/components/ProductItem';
import Product from '@/models/Product';
import db from '@/utils/db';

const getProducts = async () => {
	await db.connect();
	const products = await Product.find().lean();

	await db.disconnect();

	return products.map(db.convertDoCToObj);
};

export default async function Home() {
	const products = await getProducts();
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
			{products.map(product => (
				<ProductItem
					product={product}
					key={product.slug}
				/>
			))}
		</div>
	);
}
