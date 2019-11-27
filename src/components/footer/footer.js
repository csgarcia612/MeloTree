import React, { Component } from 'react';
import './footer.scss';
import facebookIcon from '../../images/facebook.png';
import twitterIcon from '../../images/twitter.png';
import instagramIcon from '../../images/instagram.png';
import youtubeIcon from '../../images/youtube.png';

class Footer extends Component {
	constructor() {
		super();
		this.state = {};
	}

	render() {
		return (
			<div className='footer-container'>
				<div className='footer-slogan-container'>
					<p className='footer-slogan'>Search This Tree, For a Melody</p>
				</div>
				<div className='social-icons-container'>
					<a href='https://www.facebook.com/'>
						<img
							className='social-media-icon'
							src={facebookIcon}
							alt='Facebook Icon'
						/>
					</a>
					<a href='https://twitter.com/'>
						<img
							className='social-media-icon'
							src={twitterIcon}
							alt='Twitter Icon'
						/>
					</a>
					<a href='https://www.instagram.com/'>
						<img
							className='social-media-icon'
							src={instagramIcon}
							alt='Instagram Icon'
						/>
					</a>
					<a href='https://www.youtube.com/'>
						<img
							className='social-media-icon'
							src={youtubeIcon}
							alt='YouTube Icon'
						/>
					</a>
				</div>
			</div>
		);
	}
}

export default Footer;
