import React, { Component } from 'react';
import axios from 'axios';
import './home.scss';
import musictree2 from '../../images/musictree2.png';

class home extends Component {
  constructor() {
    super();
    this.state = {
      cursorPosition: 0,
      formatedCityName: '',
      searchInput: '',
      filteredCities: [],
      showSuggestedCities: false,
      showWarningModal: false
    };
    this.getCitySuggestions = this.getCitySuggestions.bind(this);
    this.goToSearchResults = this.goToSearchResults.bind(this);
    this.updateSearchInput = this.updateSearchInput.bind(this);
    this.hoveredCity = this.hoveredCity.bind(this);
    this.selectCity = this.selectCity.bind(this);
    this.toggleWarningModal = this.toggleWarningModal.bind(this);
  }

  componentDidMount() {
    // console.log('***initial state: ', this.state);
  }

  getCitySuggestions(event) {
    // console.log('getCitySuggestions Event---', event);

    const { cursorPosition, filteredCities, showSuggestedCities } = this.state;

    let keyPressed = event.keyCode;

    // console.log('keyPressed---', keyPressed);

    // console.log('getCitySuggestions--localState: ', this.state);

    if (keyPressed === 13) {
      if (showSuggestedCities === true) {
        // console.log('target city---', filteredCities[cursorPosition]);
        let urlCityName = filteredCities[cursorPosition].name
          .toLowerCase()
          .replace(/[ ]/g, '%20')
          .replace(/[.]/g, '%2E')
          .replace(/[-]/g, '%2D')
          .replace(/[']/g, '%27');

        this.setState(
          {
            formatedCityName: urlCityName,
            searchInput: filteredCities[cursorPosition].name,
            showSuggestedCities: false
          }
          // console.log('getCitySuggestions--enterKey-localState: ', this.state)
        );
      } else {
        this.goToSearchResults();
      }
    } else if (keyPressed === 38 && cursorPosition > 0) {
      this.setState(prevState => ({
        cursorPosition: prevState.cursorPosition - 1
      }));
      // console.log('cursorPosition: ', cursorPosition);
      console.log('***filteredCitiesArr: ', filteredCities);
    } else if (
      keyPressed === 40 &&
      cursorPosition < filteredCities.length - 1
    ) {
      this.setState(prevState => ({
        cursorPosition: prevState.cursorPosition + 1
      }));
      // console.log('cursorPosition: ', cursorPosition);
    } else {
      if (this.state.searchInput.length >= 2) {
        // console.log(
        //   'getCitySuggestions--City List Axios Get Call: ',
        //   this.state
        // );

        axios
          .get(
            `https://www.ticketmaster.com/api/localization/locations/city?boundary.country=us&city=${this.state.formatedCityName}`
          )
          .then(res => {
            // console.log(
            //   'getCitySuggestions--ticketmasterCities--res.data',
            //   res.data.locations
            // );
            this.setState({
              filteredCities: res.data.locations,
              showSuggestedCities: true
            });
          });
      } else {
        this.setState({
          cursorPosition: 0,
          showSuggestedCities: false
        });
      }
    }
  }

  updateSearchInput(event) {
    let urlCityName = event.target.value
      .toLowerCase()
      .replace(/[ ]/g, '%20')
      .replace(/[.]/g, '%2E')
      .replace(/[-]/g, '%2D')
      .replace(/[']/g, '%27');

    // console.log('updateSearchInput--urlCityName: ', urlCityName);

    this.setState({
      formatedCityName: urlCityName,
      searchInput: event.target.value
    });
    // console.log('***searchInput:', this.state.searchInput);
    // ** Don't use Vanilla JavaScript here. The below code makes the event persist and without unmounting it continued to search the initial city name instead of searching the new input. The 'onKeyUp' attribute on the input field can fire the city drop down function instead of putting it on the 'event listener'. **
    // document.addEventListener('keyup', this.getCitySuggestions);
  }

  hoveredCity(i) {
    this.setState({
      cursorPosition: i
    });

    // console.log('newCursorPosition: ', this.state.cursorPosition);
  }

  selectCity(city, i) {
    let urlCityName = this.state.filteredCities[i].name
      .toLowerCase()
      .replace(/[ ]/g, '%20')
      .replace(/[.]/g, '%2E')
      .replace(/[-]/g, '%2D')
      .replace(/[']/g, '%27');

    this.setState({
      cursorPosition: i,
      formatedCityName: urlCityName,
      searchInput: city.name,
      showSuggestedCities: false
    });

    // console.log('newState: ', this.state);
  }

  goToSearchResults() {
    const { searchInput } = this.state;
    let validCharacters = /[-.'a-z ]/gi;

    if (!searchInput || !validCharacters.test(searchInput)) {
      this.toggleWarningModal();
    } else {
      this.props.history.push(`/search/${this.state.searchInput}`);
    }
  }

  toggleWarningModal() {
    this.setState({
      showWarningModal: !this.state.showWarningModal
    });
  }

  render() {
    const {
      filteredCities,
      searchInput,
      cursorPosition,
      showSuggestedCities,
      showWarningModal
    } = this.state;

    const citySuggestions = filteredCities.map((city, i, filteredCities) => {
      // console.log('mappedFilteredList---', city);

      return (
        <li
          key={`${city.dmaId}-${city.name}`}
          className={
            cursorPosition === i ? 'activeSuggestion' : 'inactiveSuggestion'
          }
          onClick={() => this.selectCity(city, i)}
          onMouseOver={() => this.hoveredCity(i)}
        >
          <p>{city.description}</p>
        </li>
      );
    });

    return (
      <div className='home-container'>
        <div
          className={showWarningModal ? 'showWarningModal' : 'hideWarningModal'}
          onClick={this.toggleWarningModal}
        >
          <div className='searchWarningModal'>
            <p className='searchWarning'>
              Please Enter A Valid City Name Before You Search For Events
            </p>
          </div>
        </div>
        <img src={musictree2} alt='Tree with music notes as leaves' />
        <div className='search-box'>
          <input
            className='home-search-input'
            placeholder='Search by City or State'
            onChange={this.updateSearchInput}
            onKeyUp={this.getCitySuggestions}
            value={searchInput}
          />
          <button className='homeSearchBtn' onClick={this.goToSearchResults}>
            Search
          </button>
        </div>
        <div
          className={
            showSuggestedCities ? 'showCitiesDropDown' : 'hideCitiesDropDown'
          }
        >
          <ul className='suggestionList'>{citySuggestions}</ul>
        </div>
      </div>
    );
  }
}

export default home;
