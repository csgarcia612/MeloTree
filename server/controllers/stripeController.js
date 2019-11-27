require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE_SECRET);

module.exports = {
	creditCharge: (req, res) => {
		// console.log('stripe server req.body', req.body);
		// console.log('token on server', req.body.token);
		const { token, state } = req.body;
		stripe.charges.create(
			{
				amount: state.ticketPrice * state.ticketQuantity * 100,
				currency: 'usd',
				description: 'Test Stripe Credit Charge',
				source: token.id
			},
			(error, charge) => {
				console.log(error);

				error ? res.status(500).send(error) : res.status(200).send(charge);
			}
		);
	}
};
