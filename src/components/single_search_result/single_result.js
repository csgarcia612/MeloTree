import React, { Component } from 'react';
import './single_result.scss';

class SingleResult extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { event } = this.props;
    // console.log('event', event);
    let splitEventName = event.name
      .replace(/ [(]/g, ',')
      .split(' Plus ')
      .join(',')
      .split(' With ')
      .join(',')
      .split('Performing')
      .join(',')
      .split('-')
      .join(',')
      .split(':')
      .join(',')
      .split(',');

    let splitAttractionName =
      event._embedded.attractions &&
      event._embedded.attractions[0].name
        .replace(/ [(]/g, ',')
        .split(' Plus ')
        .join(',')
        .split(' With ')
        .join(',')
        .split('-')
        .join(',')
        .split(',');

    let splitVenueName =
      event._embedded.venues &&
      event._embedded.venues[0].name
        .split(' at ')
        .join(',')
        .split(',')
        .join(':');

    // console.log('venueName B4 : substring', splitVenueName);

    splitVenueName = splitVenueName.includes('presented by')
      ? splitVenueName.split(' presented by ')[0]
      : splitVenueName.indexOf(':')
      ? splitVenueName.substring(splitVenueName.indexOf(':') + 1)
      : splitVenueName;

    // console.log('splitVenue', splitVenueName);

    let mainArtistName = event._embedded.attractions
      ? splitAttractionName[0]
      : splitEventName[0];

    let splitDate = event.dates.start.localDate.split('-');

    let monthAbrvs = [
      null,
      'JAN',
      'FEB',
      'MAR',
      'APR',
      'MAY',
      'JUN',
      'JUL',
      'AUG',
      'SEP',
      'OCT',
      'NOV',
      'DEC'
    ];

    let highestWidthPicture =
      event &&
      Math.max.apply(
        Math,
        event.images.map(images => {
          // console.log("images.width", images.width);
          return images.width;
        })
      );

    let bestArtistPicture =
      event &&
      event.images.find(picture => {
        return picture.width === highestWidthPicture;
      });

    return (
      <div className='mini-event-container'>
        <div className='mini-event-image-container'>
          <img
            className='mini-event-image'
            src={event && bestArtistPicture.url}
            onError={e => {
              e.target.onerror = null;
              e.target.src = '../images/default_band_image.jpg';
            }}
            alt='Event Poster Graphic'
          />

          <div className='mini-event-info-container'>
            <div className='mini-event-name-container'>
              <p className='mini-event-name'>
                {mainArtistName && mainArtistName.length > 50
                  ? mainArtistName.substring(0, 50) + '...'
                  : mainArtistName}
              </p>
              <p className='mini-venue-name'>
                {event._embedded.venues[0] && splitVenueName > 33
                  ? splitVenueName.substring(0, 33) + '...'
                  : splitVenueName}
              </p>
            </div>
            <div className='mini-event-date-container'>
              <p className='mini-date-month'>
                {monthAbrvs[Number(splitDate[1])]}
              </p>
              <p className='mini-date-day'>{Number(splitDate[2])}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SingleResult;
