import React, { Component } from 'react';
import { connect } from 'react-redux';
import './search_results.scss';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { setEvents } from '../../dux/reducer';
import SingleResult from '../single_search_result/single_result';

class search_results extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      currentCity: '',
      showFilters: false,
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: 'T23:59:59',
      radius: '25',
      genreName: 'All Genres',
      genreId:
        'KnvZfZ7vAvv,KnvZfZ7vAve,KnvZfZ7vAvd,KnvZfZ7vAvA,KnvZfZ7vAvk,KnvZfZ7vAeJ,KnvZfZ7vAv6,KnvZfZ7vAvF,KnvZfZ7vAva,KnvZfZ7vAv1,KnvZfZ7vAvJ,KnvZfZ7vAvE,KnvZfZ7vAJ6,KnvZfZ7vAvI,KnvZfZ7vAvt,KnvZfZ7vAvn,KnvZfZ7vAvl,KnvZfZ7vAev,KnvZfZ7vAee,KnvZfZ7vAed,KnvZfZ7vAe7,KnvZfZ7vAeA,KnvZfZ7vAeF',
      currentPage: 0,
      totalPages: 0,
      searchInput: '',
      formatedCityName: '',
      filteredCities: [],
      showSuggestedCities: false,
      cursorPosition: 0,
      showWarningModal: false
    };
    this.setSearchInput = this.setSearchInput.bind(this);
    this.searchEvents = this.searchEvents.bind(this);
    this.changePage = this.changePage.bind(this);
    this.getCitySuggestions = this.getCitySuggestions.bind(this);
    this.updateSearchInput = this.updateSearchInput.bind(this);
    this.hoveredCity = this.hoveredCity.bind(this);
    this.selectCity = this.selectCity.bind(this);
    this.goToSearchResults = this.goToSearchResults.bind(this);
    this.updateFilters = this.updateFilters.bind(this);
    this.resetFilters = this.resetFilters.bind(this);
    this.toggleWarningModal = this.toggleWarningModal.bind(this);
    this.toggleFilters = this.toggleFilters.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
  }

  componentDidMount() {
    // console.log('***Search Results Props: ', this.props);

    // console.log('***window.sessionStorage : ', window.sessionStorage);

    this.setSearchInput();
  }

  componentDidUpdate() {
    const {
      currentCity,
      startDate,
      endDate,
      radius,
      genreName,
      genreId,
      currentPage,
      totalPages
    } = this.state;

    let resultsObj = {
      currentCity: `${currentCity}`,
      startDate: `${startDate}`,
      endDate: `${endDate}`,
      radius: `${radius}`,
      genreName: `${genreName}`,
      genreId: `${genreId}`,
      currentPage: `${currentPage}`,
      totalPages: `${totalPages}`
    };

    // console.log('***resultsObj : ', resultsObj);

    // console.log('***JSON-resultsObj : ', JSON.stringify(resultsObj));

    window.sessionStorage.setItem('stateInfo', JSON.stringify(resultsObj));

    // console.log('***window.sessionStorage : ', window.sessionStorage);
  }

  // componentWillUnmount() {
  //   const {
  //     currentCity,
  //     startDate,
  //     endDate,
  //     radius,
  //     genreName,
  //     genreId,
  //     currentPage,
  //     totalPages
  //   } = this.state;

  //   let resultsObj = {
  //     currentCity: `${currentCity}`,
  //     startDate: `${startDate}`,
  //     endDate: `${endDate}`,
  //     radius: `${radius}`,
  //     genreName: `${genreName}`,
  //     genreId: `${genreId}`,
  //     currentPage: `${currentPage}`,
  //     totalPages: `${totalPages}`
  //   };

  //   // console.log('***resultsObj : ', resultsObj);

  //   // console.log('***JSON-resultsObj : ', JSON.stringify(resultsObj));

  //   window.sessionStorage.setItem('stateInfo', JSON.stringify(resultsObj));

  //   console.log('***window.sessionStorage : ', window.sessionStorage);
  // }

  setSearchInput() {
    // console.log('***props.match.params : ', this.props.match.params);

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

    let today = new Date();

    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    if (month < 10) {
      month = '0' + month;
    }

    if (day < 10) {
      day = '0' + day;
    }

    if (hours < 10) {
      hours = '0' + hours;
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    // console.log(
    //   '***Current Date-Time : ',
    //   `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
    // );

    let currentDate = `${year}-${month}-${day}`;

    let currentTime = `T${hours}:${minutes}:${seconds}`;

    today.setDate(today.getDate() + 15);

    year = today.getFullYear();
    month = today.getMonth() + 1;
    day = today.getDate();

    if (month < 10) {
      month = '0' + month;
    }

    if (day < 10) {
      day = '0' + day;
    }

    // console.log('***Future Date-Time : ', `${year}-${month}-${day}T23:59:59`);

    let endDate = `${year}-${month}-${day}`;

    if (window.sessionStorage.length > 0) {
      let sessionStorageObj = JSON.parse(
        window.sessionStorage.getItem('stateInfo')
      );

      // console.log(
      //   '***setSearchInput - sessionStorage : ',
      //   JSON.parse(window.sessionStorage.getItem('stateInfo'))
      // );

      this.setState(
        {
          currentCity: sessionStorageObj.currentCity,
          startDate: sessionStorageObj.startDate,
          startTime: currentTime,
          endDate: sessionStorageObj.endDate,
          radius: sessionStorageObj.radius,
          genreName: sessionStorageObj.genreName,
          genreId: sessionStorageObj.genreId,
          searchInput: params.location,
          formatedCityName: urlCityName
        },
        // () => console.log('searchState-After--', this.state)

        () => this.searchEvents()
      );
      // } else if (
      //   window.sessionStorage.length === 0 &&
      //   this.props.location &&
      //   this.props.location.state
      // ) {
      //   console.log(
      //     '***setSearchInput - props.location.state : ',
      //     this.props.location.state
      //   );

      //   this.setState(
      //     {
      //       currentCity: this.props.location.state.currentCity,
      //       startDate: this.props.location.state.startDate,
      //       startTime: currentTime,
      //       endDate: this.props.location.state.endDate,
      //       radius: this.props.location.state.radius,
      //       genreName: this.props.location.state.genreName,
      //       genreId: this.props.location.state.genreId,
      //       searchInput: params.location,
      //       formatedCityName: urlCityName
      //     },
      //     // () => console.log('searchState-After--', this.state)

      //     () => this.searchEvents()
      //   );
    } else {
      // console.log('***setSearchInput - no props or sessionStorage : ');

      this.setState(
        {
          currentCity: params.location,
          startDate: currentDate,
          startTime: currentTime,
          endDate: endDate,
          searchInput: params.location,
          formatedCityName: urlCityName
        },
        // () => console.log('searchState-After--', this.state)

        () => this.searchEvents()
      );
    }
  }

  searchEvents() {
    const {
      startDate,
      startTime,
      endDate,
      endTime,
      radius,
      genreId,
      formatedCityName,
      currentPage
    } = this.state;

    // console.log('searchEvents-formattedCityName---', formatedCityName);

    formatedCityName &&
      axios
        .get(
          `https://app.ticketmaster.com/discovery/v2/events.json?apikey=eIMh2CGNhtUTSybN21TU3JRes1j9raV3&radius=${radius}&unit=miles&localStartEndDateTime=${startDate}${startTime},${endDate}${endTime}&includeDateRange=true&size=20&page=${currentPage}&sort=date,asc&city=${formatedCityName}&countryCode=US&classificationName=[music]&includeFamily=no&genreId=${genreId}`
        )
        .then(res => {
          // console.log('res.data in searchquery response', res.data);

          if (res.data.page.totalElements === 0) {
            this.props.setEvents(null);
          } else {
            this.props.setEvents(res.data);

            this.setState({
              currentPage: res.data.page.number,
              totalPages: res.data.page.totalPages
            });
          }
        })
        .catch(error => {
          // console.log('---error in search', error);
        });
  }

  changePage(action) {
    if (action === 'next') {
      let prevState = this.state;

      this.setState(
        {
          currentPage: prevState.currentPage + 1
        },
        () => {
          // console.log('***nextPage-btn : ', this.state.currentPage);
          this.searchEvents();
        }
      );
    } else if (action === 'prev') {
      let prevState = this.state;

      this.setState(
        {
          currentPage: prevState.currentPage - 1
        },
        () => {
          // console.log('***prevPage-btn : ', this.state.currentPage);
          this.searchEvents();
        }
      );
    }
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
      // console.log('***filteredCitiesArr: ', filteredCities);
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
    let validCharacters = /^[A-Z '.-]*$/gi;

    if (!searchInput || !validCharacters.test(searchInput)) {
      this.toggleWarningModal();
    } else {
      this.props.history.push(`/search/${this.state.searchInput}`);
      this.searchEvents();
    }
  }

  updateFilters(event) {
    // console.log('***Current Filter Values : ', {
    //   startDate: this.state.startDate,
    //   startTime: this.state.startTime,
    //   endDate: this.state.endDate,
    //   endTime: this.state.endTime,
    //   radius: this.state.radius,
    //   genreName: this.state.genreName,
    //   genreId: this.state.genreId
    // });

    let genreCode = '';

    if (event.target.name === 'genreName') {
      if (event.target.value === 'All Genres') {
        genreCode =
          'KnvZfZ7vAvv,KnvZfZ7vAve,KnvZfZ7vAvd,KnvZfZ7vAvA,KnvZfZ7vAvk,KnvZfZ7vAeJ,KnvZfZ7vAv6,KnvZfZ7vAvF,KnvZfZ7vAva,KnvZfZ7vAv1,KnvZfZ7vAvJ,KnvZfZ7vAvE,KnvZfZ7vAJ6,KnvZfZ7vAvI,KnvZfZ7vAvt,KnvZfZ7vAvn,KnvZfZ7vAvl,KnvZfZ7vAev,KnvZfZ7vAee,KnvZfZ7vAed,KnvZfZ7vAe7,KnvZfZ7vAeA,KnvZfZ7vAeF';
      } else if (event.target.value === 'Alternative') {
        genreCode = 'KnvZfZ7vAvv';
      } else if (event.target.value === 'Ballads/Romantic') {
        genreCode = 'KnvZfZ7vAve';
      } else if (event.target.value === 'Blues') {
        genreCode = 'KnvZfZ7vAvd';
      } else if (event.target.value === 'Chanson Francaise') {
        genreCode = 'KnvZfZ7vAvA';
      } else if (event.target.value === "Children's Music") {
        genreCode = 'KnvZfZ7vAvk';
      } else if (event.target.value === 'Classical') {
        genreCode = 'KnvZfZ7vAeJ';
      } else if (event.target.value === 'Country') {
        genreCode = 'KnvZfZ7vAv6';
      } else if (event.target.value === 'Dance/Electronic') {
        genreCode = 'KnvZfZ7vAvF';
      } else if (event.target.value === 'Folk') {
        genreCode = 'KnvZfZ7vAva';
      } else if (event.target.value === 'Hip-Hop/Rap') {
        genreCode = 'KnvZfZ7vAv1';
      } else if (event.target.value === 'Holiday') {
        genreCode = 'KnvZfZ7vAvJ';
      } else if (event.target.value === 'Jazz') {
        genreCode = 'KnvZfZ7vAvE';
      } else if (event.target.value === 'Latin') {
        genreCode = 'KnvZfZ7vAJ6';
      } else if (event.target.value === 'Medieval/Renaissance') {
        genreCode = 'KnvZfZ7vAvI';
      } else if (event.target.value === 'Metal') {
        genreCode = 'KnvZfZ7vAvt';
      } else if (event.target.value === 'New Age') {
        genreCode = 'KnvZfZ7vAvn';
      } else if (event.target.value === 'Other') {
        genreCode = 'KnvZfZ7vAvl';
      } else if (event.target.value === 'Pop') {
        genreCode = 'KnvZfZ7vAev';
      } else if (event.target.value === 'R&B') {
        genreCode = 'KnvZfZ7vAee';
      } else if (event.target.value === 'Reggae') {
        genreCode = 'KnvZfZ7vAed';
      } else if (event.target.value === 'Religious') {
        genreCode = 'KnvZfZ7vAe7';
      } else if (event.target.value === 'Rock') {
        genreCode = 'KnvZfZ7vAeA';
      } else if (event.target.value === 'World') {
        genreCode = 'KnvZfZ7vAeF';
      }
    }

    let today = new Date();

    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    if (month < 10) {
      month = '0' + month;
    }

    if (day < 10) {
      day = '0' + day;
    }

    if (hours < 10) {
      hours = '0' + hours;
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    let currentDate = `${year}-${month}-${day}`;

    let currentTime = `T${hours}:${minutes}:${seconds}`;

    if (event.target.name === 'startDate') {
      if (event.target.value !== currentDate) {
        currentTime = 'T00:00:00';
      }
    }

    this.setState(
      {
        [event.target.name]: event.target.value,
        startTime: currentTime,
        genreId: genreCode
      }
      // ,
      // () => {
      //   console.log('***New Filter Values : ', {
      //     startDate: this.state.startDate,
      //     startTime: this.state.startTime,
      //     endDate: this.state.endDate,
      //     endTime: this.state.endTime,
      //     radius: this.state.radius,
      //     genreName: this.state.genreName,
      //     genreId: this.state.genreId
      //   });
      // }
    );
  }

  resetFilters() {
    // console.log('***Current Filter Values : ', {
    //   startDate: this.state.startDate,
    //   startTime: this.state.startTime,
    //   endDate: this.state.endDate,
    //   endTime: this.state.endTime,
    //   radius: this.state.radius,
    //   genreName: this.state.genreName,
    //   genreId: this.state.genreId
    // });

    let today = new Date();

    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    if (month < 10) {
      month = '0' + month;
    }

    if (day < 10) {
      day = '0' + day;
    }

    if (hours < 10) {
      hours = '0' + hours;
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    // console.log(
    //   '***Current Date-Time : ',
    //   `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
    // );

    let currentDate = `${year}-${month}-${day}`;

    let currentTime = `T${hours}:${minutes}:${seconds}`;

    today.setDate(today.getDate() + 15);

    year = today.getFullYear();
    month = today.getMonth() + 1;
    day = today.getDate();

    if (month < 10) {
      month = '0' + month;
    }

    if (day < 10) {
      day = '0' + day;
    }

    // console.log('***Future Date-Time : ', `${year}-${month}-${day}T23:59:59`);

    let endDate = `${year}-${month}-${day}`;

    this.setState(
      {
        startDate: currentDate,
        startTime: currentTime,
        endDate: endDate,
        radius: 25,
        genreName: 'All Genres',
        genreId:
          'KnvZfZ7vAvv,KnvZfZ7vAve,KnvZfZ7vAvd,KnvZfZ7vAvA,KnvZfZ7vAvk,KnvZfZ7vAeJ,KnvZfZ7vAv6,KnvZfZ7vAvF,KnvZfZ7vAva,KnvZfZ7vAv1,KnvZfZ7vAvJ,KnvZfZ7vAvE,KnvZfZ7vAJ6,KnvZfZ7vAvI,KnvZfZ7vAvt,KnvZfZ7vAvn,KnvZfZ7vAvl,KnvZfZ7vAev,KnvZfZ7vAee,KnvZfZ7vAed,KnvZfZ7vAe7,KnvZfZ7vAeA,KnvZfZ7vAeF'
      }
      // ,
      // () => {
      //   console.log('***New Filter Values : ', {
      //     startDate: this.state.startDate,
      //     startTime: this.state.startTime,
      //     endDate: this.state.endDate,
      //     endTime: this.state.endTime,
      //     radius: this.state.radius,
      //     genreName: this.state.genreName,
      //     genreId: this.state.genreId
      //   });
      // }
    );
  }

  toggleWarningModal() {
    this.setState({
      showWarningModal: !this.state.showWarningModal
    });
  }

  toggleFilters() {
    // console.log('***Show Filters : ', this.state.showFilters);

    this.setState({
      showFilters: !this.state.showFilters
    });
  }

  toggleSearch() {
    this.setState({
      searchInput: this.state.currentCity,
      showSuggestedCities: false
    });
  }

  render() {
    const {
      currentCity,
      showFilters,
      startDate,
      endDate,
      radius,
      genreName,
      genreId,
      currentPage,
      totalPages,
      searchInput,
      filteredCities,
      showSuggestedCities,
      cursorPosition,
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

    const eventsList =
      this.props.events &&
      this.props.events._embedded.events.map(e => {
        // console.log('***Events : ', this.props.events);

        return (
          <NavLink
            to={{
              pathname: `/event/${e.id}`,
              state: {
                currentCity: `${currentCity}`,
                startDate: `${startDate}`,
                endDate: `${endDate}`,
                radius: `${radius}`,
                genreName: `${genreName}`,
                genreId: `${genreId}`
              }
            }}
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
            <div
              className={
                showSuggestedCities
                  ? 'showSearchingBackground'
                  : 'hideSearchingBackground'
              }
              onClick={this.toggleSearch}
            ></div>
            <div className='search-main-container'>
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
            <div className='filters-main-container'>
              <div className={'single-filter-container'}>
                <div className='filter-title-container'>
                  <p className='filter-title'>Start Date</p>
                </div>
                <span className='filterSpan' />
                <div className='filter-container'>
                  <input
                    name='startDate'
                    type='date'
                    required='required'
                    value={startDate}
                    min={startDate}
                    onChange={e => this.updateFilters(e)}
                  />
                </div>
              </div>
              <div className={'single-filter-container'}>
                <div className='filter-title-container'>
                  <p className='filter-title'>End Date</p>
                </div>
                <span className='filterSpan' />
                <div className='filter-container'>
                  <input
                    name='endDate'
                    type='date'
                    required='required'
                    value={endDate}
                    min={startDate}
                    onChange={e => this.updateFilters(e)}
                  />
                </div>
              </div>
              <div className={'single-filter-container'}>
                <div className='filter-title-container'>
                  <p className='filter-title'>Distance (Miles)</p>
                </div>
                <span className='filterSpan' />
                <div className='filter-container'>
                  <select
                    name='radius'
                    value={radius}
                    onChange={e => this.updateFilters(e)}
                  >
                    <option value='5'>5</option>
                    <option value='10'>10</option>
                    <option value='15'>15</option>
                    <option value='25'>25</option>
                    <option value='50'>50</option>
                    <option value='75'>75</option>
                    <option value='100'>100</option>
                  </select>
                </div>
              </div>
              <div className={'single-filter-container'}>
                <div className='filter-title-container'>
                  <p className='filter-title'>Genre</p>
                </div>
                <span className='filterSpan' />
                <div className='filter-container'>
                  <select
                    name='genreName'
                    value={genreName}
                    onChange={e => this.updateFilters(e)}
                  >
                    <option value='All Genres'>All Genres</option>
                    <option value='Alternative'>Alternative</option>
                    <option value='Ballads / Romantic'>
                      Ballads / Romantic
                    </option>
                    <option value='Blues'>Blues</option>
                    <option value='Chanson Francaise'>Chanson Francaise</option>
                    <option value="Children's Music">Children's Music</option>
                    <option value='Classical'>Classical</option>
                    <option value='Country'>Country</option>
                    <option value='Dance / Electronic'>
                      Dance / Electronic
                    </option>
                    <option value='Folk'>Folk</option>
                    <option value='Hip-Hop / Rap'>Hip-Hop / Rap</option>
                    <option value='Holiday'>Holiday</option>
                    <option value='Jazz'>Jazz</option>
                    <option value='Latin'>Latin</option>
                    <option value='Medieval / Renaissance'>
                      Medieval / Renaissance
                    </option>
                    <option value='Metal'>Metal</option>
                    <option value='New Age'>New Age</option>
                    <option value='Other'>Other</option>
                    <option value='Pop'>Pop</option>
                    <option value='R&B'>R&B</option>
                    <option value='Reggae'>Reggae</option>
                    <option value='Religious'>Religious</option>
                    <option value='Rock'>Rock</option>
                    <option value='World'>World</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={'filter-results-btn-container'}>
              <button className='reset-filters-btn' onClick={this.resetFilters}>
                Reset Filters
              </button>
              <button
                className='filter-results-btn'
                onClick={this.searchEvents}
              >
                Filter Events
              </button>
            </div>
          </div>
        </div>
        <div className='events-list-main-container'>
          <div className='events-list'>
            {eventsList ? (
              eventsList
            ) : (
              <p className='no-results-msg'>No Events Found</p>
            )}
          </div>
          <div className='page-btns-container'>
            <button
              className='page-btn'
              disabled={currentPage === 0 ? true : false}
              onClick={() => this.changePage('prev')}
            >
              Previous
            </button>
            <button
              className='page-btn'
              disabled={currentPage === totalPages - 1 ? true : false}
              onClick={() => this.changePage('next')}
            >
              Next
            </button>
          </div>
        </div>
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

export default connect(mapStateToProps, { setEvents })(search_results);
