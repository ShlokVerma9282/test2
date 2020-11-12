import React from 'react';
import { Link } from 'react-router-dom'
import { Dropdown, ButtonGroup, Image, Button } from 'react-bootstrap'
import { icon_profile_image } from '../graphics';

class AccountLink extends React.Component {

    render() {
        if (this.props.auth) {
            return (
                <Dropdown id="tab-component-account-link-container" as={ButtonGroup}>
                    <Button id="tab-component-account-link-button">
                        <Link to={"/main/profile/" + this.props.user._id}>
                            <Image id="tab-component-account-link-image" src={this.props.user.image ? this.props.user.image : icon_profile_image} />
                        </Link>
                    </Button>
                    <Dropdown.Toggle split id="tab-component-account-link-dropdown-button" />
                    <Dropdown.Menu id="tab-component-account-link-dropdown-menu">
                        <Dropdown.Item as={Link} to={"/main/profile/" + this.props.user._id}>
                            Profile
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to={"/main/settings"}>
                            Settings
                        </Dropdown.Item>
                        <Dropdown.Item as={Link} to={"/login"} onClick={this.props.handleLogOut}>
                            Log Out
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            )
        }
        else {
            return (
                <Link id="tab-component-login-button" className="subtitle color-accented" to="/login">Login/Sign-Up</Link>
            )
        }
    }

}

export default AccountLink;