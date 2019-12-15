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
    // users: [],
    // addressProperties: [
    //   'address_one',
    //   'address_two',
    //   'city',
    //   'state',
    //   'zipcode'
    // ],
    editingState: false,
    address_one: '',
    address_two: '',
    city: '',
    state: '',
    zipcode: '',
    username: '',
    first_name: '',
    last_name: '',
    email: '',
    image_url: ''
  };

  componentDidMount() {
    setTimeout(() => {
      this.fillUserData(this.props);
    }, 500);
  }

  handleInput = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  fillUserData = () => {
    console.log('**1st Props: ', this.props.userInfo);

    if (this.props.userInfo) {
      this.setState({
        address_one: this.props.userInfo.address.address_one,
        address_two: this.props.userInfo.address.address_two,
        auth0_id: this.props.userInfo.auth0_id,
        city: this.props.userInfo.address.city,
        state: this.props.userInfo.address.state,
        zipcode: this.props.userInfo.address.zipcode,
        username: this.props.userInfo.username,
        first_name: this.props.userInfo.first_name,
        last_name: this.props.userInfo.last_name,
        email: this.props.userInfo.email,
        image_url: this.props.userInfo.image_url
      });
    }

    console.log('**State: ', this.state);
    console.log('**Props: ', this.props);
  };

  render() {
    const { editingState } = this.state;
    let address_id;

    const user_id = this.props.user && this.props.user.auth0_id;
    const auth0_id = this.props.user && this.props.user.auth0_id;
    // console.log('userID', this.props.user);

    const getUser = auth0_id => (
      <Query query={GET_USER} variables={{ auth0_id }}>
        {({ loading, error, data }) => {
          if (loading) return <h1>Loading data...</h1>;
          if (error) return <h1>Error!</h1>;

          // console.log('data', data);

          address_id = data.user.address
            ? +data.user.address.address_id
            : 'Please Log In';
          return <UserProfile userInfo={data.user} />;
        }}
      </Query>
    );

    return this.props.userInfo ? (
      <div className='user-profile-container'>
        <div className='edit-info-container'>
          {editingState ? (
            <React.Fragment>
              <p>
                {this.state.editingState === 'add' ||
                this.state.editingState === 'edit' ? (
                  <>
                    Address - Line 1:{' '}
                    <input
                      type='text'
                      name='address_one'
                      placeholder={this.state.address_one}
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
                      placeholder={this.state.username}
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
                    Address - Line 2:{' '}
                    <input
                      type='text'
                      name='address_two'
                      placeholder={this.state.address_two}
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
                      placeholder={this.state.first_name}
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
                    City:{' '}
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
                    State:{' '}
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
                    Zipcode:{' '}
                    <input
                      name='zipcode'
                      value={this.state.zipcode}
                      onChange={e => this.handleInput(e)}
                    />
                  </>
                ) : (
                  <>
                    Image URL:{' '}
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
        <div className='edit-btns-container'>
          {!editingState && (
            <React.Fragment>
              <button
                className='open-edit-btn'
                onClick={() => this.setState({ editingState: 'update' })}
              >
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
                    { editingState: false } &
                      window.location.replace('/profile')
                  )
                }
              >
                {(updateUser, { loading, error }) => (
                  // console.log('data', data)
                  <div>
                    <button
                      className='edit-btns'
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
                    className='edit-btns'
                    onClick={() => {
                      deleteUser({ variables: { auth0_id } });
                      // console.log('userid', auth0_id);
                    }}
                  >
                    Delete User
                  </button>
                )}
              </Mutation>
              <button
                className='edit-btns'
                onClick={() => this.setState({ editingState: false })}
              >
                Cancel
              </button>
            </React.Fragment>
          )}

          {!editingState && (
            <React.Fragment>
              <button
                className='open-edit-btn'
                onClick={() => this.setState({ editingState: 'add' })}
              >
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
                    { editingState: false } &
                      window.location.replace('/profile')
                  )
                }
              >
                {(addAddres, { loading, error }) => (
                  // console.log('data', data)
                  <div>
                    <button
                      className='edit-btns'
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
              <button
                className='edit-btns'
                onClick={() => this.setState({ editingState: false })}
              >
                Cancel
              </button>
            </React.Fragment>
          )}

          {!editingState && (
            <React.Fragment>
              <button
                className='open-edit-btn'
                onClick={() => this.setState({ editingState: 'edit' })}
              >
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
                    { editingState: false } &
                      window.location.replace('/profile')
                  )
                }
              >
                {(updateAddress, { loading, error }) => (
                  <div>
                    <button
                      className='edit-btns'
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
                    { editingState: false } &
                      window.location.replace('/profile')
                  )
                }
              >
                {deleteAddress => (
                  <button
                    className='edit-btns'
                    onClick={() => {
                      deleteAddress({ variables: { address_id } });
                    }}
                  >
                    Delete Address
                  </button>
                )}
              </Mutation>
              <button
                className='edit-btns'
                onClick={() => this.setState({ editingState: false })}
              >
                Cancel
              </button>
            </React.Fragment>
          )}
        </div>
        <div className='user-container'>
          {getUser(user_id)}

          <div className='user-container'>
            <div className='user-image-container'>
              <img src={this.state.image_url} alt='User Imagery' />
            </div>
            <div className='user-info-container'>
              <p>Username: {this.state.username}</p>
              <p>First Name: {this.state.first_name}</p>
              <p>Last Name: {this.state.last_name}</p>
              <p>Email: {this.state.email}</p>
              {this.props.user.address && (
                <div className='user-address-container'>
                  <span />
                  <p>
                    {this.state.address_two
                      ? `Street Address - Line 1: ${this.state.address_one}`
                      : `Street Address: ${this.state.address_one}`}
                  </p>
                  <p>
                    {this.state.address_two
                      ? `Street Address - Line 2: ${this.state.address_two}`
                      : `${this.state.address_two}`}
                  </p>
                  <p>City: {this.state.city}</p>
                  <p>State: {this.state.state}</p>
                  <p>Zipcode: {this.state.zipcode}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div>**Please Log In**</div>
    );
  }
}
const mapStateToProp = state => {
  return {
    user: state.user
  };
};

export default connect(mapStateToProp, { setUser })(UserProfile);
