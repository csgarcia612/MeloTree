import React, { Component } from 'react';
import './about.scss';

export default class About extends Component {
	render() {
		return (
			<div className='about-page-container'>
				<div className='topper-container'>
					<p className='cohort-title'>DevMountain Phoenix - WPX9</p>
					<p className='group-title'>Group Project Contributors</p>
				</div>
				<div className='all-contributors-container'>
					<div className='contributor-container'>
						<div className='contributor-image-container'>
							<img
								className='contributor-image'
								src='https://avatars0.githubusercontent.com/u/44471899?s=460&v=4'
								alt='Contributor Headshot'
							/>
						</div>
						<div className='contributor-info-container'>
							<div className='name-container'>
								<p className='info'>Name: </p>
								<p className='contributor-info'>Chris Garcia </p>
							</div>
							<div className='name-container'>
								<p className='info'>Home City: </p>
								<p className='contributor-info'>Lisle, IL</p>
							</div>
							<div className='name-container'>
								<p className='info'>Email: </p>
								<p className='contributor-info'>
									webdeveloper@professionalbusiness.com
								</p>
							</div>
							<div className='contact-links-container'>
								<p className='info'>Contact Links:</p>
							</div>
						</div>
						<div className='tech-icons-container'>
							<p className='knowledge-info'>Programming Experience:</p>
						</div>
					</div>
					<div className='contributor-container'>
						<div className='contributor-image-container'>
							<img
								className='contributor-image'
								src='https://ca.slack-edge.com/T039C2PUY-UBQ0SK7UH-0716cbb972cc-72'
								alt='Contributor Headshot'
							/>
						</div>
						<div className='contributor-info-container'>
							<div className='name-container'>
								<p className='info'>Name: </p>
								<p className='contributor-info'>Kyle Boysen</p>
							</div>
							<div className='name-container'>
								<p className='info'>Home City: </p>
								<p className='contributor-info'>Phoenix, AZ</p>
							</div>
							<div className='name-container'>
								<p className='info'>Email: </p>
								<p className='contributor-info'>
									webdeveloper@professionalbusiness.com
								</p>
							</div>
							<div className='contact-links-container'>
								<p className='info'>Contact Links:</p>
							</div>
						</div>
						<div className='tech-icons-container'>
							<p className='knowledge-info'>Programming Experience:</p>
						</div>
					</div>
					<div className='contributor-container'>
						<div className='contributor-image-container'>
							<img
								className='contributor-image'
								src='https://www.ibts.org/wp-content/uploads/2017/08/iStock-476085198.jpg'
								alt='Contributor Headshot'
							/>
						</div>
						<div className='contributor-info-container'>
							<div className='name-container'>
								<p className='info'>Name: </p>
								<p className='contributor-info'>Huy Pham</p>
							</div>
							<div className='name-container'>
								<p className='info'>Home City: </p>
								<p className='contributor-info'>Avondale, AZ</p>
							</div>
							<div className='name-container'>
								<p className='info'>Email: </p>
								<p className='contributor-info'>
									webdeveloper@professionalbusiness.com
								</p>
							</div>
							<div className='contact-links-container'>
								<p className='info'>Contact Links:</p>
							</div>
						</div>
						<div className='tech-icons-container'>
							<p className='knowledge-info'>Programming Experience:</p>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
