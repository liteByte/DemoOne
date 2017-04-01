import React from "react";
import UserStore from "../../stores/User";
import Loading from "react-loading-spinner";
import CircularProgress from "material-ui/CircularProgress";
import {GoogleMap, InfoWindow, Marker, withGoogleMap} from "react-google-maps";
import RaisedButton from "material-ui/RaisedButton";

const spinnerStyle = {
  top: "50%",
  left: "50%",
  position: "fixed"
};

const GettingStartedGoogleMap = withGoogleMap(props => (
  <GoogleMap
    ref={props.onMapLoad}
    defaultZoom={2}
    defaultCenter={{lat: 0, lng: 0}}
    onClick={props.onMapClick}
  >
    {props.showInfoWindow &&
    <InfoWindow
      {...props.infoWindow.props}
    >
      <div id="infowindow" style={props.infoWindow.style}>
        <h2>{props.infoWindow.user.name + " " + props.infoWindow.user.last_name}</h2>
        <RaisedButton label="Edit" primary onClick={props.onEditUser}/>
      </div>
    </InfoWindow>
    }
    {props.markers.map(marker => (
      <Marker
        {...marker}
        onRightClick={() => props.onMarkerRightClick(marker)}
        onClick={() => props.onMarkerClick(marker)}
      />
    ))}
  </GoogleMap>
));

class Map extends React.Component {

  constructor(props) {
    super(props);

    this.token = localStorage.getItem('access-token');

    this.state = {
      users: [],
      markers: [],
      toShow: [],
      showInfoWindow: false,
      infoWindow: null
    };
  }

  componentDidMount() {
    this.getUsers();
  }

  getUsers = () => {

    UserStore.get(this.token)
      .then(data => {
        this.setState({
          users: data.content,
          markers: data.content.map(u => {
            return {
              position: u.location,
              key: u.user_id,
              name: `${u.name} ${u.last_name}`,
              defaultAnimation: 0
            }
          }),
          loading: false
        }, () => {
          // this.updateTable();
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
      // this.updateTable();
    });
  };

  // updateTable = () => {
  //   this.setState({
  //     usersToShow: UserSearch.filter(this.state.users, this.state.search)
  //   });
  // };

  handleMapLoad = (map) => {
    this._mapComponent = map;
  };

  handleMapClick = (e) => {
    this.setState({
      showInfoWindow: false
    });
  };

  handleMarkerClick = (e) => {
    const marker = this.state.markers.find(m => m.key === e.key);
    const state = {
      showInfoWindow: true,
      infoWindow: {
        props: {
          position: marker.position,
          key: marker.key + "i"
        },
        user: this.state.users.find(u => u.user_id === e.key),
        style: {opacity: 0}
      }
    };
    this.setState(state);
    setTimeout(() => {
      state.infoWindow.style = {opacity: 1};
      this.setState(state)
    }, 50);
  };

  handleEditUser = () => {
    this.props.navigate(`/a/admin/users/${this.state.infoWindow.user.user_id}/edit`);
  };

  render() {
    return (
      <Loading isLoading={this.state.loading} loadingClassName="loading" style={{height: "100%"}}
               spinner={() => <CircularProgress style={spinnerStyle}/>}>
        <GettingStartedGoogleMap
          containerElement={
            <div style={{height: "100%"}}/>
          }
          mapElement={
            <div style={{height: "100%"}}/>
          }
          onMapLoad={this.handleMapLoad}
          onMapClick={this.handleMapClick}
          onMarkerClick={this.handleMarkerClick}
          markers={this.state.markers}
          showInfoWindow={this.state.showInfoWindow}
          infoWindow={this.state.infoWindow}
          onEditUser={this.handleEditUser}
        />
      </Loading>
    )
  }
}

export default Map;

Map.propTypes = {
  navigate: React.PropTypes.func.isRequired
};
