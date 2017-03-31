import React from "react";
import {Cell, Row, Table} from "react-responsive-table";
import TextField from "material-ui/TextField";
import IconSearch from "material-ui/svg-icons/action/search";
import {grey500} from "material-ui/styles/colors";

export default class UserSearch extends React.Component {

  static filter(data, keyword) {

    const toShow = [];
    const regex = new RegExp(keyword);

    for (let i = 0; i < data.length; i++) {

      for (let key in data[i]) {
        if (data[i].hasOwnProperty(key)) {
          if (data[i][key].toString().toLowerCase().match(regex) !== null) {
            toShow.push(data[i]);
            break;
          }
        }
      }
    }

    return toShow;
  };

  render() {
    return (
      <Table material style={{padding: 0}}>
        <Row key="typeDocRow">
          <Cell key={1} minWidthPx={150} style={{margin: 0}}>
            <IconSearch color={grey500} style={{position: "relative", top: 7}}/>
            <TextField onChange={this.props.search} hintText="Search"/>
          </Cell>
        </Row>
      </Table>
    )
  }
}

UserSearch.contextTypes = {
  router: React.PropTypes.object.isRequired
};

UserSearch.PropTypes = {
  searchDocument: React.PropTypes.func,
  searchName: React.PropTypes.func
};
