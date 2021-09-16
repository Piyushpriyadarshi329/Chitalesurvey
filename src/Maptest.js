import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions, StyleSheet} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import axios from 'axios';
import AppConstants from './AppConstants';
import {Picker} from '@react-native-community/picker';


import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps
import GetLocation from 'react-native-get-location';
import MapViewDirections from 'react-native-maps-directions';
const windowWidth = Dimensions.get('window').width;

const windowHeight = Dimensions.get('window').height;

// var cord = [
//   {latitude: 37.8025259, longitude: -122.4351431},
//   {latitude: 37.7896386, longitude: -122.421646},
//   {latitude: 37.7665248, longitude: -122.4161628},
//   {latitude: 37.7734153, longitude: -122.4577787},
//   {latitude: 37.7948605, longitude: -122.4596065},
//   {latitude: 37.8025259, longitude: -122.4351431},
// ];

// function Maptest() {
const Maptest = ({navigation, route}) => {
  const [coard, setcoard] = useState([{
          latitude: 17.0410971,
      longitude: 74.7486717,
    descn:'hello',
    mobile:'111'
    }
]);
  const [center, setcenter] = useState({  
       latitude: 17.0410971,
    longitude: 74.7486717,});
  const [type, settype] = useState();
  const [allmember, setallmember] = useState([]);
  const [linkrecno, setlinkrecno] = useState("1");

const alltype=
[
    {
        "recno": 1,
        "descn": "Chitale Dairy",
        "active": 1
    },
    {
        "recno": 2,
        "descn": "Chilling Center",
        "active": 1
    },
    {
        "recno": 3,
        "descn": "Super Gavali",
        "active": 1
    },
    {
        "recno": 4,
        "descn": "Gavali",
        "active": 1
    },
    {
        "recno": 5,
        "descn": "Sub Gavali",
        "active": 1
    },
    {
        "recno": 6,
        "descn": "Utpadak",
        "active": null
    }
]
  useEffect(() => {
    getlocationdata();
  }, [linkrecno]);

  async function getlocationdata() {
    var newdata = [];
    console.log("linkrecno",linkrecno)
    var res = await axios.post(
      'http://dev.sutradhar.tech/chitalepop/api/v1/getsurveydata/',
      {linkrecno: linkrecno},
    );
    console.log('response', res.data.Message);

    res.data.Message.map(item => {
      var localdata = {
        location: {
          latitude: Number(item.latitude),
          longitude: Number(item.longitude),
        },
        descn: item.descn,
        mobile: item.mobile,
      };
      setcenter({...{
        latitude: Number(item.latitude),
        longitude: Number(item.longitude),
      }});
      newdata.push(localdata);
    });

    setcoard(newdata);
  }


  async function getallmember(recno) {


   if(recno==1){
       setlinkrecno(recno)
   }else{

       var res = await axios.post(
         AppConstants.ChitaleSurveyAPIUrl + '/getmemtypesurvey/',
         {memtype: recno},
       );
       console.log('member response', res.data);
       setallmember(res.data.Message);
   }

    
  }
 
  const GOOGLE_MAPS_APIKEY = 'AIzaSyCpAysZIplAqguTrjaOKu_i6MLRV1Ez-SI';

  return (
    <View style={styles.container}>
<View style={{width:windowWidth,backgroundColor:'lightgray',height:100,flexDirection: 'row',}}>
   
<View style={{padding: 10,  marginTop: 40,flex:1}}>

            <View
              style={{
                borderWidth: 1,
                height: 50,
                borderRadius: 5,

                flex: 2,
              }}>
            <Picker
    selectedValue={type}
    itemStyle={{textAlign: 'center'}}
    onValueChange={(itemValue, itemIndex) =>{

        settype(itemValue)
        getallmember(itemValue)
    }
    }>
    {alltype.map(item => {
      return <Picker.Item label={item.descn} value={item.recno} />;
    })}
  </Picker>
            </View>
          </View>

   
          <View style={{padding: 10,  marginTop: 40,flex:1}}>

<View
  style={{
    borderWidth: 1,
    height: 50,
    borderRadius: 5,

    flex: 2,
  }}>
  <Picker
    selectedValue={linkrecno}
    itemStyle={{textAlign: 'center'}}
    onValueChange={(itemValue, itemIndex) =>
        setlinkrecno(itemValue)
    }>
    {allmember.map(item => {
      return <Picker.Item label={item.descn} value={item.recno} />;
    })}
  </Picker>
</View>
</View>


</View>

      <MapView
        provider={PROVIDER_GOOGLE} // remove if not using Google Maps
        style={styles.map}
        region={{
            latitude: center.latitude,
            longitude: center.longitude,
        //   latitude: 17.0410971,
        //   longitude: 74.7486717,
          latitudeDelta: 0.015,
          longitudeDelta: 0.0121,
        }}>
        {coard.map((item, index) => {
          return (
            <Marker
              key={index.toString()}
              coordinate={item.location}
              title={'Name: ' + item.descn + '  Mobile:' + item.mobile}
            />
          );
        })}
      

        {coard.map((item, index) => {


          return (
            <View key={index.toString()}>
              {(index < coard.length - 1 && coard.length>2)? (
                <MapViewDirections
                  origin={coard[index].location}
                  destination={coard[index + 1].location}
                  apikey={GOOGLE_MAPS_APIKEY}
                  strokeWidth={3}
                  strokeColor="dodgerblue"
                />
              ) : null}
            </View>
          );
        })}
      </MapView>
    </View>
  );
};

export default Maptest;

const styles = StyleSheet.create({
  container: {
    // ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    // ...StyleSheet.absoluteFillObject,
    height:windowHeight-100,
    width:windowWidth
  },
});
