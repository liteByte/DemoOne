import React from "react";
import {Cell, Row, Table} from "react-responsive-table";
import IconButton from "material-ui/IconButton";
import FlatButton from "material-ui/FlatButton";
import MenuItem from "material-ui/MenuItem";
import Pagination from "react-js-pagination";

import IconEdit from "material-ui/svg-icons/editor/mode-edit";
import IconDelete from "material-ui/svg-icons/action/delete";
import IconMapsPlace from "material-ui/svg-icons/maps/place";
import IconMoreVert from "material-ui/svg-icons/navigation/more-vert";

import Alert from "../alert/Alert";
import UserStore from "../../stores/User";
import Popover from "../popover/Popover";

const tableStyle = {
  padding: 0,
  marginBottom: 50
};

const iconButtonStyle = {
  padding: 2,
  width: 28,
  height: 28
};

const cellStyle = {
  textOverflow: 'ellipsis',
  overflow: 'hidden'
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
          <Cell style={cellStyle} key={data[i].user_id + '-name'}
                minWidthPx={100}>{data[i].name + " " + data[i].last_name}</Cell>
          <Cell style={cellStyle} key={data[i].user_id + '-dni'} minWidthPx={55}>{data[i].document_number}</Cell>
          <Cell style={cellStyle} key={data[i].user_id + '-email'} minWidthPx={100}>{data[i].email}</Cell>
          <Cell style={cellStyle} key={data[i].user_id + '-buttons'}>
            <div className="single-buttons">
              <IconButton style={iconButtonStyle} onClick={() => this.modifyUser(data[i])}><IconEdit/></IconButton>
              <IconButton style={iconButtonStyle}
                          onClick={() => this.props.navigate("/a/map?u=" + data[i].user_id)}><IconMapsPlace/></IconButton>
              <IconButton style={iconButtonStyle} onClick={() => this.confirmDelete(data[i])}><IconDelete/></IconButton>
            </div>
            <div className="menu-buttons">
              <Popover component={<IconButton><IconMoreVert/></IconButton>}>
                <MenuItem primaryText="Edit" onClick={() => this.modifyUser(data[i])}/>
                <MenuItem primaryText="Show on map"
                          onClick={() => this.props.navigate("/a/map?u=" + data[i].user_id)}/>
                <MenuItem primaryText="Delete" onClick={() => this.confirmDelete(data[i])}/>
              </Popover>
            </div>
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
      .then(() => {
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
      <div style={{textAlign: "center"}}>
        <Table material style={tableStyle}>
          <Row header key="header">
            <Cell header minWidthPx={100} key="header-1">Name</Cell>
            <Cell header minWidthPx={55} key="header-2">Id</Cell>
            <Cell header minWidthPx={100} key="header-3">Email</Cell>
            <Cell header key="header-4">Actions</Cell>
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
