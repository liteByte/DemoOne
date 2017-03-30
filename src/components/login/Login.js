import React from "react";
import Loading from "react-loading-spinner";
import CircularProgress from "material-ui/CircularProgress";
import TextField from "material-ui/TextField";
import RaisedButton from "material-ui/RaisedButton";
import Paper from "material-ui/Paper";
import {grey50, red500} from "material-ui/styles/colors";

import LoginStore from "../../stores/Login";

const spinnerStyle = {
  top: "50%",
  left: "50%",
  position: "fixed"
};

const loginStyle = {
  width: "100%",
  height: "100%",
  margin: "auto",
  position: "absolute",
  textAlign: "center",
  fontFamily: '"Roboto", sans-serif',
  backgroundColor: grey50
};

const paperStyle = {
  maxWidth: 500,
  margin: "0 auto",
  padding: 15,
  position: "relative",
  top: "50%",
  transform: "translateY(-60%)"
};

const titleStyle = {
  marginBottom: "25px"
};

const textFieldStyle = {
  marginBottom: 15
};

const errorStyle = {
  marginBottom: 0,
  color: red500
};

class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: null,
      loading: false,
      username: "",
      password: ""
    };

    this.LoginStore = new LoginStore();
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') this.handleSubmit();
  };

  handleSubmit = () => {

    this.setState({
      loading: true
    });

    const username = this.state.username;
    const password = this.state.password;

    this.LoginStore.post(username, password)
      .then(data => {
        const content = data.content;
        localStorage.clear();
        localStorage.setItem('access-token', content.token);
        localStorage.setItem('user-name', content.name);
        this.setState({
          error: null,
          loading: false
        }, () => {
          this.context.router.history.push('/a/admin/users');
        })
      })
      .catch(error => {
        this.setState({
          error: error.msg,
          loading: false
        });
      });
  };

  render() {
    return (
      <Loading isLoading={this.state.loading} loadingClassName="loading"
               spinner={() => <CircularProgress style={spinnerStyle}/>}>
        <div id="login-page" style={loginStyle}>

          <Paper style={paperStyle}>
            <h2 style={titleStyle}>
              Welcome to Demo 1
            </h2>
            <TextField id="username" name="username" default="Username" fullWidth={true} style={textFieldStyle}
                       autoFocus={true}
                       onChange={(e) => {this.setState({username: e.target.value});}}
                       onKeyUp={this.handleKeyPress}/>
            <TextField id="password" name="password" type="password" fullWidth={true} style={textFieldStyle}
                       onChange={(e) => {this.setState({password: e.target.value});}}
                       onKeyUp={this.handleKeyPress}/>
            <RaisedButton primary label="Log In" fullWidth={true} onClick={this.handleSubmit}/>
            {!!this.state.error &&
            <p style={errorStyle}>{this.state.error}</p>
            }
          </Paper>

        </div>
      </Loading>
    );
  }
}

Login.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default Login;
