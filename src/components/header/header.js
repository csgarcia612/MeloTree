import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { setUser } from '../../dux/reducer';
import './header.scss';
import headerMiniTree from '../../images/musictreeheader.png';

class Header extends Component {
  constructor() {
    super();
    this.state = {
      showMenu: false,
      showLoginWarning: false
    };
    this.login = this.login.bind(this);
    this.loginWarning = this.loginWarning.bind(this);
    this.addClassFunOne = this.addClassFunOne.bind(this);
    this.clearSessionStorage = this.clearSessionStorage.bind(this);
  }

  componentDidMount() {
    axios.get('/api/user-data').then(res => {
      // console.log('res', res);
      this.props.setUser(res.data.user);
    });
  }

  login(req, res) {
    // console.log('***window.location.href : ', window.location.href);

    let refererURL = window.location.href;

    let redirectUri = encodeURIComponent(
      window.location.origin + '/auth/callback'
    );

    window.location = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/authorize?client_id=${process.env.REACT_APP_AUTH0_CLIENT_ID}&scope=openid%20profile%20email&redirect_uri=${redirectUri}&state=${refererURL}&response_type=code`;
  }

  logout = () => {
    axios.post('/api/logout').then(res => {
      this.props.setUser(null);

      this.props.history.push('/');

      if (window.sessionStorage.length > 0) {
        // console.log('***window.sessionStorage 1 : ', window.sessionStorage);

        window.sessionStorage.clear();

        // console.log('***window.sessionStorage 2 : ', window.sessionStorage);
      }
    });
  };

  loginWarning() {
    this.setState({
      showMenu: false,
      showLoginWarning: !this.state.showLoginWarning
    });
  }

  clearSessionStorage() {
    if (window.sessionStorage.length > 0) {
      // console.log('***window.sessionStorage 1 : ', window.sessionStorage);

      window.sessionStorage.clear();

      // console.log('***window.sessionStorage 2 : ', window.sessionStorage);
    }
  }

  addClassFunOne() {
    this.setState({
      showMenu: !this.state.showMenu
    });
  }

  render() {
    const { user } = this.props;
    return (
      <div className='main-header-container'>
        <div
          className={
            this.state.showMenu ? 'showMenuBackground' : 'hideMenuBackground'
          }
          onClick={this.addClassFunOne}
        ></div>
        <div
          className={
            this.state.showLoginWarning
              ? 'showLoginWarning'
              : 'hideLoginWarning'
          }
          onClick={this.loginWarning}
        >
          <div className='loginWarningContainer'>
            <p className='loginWarning'>Return To Search Results Page</p>
            <span className='loginWarningSpan' />
            <p className='loginWarning'>Then Login</p>
          </div>
        </div>

        <div className='header-container'>
          <div className='header-logo-container'>
            <img
              className='header-logo'
              src={headerMiniTree}
              alt='Tree with music notes as leaves'
            />
            <p className='header-name'>MeloTree</p>
          </div>
          <div
            className={this.state.showMenu ? 'menuOne clickMenuOne' : 'menuOne'}
            onClick={this.addClassFunOne}
          >
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <div
            className={
              this.state.showMenu
                ? 'show-menu-container'
                : 'hide-menu-container'
            }
          >
            {user ? (
              <>
                <ul>
                  <li>
                    <p>Welcome</p>
                  </li>
                  <li>
                    <p>{user.first_name}</p>
                  </li>
                  <li>
                    <span />
                  </li>
                  <li>
                    <a href='/' onClick={this.clearSessionStorage}>
                      Home
                    </a>
                  </li>
                  <li>
                    <a href='/profile' onClick={this.clearSessionStorage}>
                      Profile
                    </a>
                  </li>
                  {/* <li>
									<a href='/contact'>Contact</a>
								</li> */}
                  <li>
                    <a href='/about' onClick={this.clearSessionStorage}>
                      About
                    </a>
                  </li>
                </ul>
                <div className='log-btn-container'>
                  <button className='logout-button' onClick={this.logout}>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <ul>
                  <li>
                    <a href='/' onClick={this.clearSessionStorage}>
                      Home
                    </a>
                  </li>
                  {/* <li>
                    <a href='/contact'>Contact</a>
                  </li> */}
                  <li>
                    <a href='/about' onClick={this.clearSessionStorage}>
                      About
                    </a>
                  </li>
                </ul>
                <div className='log-btn-container'>
                  <button className='login-button' onClick={this.login}>
                    {/* <button
                    className='login-button'
                    onClick={
                      window.location.pathname.includes('event')
                        ? this.loginWarning
                        : this.login
                    }
                  > */}
                    Login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
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

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
