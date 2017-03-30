import React from "react";
import {Cell, Row, Table} from "react-responsive-table";
import FontIcon from "material-ui/FontIcon";
import FlatButton from "material-ui/FlatButton";
import Pagination from "react-js-pagination";
import Alert from "../alert/Alert";
import UserStore from "../../stores/User";

const style = {
  padding: 0
};

const alerts = {
  DELETE: 'delete',
  SUCCESS: 'success',
  ERROR: 'error',
  NONE: '',
};

class UsersTable extends React.Component {

  constructor(props) {
    super(props);

    this.token = localStorage.getItem('access-token');

    this.state = {
      dataToShow: [],
      activePage: 1,
      toDelete: {},
      alert: alerts.NONE,
      error: ""
    };
  }

  getTable = () => {
    const tableData = [];

    const data = this.props.data;
    const itemsPerPage = this.props.itemsCountPerPage;
    const startingItem = (this.state.activePage - 1) * itemsPerPage;

    let length = data.length;
    if (startingItem + itemsPerPage < data.length)
      length = startingItem + itemsPerPage;

    for (let i = startingItem; i < length; i++) {
      tableData.push(
        <Row key={data[i].user_id} striped>
          <Cell key={data[i].user_id + '-name'} minWidthPx={100}>{data[i].name + " " + data[i].last_name}</Cell>
          <Cell key={data[i].user_id + '-dni'} minWidthPx={70}>{data[i].document_number}</Cell>
          <Cell key={data[i].user_id + '-email'} minWidthPx={100}>{data[i].email}</Cell>
          <Cell key={data[i].user_id + '-buttons'} minWidthPx={75}>
            <button className="user-button-icon" onClick={() => this.modifyUser(data[i])}>
              <FontIcon className="material-icons">mode_edit</FontIcon>
            </button>
            <button className="user-button-icon" onClick={() => this.confirmDelete(data[i])}>
              <FontIcon className="material-icons">delete</FontIcon>
            </button>
          </Cell>
        </Row>
      )
    }

    if (tableData.length === 0)
      return (<p>No data</p>);

    return tableData;
  };

  modifyUser = (user) => {
    this.props.navigate(`/a/admin/users/${user.user_id}/edit`);
  };

  deleteUser = () => {

    UserStore.deleteUser(this.token, this.state.toDelete.user_id)
      .then(response => {
        this.props.getUsers();
        this.setState({
          alert: alerts.SUCCESS
        });
      })
      .catch(error => {
        this.setState({
          alert: alerts.ERROR,
          error: error.msg
        });
      });
  };

  confirmDelete = (user) => {
    this.setState({
      alert: alerts.DELETE,
      toDelete: user
    });
  };

  setAlert = (val) => {
    this.setState({
      alert: val
    });
  };

  handlePageChange = (pageNumber) => {
    this.setState({
      activePage: pageNumber
    });
  };

  render() {
    return (
      <div className="div-center">
        <Table material style={style}>
          <Row header key="header">
            <Cell thead minWidthPx={100} key="cheader-1">Name</Cell>
            <Cell thead minWidthPx={70} key="cheader-2">Id</Cell>
            <Cell thead minWidthPx={100} key="cheader-3">Email</Cell>
            <Cell thead minWidthPx={75} key="cheader-4">Action</Cell>
          </Row>
          {this.getTable()}
        </Table>
        {(this.props.data.length > this.props.itemsCountPerPage) &&
        <Pagination
          activePage={this.state.activePage}
          itemsCountPerPage={this.props.itemsCountPerPage}
          totalItemsCount={this.props.data.length}
          pageRangeDisplayed={this.props.pageRangeDisplayed}
          onChange={this.handlePageChange}
        />
        }
        <Alert open={this.state.alert === alerts.DELETE} exit={() => this.setAlert(alerts.NONE)}
               title="Delete user?" text={`User ${this.state.toDelete.name} will be deleted.`}>
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={() => this.setAlert(alerts.NONE)}
          />
          <FlatButton
            label="Delete"
            primary={true}
            onTouchTap={this.deleteUser}
          />
        </Alert>
        <Alert open={this.state.alert === alerts.SUCCESS} exit={() => this.setAlert(alerts.NONE)}
               title="Success!" text={`User ${this.state.toDelete.name} deleted successfully.`}>
          <FlatButton
            label="OK"
            primary={true}
            onTouchTap={() => this.setAlert(alerts.NONE)}
          />
        </Alert>
        <Alert open={this.state.alert === alerts.ERROR} exit={() => this.setAlert(alerts.NONE)}
               title="Something went wrong!" text={`${this.state.error}.`}>
          <FlatButton
            label="OK"
            primary={true}
            onTouchTap={() => this.setAlert(alerts.NONE)}
          />
        </Alert>
      </div>
    )
  }
}

export default UsersTable;

UsersTable.contextTypes = {
  router: React.PropTypes.object.isRequired
};

UsersTable.PropTypes = {
  setDialog: React.PropTypes.func.isRequired,
  data: React.PropTypes.array.isRequired
};

UsersTable.defaultProps = {
  itemsCountPerPage: 10,
  pageRangeDisplayed: 10
};
