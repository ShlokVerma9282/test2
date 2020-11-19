import React from 'react';
import Spinner from './Spinner';
import { icon_profile_image, icon_like, icon_music_1, plus_button } from '../graphics';
import { Modal, Button } from 'react-bootstrap'


class ProfileScreen extends React.Component{

	constructor(props){
		super(props)
		this.state = {
			user: this.props.user,
			loading: true,
			sessions_loading: true,
			playlists_loading: true,
			likedSongs_loading: true,
			likedCollections_loading: true,
			profileUser: null,
			sessions: [],
			playlists: [],
			likedSongs: [],
			likedCollections: [],
			newCollectionName: "",
			showCreateCollectionModal: false
		}
		this.fetchUser().then(() => {
			this.fetchUserData()
		})
	}

	handleGoToCollection = (id, e) => {

		this.props.history.push('/main/collection/' + id)
	}

	handleCreateCollection = () => {
		if (this.state.newCollectionName.trim() !== ''){
			this.props.axiosWrapper.axiosGet('main/profile/createCollection/' + this.state.newCollectionName, (function(res, data){
				if (data.success){
					this.handleGoToCollection(data.data.collectionId);
				}
			}).bind(this), true)
		}
	}

	handleNewCollectionNameChange = (e) => {
		this.setState({
			newCollectionName: e.target.value
		})
	}

	showCreateCollectionModal = () => {
		this.setState({
			showCreateCollectionModal: true
		})
	}

	hideCreateCollectionModal = () => {
		this.setState({
			newCollectionName: "",
			showCreateCollectionModal: false
		})
	}

	fetchUser () {
		return this.props.axiosWrapper.axiosGet('/main/profile/' + this.props.match.params.userId, (function(res, data) {
			if (data.success) {
				this.setState({
					profileUser: data.data.user,
					loading: false
				})
			}
		}).bind(this), true)
	}

	fetchUserData = () => {
		if (this.state.profileUser && this.state.profileUser.sessions.length > 0) {
			this.props.axiosWrapper.axiosGet('/main/profile/' + this.props.match.params.userId + '/sessions', (function(res, data) {
				if (data.success) {
					this.setState({
						sessions: data.data.sessions,
						sessions_loading: false
					})
				}
			}).bind(this), true)
		}

		if (this.state.profileUser && this.state.profileUser.playlists.length > 0) {
			this.props.axiosWrapper.axiosGet('/main/profile/' + this.props.match.params.userId + '/playlists', (function(res, data) {
				if (data.success) {
					this.setState({
						playlists: data.data.playlists,
						playlists_loading: false
					})
				}
			}).bind(this), true)
		}

		if (this.state.profileUser && this.state.profileUser.likedSongs.length > 0) {
			Promise.all(this.state.profileUser.likedSongs.map((songId) => {
				return this.props.fetchVideoById(songId, true)
			})).then((likedSongs) => {
				this.setState({
					likedSongs: likedSongs,
					likedSongs_loading: false
				})
			})
		}

		if (this.state.profileUser && this.state.profileUser.likedCollections.length > 0) {
			this.props.axiosWrapper.axiosGet('/main/profile/' + this.props.match.params.userId + '/likedCollections', (function(res, data) {
				if (data.success) {
					this.setState({
						likedCollections: data.data.likedCollections,
						likedCollections_loading: false
					})
				}
			}).bind(this), true)
		}
	}

    render(){
		if (this.state.loading) {
			return <Spinner/>
		}
		else {
			return(
				<div style={{fontFamily: 'BalsamiqSans', padding:'1em'}}>
					<Modal show={this.state.showCreateCollectionModal}>
							<Modal.Header onHide={this.hideCreateCollectionModal} closeButton>
								<Modal.Title>Create A New Playlist</Modal.Title>
							</Modal.Header>
							<Modal.Body>
								<p>Playlist Name:</p>
								<input value={this.state.newCollectionName} onChange={this.handleNewCollectionNameChange}></input>
							</Modal.Body>
							<Modal.Footer>
								<Button variant="secondary" onClick={this.hideCreateCollectionModal}>Close</Button>
								<Button variant="primary" onClick={this.handleCreateCollection}>Create</Button>
							</Modal.Footer>
					</Modal>
					<div id='profile-screen-top-container' className='row'>
						<div className='col-sm-1.3' style={{display:'flex', padding:'1em'}}>
							<div id='container' style={{position:'relative'}}>
									<img id="user-profile-image" src={this.state.profileUser.image ? this.state.profileUser.image : icon_profile_image} style={{width: '208px'}}/>
							</div>
						</div>
						<div className='col'>
							<div className='body-text color-contrasted'>PROFILE</div>
							<div id='profile-screen-username' className='color-contrasted'>
								{this.state.profileUser.username}
							</div>
							<div id='profile-screen-biography' className='body-text color-contrasted' rows='5' cols='35'>{this.state.profileUser.biography}</div>
							<div id='profile-screen-summary' className='row'>
								<div id='profile-screen-summary-text' className='body-text color-contrasted'>
									{this.state.profileUser.sessions.length} Session(s) ⋅  
									{" " + this.state.profileUser.playlists.length} Playlist(s) ⋅  
									{" " + this.state.profileUser.likedSongs.length} Liked Song(s) ⋅  
									{" " + this.state.profileUser.likedCollections.length} Liked Collection(s)
								</div>
							</div>
						</div>
					</div>
					<div id='profile-screen-bottom-container'>
					{ this.state.profileUser.sessions !== undefined && this.state.profileUser.sessions.length > 0 ?
							<div>	
								<div className='row' style={{padding:'1em'}}>
									<div style={{color: 'white', fontSize:'35px'}}>
										{this.state.profileUser.username}'s Sessions
									</div>
								</div>
								<div className='row' style={{padding:'1em'}}>
									<div className='card-deck profile-screen-category-container'>
										{
											this.state.sessions_loading ? 
											<Spinner/> :
											this.state.sessions.map(session => 
												<div className='card profile-screen-category-item-card'>
													<img className="card-img-top profile-screen-category-item-card-image" src={session.image}/>
													<div className="card-body profile-screen-category-item-card-text-container" style={{textAlign:'center'}}>
														<h1 className="card-title profile-screen-category-item-card-name title">{session.name}</h1>
														<p className="body-text profile-screen-category-item-card-creator body-text">{session.hostName}</p>
														<div className="profile-screen-category-item-card-likes">{session.likes} <img src={icon_like} className='profile-screen-category-item-card-likes-icon'/></div>
														<div className="profile-screen-category-item-card-streams">{session.streams} <img src={icon_music_1} className='profile-screen-category-item-card-streams-icon'/></div>
													</div>
												</div>
												)
										}
									</div>
								</div>
							</div> :
							<div></div>
					}
					<div>	
						<div className='row' style={{padding:'1em'}}>
							<div style={{color: 'white', fontSize:'35px'}}>
								{this.state.profileUser.username}'s Playlists
							</div>
						</div>
						<div className='row' style={{padding:'1em'}}>
							<div className='card-deck profile-screen-category-container'>
								{
									this.state.playlists_loading ?
									<Spinner/> :
									this.state.playlists.map((playlist, ind) => 
										<div className='card profile-screen-category-item-card' key={ind} onClick={this.handleGoToCollection.bind(this, playlist._id)}>
											<img className="card-img-top profile-screen-category-item-card-image" src={playlist.image}/>
											<div className="card-body profile-screen-category-item-card-text-container" style={{textAlign:'center'}}>
												<h1 className="card-title profile-screen-category-item-card-name title">{playlist.name}</h1>
												<p className="profile-screen-category-item-card-creator body-text">{playlist.user}</p>
												<p className="profile-screen-category-item-card-likes">{playlist.likes} <img src={icon_like} className='profile-screen-category-item-card-likes-icon'/></p>
											</div>
										</div>
										)
								}
								{
									this.state.user._id === this.state.profileUser._id ? //Viewing own profile
									<div className='card profile-screen-category-item-card' onClick={this.showCreateCollectionModal}>
										<img className="card-img-top profile-screen-category-item-card-image" src={plus_button}/>
									</div> :
									<div></div>
								}
							</div>
						</div>
					</div>
						{ this.state.profileUser.likedSongs !== undefined && this.state.profileUser.likedSongs.length > 0 ?
							<div>
								<div className='row' style={{padding:'1em'}}>
									<div style={{color: 'white', fontSize:'35px'}}>
										{this.state.profileUser.username}'s Liked Songs
									</div>
								</div>
								<div className='row' style={{padding:'1em'}}>
									<div className='card-deck profile-screen-category-container'>
										{
											this.state.likedSongs_loading ? 
											<Spinner/> :
											this.state.likedSongs.map(song => 
												<div className='card profile-screen-category-item-card'>
													<img className="card-img-top profile-screen-category-item-card-image" src={song.image}/>
													<div className="card-body profile-screen-category-item-card-text-container" style={{textAlign:'center'}}>
														<h1 className="card-title profile-screen-category-item-card-name title">{song.name}</h1>
														<p className="profile-screen-category-item-card-creator body-text">{song.creator}</p>
														<p className="profile-screen-category-item-card-likes">{song.likes} <img src={icon_like} className='profile-screen-category-item-card-likes-icon'/></p>
													</div>
												</div>
												)
										}
									</div>
								</div>
							</div> : 
							<div></div>
						}
						{ this.state.profileUser.likedCollections !== undefined && this.state.profileUser.likedCollections.length > 0 ?
							<div>
								<div className='row' style={{padding:'1em'}}>
									<div style={{color: 'white', fontSize:'35px'}}>
										{this.state.profileUser.username}'s Liked Collections
									</div>
								</div>
								<div className='row' style={{padding:'1em'}}>
									<div className='card-deck profile-screen-category-container'>
										{
											this.state.likedSongs_loading ? 
											<Spinner/> :
											this.state.likedCollections.map(collection => 
												<div className='card profile-screen-category-item-card'>
													<img className="card-img-top profile-screen-category-item-card-image" src={collection.image}/>
													<div className="card-body profile-screen-category-item-card-text-container" style={{textAlign:'center'}}>
														<h1 className="card-title profile-screen-category-item-card-name title">{collection.name}</h1>
														<p className="profile-screen-category-item-card-creator body-text">{collection.user}</p>
														<p className="profile-screen-category-item-card-likes">{collection.likes} <img src={icon_like} className='profile-screen-category-item-card-likes-icon'/></p>
													</div>
												</div>
												)
										}
									</div>
								</div>
							</div> 
							: <div></div>
							
						}
                    		
					</div>

				</div>
			);
		}
	}
}
export default ProfileScreen;