import fs from 'fs';
import data from './src/lib/MapEntry/data.json' assert { type: 'json' };

const newData = data.map((d) => ({
	id: d.id.toString(),
	sport: d.sport,
	name: d.name,
	shortDescription: d.shortDescription,
	address: {
		street: d.street,
		city: d.city,
		state: d.state,
		zipCode: d.zipCode,
		country: d.country,
		lat: d.lat,
		lon: d.lon
	},
	startingPrice: d.startingPrice,
	reviews: {
		rating: d.rating,
		count: d.count
	},
	image: '/picture.png'
}));

fs.writeFileSync('./src/lib/MapEntry/valid.json', JSON.stringify(newData));
