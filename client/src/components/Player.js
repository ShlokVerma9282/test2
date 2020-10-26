import React from 'react';
import RangeSlider from 'react-bootstrap-range-slider';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { icon_play_2, icon_pause_3, icon_music_album_3, icon_previous, icon_next, icon_repeat_3, icon_repeat_1, icon_shuffle_arrows, icon_volume_up_1, icon_no_sound, icon_like } from '../graphics';
import { repeatStates } from '../const'

/*
var formData  = new FormData();

formData.append("format", "json");
formData.append("url", "http://soundcloud.com/forss/flickermood");

var html = fetch('http://soundcloud.com/oembed', {
    method: 'POST',
    body: formData
}).then(function (response) {
    return response.json();
}).then(function (res) {
  return res.html;
});
*/

class Player extends React.Component{

    state = {
        currentSong: {id: 'abcd1234', url: null, imageUrl: null, duration: 100, name: "Saturday Nights", artist: "Khalid", favorited: false},
        playing: false,
        progress: 0,
        volume: 50,
        mute: false,
        shuffle: false,
        repeat: repeatStates.OFF
    }

    seek = (value) => {
        this.setState({
            progress: value
        })
    }

    nextSong = () => {

    }

    previousSong = () => {

    }

    togglePlay = () => {
        this.setState({
            playing: !this.state.playing
        })
    }

    toggleRepeat = () => {
        this.setState({
            repeat: this.state.repeat === repeatStates.QUEUE ? repeatStates.OFF : this.state.repeat + 1
        })
    }

    toggleShuffle = () => {
        this.setState({
            shuffle: !this.state.shuffle
        })
    }

    setVolume = (value) => {
        this.setState({
            volume: value
        })
    }

    toggleMute = () => {
        this.setState({
            mute: !this.state.mute
        })
    }

    /*
        In practice, there will not be a favorited state, 
        and toggleFavorite will simply add/remove the song to/from the user's favorite songs list
    */
    toggleFavorite = () => {
        this.setState({
            favorited: !this.state.favorited
        })
    }

    getSongProgress = () => {
        var sec = this.state.progress % 60
        var min = Math.floor(this.state.progress / 60)
        return min + ":" + String(sec).padStart(2, '0');
    }

    getSongDuration = () => {
        var sec = this.state.currentSong.duration % 60
        var min = Math.floor(this.state.currentSong.duration / 60)
        return min + ":" + String(sec).padStart(2, '0');
    }

    getSongImage = () => {
        return this.state.currentSong.imageUrl ? this.state.currentSong.imageUrl : icon_music_album_3;
    }
    
    getSongURL = () => {
        return this.state.currentSong.url;
    }

    getSongName = () => {
        return this.state.currentSong.name;
    }

    getArtist = () => {
        return this.state.currentSong.artist;
    }

    getPlayButtonIcon = () => {
        return this.state.playing ? icon_pause_3 : icon_play_2; 
    }

    getRepeatButtonIcon = () => {
        return this.state.repeat === repeatStates.QUEUE ? icon_repeat_3 : icon_repeat_1;
    }
    
    getRepeatButtonIconClass = () => {
        return this.state.repeat === repeatStates.OFF ? 'player-control-button-icon' : 'player-control-button-icon-on';
    }

    getShuffleButtonIconClass = () => {
        return this.state.shuffle ? 'player-control-button-icon-on' : 'player-control-button-icon';
    }

    getMuteButtonIcon = () => {
        return this.state.mute ? icon_no_sound : icon_volume_up_1;
    }

    getFavoriteButtonIconClass = () => {
        return this.getFavorite() ? 'player-song-favorite-button-icon-on' : 'player-song-favorite-button-icon'
    }

    /*
        In practice, there will not be a favorited state, 
        and getFavorite will simply check if the song is in the user's favorite songs list
    */
    getFavorite = () => {
        return this.state.favorited;
    }

    render(){
        return(
            <Container id="player-container" fluid>
                <Row>
                    <Col id="player-display">
                        <Row>
                            <Col id="player-song-image-container">
                                <Image id="player-song-image" src={this.getSongImage()} thumbnail/>
                            </Col>
                            <Col id="player-song-title">
                                <div>{this.getSongName()}</div>
                                <div>{this.getArtist()}</div>
                                <Button id="player-song-favorite-button">
                                    <Image className={this.getFavoriteButtonIconClass()} src={icon_like} onClick={e => this.toggleFavorite()} roundedCircle/>
                                </Button>
                            </Col>
                        </Row>
                    </Col>
                    <Col id="player-controls">
                        <Row id="player-controls-main-container"> 
                            <Button className="player-control-button" onClick={e => this.toggleRepeat()}>
                                <Image className={this.getRepeatButtonIconClass()} src={this.getRepeatButtonIcon()} roundedCircle/>
                            </Button>
                            <Button className="player-control-button" onClick={e => this.previousSong()}>
                                <Image className="player-control-button-icon" src={icon_previous} roundedCircle/>
                            </Button>
                            <Button className="player-control-button" onClick={e => this.togglePlay()}>
                                <Image className="player-control-button-icon" src={this.getPlayButtonIcon()} roundedCircle/>
                            </Button>
                            <Button className="player-control-button" onClick={e => this.nextSong()}>
                                <Image className="player-control-button-icon" src={icon_next} roundedCircle/>
                            </Button>
                            <Button className="player-control-button" onClick={e => this.toggleShuffle()}>
                                <Image className={this.getShuffleButtonIconClass()} src={icon_shuffle_arrows} roundedCircle/>
                            </Button>
                        </Row>
                        <Row id="player-progress-bar-container">
                            <div className="player-progress-display">{this.getSongProgress()}</div>
                            <RangeSlider className="player-progress-bar" variant="dark" tooltip="off" value={this.state.progress} onChange={e => this.seek(e.target.value)} min={0} max={this.state.currentSong.duration}/>
                            <div className="player-progress-display">{this.getSongDuration()}</div>
                        </Row>
                    </Col>
                    <Col id="player-volume-container">
                        <Row>
                            <Button id="player-mute-button" className="player-control-button" onClick={e => this.toggleMute()}>
                                <Image id="player-mute-button-icon" src={this.getMuteButtonIcon()} roundedCircle/>
                            </Button>
                            <div id="player-volume-bar-container">
                                <RangeSlider className="player-volume-bar" variant="dark" tooltip="off" value={this.state.volume} onChange={e => this.setVolume(e.target.value)} min={0} max={100}/>
                            </div>
                        </Row>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Player;