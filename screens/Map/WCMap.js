import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Bar } from 'react-native-progress';
import Constants from 'expo-constants';

const twoTiersWidth = Dimensions.get("window").width * 2 / 3;

export default class WCMap extends React.Component {
    constructor(props) {
        super(props);
        this.markers = {};
        this.state = {
            all_floaters_data:null,
            mapRegion: null,
            locationResult: null,
            markers: [],
            api_token: global.infos.api_token,
            usr_token: global.infos.user_token,
        };
    }

    getMarkerById(id) {
        for (let i = 0; i < this.state.markers.length; i++)
            if (this.state.markers[i].id == id)
                return this.state.markers[i];
        return null;
    }

    UNSAFE_componentWillReceiveProps(props) {
        if (props.route.params && props.route.params.deviceId) {
            let marker = this.getMarkerById(props.route.params.deviceId);
            if (marker) {
                this.setState({
                    mapRegion: {
                        latitude: marker.latlng.latitude,
                        longitude: marker.latlng.longitude,
                        latitudeDelta: this.state.mapRegion.latitudeDelta,
                        longitudeDelta: this.state.mapRegion.longitudeDelta
                    }
                });
                this.markers[marker.id].showCallout();
            }
        }
    }
    
    componentDidMount() {
        this.forceUpdate();
        this.getCurrentPosition();
        this._request_get_all_floater_infos();
    }

    _request_get_all_floater_infos = async () => {
        try {
            const response = await fetch('https://api.wellcheck.fr/points/infos/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token':global.infos.api_token,
                    'usrtoken':global.infos.user_token,
                },
                body: JSON.stringify({})
            });
            const responseJson = await response.json();
            if (responseJson["succes"] == false) {
                this.setState({error:responseJson['error']})
            }
            if (responseJson["succes"] == true) {
                this.setState({all_floaters_data:responseJson['data']['points']})
                this.setState({markers:this.getMarkers()});
            }
        }
        catch (error) {
            this.setState({
                error:'Cann\'t connect to server'
            })
        }        
      }

    getMarkers() {
        return (
            this.state.all_floaters_data.proprietary.map(floater => 
            {    
                if(floater['data'].length > 0){
                    return (
                        {
                            id: floater['id'],
                            latlng: {
                                latitude: floater['data'][floater['data'].length-1]["data"]["pos"]['lat'],
                                longitude: floater['data'][floater['data'].length-1]["data"]["pos"]['lon']
                            },
                            name: floater['name'],
                            since: new Date(floater['date'] / 1000).toLocaleDateString("en-US"),
                            lastReport: new Date(floater['data'][floater['data'].length-1]['date'] / 1000).toLocaleDateString("en-US"),
                            note: floater['data'][floater['data'].length-1]['data']['data']['note'],
                            progressBar: {
                                note: floater['data'][floater['data'].length-1]['data']['data']['note']/20,
                                color: this.getColorFromNote(floater['data'][floater['data'].length-1]['data']['data']['note']*10)
                            }
                        }
                    );
                }
            })
        );
    }

    display_markers(){
        return(
            this.state.markers.map(marker =>
                {
                    if(marker){
                        return(
                            <Marker key={marker.id} coordinate={marker.latlng} anchor={{x: 0.5, y: 0.5}} ref={ref => this.markers[marker.id] = ref}>
                                <Image source={require('../../assets/images/float.png')} style={{ width: 40, height: 40 }} /> 
                                    <Callout onPress={() => this._details(marker.id, marker.name)} style={{width: twoTiersWidth,paddingVertical: 10}}>
                                        <View style={{alignItems:'center', justifyContent:'center', flexDirection:'row',flexWrap:'wrap',}}>
                                            <Text style={{fontWeight: "bold"}}>Name: </Text>
                                            <Text>{marker.name}</Text>
                                        </View>
                                        <View style={{alignItems:'center', justifyContent:'center', flexDirection:'row',flexWrap:'wrap',}}>
                                            <Text style={{fontWeight: "bold"}}>Since: </Text>
                                            <Text>{marker.since}</Text>
                                        </View>
                                        <View style={{alignItems:'center', justifyContent:'center', flexDirection:'row',flexWrap:'wrap',}}>
                                            <Text style={{fontWeight: "bold"}}>Last report: </Text>
                                            <Text>{marker.lastReport}</Text>
                                        </View>
                                        <View style={{alignItems:'center', justifyContent:'center', flexDirection:'row',flexWrap:'wrap',marginTop:20}}>
                                            <Text style={{fontWeight: "bold"}}>Note: </Text>
                                            <Text>{marker.note} / 20</Text>
                                        </View>
                                        <View style={{alignItems:'center'}}>
                                            <Bar progress={marker.progressBar.note} borderWidth={0} color={marker.progressBar.color} style={{backgroundColor: "darkgray"}} />
                                        </View>
                                    </Callout>
                            </Marker>
                        );
                    }
                }
            )
        )
    }

    getCurrentPosition() {
        navigator.geolocation.getCurrentPosition(
            position => {
                this.setState({mapRegion: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421
                }});
            },
            error => alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
    }

    getColorFromNote(noteOn100) {
        return "hsl("+ noteOn100 +", 100%, 40%)";
    }

    _details = (id, floater_name) => {
        this.props.navigation.navigate('Details', {floater_id:id, floater_name:floater_name});
    }
    
    render() {
        return (
          <View style={{flex: 1, marginTop: Constants.statusBarHeight,}}>
            {
                this.state.mapRegion === null ?
                <Text>Finding your current location...</Text> :
                <View style={{flex: 1}}>
                    <MapView
                        style={{flex: 1}}
                        region={this.state.mapRegion}
                        customMapStyle={[{"featureType":"all","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"administrative.country","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.province","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"administrative.neighborhood","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"administrative.land_parcel","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels","stylers":[{"visibility":"simplified"}]},{"featureType":"road.highway","elementType":"labels.text","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"road.local","elementType":"labels.text","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#1c94fe"},{"visibility":"on"},{"saturation":"0"},{"weight":"1.00"}]},{"featureType":"water","elementType":"geometry","stylers":[{"visibility":"on"}]},{"featureType":"water","elementType":"labels.text","stylers":[{"visibility":"simplified"},{"color":"#211267"}]},{"featureType":"water","elementType":"labels.icon","stylers":[{"weight":"2.54"},{"visibility":"off"}]}]}
                        showsUserLocation={true}
                    >
                     {this.display_markers()}   
                    </MapView>
                </View>
                
            }
          </View>
            
        );
    }
}