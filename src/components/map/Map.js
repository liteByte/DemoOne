import React from "react";
import UserStore from "../../stores/User";
import Loading from "react-loading-spinner";
import CircularProgress from "material-ui/CircularProgress";
import {GoogleMap, Marker, withGoogleMap} from "react-google-maps";

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
    {props.markers.map(marker => (
      <Marker
        {...marker}
        onRightClick={() => props.onMarkerRightClick(marker)}
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
      markers: [{
        position: {
          lat: 25.0112183,
          lng: 121.52067570000001,
        },
        key: `Taiwan`,
        defaultAnimation: 2,
      }]
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
              defaultAnimation: 2
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

  handleMapClick = (event) => {
    const nextMarkers = [
      ...this.state.markers,
      {
        position: event.latLng,
        defaultAnimation: 2,
        key: Date.now(), // Add a key property for: http://fb.me/react-warning-keys
      },
    ];
    this.setState({
      markers: nextMarkers,
    });
  };

  handleMarkerRightClick = (targetMarker) => {
    /*
     * All you modify is data, and the view is driven by data.
     * This is so called data-driven-development. (And yes, it's now in
     * web front end and even with google maps API.)
     */
    const nextMarkers = this.state.markers.filter(marker => marker !== targetMarker);
    this.setState({
      markers: nextMarkers,
    });
  };

  render() {
    return (
      <Loading isLoading={this.state.loading} loadingClassName="loading" style={{height: "100%"}}
               spinner={() => <CircularProgress style={spinnerStyle}/>}>
        <GettingStartedGoogleMap
          containerElement={
            <div style={{height: `100%`}}/>
          }
          mapElement={
            <div style={{height: `100%`}}/>
          }
          onMapLoad={this.handleMapLoad}
          onMapClick={this.handleMapClick}
          markers={this.state.markers}
          onMarkerRightClick={this.handleMarkerRightClick}
        />
      </Loading>
    )
  }
}

export default Map;

Map.propTypes = {
  navigate: React.PropTypes.func.isRequired
};
