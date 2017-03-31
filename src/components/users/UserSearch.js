import React from "react";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";

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
        <TextField hintText="Search by name, id or email" style={{minWidth: 256, width: "50%", float: "left"}}
                   onChange={this.props.search}/>
        <div style={{width: "50%", float: "left", textAlign: "right"}}>
          <RaisedButton label="Create User" primary={true} style={{minWidth: 170}}
                        onClick={() => this.props.navigate("/a/admin/users/create")}/>
        </div>
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
