export interface Product {
	_id: string;
	name: string;
	slug: string;
	category: string;
	image: string;
	price: number;
	brand: string;
	rating: number;
	numReviews: number;
	countInStock: number;
	description: string;
	updatedAt: string;
	createdAt: string;
}

export interface OrderItem {
	_id: string;
	slug: string;
	name: string;
	quantity: number;
	image: string;
	price: number;
}

export interface Order {
	orderItems: OrderItem[];
	shippingAddress: {
		fullName: string;
		address: string;
		city: string;
		postalCode: string;
		country: string;
	};
	paymentMethod: string;
	itemsPrice: number;
	shippingPrice: number;
	taxPrice: number;
	totalPrice: number;
	isPaid: boolean;
	isDelivered: boolean;
	paidAt: Date;
	deliveredAt: Date;
}
