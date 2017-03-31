import React from "react";
import MUIDrawer from "material-ui/Drawer";
import {List, ListItem} from "material-ui/List";

import IconHome from "material-ui/svg-icons/action/home";
import IconAccountBox from "material-ui/svg-icons/action/account-box";
import IconAccountBalance from "material-ui/svg-icons/action/account-balance";
import IconTrendingUp from "material-ui/svg-icons/action/trending-up";
import IconWork from "material-ui/svg-icons/action/work";
import IconLocalHospital from "material-ui/svg-icons/maps/local-hospital";
import IconClass from "material-ui/svg-icons/action/class";

export default class Drawer extends React.Component {

  createItem = (id, title, url, icon) => {
    return (
      <ListItem
        key={id}
        primaryText={title}
        leftIcon={icon}
        onClick={() => {
          this.props.navigate(url);
          this.props.setDrawerOpen(false);
          this.props.setTitle(title)
        }}/>
    )
  };

  render() {
    return (
      <MUIDrawer
        open={this.props.open}
        docked={false}
        onRequestChange={open => this.props.setDrawerOpen(open)}
      >
        <List>
          <ListItem
            primaryText="Administration"
            leftIcon={<IconHome/>}
            initiallyOpen={true}
            primaryTogglesNestedList={true}
            nestedItems={[
              this.createItem(1, 'Users', '/a/admin/users', <IconAccountBox/>),
              this.createItem(2, 'Banks', '/a/admin/banks', <IconAccountBalance/>),
              this.createItem(3, 'Specialities', '/a/admin/specialities', <IconTrendingUp/>),
              this.createItem(4, 'Professionals', '/a/admin/professionals', <IconWork/>),
              this.createItem(5, 'Insurances', '/a/admin/insurances', <IconLocalHospital/>),
              this.createItem(6, 'Plans', '/a/admin/plans', <IconClass/>),
            ]}
          />
        </List>
      </MUIDrawer>
    );
  }
}

Drawer.contextTypes = {
  router: React.PropTypes.object.isRequired
};
