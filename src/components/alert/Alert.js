import React from "react";
import Dialog from "material-ui/Dialog";

export default class GenericAlert extends React.Component {
  render() {
    return (
      <Dialog
        title={this.props.title}
        actions={this.props.children}
        modal={false}
        open={this.props.open}
        onRequestClose={this.props.exit}
        autoScrollBodyContent={true}
        actionsContainerStyle={{borderTop: "none"}}
        titleStyle={{borderBottom: "none"}}
      >
        {this.props.text}
      </Dialog>
    )
  }
}

GenericAlert.PropTypes = {
  title: React.PropTypes.string.isRequired,
  text: React.PropTypes.string.isRequired,
  open: React.PropTypes.bool.isRequired,
  exit: React.PropTypes.func.isRequired,
};
