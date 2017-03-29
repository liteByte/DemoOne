import React from "react";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import "../public/App.css";
import {MuiThemeProvider} from "material-ui";
import Login from "./components/login/Login";
import Layout from "./components/layout/Layout";

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider>
        <BrowserRouter basename="/">
          <Switch>

            <Route path="/login" component={Login}/>

            <Route path="/a" component={Layout}/>

            <Route component={Login}/>

          </Switch>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default App;
