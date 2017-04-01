import React from "react";
import MUIPopover, {PopoverAnimationVertical} from "material-ui/Popover";
import Menu from "material-ui/Menu";

export default class Popover extends React.Component {

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

  renderComponent = () => {
    return React.cloneElement(
      this.props.component,
      {
        onTouchTap: this.handleTouchTap,
      }
    );
  };

  renderChildren = () => {
    return this.props.children.map((item, index) => {
      return React.cloneElement(
        item,
        {
          key: index,
          onClick: () => {
            this.handleRequestClose();
            item.props.onClick();
          }
        }
      );
    });
  };

  render() {
    return (
      <div>
        {this.renderComponent()}
        <MUIPopover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          animation={PopoverAnimationVertical}
          onRequestClose={this.handleRequestClose}
          onClick={this.handleClick}
        >
          <Menu>
            {this.renderChildren()}
          </Menu>
        </MUIPopover>
      </div>
    )
  }
}

Popover.PropTypes = {
  component: React.PropTypes.element.isRequired
};
