import ProductItem from '@/components/ProductItem';
import data from '@/utils/data';

export default function Home() {
	console.log('home page');
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
			{data.products.map(product => (
				<ProductItem
					product={product}
					key={product.slug}
				/>
			))}
		</div>
	);
}
