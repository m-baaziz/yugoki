export type MapEntry = {
	id: string;
	sport: string;
	name: string;
	shortDescription: string;
	address: Address;
	startingPrice: number;
	reviews: Reviews;
	image: string;
};

export type Address = {
	street: string;
	city: string;
	state: string;
	zipCode: string;
	country: string;
	lat: number;
	lon: number;
};

export type Reviews = {
	rating: number;
	count: number;
};

export { data as mapEntries } from './data';
