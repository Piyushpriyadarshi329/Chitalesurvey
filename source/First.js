import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  ToastAndroid,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import axios from 'axios';
import AppConstants from '../AppConstants';
import RNLocation from 'react-native-location';
import Toast from 'react-native-simple-toast';
import {AuthContext} from './Auth';
import AsyncStorage from '@react-native-community/async-storage';
import uuid from 'uuid-random';
import AppFunctions from '../android/AppFunctions';


const First = ({navigation}) => {
  const auth = useContext(AuthContext);

  const [selected, setSelected] = useState();
  const [surveyType, setSurveyType] = useState([]);
  const [datakey, setdatakey] = useState([]);
  const [surveyHeader, setSurveyHeader] = useState({
    domainrecno:0,
    customerrecno:0,
    fname: '',
    mname: '',
    lname: '',
    mobile: '',
    latitude: '',
    longitude: '',
    surveyername: '',
    surveyerrecno: '',
    trdate: Number(AppConstants.today()),
    trtime: Number(AppConstants.now()),
  });

  useEffect(() => {
    getlocation();
    getSurveyType();
    getasyncstrogedata();
  }, []);

  


  async function getasyncstrogedata() {
    let descn = await AsyncStorage.getItem('descn');
    let recno = await AsyncStorage.getItem('recno');
    // console.log("surveyrecno",recno)

    setSurveyHeader(prev => {
      (prev.surveyername = descn), (prev.surveyerrecno = Number(recno));

      return {
        ...prev,
      };
    });
  }

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
    setSurveyHeader(prev => {
      (prev.latitude = location.latitude),
        (prev.longitude = location.longitude);

      return {
        ...prev,
      };
    });
  }

  async function getSurveyType() {
    var tenant = await AsyncStorage.getItem('tenant');

    const res = await axios.get(AppConstants.url +'/surveytype/'+tenant+'/');
    console.log("surveytyperesponse",res.data)
    setSurveyType(res.data.Message);
  }

  async function addSurveyHeader() {
    try {
      var tenant = await AsyncStorage.getItem('tenant');


      if (surveyHeader.fname == '') {
        alert('Please enter First Name');
        return;
      } else if (surveyHeader.latitude == '' && surveyHeader.longitude == '') {
        alert('Please allow Loction  Permission from setting');
        getlocation();
  
        return;
      } else if (surveyHeader.mobile == '') {
        alert('Please enter mobile number');
        return;
      }


      var data = await axios.post(
        AppConstants.url + 'surveyanswers/',
        {...surveyHeader,shortguid:uuid(),tenant:tenant},
      );

      if (data.data.Success == true) {
        Toast.show('Start Survey Now..', Toast.SHORT, [
          'RCTModalHostViewController',
        ]);
      var shortguid=uuid()

      
  
        var newsurvey = {
          name: surveyHeader.fname,
          mobile: surveyHeader.mobile,
          question: [],
          answer: [],
          mainrecno: data.data.Message,
        };
  
        AsyncStorage.setItem(
          surveyHeader.mobile.toString(),
          JSON.stringify(newsurvey),
        );

  var answer=[]
  var question=[]
  
        const qnsansInsertString = `insert into qnsans('shortguid','tenant',descn', 'mobile', 'trdate', 'trtime', 'question', 'answer', 'status') values(${AppFunctions.insertQuestionMarks(
          9,
        )})`;


        // 'CREATE TABLE IF NOT EXISTS `surveyanswer` ( `recno` INTEGER NOT NULL, `shortguid` INTEGER NOT NULL, `tenantrecno` TEXT DEFAULT NULL,
        // `domainrecno` TEXT DEFAULT NULL,`customerrecno` INTEGER NOT NULL,  `fname` TEXT DEFAULT NULL, `mobile` TEXT DEFAULT NULL, `latitude` TEXT DEFAULT NULL, `longitude` INTEGER NOT NULL, `trdate` INTEGER NOT NULL, `trtime` INTEGER NOT NULL, `mname` INTEGER NOT NULL, `lname` INTEGER NOT NULL, `surveyername` INTEGER NOT NULL, `serveyerrecno` INTEGER NOT NULL, PRIMARY KEY (`recno` AUTOINCREMENT) ) ;',


        AppFunctions.ExecuteQuery(
          qnsansInsertString,
          [
            shortguid,
            tenant,
            surveyHeader.fname,
            surveyHeader.mobile,
            AppConstants.today(),
            AppConstants.now(),
            JSON.stringify(question),
            JSON.stringify(answer),
            'P',
          ],
        )

        const surveyanswerInsertString = `insert into  surveyanswer('shortguid','tenant', 'domainrecno', 'customerrecno', 'fname', 'mobile', 'latitude', 'longitude','trdate','trtime','mname','lname','serveyerrecno','surveyername',status) values(${AppFunctions.insertQuestionMarks(
          15,
        )})`;
        AppFunctions.ExecuteQuery(
          surveyanswerInsertString,
          [
            shortguid,
            tenant,
            surveyHeader.domainrecno,
            surveyHeader.customerrecno,
            surveyHeader.fname,
            surveyHeader.mobile,
            surveyHeader.latitude,
            surveyHeader.longitude,
            AppConstants.today(),
            AppConstants.now(),
            surveyHeader.mname,
            surveyHeader.lname,
            surveyHeader.surveyerrecno,
            surveyHeader.surveyername,
            "P"
          ],
        )
  
  
        var datakeya = await AsyncStorage.getItem('datakey');
        datakeya = JSON.parse(datakeya);
        console.log('datakey??????????/', datakeya);
  
        let newdata = {
          mobile: surveyHeader.mobile,
          name: surveyHeader.fname,
          mainrecno: data.data.Message,
        };
  
        datakeya.push(newdata);
  
        AsyncStorage.setItem('datakey', JSON.stringify(datakeya));


        navigation.navigate('Questionspage', {
          surveyType: selected,
          mainrecno: data.data.Message,
          mobile: surveyHeader.mobile,
          newsurvey: true,
          shortguid:shortguid
        });


      } else {
        alert(data.data.Message);
      }
      
    } catch (e) {
      console.log("Error: =>addSurveyHeader",e)
      
    }
  }
  return (
    <ScrollView>
      <View style={{flex: 1, padding: 20}}>
        {/* <View>
          <Button
            title="Logout"
            onPress={() => {
              console.log("logout")
              AsyncStorage.clear();
              AsyncStorage.setItem('register', "false");

              auth.dispatch({
                type: 'SIGN_OUT',
              });
              // navigation.navigate('Login')
            }}></Button>
        </View> */}

        <Text style={{textAlign: 'center', fontSize: 20, marginTop: 20}}>
          Survey App
        </Text>
        <View style={{flexDirection: 'column'}}>
          
          <View style={{padding: 10, flexDirection: 'row', marginTop: 40}}>
            <Text style={{flex: 1}}> Select Survey Type: </Text>

            <View
              style={{
                borderWidth: 1,
                height: 50,
                borderRadius: 5,

                flex: 2,
              }}>
              <Picker
                selectedValue={selected}
                itemStyle={{textAlign: 'center'}}
                onValueChange={(itemValue, itemIndex) =>
                  setSelected(itemValue)
                }>
                {surveyType.map(item => {
                  return <Picker.Item label={item.descn} value={item.recno} />;
                })}
              </Picker>
            </View>
          </View>

          <View style={{padding: 10, flexDirection: 'row', marginTop: 20}}>
            <Text style={{flex: 1, textAlignVertical: 'center'}}>
              First Name :
            </Text>
            <TextInput
              style={{
                flex: 2,
                borderColor: 'black',
                borderWidth: 1,
                borderRadius: 10,
              }}
              placeholder="First Name"
              onChangeText={text => {
                setSurveyHeader(prev => {
                  prev.fname = text;

                  return {
                    ...prev,
                  };
                });
              }}></TextInput>
          </View>
          <View style={{padding: 10, flexDirection: 'row', marginTop: 20}}>
            <Text style={{flex: 1, textAlignVertical: 'center'}}>
              Middle Name :
            </Text>
            <TextInput
              style={{
                flex: 2,
                borderColor: 'black',
                borderWidth: 1,
                borderRadius: 10,
              }}
              placeholder="Middle Name"
              onChangeText={text => {
                setSurveyHeader(prev => {
                  prev.mname = text;

                  return {
                    ...prev,
                  };
                });
              }}></TextInput>
          </View>
          <View style={{padding: 10, flexDirection: 'row', marginTop: 20}}>
            <Text style={{flex: 1, textAlignVertical: 'center'}}>
              Last Name :
            </Text>
            <TextInput
              style={{
                flex: 2,
                borderColor: 'black',
                borderWidth: 1,
                borderRadius: 10,
              }}
              placeholder="Last Name"
              onChangeText={text => {
                setSurveyHeader(prev => {
                  prev.lname = text;

                  return {
                    ...prev,
                  };
                });
              }}></TextInput>
          </View>

          <View style={{padding: 10, flexDirection: 'row', marginTop: 20}}>
            <Text style={{flex: 1}}> Mobile No. : </Text>
            <TextInput
              style={{
                flex: 2,
                borderColor: 'black',
                borderWidth: 1,
                borderRadius: 10,
              }}
              placeholder="Enter Mobile"
              keyboardType="numeric"
              onChangeText={text => {
                setSurveyHeader(prev => {
                  prev.mobile = Number(text);

                  return {
                    ...prev,
                  };
                });
              }}></TextInput>
          </View>

          <View style={{marginTop: 20}}>
            <Button
              onPress={() => addSurveyHeader()}
              title="Start Survey"></Button>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default First;
