import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import RNLocation from 'react-native-location';
import axios from 'axios';
import AppConstants from './AppConstants';

const Update = ({navigation, route}) => {
  const {data} = route.params;
  console.log('data...', data);
  const [Data, setData] = useState(data);

  const [latitude, setlatitude] = useState('');
  const [longitude, setlongitude] = useState('');

  useEffect(() => {
    getlocation();
  }, []);

  async function getlocation() {
    RNLocation.configure({
      distanceFilter: 5.0,
    });

    let permission = await RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'coarse', // or 'fine'
      },
    });

    if (!permission) {
      permission = await RNLocation.requestPermission({
        ios: 'whenInUse',
        android: {
          detail: 'coarse',
          rationale: {
            title: 'We need to access your location',
            message: 'We use your location to show where you are on the map',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        },
      });
    }

    var location = await RNLocation.getLatestLocation({timeout: 60000});
    console.log('location...............', location);
    // setData(prev => {
    //   (prev.latitude = location.latitude),
    //     (prev.longitude = location.longitude);

    //   return {
    //     ...prev,
    //   };
    // });
    setlatitude(location.latitude);
    setlongitude(location.longitude);
  }

  async function submithandler() {
    var senddataapi = {
      ...Data,
      latitude: latitude,
      longitude: longitude,
      surveyrecno: Data.recno,
    };

    var res = await axios.post(
      AppConstants.ChitaleSurveyAPIUrl + '/updatesurvey/',
      senddataapi,
    );
    console.log('response', res.data);
    if(res.data.Success){
        alert("You Update Successfully")
        navigation.navigate('Main')

    }
  }

  return (
    <View style={{flex: 1, marginHorizontal: 20}}>
      <ScrollView>
        <View style={{flex: 1, flexDirection: 'row', marginTop: 20}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 24}}>Name:</Text>
          </View>
          <View style={{flex: 2}}>
            <TextInput
              style={{flex: 1, borderWidth: 1, borderRadius: 5}}
              value={Data.descn}
              onChangeText={text => {
                setData(prev => {
                  prev.descn = text;

                  return {...prev};
                });
              }}></TextInput>
          </View>
        </View>

        <View style={{flex: 1, flexDirection: 'row', marginTop: 20}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 24}}>mobile:</Text>
          </View>
          <View style={{flex: 2}}>
            <TextInput
              style={{flex: 1, borderWidth: 1, borderRadius: 5}}
              value={Data.mobile.toString()}
              onChangeText={text => {
                setData(prev => {
                  prev.mobile = text;

                  return {...prev};
                });
              }}></TextInput>
          </View>
        </View>
        <View style={{flex: 1, flexDirection: 'row', marginTop: 20}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 24}}>Email Id:</Text>
          </View>
          <View style={{flex: 2}}>
            <TextInput
              style={{flex: 1, borderWidth: 1, borderRadius: 5}}
              value={Data.email}
              onChangeText={text => {
                setData(prev => {
                  prev.email = text;

                  return {...prev};
                });
              }}></TextInput>
          </View>
        </View>

        <View style={{flex: 1, flexDirection: 'row', marginTop: 20}}>
          <TouchableOpacity
            style={{
              backgroundColor: 'dodgerblue',
              flex: 1,
              alignItems: 'center',
              borderRadius: 5,
              marginHorizontal: 120,
            }}
            onPress={submithandler}>
            <View>
              <Text style={{fontSize: 26, padding: 5}}>Submit</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Update;
