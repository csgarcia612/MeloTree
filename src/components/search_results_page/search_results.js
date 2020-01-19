import React, { Component } from 'react';
import { connect } from 'react-redux';
import './search_results.scss';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { setEvents, setCity, getCities } from '../../dux/reducer';
import SingleResult from '../single_search_result/single_result';
// import arrow from './icons8-sort-down-24.png';

class search_results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      city: this.props.city,
      showFilters: true,
      startDateTime: null,
      endDateTime: null,
      radius: 50,
      genreId:
        'KnvZfZ7vAvv,KnvZfZ7vAve,KnvZfZ7vAvd,KnvZfZ7vAvA,KnvZfZ7vAvk,KnvZfZ7vAeJ,KnvZfZ7vAv6,KnvZfZ7vAvF,KnvZfZ7vAva,KnvZfZ7vAv1,KnvZfZ7vAvJ,KnvZfZ7vAvE,KnvZfZ7vAvI,KnvZfZ7vAvt,KnvZfZ7vAvn,KnvZfZ7vAvl,KnvZfZ7vAev,KnvZfZ7vAee,KnvZfZ7vAed,KnvZfZ7vAe7,KnvZfZ7vAeA,KnvZfZ7vAeF',
      filteredLocations: null,
      searchInput: '',
      formatedCityName: '',
      filteredCities: [],
      showSuggestedCities: false,
      showWarningModal: false
    };
    this.setSearchInput = this.setSearchInput.bind(this);
    this.searchEvents = this.searchEvents.bind(this);
    this.getCitySuggestions = this.getCitySuggestions.bind(this);
    // this.goToSearchResults = this.goToSearchResults.bind(this);
    this.updateSearchInput = this.updateSearchInput.bind(this);
    this.hoveredCity = this.hoveredCity.bind(this);
    this.selectCity = this.selectCity.bind(this);
    this.toggleWarningModal = this.toggleWarningModal.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
  }

  componentDidMount() {
    this.setSearchInput();
  }

  setSearchInput() {
    const { params } = this.props.match;

    // console.log('params.location--', params.location);
    // console.log('searchState-Before--', this.state);

    let urlCityName = params.location
      .toLowerCase()
      .replace(/[ ]/g, '%20')
      .replace(/[.]/g, '%2E')
      .replace(/[-]/g, '%2D')
      .replace(/[']/g, '%27');

    // console.log('urlCityName--', urlCityName);

    this.setState(
      {
        searchInput: params.location,
        formatedCityName: urlCityName
      },
      // () => console.log('searchState-After--', this.state)
      () => this.searchEvents()
    );
  }

  searchEvents() {
    const { radius, formatedCityName } = this.state;
    // console.log('searchEvents-formattedCityName---', formatedCityName);
    formatedCityName &&
      axios
        .get(
          `https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=eIMh2CGNhtUTSybN21TU3JRes1j9raV3&radius=${radius}&sort=date,asc&classificationName=[music]&unit=miles&city=${formatedCityName}`
        )
        .then(res => {
          // console.log('res.data in searchquery response', res.data);
          if (res.data.page.totalElements === 0) {
            this.props.setEvents(null);
          } else {
            this.props.setEvents(res.data);
          }
        })
        .catch(error => {
          // console.log('---error in search', error);
        });
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

  toggleWarningModal() {
    this.setState({
      showWarningModal: !this.state.showWarningModal
    });
  }

  toggleFilters() {
    console.log('***Show Filters : ', this.state.showFilters);

    this.setState({
      showFilters: !this.state.showFilters
    });
  }

  render() {
    const {
      filteredCities,
      searchInput,
      cursorPosition,
      showSuggestedCities,
      showWarningModal,
      showFilters
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

    const eventsList =
      this.props.events &&
      this.props.events._embedded.events.map(e => {
        // console.log('***Events : ', this.props.events);

        return (
          <NavLink
            to={`/event/${e.id}`}
            key={e.id}
            event={e}
            className='event-details-navlink'
          >
            <SingleResult event={e} />
          </NavLink>
        );
      });
    // console.log("state", this.state);
    return (
      <div className='search-results-container'>
        {/* <div className='dropdown-menu'>
						{this.state.filteredLocations && searchDropDown}
					</div>
					<p className='search-filter-title'>Search Filters</p>
					<img
						src={arrow}
						alt='arrow'
						onClick={() => this.handleFilterToggle(initialState)}
						className={this.state.filterToggle ? 'buttonOn' : 'buttonOff'}
					/> */}
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
        <div className='search-filters-main-container'>
          <div className='search-filters-btn-container'>
            <div className='search-container'>
              <div className='search-box'>
                <input
                  className='home-search-input'
                  placeholder='Search by City or State'
                  onChange={this.updateSearchInput}
                  onKeyUp={this.getCitySuggestions}
                  value={searchInput}
                />
                <button
                  className='homeSearchBtn'
                  onClick={this.goToSearchResults}
                >
                  Search
                </button>
              </div>
              <div
                className={
                  showSuggestedCities
                    ? 'showCitiesDropDown'
                    : 'hideCitiesDropDown'
                }
              >
                <ul className='suggestionList'>{citySuggestions}</ul>
              </div>
            </div>
            <div className='filters-drpdwn-btn-container'>
              <button
                className='filters-drpdwn-btn'
                onClick={this.toggleFilters}
              >
                {showFilters ? 'CLOSE FILTERS' : 'OPEN FILTERS'}
              </button>
            </div>
          </div>
          <div
            className={
              showFilters ? 'show-search-filters' : 'hide-search-filters'
            }
          >
            <div className='filters-container'>
              <div className={'filter'}>
                <h2>Start Date</h2>
                {/* <input
              name='startDateTime'
              type='date'
              onChange={e => this.handleUserInput(e)}
            /> */}
              </div>
              <div className={'filter'}>
                <h2>End Date</h2>
                {/* <input
              name='endDateTime'
              type='date'
              onChange={e => this.handleUserInput(e)}
            /> */}
              </div>
              <div className={'filter'}>
                <h2>Distance</h2>
                {/* <input
              type='number'
              name='radius'
              min='10'
              max='100'
              step='10'
              value={this.state.radius}
              onChange={e => this.handleUserInput(e)}
            /> */}
              </div>
              <div className={'filter'}>
                <h2>Genre</h2>
                {/* <select name='genreId' onChange={e => this.handleUserInput(e)}>
              <option value='KnvZfZ7vAvv,KnvZfZ7vAve,KnvZfZ7vAvd,KnvZfZ7vAvA,KnvZfZ7vAvk,KnvZfZ7vAeJ,KnvZfZ7vAv6,KnvZfZ7vAvF,KnvZfZ7vAva,KnvZfZ7vAv1,KnvZfZ7vAvJ,KnvZfZ7vAvE,KnvZfZ7vAvI,KnvZfZ7vAvt,KnvZfZ7vAvn,KnvZfZ7vAvl,KnvZfZ7vAev,KnvZfZ7vAee,KnvZfZ7vAed,KnvZfZ7vAe7,KnvZfZ7vAeA,KnvZfZ7vAeF'>
                All Genres
              </option>
              <option value='KnvZfZ7vAvv'>Alternative</option>
              <option value='KnvZfZ7vAve'>Romantic</option>
              <option value='KnvZfZ7vAvd'>Blues</option>
              <option value='KnvZfZ7vAvA'>Chanson</option>
              <option value='KnvZfZ7vAvk'>Children</option>
              <option value='KnvZfZ7vAeJ'>Classical</option>
              <option value='KnvZfZ7vAv6'>Country</option>
              <option value='KnvZfZ7vAvF'>EDM</option>
              <option value='KnvZfZ7vAva'>Folk</option>
              <option value='KnvZfZ7vAv1'>Hip Hop/Rap</option>
              <option value='KnvZfZ7vAvJ'>Holiday</option>
              <option value='KnvZfZ7vAvE'>Jazz</option>
              <option value='KnvZfZ7vAvI'>Medieval</option>
              <option value='KnvZfZ7vAvt'>Metal</option>
              <option value='KnvZfZ7vAvn'>New Age</option>
              <option value='KnvZfZ7vAev'>Pop</option>
              <option value='KnvZfZ7vAee'>R & B</option>
              <option value='KnvZfZ7vAed'>Reggae</option>
              <option value='KnvZfZ7vAe7'>Religious</option>
              <option value='KnvZfZ7vAeA'>Rock</option>
              <option value='KnvZfZ7vAeF'>World</option>
            </select> */}
              </div>
              <div className={'filter'} onClick={this.handleSearch}>
                {/* <button onClick={() => this.setState({ ...initialState })}>
							Clear
						</button> */}
                {/* <button >Search</button> */}
                <p>Filter Results</p>
              </div>
            </div>
          </div>
        </div>
        <div className='events-list'>
          {eventsList ? eventsList : <h1>No Results</h1>}
        </div>
        {/* <img className={this.state.loading ? 'loading' : 'loaded'} src='https://media.giphy.com/media/7FfMfPHQr9romeeKtk/giphy.gif' alt='loading'/> */}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    events: state.events,
    city: state.city,
    citiesList: state.citiesList
  };
};

export default connect(mapStateToProps, { setEvents, setCity, getCities })(
  search_results
);
