import React from "react";
import {Redirect, Route, Switch} from "react-router-dom";

import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import NavigationMenu from "material-ui/svg-icons/navigation/menu";
import Avatar from "./Avatar";
import Drawer from "./Drawer";

import Restricted from "../Restricted";

import Users from "../users/Users";
import ModifyUser from "../users/CreateModifyUser";

import Map from "../map/Map";

export default class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      responsiveMenu: false,
      loading: false,
      drawerOpen: false,
      title: "Users"
    };
  }

  componentDidMount() {
    if (localStorage.getItem('access-token') === null) {
      this.navigate("/login")
    } else {
      this.setState({
        permissions: localStorage.getItem('permissions'),
        accessToken: localStorage.getItem('access-token')
      });
    }
  }

  navigate = (url) => {
    this.context.router.history.push(url);
  };

  setTitle = (title) => {
    this.setState({
      title: title
    })
  };

  toggleDrawer = () => this.setState({drawerOpen: !this.state.drawerOpen});

  setDrawerOpen = (open) => this.setState({drawerOpen: open});

  render() {
    const createRestricted = (component, permissions = []) => {
      return <Restricted needed={permissions} navigate={this.navigate}>{component}</Restricted>;
    };

    const ABM = (name, get, create, modify, permissions = []) => {
      const render = (component) => {
        return createRestricted(
          React.createElement(component, {
            navigate: this.navigate
          }),
          permissions);
      };
      return ([
        <Route key={1} render={() => render(get)} exact path={`/a/admin/${name}`}/>,
        <Route key={2} render={() => render(create)} path={`/a/admin/${name}/create`}/>,
        <Route key={3} render={() => render(modify)} path={`/a/admin/${name}/:id/edit`}/>,
      ]);
    };
    return (
      <div style={{height: "100%"}}>
        <AppBar
          title={this.state.title}
          iconElementLeft={<IconButton onTouchTap={this.toggleDrawer}><NavigationMenu/></IconButton>}
          iconElementRight={<Avatar/>}
        />
        <div className="main-content" style={{height: "calc(100% - 64px)"}}>
          <Switch>

            {ABM("users", Users, ModifyUser, ModifyUser)}

            <Route path="/a/map" render={() => createRestricted(<Map navigate={this.navigate}/>)}/>

            <Redirect to="/"/>

          </Switch>
          <div className="site-cache" id="site-cache" onClick={this.handleClick}/>
        </div>
        <Drawer
          open={this.state.drawerOpen}
          toggle={this.toggleDrawer}
          setDrawerOpen={this.setDrawerOpen}
          setTitle={this.setTitle}
          navigate={this.navigate}
        />
      </div>
    );
  }
}

Layout.contextTypes = {
  router: React.PropTypes.object.isRequired
};
