import React from 'react';
import { View, Text, Dimensions, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Bar } from 'react-native-progress';
import Constants from 'expo-constants';
import { SvgXml } from "react-native-svg";
import { NavigationEvents } from 'react-navigation';

const twoTiersWidth = Dimensions.get("window").width * 2 / 3;

export default class WCMap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mapRegion: null,
            locationResult: null,
            markers: [],
            api_token: global.infos.api_token,
            usr_token: global.infos.user_token,
        };
    }

    buildsvg(choice, note) {
        const label = {
            'test': '#ff970f',
            'your':'#1C94FE',
            'shared': '#79befa',
        };

        const basenote = [
            ["#ff4444", "#aa0000"],
            ["#ffff0f", "#ff970f"],
            ["#03ff00", "#039900"]
        ];

        let svg = '\
        <svg height="558pt" viewBox="0 0 558 558" width="558pt" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
            <linearGradient id="a" gradientUnits="userSpaceOnUse" x1="0" x2="558" y1="279" y2="279">\
                <stop offset="0" stop-color="' + basenote[Math.floor(note / 7)][0] + '"/>\
                <stop offset="1" stop-color="' + basenote[Math.floor(note / 7)][1] + '"/>\
            </linearGradient>\
            <circle cx="279" cy="279" r="279" fill="' + label[choice] + '"/>\
            <path d="m279, 279m -250, 0a 250,250 0 1,0 500,0 a 250,250 0 1,0 -500,0" fill="url(#a)"/>\
            <path d="m425.960938 106.542969c-14.636719 0-26.5 11.863281-26.5 26.496093 0 1.726563.171874 3.414063.484374 5.046876l-36.210937 36.210937c-13.574219-8.984375-29.84375-13.367187-47.089844-12.472656-24.167969 1.257812-48.273437 12.789062-69.71875 33.351562-.664062.640625-1.324219 1.285157-1.984375 1.945313-32.925781 32.925781-62.105468 70.882812-80.0625 104.136718-23.480468 43.492188-22.882812 70.320313-15.035156 86.6875l-33.90625 33.90625c-5.859375 5.855469-5.859375 15.351563 0 21.210938 2.929688 2.929688 6.765625 4.394531 10.605469 4.394531 3.839843 0 7.679687-1.464843 10.605469-4.394531l34.121093-34.121094c6.136719 2.8125 13.636719 4.609375 22.824219 4.609375 18.851562 0 44.742188-7.539062 80.207031-29.214843 7.066407-4.320313 9.292969-13.554688 4.972657-20.621094-4.320313-7.070313-13.550782-9.300782-20.621094-4.976563-37.941406 23.195313-68.242188 30.867188-79.078125 20.03125-9.128907-9.128906-4.753907-32.777343 11.703125-63.257812 13.46875-24.949219 34.78125-53.933594 58.882812-80.402344l73.957032 73.957031c-5.660157 5.128906-11.488282 10.167969-17.449219 15.085938-6.390625 5.273437-7.296875 14.726562-2.027344 21.117187 5.273437 6.390625 14.726563 7.296875 21.117187 2.027344 12.796876-10.558594 25.03125-21.65625 36.367188-32.992187.664062-.664063 1.320312-1.332032 1.949219-1.992188 20.558593-21.4375 32.089843-45.542969 33.347656-69.707031.894531-17.257813-3.488281-33.519531-12.472656-47.09375l36.382812-36.382813c1.503907.261719 3.046875.410156 4.628907.410156 14.632812 0 26.496093-11.863281 26.496093-26.5 0-14.632812-11.863281-26.496093-26.496093-26.496093zm-58.5 134.503906c-.8125 15.679687-8.359376 31.867187-21.871094 47.0625l-74.457032-74.453125c15.191407-13.507812 31.382813-21.058594 47.066407-21.871094 13.664062-.707031 26.183593 3.796875 35.402343 12.679688.183594.207031.359376.421875.558594.621094.199219.199218.414063.375.621094.558593 8.882812 9.21875 13.390625 21.75 12.679688 35.402344zm0 0" fill="#fff"/>\
        </svg>\
        '
        
        return <SvgXml xml={svg} width="40" height="40"/>;
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
        this._request_get_all_floater_infos();
        this.getCurrentPosition();
        this.forceUpdate();
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
                this.setState({markers: this.getMarkers(responseJson['data']['points'])})
            }
        }
        catch (error) {
            this.setState({
                error:'Cann\'t connect to server'
            })
        }        
      }

    getMarkers (data) {
        let markers = []
        data.proprietary.map(floater => {
            if(floater['data'].length > 0){
                markers.push(
                    {
                        id: floater['id'],
                        latlng: {
                            latitude: parseFloat(floater['data'][0]["data"]["pos"]['lat']),
                            longitude: parseFloat(floater['data'][0]["data"]["pos"]['lng'])
                        },
                        name: floater['name'],
                        since: new Date(floater['date'] / 1000).toLocaleDateString("en-US"),
                        lastReport: new Date(floater['data'][floater['data'].length-1]['date'] / 1000).toLocaleDateString("en-US"),
                        note: floater['data'][floater['data'].length-1]['data']['data']['note'],
                        progressBar: {
                            note: floater['data'][floater['data'].length-1]['data']['data']['note']/20,
                            color: this.getColorFromNote(floater['data'][floater['data'].length-1]['data']['data']['note']*10)
                        },
                        shared: false,
                        test: floater['test']
                    }
                );
            }
        })
        data.shared.map(floater => {
            if(floater['data'].length > 0){
                markers.push(
                    {
                        id: floater['id'],
                        latlng: {
                            latitude: parseFloat(floater['data'][0]["data"]["pos"]['lat']),
                            longitude: parseFloat(floater['data'][0]["data"]["pos"]['lng'])
                        },
                        name: floater['name'],
                        since: new Date(floater['date'] / 1000).toLocaleDateString("en-US"),
                        lastReport: new Date(floater['data'][floater['data'].length-1]['date'] / 1000).toLocaleDateString("en-US"),
                        note: floater['data'][floater['data'].length-1]['data']['data']['note'],
                        progressBar: {
                            note: floater['data'][floater['data'].length-1]['data']['data']['note']/20,
                            color: this.getColorFromNote(floater['data'][floater['data'].length-1]['data']['data']['note']*10)
                        },
                        shared: true,
                        test: floater['test']
                    }
                );
            }
        })
        return markers;
    }


    display_markers(){
        return(
            this.state.markers.map(marker =>
                {
                    if(marker){
                        if(marker.note == 0)
                            marker.note = 0.5;
                        let label = marker.shared ? 'shared' : (marker.test ? 'test' : 'your')
                        return(
                            <Marker key={marker.id} coordinate={marker.latlng} anchor={{x: 0.5, y: 0.5}} ref={marker.id}>
                                {this.buildsvg(label, marker.note)}
                                    <Callout onPress={() => this._details(marker.id, marker.name, label )} style={{width: twoTiersWidth,paddingVertical: 10}}>
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
                                            <Text style={{fontWeight: "bold"}}>Score: </Text>
                                            <Text>{marker.note == 0.5 ? 0 : marker.note} / 20</Text>
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

    _details = (id, floater_name, label) => {
        this.setState({markers:[]})
        this.props.navigation.navigate('Details', {floater_id:id, floater_name:floater_name, back_to_map:true, floater_type:label});
    }
    
    render() {
        return (
          <View style={{flex: 1, marginTop: Constants.statusBarHeight,}}>
            {
                this.state.mapRegion === null ?
                    <Text>Finding your current location...</Text> 
                :
                    <View style={{flex: 1}}>
                        <NavigationEvents onDidFocus={() => this._request_get_all_floater_infos()}/> 
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