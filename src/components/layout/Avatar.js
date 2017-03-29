import React from "react";
import {Link} from "react-router-dom";
import FlatButton from "material-ui/FlatButton";
import Popover, {PopoverAnimationVertical} from "material-ui/Popover";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";

export default class Avatar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
    };
  }

  handleTouchTap = (event) => {
    event.preventDefault();

    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  deleteUserData() {
    localStorage.removeItem("permissions");
    localStorage.removeItem("access-token");
  }

  render() {
    return (
      <div style={{marginTop: 5}}>
        <FlatButton
          style={{color: "#fff"}}
          onTouchTap={this.handleTouchTap}
          label={localStorage.getItem('user-name')}/>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          animation={PopoverAnimationVertical}
          onRequestClose={this.handleRequestClose}
        >
          <Menu>
            <Link to="/">
              <MenuItem primaryText="Log out" onClick={() => {
                this.deleteUserData();
                this.handleRequestClose()
              }}/>
            </Link>
          </Menu>
        </Popover>
      </div>
    )
  }
}
