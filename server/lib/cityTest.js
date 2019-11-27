const axios = require('axios');

module.exports = {
	getSuggestedCities() {
		return axios
			.get(
				'https://gist.githubusercontent.com/Miserlou/c5cd8364bf9b2420bb29/raw/2bf258763cdddd704f8ffd3ea9a3e81d25e2c6f6/cities.json'
			)
			.then(res => {
				return res.data.results;
			});
	}
};
