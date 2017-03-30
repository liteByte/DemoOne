import React from "react";
import {Cell, Row, Table} from "react-responsive-table";
import FontIcon from "material-ui/FontIcon";
import FlatButton from "material-ui/FlatButton";
import Pagination from "react-js-pagination";
import Alert from "../alert/Alert";
import config from "../../config";

const style = {
  padding: 0
};

class UsersTable extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dataToShow: [],
      dataToDelete: {},
      deleteDialog: false,
      activePage: 1,
      successful: false,
      respond: ""
    };
  }

  getTable = () => {
    let datosTabla = [];

    let data = this.props.data;
    let items = this.props.itemsCountPerPage;
    let i = (this.state.activePage - 1) * items;
    let length;

    if ((i + items) > data.length) {
      length = data.length;
    } else {
      length = i + items;
    }

    for (i; i < length; i++) {
      datosTabla.push(
        <Row key={data[i].user_id} striped>
          <Cell key={data[i].user_id + '-nombre'} minWidthPx={100}>{data[i].name + " " + data[i].last_name}</Cell>
          <Cell key={data[i].user_id + '-dni'} minWidthPx={70}>{data[i].document_number}</Cell>
          <Cell key={data[i].user_id + '-email'} minWidthPx={100}>{data[i].email}</Cell>
          <Cell key={data[i].user_id + '-buttons'} minWidthPx={75}>
            <button className="user-button-icon" onClick={this.modifyUser.bind(this, data[i].user_id)}>
              <FontIcon className="material-icons">mode_edit</FontIcon>
            </button>
            <button className="user-button-icon" onClick={this.setDeleteDialog.bind(this, data[i])}>
              <FontIcon className="material-icons">delete</FontIcon>
            </button>
          </Cell>
        </Row>
      )
    }
    if (datosTabla.length === 0) {
      return (<p>No data</p>);
    }

    return datosTabla;
  };

  modifyUser = (id) => {
    this.props.navigate(`/a/admin/users/${id}/edit`);
  };

  setDeleteDialog = (data) => {
    this.setState({
      deleteDialog: true,
      dataToDelete: data
    });
  };

  deleteUser = () => {
    const access_token = localStorage.getItem('access-token');

    let params = {
      method: 'DELETE',
      mode: 'cors',
      headers: new Headers({
        'Content-Type': 'application/json',
        'authorization': access_token
      })
    };

    let url = config.endpoint + "/users/remove/" + this.state.dataToDelete.user_id;

    fetch(url, params)
      .then((response) => {
        if (response.ok) {
          response.json()
            .then((res) => {
              this.exitDeleteDialog();
              this.props.getUsers();
              this.setState({
                successful: true,
                respond: res.error
              });
            });
        } else {
          response.json()
            .then((res) => {
              this.exitDeleteDialog();
              this.setState({
                successful: true,
                respond: res.error
              });
            });
        }
      }).catch((err) => {
      err.json()
        .then((res) => {
          this.exitDeleteDialog();
          this.setState({
            successful: true,
            respond: res.error
          });
        });
    });
  };

  exitDeleteDialog = () => {
    this.setState({
      deleteDialog: false
    });
  };

  exitDeleteAlert = () => {
    this.setState({
      successful: false
    })
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
            <Cell thead minWidthPx={100} key="cheader-1">Nombre</Cell>
            <Cell thead minWidthPx={70} key="cheader-2">Identificador</Cell>
            <Cell thead minWidthPx={100} key="cheader-3">Email</Cell>
            <Cell thead minWidthPx={75} key="cheader-4">Modificar/Eliminar</Cell>
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
        <Alert open={this.state.deleteDialog} exit={this.exitDeleteDialog}
               title="Delete user?" text={`The user ${"asd"} will be deleted.`}>
          <FlatButton
            label="Cancel"
            primary={true}
            onTouchTap={this.props.exit}
          />
          <FlatButton
            label="Delete"
            primary={true}
            onTouchTap={this.props.delete}
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
