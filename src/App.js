import React, { Component } from 'react';
import './App.scss';
import routes from './routes';
import Header from './components/header/header';
import Footer from './components/footer/footer';

const dotenv = require('dotenv');
dotenv.config();

class App extends Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    return (
      <div className='App'>
        <header>
          <Header />
        </header>
        <div className='site-contents-container'>{routes}</div>
        <footer>
          <Footer />
        </footer>
      </div>
    );
  }
}

export default App;
