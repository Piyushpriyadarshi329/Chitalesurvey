import React, {useState, useEffect, useContext} from 'react';
import {View, Text, Button, TextInput, ToastAndroid} from 'react-native';
// import SelectPicker from 'react-native-form-select-picker'; // Import the package
// import RNPickerSelect from 'react-native-picker-select';
import {Picker} from '@react-native-community/picker';
import axios from 'axios';
import AppConstants from '../AppConstants';
import GetLocation from 'react-native-get-location';
import Toast from 'react-native-simple-toast';
import AsyncStorage from '@react-native-community/async-storage';
import {AuthContext} from './Auth';

const Login = ({navigation}) => {
  const [surveyerHeader, setSurveyerHeader] = useState({
    loginid: '',
    password: '',
  });
  const auth = useContext(AuthContext);

  async function addSurveyerHeader() {
    // alert(surveyerHeader)

    var logindata = await axios.post(
      AppConstants.url + 'verifylogin/',
      surveyerHeader,
    );
    // alert(logindata.data)
    // console.log('surveyerdata......', logindata.data);
    if (logindata.data.Success == true) {
      if (logindata.data.Message.active == true) {
        // alert("case=1")
        AsyncStorage.setItem('register', 'true');
        AsyncStorage.setItem('datakey', JSON.stringify([]));
        AsyncStorage.setItem('descn', logindata.data.Message.descn);
        AsyncStorage.setItem('recno', logindata.data.Message.recno.toString());
        AsyncStorage.setItem('tenant', logindata.data.Message.tenant.toString());
        // auth.dispatch({
        //   type: 'SIGN_IN',
        //   text: 'true',
        // });
        navigation.navigate('Selectpage');
      } else {
        // alert("case=2")

        navigation.navigate('Register', {
          data: data.data.Message,
        });
      }
    } else {
      // alert("case=3")

      alert('Worng loginid or password');
    }
  }

  return (
    <View style={{flex: 1, padding: 20}}>
      <Text style={{textAlign: 'center', fontSize: 20, marginTop: 20}}>
        Login Page
      </Text>
      <View style={{flexDirection: 'column'}}>
        <View style={{padding: 10, flexDirection: 'row', marginTop: 20}}>
          <Text style={{flex: 1, textAlignVertical: 'center'}}>Login Id :</Text>
          <TextInput
            style={{
              flex: 2,
              borderColor: 'black',
              borderWidth: 1,
              borderRadius: 10,
            }}
            placeholder="Login Id"
            onChangeText={text => {
              setSurveyerHeader(prev => {
                prev.loginid = text;

                console.log('Survey Header..', prev);
                return {
                  ...prev,
                };
              });
            }}></TextInput>
        </View>
        <View style={{padding: 10, flexDirection: 'row', marginTop: 20}}>
          <Text style={{flex: 1, textAlignVertical: 'center'}}>Password :</Text>
          <TextInput
            secureTextEntry={true}
            style={{
              flex: 2,
              borderColor: 'black',
              borderWidth: 1,
              borderRadius: 10,
            }}
            placeholder="Password"
            onChangeText={text => {
              setSurveyerHeader(prev => {
                prev.password = text;

                console.log('Survey Header..', prev);
                return {
                  ...prev,
                };
              });
            }}></TextInput>
        </View>

        <View style={{marginTop: 20}}>
          <Button
            style={{marginTop: 50}}
            onPress={() => addSurveyerHeader()}
            title="Submit"></Button>
        </View>
      </View>
    </View>
  );
};

export default Login;
