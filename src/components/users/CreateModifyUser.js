import React from "react";
import Validators from "../../validators/validatorsUsers";
import {Cell, Row, Table} from "react-responsive-table";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import List from "material-ui/List/List";
import ListItem from "material-ui/List/ListItem";
import Subheader from "material-ui/Subheader";
import Checkbox from "material-ui/Checkbox";
import Loading from "react-loading-spinner";
import CircularProgress from "material-ui/CircularProgress";
import UserStore from "../../stores/User";
import Alert from "../alert/Alert";
import FlatButton from "material-ui/FlatButton";

const styles = {
  spinner: {
    top: "50%",
    left: "50%",
    position: "fixed"
  },
  table: {
    display: "flex",
    justifyContent: "center",
    padding: 0,
    alignContent: "center"
  },
  cell: {
    margin: "auto 10px 5px 10px",
    width: "100%",
  },
  button: {
    margin: "0 20px",
  },
};

export default class NewAndModifyUser extends React.Component {

  constructor(props) {
    super(props);

    this.token = localStorage.getItem('access-token');

    this.state = {
      loadingUser: true,
      loadingRoles: true,
      alert: false,
      roles: [],
      saveEnabled: false,
      form: {
        document_type: "DNI",
        document_number: "",
        name: "",
        last_name: "",
        email: "",
        password: "",
        roles: [],
      },
      error: {
        doc: "",
        email: "",
        name: "",
        lastName: "",
        msg: "",
      },
    };
  }

  componentDidMount() {
    this.userID = Number(this.context.router.route.match.params.id);

    this.getUser();
    this.getRoles();

    if (this.userID) {
      this.setState({
        saveEnabled: true
      })
    }
  }

  getRoles = () => {
    UserStore.getRoles(this.token)
      .then(data => {
        this.setState({
          roles: data.content,
          loadingRoles: false
        });
      })
      .catch(error => {
        if (error.code === 401) this.props.navigate("/login");
        this.setState({
          errorVisibility: true,
          errorMessage: error.msg
        });
      });
  };

  getUser = () => {
    if (this.userID) {
      UserStore.getUser(this.token, this.userID)
        .then(response => {
          const data = response.content;
          this.setState({
            form: data,
            loadingUser: false
          });
        })
        .catch(error => {
          if (error.code === 404) {
            this.props.navigate("/a/admin/users");
          } else {
            this.setState({
              errorVisibility: true,
              errorMessage: error.msg,
              loadingUser: false
            });
          }
        });
    } else {
      this.setState({
        loadingUser: false
      });
    }
  };

  isRolSelected = (rol) => {
    const selectedRoles = this.state.form.roles;

    if (!this.userID)
      return false;

    for (let i = 0; i < selectedRoles.length; i++) {
      if (rol.role_id === selectedRoles[i].role_id)
        return true;
    }
    return false;
  };

  saveUser = () => {
    this.setState({
      loadingUser: true
    });

    let promise;
    if (this.userID)
      promise = UserStore.putUser(this.token, this.userID, this.state.form);
    else
      promise = UserStore.post(this.token, this.state.form);

    promise
      .then(() => {
        this.setState({
          loadingUser: false,
          alert: true
        });
      })
      .catch(err => {
        this.setState({
          errorVisibility: true,
          errorMsg: err.error,
          loadingUser: false
        });
      });
  };

  checkForm = () => {

    const form = this.state.form;

    if (form.document_type === "") {
      this.setState({saveEnabled: false});
      return;
    }
    if (Validators.validateDoc(form.document_number) !== null) {
      this.setState({saveEnabled: false});
      return;
    }
    if (Validators.validateName(form.name) !== null) {
      this.setState({saveEnabled: false});
      return;
    }
    if (Validators.validateName(form.last_name) !== null) {
      this.setState({saveEnabled: false});
      return;
    }
    if (Validators.validateEmail(form.email) !== null) {
      this.setState({saveEnabled: false});
      return;
    }

    this.setState({
      saveEnabled: true
    });
  };

  alertExit = () => {
    this.setState({
      alert: false
    }, () => {
      this.props.navigate('/a/admin/users');
    });
  };

  handle = {
    docType: (e, index, value) => {
      const form = this.state.form;
      form.document_type = value;
      this.setState({form}, () => {this.checkForm()});
    },
    doc: (e) => {
      const value = e.target.value;
      const form = this.state.form;
      form.document_number = value;
      const error = this.state.error;
      error.doc = Validators.validateDoc(value);
      this.setState({error, form}, () => {this.checkForm()});
    },
    name: (e) => {
      const value = e.target.value;
      const form = this.state.form;
      form.name = value;
      const error = this.state.error;
      error.name = Validators.validateName(value);
      this.setState({error, form}, () => {this.checkForm()});
    },
    lastName: (e) => {
      const value = e.target.value;
      const form = this.state.form;
      form.last_name = value;
      const error = this.state.error;
      error.lastName = Validators.validateName(value);
      this.setState({error, form}, () => {this.checkForm()});
    },
    email: (e) => {
      const value = e.target.value;
      const form = this.state.form;
      form.email = value;
      const error = this.state.error;
      error.email = Validators.validateEmail(value);
      this.setState({error, form}, () => {this.checkForm()});
    },
    rol: (data) => {
      let checked = true;
      let selectedRoles = this.state.form.roles;

      for (let i = 0; i < selectedRoles.length; i++) {
        if (data.role_id === selectedRoles[i].role_id) {
          checked = false;
          selectedRoles.splice(i, 1);
        }
      }

      if (checked)
        selectedRoles.push(data);

      this.setState({
        selectedRoles: selectedRoles
      });
    }
  };

  renderRoleList = () => {
    const list = [];
    const roles = this.state.roles;

    for (let i = 0; i < roles.length; i++) {
      list.push(
        <ListItem key={i}
                  primaryText={roles[i].name}
                  leftCheckbox={
                    <Checkbox defaultChecked={this.isRolSelected(roles[i])}
                              onCheck={() => {this.handle.rol(roles[i])}}/>
                  }
        />
      );
    }

    return list;
  };

  handleCancel = () => {
    if (this.context.router.route.location.search === "?b=m")
      this.props.navigate("/a/map");
    else
      this.props.navigate("/a/admin/users");
  };

  render() {
    return (
      <Loading isLoading={this.state.loadingUser || this.state.loadingRoles}
               loadingClassName="loading" spinner={() => <CircularProgress style={styles.spinner}/>}>
        <div>
          <Table style={styles.table}>
            <form>
              <Row key="typeDocRow" style={{marginBottom: 10}}>
                <SelectField
                  key="typeDocCell"
                  floatingLabelText="Doc type"
                  value={this.state.form.document_type}
                  onChange={this.handle.docType}
                  style={{margin: "auto 0 5px 10px", width: 100}}

                >
                  <MenuItem value={"DNI"} primaryText="DNI"/>
                  <MenuItem value={"LE"} primaryText="LE"/>
                  <MenuItem value={"LC"} primaryText="LC"/>
                </SelectField>
                <TextField id="dni" defaultValue={this.state.form.document_number} onBlur={this.handle.doc}
                           errorText={this.state.error.doc} key="docCell" type="number"
                           hintText="Nro de Documento"
                           style={{margin: "auto 0px 5px 10px", width: 175}}/>
              </Row>
              <Row key="nameRow">
                <Cell key="nameText" style={styles.cell}>
                  <TextField id="name" defaultValue={this.state.form.name} onBlur={this.handle.name}
                             errorText={this.state.error.name} fullWidth hintText="Name"
                             style={{margin: "0 10px 0 0"}}/>
                </Cell>
              </Row>
              <Row>
                <Cell key="lastNameText" style={styles.cell}>
                  <TextField id="lastName" defaultValue={this.state.form.last_name} onBlur={this.handle.lastName}
                             errorText={this.state.error.lastName} fullWidth hintText="Last name"/>
                </Cell>
              </Row>
              <Row key="emailRow">
                <Cell minWidthPx={100} key="emailCell" style={styles.cell}>
                  <TextField id="email" defaultValue={this.state.form.email} onBlur={this.handle.email}
                             errorText={this.state.error.email} fullWidth hintText="Email"/>
                </Cell>
              </Row>
              <List>
                <Subheader>Roles</Subheader>
                {this.renderRoleList()}
              </List>
              {this.state.errorVisibility &&
              <Row key="error">
                <p>{this.state.errorMsg}</p>
              </Row>
              }
              <Row key="buttons">
                <Cell key="buttonCancel" style={{margin: "20px auto"}}>
                  <RaisedButton label="Cancel" style={styles.button}
                                onClick={this.handleCancel}/>
                  <RaisedButton label="Save" disabled={!this.state.saveEnabled} primary={true} style={styles.button}
                                onClick={this.saveUser}/>
                </Cell>
              </Row>
            </form>
          </Table>
          <Alert title="Success!" text="User saved successfully." open={this.state.alert}
                 exit={this.alertExit}>
            <FlatButton
              label="OK"
              primary={true}
              onTouchTap={this.alertExit}
            />
          </Alert>
        </div>
      </Loading>
    )
  }
}

NewAndModifyUser.contextTypes = {
  router: React.PropTypes.object.isRequired
};
