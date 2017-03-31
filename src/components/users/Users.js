import React from "react";
import UsersTable from "./UsersTable";
import UserSearch from "./UserSearch";
import UserStore from "../../stores/User";
import Loading from "react-loading-spinner";
import CircularProgress from "material-ui/CircularProgress";

const spinnerStyle = {
  top: "50%",
  left: "50%",
  position: "fixed"
};

class Users extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      users: [],
      usersToShow: [],
      search: "",
      loading: true
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {

    const token = localStorage.getItem('access-token');

    UserStore.get(token)
      .then(data => {
        this.setState({
          users: data.content,
          loading: false
        }, () => {
          this.updateTable();
        });
      })
      .catch(error => {
        if (error.code === 401) this.props.navigate("/login");
        this.setState({
          error: error.msg,
          loading: false
        });
      });
  };

  search = (e) => {
    this.setState({
      search: e.target.value.toString().toLowerCase()
    }, () => {
      this.updateTable();
    });
  };

  updateTable = () => {
    this.setState({
      usersToShow: UserSearch.filter(this.state.users, this.state.search)
    });
  };

  render() {
    return (
      <Loading isLoading={this.state.loading} loadingClassName="loading" style={{height: "100%"}}
               spinner={() => <CircularProgress style={spinnerStyle}/>}>
        <div style={{padding: 20}}>
          <UserSearch search={this.search} navigate={this.props.navigate}/>
          <UsersTable getUsers={this.getUsers} data={this.state.usersToShow} navigate={this.props.navigate}/>
        </div>
      </Loading>
    )
  }
}

export default Users;

Users.propTypes = {
  navigate: React.PropTypes.func.isRequired
};

Users.contextTypes = {
  router: React.PropTypes.object.isRequired
};
