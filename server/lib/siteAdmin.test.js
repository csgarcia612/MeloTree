const sinon = require('sinon'),
	axios = require('axios'),
	cityTest = require('./cityTest');

// Unit Tests
describe('Unit Tests', () => {
	describe('getUser function', () => {
		it('Should return user', () => {
			axios.get('/api/user-data');
		});
	}),
		describe('getSuggestedCities', () => {
			it('Should return an array of cities', () => {
				sinon.stub(axios, 'get').returns(
					Promise.resolve({
						data: {
							results: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
						}
					})
				);
				return cityTest.getSuggestedCities().then(cities => {
					expect(cities.length).toEqual(10);
				});
			});
		});
});

// Integration Tests
describe('Integration Tests', () => {
	describe('getUser function', () => {
		it('Should get user data from session', () => {
			axios.get('/api/user-data').then(res => {
				expect(res.data).toMatchObject({
					user_id: expect.any(Number),
					auth0_id: expect.any(String),
					username: expect.any(String),
					first_name: expect.any(String),
					last_name: expect.any(String),
					email: expect.any(String),
					image_url: expect.any(String)
				});
			});
		});
	}),
		describe('getCities function', () => {
			it('Should return city data from 3rd party db', () => {
				axios
					.get(
						'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json'
					)
					.then(res => {
						expect(res.data[0]).toMatchObject({
							city: expect.any(String),
							growth_from_2000_to_2013: expect.any(String),
							latitude: expect.any(Number),
							longitude: expect.any(Number),
							population: expect.any(String),
							rank: expect.any(String),
							state: expect.any(String)
						});
					});
			});
		});
});
