import React from "react";
import UsersTable from "./UsersTable";
import UserSearch from "./UserSearch";
import UserStore from "../../stores/User";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import Loading from "react-loading-spinner";
import CircularProgress from "material-ui/CircularProgress";

const spinnerStyle = {
  top: "50%",
  left: "50%",
  position: "fixed"
};

const actionButtonStyle = {
  marginRight: 20,
  position: "fixed",
  bottom: 25,
  right: 15
};

class Users extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      users: [],
      usersToShow: [],
      searchByDocument: "",
      searchByName: "",
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
          this.findUsers();
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

  searchDocument = (e) => {
    this.setState({
      searchByDocument: e.target.value
    }, () => {
      this.findUsers();
    });
  };

  searchName = (e) => {
    this.setState({
      searchByName: e.target.value
    }, () => {
      this.findUsers();
    });
  };

  findUsers() {
    const data = this.state.users;
    const usersToShow = [];
    const documentToSearch = this.state.searchByDocument.toLowerCase();
    const nameToSearch = this.state.searchByName.toLowerCase();

    for (let i = 0; i < data.length; i++) {
      const completeName = data[i].name + ' ' + data[i].last_name;

      const documentSearch = data[i].document_number.toLowerCase().match(new RegExp(documentToSearch));
      const nameSearch = completeName.toLowerCase().match(new RegExp(nameToSearch));

      if (documentSearch !== null && nameSearch !== null) {
        usersToShow.push(data[i]);
      }
    }

    this.setState({
      usersToShow: usersToShow
    });
  }

  render() {
    return (
      <Loading isLoading={this.state.loading} loadingClassName="loading" style={{height: "100%"}}
               spinner={() => <CircularProgress style={spinnerStyle}/>}>
        <div>
          <UserSearch searchDocument={this.searchDocument} searchName={this.searchName} navigate={this.props.navigate}/>
          <UsersTable getUsers={this.getUsers} data={this.state.usersToShow}
                      loading={this.handleLoading} navigate={this.props.navigate}/>
          <FloatingActionButton style={actionButtonStyle} onClick={() => this.props.navigate("/a/admin/users/create")}>
            <ContentAdd/>
          </FloatingActionButton>
        </div>
      </Loading>
    )
  }
}

export default Users;

Users.contextTypes = {
  router: React.PropTypes.object.isRequired
};
