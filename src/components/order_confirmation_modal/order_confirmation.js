import React, { Component } from 'react';
import './order_confirmation.scss';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { setUser } from '../../dux/reducer';
import StripeCheckout from 'react-stripe-checkout';

const dotenv = require('dotenv');
dotenv.config();

class OrderConfirmation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userName: '',
			userEmail: '',
			ticketPrice: 0,
			ticketQuantity: 1,
			taxRate: 0.09
		};
		this.fillUserData = this.fillUserData.bind(this);
		this.increaseQuantity = this.increaseQuantity.bind(this);
		this.decreaseQuantity = this.decreaseQuantity.bind(this);
		this.buyerInputChange = this.buyerInputChange.bind(this);
		this.calculateTotal = this.calculateTotal.bind(this);
	}

	componentDidMount() {
		setTimeout(() => {
			this.fillUserData();
		}, 500);
	}

	// componentDidUpdate(prevProps) {
	// 	if (
	// 		this.props.user.first_name !== prevProps.user.first_name &&
	// 		this.props.purchaseInfo !== prevProps.purchaseInfo
	// 	) {
	// 		console.log('CDU FIRED');

	// 		this.fillUserData();
	// 	}
	// }

	fillUserData() {
		this.setState({
			userName: `${this.props.user.first_name} ${this.props.user.last_name}`,
			userEmail: `${this.props.user.email}`,
			ticketPrice: this.props.purchaseInfo.ticketPrice
		});
	}

	increaseQuantity() {
		let higherQuantity = this.state.ticketQuantity + 1;

		this.setState({
			ticketQuantity: higherQuantity
		});
	}

	decreaseQuantity() {
		let lowerQuantity = this.state.ticketQuantity - 1;

		this.setState({
			ticketQuantity: lowerQuantity
		});
	}

	buyerInputChange(event) {
		this.setState({
			[event.target.name]: event.target.value
		});
	}

	onToken = token => {
		console.log('stripe token:', token);

		const recipient = {
			auth0_id: this.props.user.auth0_id,
			name: this.state.userName,
			to: this.state.userEmail,
			subject: `Thank you ${
				this.state.userName
			} for your recent ticket purchase on Melo-Tree`
			// price: this.total(),
			// cart: this.props.cartProducts
		};

		const creditCharge = {
			token,
			state: this.state
		};
		// console.log("creditCharge", creditCharge);
		axios
			.post('/api/stripe', creditCharge)
			.then(res => {
				console.log('stripe response from server', res);
				axios.post('/api/nodemailer', recipient).then(res => {
					console.log('nodemailer response', res);
					return alert(
						'Payment successful! Check your email for order confirmation receipt'
					);
				});
				this.props.history.push('/');
			})
			.catch(error => {
				console.log('Error with front end credit processing', error);
			});
	};

	calculateTotal() {
		let preTaxPrice = this.state.ticketPrice * this.state.ticketQuantity;

		let currentTax = preTaxPrice * this.state.taxRate;

		let totalPrice = preTaxPrice + currentTax;

		return (
			<React.Fragment>
				<div className='ticket-tax-container'>
					<p className='ticket-tax-title'>Taxes:</p>
					<p className='ticket-tax'>${currentTax.toFixed(2)}</p>
				</div>
				<div className='ticket-total-price-container'>
					<p className='ticket-total-price-title'>Total Price:</p>
					<p className='ticket-total-price'>${totalPrice.toFixed(2)}</p>
				</div>
			</React.Fragment>
		);
	}

	render() {
		console.log('Order Confirm Props:', this.props.purchaseInfo);
		// console.log('user-props', this.props.user);
		console.log('order-confirm-state', this.state);

		const {
			userName,
			userEmail,
			ticketPrice,
			ticketQuantity,
			taxRate
		} = this.state;

		let totalPriceInPennies =
			(ticketPrice * ticketQuantity * taxRate + ticketPrice * ticketQuantity) *
			100;

		let modalGuestList =
			this.props.purchaseInfo.guestArtists &&
			this.props.purchaseInfo.guestArtists.map(artist => {
				// console.log("artist", artist);
				return (
					<p key={artist.id} className='guest-artist'>
						{artist.name}
					</p>
				);
			});

		modalGuestList && modalGuestList.splice(0, 1);

		return (
			<div className='order-confirmation-container'>
				{this.props.purchaseInfo && (
					<React.Fragment>
						<button
							className='close-modal-button'
							onClick={() => this.props.closeModal()}
						>
							X
						</button>
						<div className='modal-event-info'>
							<div className='modal-event-name-container'>
								<p className='modal-event-name'>{`${
									this.props.purchaseInfo.event.name
								}`}</p>
							</div>
							<div className='modal-date-time-container'>
								<p className='modal-date'>{`${
									this.props.purchaseInfo.date
								}`}</p>
								<p className='date-time-split'>AT</p>
								<p className='modal-time'>{`${
									this.props.purchaseInfo.time
								}`}</p>
							</div>
							<div className='modal-artist-venue-info-container'>
								<div className='modal-artist-info-container'>
									<p className='modal-main-artist-name'>{`${
										this.props.purchaseInfo.artist
									}`}</p>
									<div
										className={
											this.props.purchaseInfo &&
											this.props.purchaseInfo.guestArtists
												? 'show-modal-guests'
												: 'hide-modal-guest'
										}
									>
										<p className='modal-guest-title'>
											{this.props.purchaseInfo.guestTitle}
										</p>
										{modalGuestList}
									</div>
								</div>
								<span className='modal-artist-venue-split' />
								<div className='modal-venue-info-container'>
									<p className='modal-venue-name'>{`${
										this.props.purchaseInfo.event._embedded.venues[0].name
									}`}</p>
									<p className='modal-venue-address'>
										{this.props.purchaseInfo.event._embedded.venues[0].address
											.line1 !==
										this.props.purchaseInfo.event._embedded.venues[0].name
											? `${
													this.props.purchaseInfo.event._embedded.venues[0]
														.address.line1
											  }`
											: ''}
									</p>
									<p className='modal-venue-city-state-zip'>{`${
										this.props.purchaseInfo.event._embedded.venues[0].city.name
									}, ${
										this.props.purchaseInfo.event._embedded.venues[0].state
											.stateCode
									} ${
										this.props.purchaseInfo.event._embedded.venues[0].postalCode
									}`}</p>
									<p className='modal-venue-phone'>{`${this.props
										.purchaseInfo &&
										this.props.purchaseInfo.event._embedded.venues[0]
											.boxOfficeInfo &&
										this.props.purchaseInfo.event._embedded.venues[0]
											.boxOfficeInfo.phoneNumberDetail}`}</p>
								</div>
							</div>
						</div>
						<div className='modal-ticket-info'>
							<div className='modal-ticket-price-container'>
								<p className='ticket-price-title'>Ticket Price:</p>
								<p className='ticket-price'>
									${`${this.props.purchaseInfo.ticketPrice}`}
									.00
								</p>
							</div>
							<div className='modal-ticket-quantity-container'>
								<p className='ticket-quantity-title'>Quantity: </p>
								<p className='ticket-quantity-limit'>( Max Qty: 8 )</p>
								<div className='ticket-quantity-update'>
									<button
										className='ticket-quantity-buttons'
										disabled={ticketQuantity === 1 ? true : false}
										onClick={this.decreaseQuantity}
									>
										-
									</button>
									<p className='ticket-quantity'>{ticketQuantity}</p>
									<button
										className='ticket-quantity-buttons'
										disabled={ticketQuantity === 8 ? true : false}
										onClick={this.increaseQuantity}
									>
										+
									</button>
								</div>
							</div>
							<div className='ticket-total-calc-container'>
								{this.calculateTotal()}
							</div>
						</div>
						<div className='modal-buyer-info'>
							<p className='buyer-name'>Name:</p>
							<input
								className='buyer-inputs'
								value={userName}
								onChange={this.buyerInputChange}
								name='userName'
							/>
							<p className='buyer-email'>Email:</p>
							<input
								className='buyer-inputs'
								value={userEmail}
								onChange={this.buyerInputChange}
								name='userEmail'
							/>
						</div>
						<div className='stripe-checkout-form'>
							<StripeCheckout
								name='MeloTree'
								description='Enjoy The Show'
								image='https://i.imgur.com/yykorWm.png'
								ComponentClass='div'
								panelLabel='Total Price: '
								amount={totalPriceInPennies}
								currency='USD'
								stripeKey={process.env.REACT_APP_STRIPE_PUBLIC_KEY}
								locale='auto'
								email={userEmail}
								zipCode={false}
								allowRememberMe={false}
								token={this.onToken}
								triggerEvent='onClick'
							>
								<button className='stripe-checkout-button'>
									Proceed To Payment Info
								</button>
							</StripeCheckout>
						</div>
					</React.Fragment>
				)}
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.user
	};
};

const mapDispatchToProps = {
	setUser: setUser
};

export default withRouter(
	connect(
		mapStateToProps,
		mapDispatchToProps
	)(OrderConfirmation)
);
