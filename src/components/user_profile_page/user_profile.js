import React, { Component } from 'react';
import {
	GET_USER,
	DELETE_ADDRESS,
	NEW_ADDRESS,
	UPDATE_USER,
	DELETE_USER
} from './graphqlController';
import { Query, Mutation } from 'react-apollo';
import { connect } from 'react-redux';
import { setUser } from '../../dux/reducer';
import './user_profile.scss';

class UserProfile extends Component {
	state = {
		users: [],
		addressProperties: [
			'address_one',
			'address_two',
			'city',
			'state',
			'zipcode'
		],
		editingState: false,
		address_one: '',
		address_two: '',
		city: '',
		state: '',
		zipcode: 0,
		username: '',
		first_name: '',
		last_name: '',
		email: '',
		image_url: ''
	};

	handleInput = e => {
		this.setState({
			[e.target.name]: e.target.value
		});
	};

	render() {
		const { editingState } = this.state;
		let address_id;
		// let user_id;

		const user_id = this.props.user && this.props.user.auth0_id;
		const auth0_id = this.props.user && this.props.user.auth0_id;
		// console.log('userID', this.props.user);

		const getUser = auth0_id => (
			<Query query={GET_USER} variables={{ auth0_id }}>
				{({ loading, error, data }) => {
					if (loading) return <h1>Loading data...</h1>;
					if (error) return <h1>Error!</h1>;
					console.log('data', data);
					// user_id = data.user ? data.user.user_id : 0;
					address_id = data.user.address
						? +data.user.address.address_id
						: 'Please Log In';
					return (
						<>
							<div className='user-image-container'>
								<img src={data.user.image_url} alt='User Imagery' />
							</div>
							<div className='user-info-container'>
								<p>{data.user.username}</p>
								<p>{data.user.first_name}</p>
								<p>{data.user.last_name}</p>
								<p>{data.user.email}</p>
								{data.user.address && (
									<>
										<p>{data.user.address.address_one}</p>
										<p>{data.user.address.address_two}</p>
										<p>{data.user.address.city}</p>
										<p>{data.user.address.state}</p>
										<p>{data.user.address.zipcode}</p>
									</>
								)}
							</div>
						</>
					);
				}}
			</Query>
		);

		return this.props.user ? (
			<div className='user-profile-container'>
				{getUser(user_id)}
				<div className='address-info'>
					{editingState ? (
						<React.Fragment>
							<p>
								{this.state.editingState === 'add' ||
								this.state.editingState === 'edit' ? (
									<>
										Address:{' '}
										<input
											type='text'
											name='address_one'
											value={this.state.address_one}
											onChange={e => this.handleInput(e)}
										/>
									</>
								) : (
									<>
										Username:{' '}
										<input
											type='text'
											name='username'
											value={this.state.username}
											onChange={e => this.handleInput(e)}
										/>
									</>
								)}
							</p>
							<p>
								{this.state.editingState === 'add' ||
								this.state.editingState === 'edit' ? (
									<>
										Address:
										<input
											type='text'
											name='address_two'
											value={this.state.address_two}
											onChange={e => this.handleInput(e)}
										/>
									</>
								) : (
									<>
										First Name:{' '}
										<input
											type='text'
											name='first_name'
											value={this.state.first_name}
											onChange={e => this.handleInput(e)}
										/>
									</>
								)}
							</p>
							<p>
								{this.state.editingState === 'add' ||
								this.state.editingState === 'edit' ? (
									<>
										City:
										<input
											type='text'
											name='city'
											value={this.state.city}
											onChange={e => this.handleInput(e)}
										/>
									</>
								) : (
									<>
										Last Name:{' '}
										<input
											type='text'
											name='last_name'
											value={this.state.last_name}
											onChange={e => this.handleInput(e)}
										/>
									</>
								)}
							</p>
							<p>
								{this.state.editingState === 'add' ||
								this.state.editingState === 'edit' ? (
									<>
										State:
										<input
											type='text'
											name='state'
											value={this.state.state}
											onChange={e => this.handleInput(e)}
										/>
									</>
								) : (
									<>
										Email:{' '}
										<input
											type='text'
											name='email'
											value={this.state.email}
											onChange={e => this.handleInput(e)}
										/>
									</>
								)}
							</p>
							<p>
								{this.state.editingState === 'add' ||
								this.state.editingState === 'edit' ? (
									<>
										Zipcode:
										<input
											name='zipcode'
											value={this.state.zipcode}
											onChange={e => this.handleInput(e)}
										/>
									</>
								) : (
									<>
										Image_url:{' '}
										<input
											type='text'
											name='image_url'
											value={this.state.image_url}
											onChange={e => this.handleInput(e)}
										/>
									</>
								)}
							</p>
						</React.Fragment>
					) : (
						''
					)}
				</div>
				{!editingState && (
					<React.Fragment>
						<button onClick={() => this.setState({ editingState: 'update' })}>
							Update Profile
						</button>
					</React.Fragment>
				)}
				{editingState === 'update' && (
					<React.Fragment>
						<Mutation
							mutation={UPDATE_USER}
							refetchQueries={[{ query: GET_USER }]}
							onCompleted={() =>
								this.setState(
									{ editingState: false } & window.location.replace('/profile')
								)
							}
						>
							{(updateUser, { loading, error }) => (
								// console.log('data', data)
								<div>
									<button
										onClick={() => {
											updateUser({
												variables: {
													input: {
														user_id: this.props.user.user_id,
														username: this.state.username,
														first_name: this.state.first_name,
														last_name: this.state.last_name,
														email: this.state.email,
														image_url: this.state.image_url
													}
												}
											});
										}}
									>
										Submit
									</button>
									{loading && <h1>Loading data...</h1>}
									{error && <h1>Error!</h1>}
								</div>
							)}
						</Mutation>
						<Mutation
							mutation={DELETE_USER}
							refetchQueries={[{ query: GET_USER }]}
							onCompleted={() =>
								this.setState(
									{ editingState: false } & window.location.replace('/')
								)
							}
						>
							{deleteUser => (
								<button
									onClick={() => {
										deleteUser({ variables: { auth0_id } });
										console.log('userid', auth0_id);
									}}
								>
									Delete User
								</button>
							)}
						</Mutation>
						<button onClick={() => this.setState({ editingState: false })}>
							Cancel
						</button>
					</React.Fragment>
				)}

				{!editingState && (
					<React.Fragment>
						<button onClick={() => this.setState({ editingState: 'add' })}>
							Add Address
						</button>
					</React.Fragment>
				)}
				{editingState === 'add' && (
					<React.Fragment>
						<Mutation
							mutation={NEW_ADDRESS}
							refetchQueries={[{ query: GET_USER }]}
							onCompleted={() =>
								this.setState(
									{ editingState: false } & window.location.replace('/profile')
								)
							}
						>
							{(addAddres, { loading, error }) => (
								// console.log('data', data)
								<div>
									<button
										onClick={() => {
											addAddres({
												variables: {
													input: {
														user_id: this.props.user.user_id,
														address_one: this.state.address_one,
														address_two: this.state.address_two,
														city: this.state.city,
														state: this.state.state,
														zipcode: +this.state.zipcode
													}
												}
											});
										}}
									>
										Submit
									</button>
									{loading && <h1>Loading data...</h1>}
									{error && <h1>Error!</h1>}
								</div>
							)}
						</Mutation>
						<button onClick={() => this.setState({ editingState: false })}>
							Cancel
						</button>
					</React.Fragment>
				)}

				{!editingState && (
					<React.Fragment>
						<button onClick={() => this.setState({ editingState: 'edit' })}>
							Edit Address
						</button>
					</React.Fragment>
				)}
				{editingState === 'edit' && (
					<React.Fragment>
						<Mutation
							mutation={NEW_ADDRESS}
							refetchQueries={[{ query: GET_USER }]}
							onCompleted={() =>
								this.setState(
									{ editingState: false } & window.location.replace('/profile')
								)
							}
						>
							{(updateAddress, { loading, error }) => (
								<div>
									<button
										onClick={() => {
											updateAddress({
												variables: {
													input: {
														user_id: this.props.user.user_id,
														address_id: address_id,
														address_one: this.state.address_one,
														address_two: this.state.address_two,
														city: this.state.city,
														state: this.state.state,
														zipcode: +this.state.zipcode
													}
												}
											});
										}}
									>
										Submit
									</button>
									{loading && <h1>Loading data...</h1>}
									{error && <h1>Error!</h1>}
								</div>
							)}
						</Mutation>

						<Mutation
							mutation={DELETE_ADDRESS}
							refetchQueries={[{ query: GET_USER }]}
							onCompleted={() =>
								this.setState(
									{ editingState: false } & window.location.replace('/profile')
								)
							}
						>
							{deleteAddress => (
								<button
									onClick={() => {
										deleteAddress({ variables: { address_id } });
									}}
								>
									Delete Address
								</button>
							)}
						</Mutation>
						<button onClick={() => this.setState({ editingState: false })}>
							Cancel
						</button>
					</React.Fragment>
				)}
			</div>
		) : (
			<div>Please Log in</div>
		);
	}
}
const mapStateToProp = state => {
	return {
		user: state.user
	};
};

export default connect(
	mapStateToProp,
	{ setUser }
)(UserProfile);
