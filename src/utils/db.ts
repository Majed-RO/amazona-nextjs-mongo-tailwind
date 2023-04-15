import mongoose from 'mongoose';
import { Product } from './interfaces';

const connection: any = {};

/* https://stackoverflow.com/questions/75697312/import-mongoose-lib-in-api-directory-in-next-js-13-2-app-directory-gives-error
 */
async function connect() {
	if (connection.isConnected) {
		console.log('already connected');
		return;
	}

	if (mongoose.connections.length > 0) {
		connection.isConnected = mongoose.connections[0].readyState;

		if (connection.isConnected === 1) {
			console.log('use previous connection');
			return;
		}
		await mongoose.disconnect();
	}

	const db = await mongoose.connect(`${process.env.MONGODB_URI}`);
	console.log('NEW CONNECTION');
	connection.isConnected = db.connections[0].readyState;
}

async function disconnect() {
	if (connection.isConnected) {
		if (`${process.env.NODE_ENV}` === 'production') {
			await mongoose.disconnect();
			connection.isConnected = false;
		} else {
			console.log('not disconnected');
		}
	}
}

function convertDoCToObj(doc: Product) {
	doc._id = doc._id.toString();
	doc.createdAt = doc.createdAt.toString();
	doc.updatedAt = doc.updatedAt.toString();

	return doc;
}

const db = { connect, disconnect, convertDoCToObj };

export default db;
