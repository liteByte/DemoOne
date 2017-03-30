import React from "react";

const unauthorizedPath = "/";

export default class RestrictedComponent extends React.Component {

  constructor(props) {
    super(props);

    this.roles = JSON.parse(localStorage.getItem("permissions"));
  }

  componentWillMount() {
    if (this.isAuthorized() === false)
      this.props.navigate(unauthorizedPath);
  }

  isAuthorized() {
    return RestrictedComponent.isAuthorized(this.roles, this.props.needed);
  }

  static isAuthorized(roles, needed) {
    for (let i = 0; i < needed.length; i++) {
      if (roles.indexOf(needed[i]) === -1) {
        return false;
      }
    }
    return true;
  }

  render() {
    return (
      <div style={{height: "100%"}}>
        {this.isAuthorized() && this.props.children}
      </div>
    );
  }
}

RestrictedComponent.propsTypes = {
  navigate: React.PropTypes.func.isRequired,
  needed: React.PropTypes.array.isRequired
};
