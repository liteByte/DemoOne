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

import Banks from "../banks/Banks";
import ModifyBank from "../banks/CreateModifyBank";

import Specialities from "../specialities/Specialitys";
import ModifySpeciality from "../specialities/CreateModifySpeciality";

import Professionals from "../professionals/Professionals";
import ModifyProfessional from "../professionals/CreateModifyProfessional";

import Insurances from "../insurances/Insurances";
import ModifyInsurance from "../insurances/CreateModifyInsurance";

import Plans from "../plans/Plans";
import ModifyPlan from "../plans/CreateModifyPlan";

export default class Layout extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      responsiveMenu: false,
      loading: false,
      drawerOpen: false,
      title: "Traditional"
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
      <div>
        <AppBar
          title={this.state.title}
          iconElementLeft={<IconButton onTouchTap={this.toggleDrawer}><NavigationMenu/></IconButton>}
          iconElementRight={<Avatar/>}
        />
        <div className="main-content">
          <Switch>

            {ABM("users", Users, ModifyUser, ModifyUser)}
            {ABM("banks", Banks, ModifyBank, ModifyBank)}
            {ABM("specialities", Specialities, ModifySpeciality, ModifySpeciality)}
            {ABM("professionals", Professionals, ModifyProfessional, ModifyProfessional)}
            {ABM("insurances", Insurances, ModifyInsurance, ModifyInsurance)}
            {ABM("plans", Plans, ModifyPlan, ModifyPlan)}

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
