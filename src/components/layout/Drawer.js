import React from "react";
import MUIDrawer from "material-ui/Drawer";
import {List, ListItem} from "material-ui/List";
import Subheader from "material-ui/Subheader";

import IconHome from "material-ui/svg-icons/action/home";
import IconAccountBox from "material-ui/svg-icons/action/account-box";
import IconMapsPlace from "material-ui/svg-icons/maps/place";
import IconCommChat from "material-ui/svg-icons/communication/chat";

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
        <Subheader>Demo One</Subheader>
        <List>
          <ListItem
            primaryText="Administration"
            leftIcon={<IconHome/>}
            initiallyOpen={true}
            primaryTogglesNestedList={true}
            nestedItems={[
              this.createItem(1, 'Users', '/a/admin/users', <IconAccountBox/>),
            ]}
          />
          {this.createItem(0, 'Map', '/a/map', <IconMapsPlace/>)}
        </List>
        <Subheader>liteByte</Subheader>
        <ListItem
          primaryText="Contact Us"
          leftIcon={<IconCommChat/>}
          onClick={() => {window.open('http://litebyte.us/#contact', '_blank')}}
        />
      </MUIDrawer>
    );
  }
}

Drawer.contextTypes = {
  router: React.PropTypes.object.isRequired
};
