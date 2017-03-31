import React from "react";
import TextField from "material-ui/TextField";

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
      <div>
        {/*<IconSearch color={grey500} style={{position: "relative", top: 7}}/>*/}
        <TextField onChange={this.props.search} hintText="Search by name, id or email"/>
      </div>
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
