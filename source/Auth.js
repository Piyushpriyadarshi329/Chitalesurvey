import React, {useEffect, useState, useReducer} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import First from './First';
import Login from './Login';
import Register from './Register';
import Questionspage from './Questionspage';
import Selectpage from './Selectpage';
import Toast from 'react-native-toast-message';
import AppFunctions from '../android/AppFunctions';
import uuid from 'uuid-random';
import SplashScreen from './SplashScreen';
import Start from './Start'


export const AuthContext = React.createContext();

const dbCreateSql = {
  qnsansCreateSQL: 
 'CREATE TABLE IF NOT EXISTS `qnsans` ( `recno` INTEGER NOT NULL, `shortguid` INTEGER NOT NULL, `descn` TEXT DEFAULT NULL,`mobile` TEXT DEFAULT NULL,`trdate` INTEGER NOT NULL,  `trtime` TEXT DEFAULT NULL, `question` TEXT DEFAULT NULL, `answer` TEXT DEFAULT NULL, `status` INTEGER NOT NULL,  PRIMARY KEY (`recno` AUTOINCREMENT) ) ;',
 surveyanswerfooterCreateSQL: 
 'CREATE TABLE IF NOT EXISTS `surveyanswerfooter` ( `recno` INTEGER NOT NULL,`tenant` INTEGER NOT NULL, `shortguid` INTEGER NOT NULL,`groupshortguid` INTEGER NOT NULL,`questiontype` INTEGER NOT NULL, `mainshortguid` INTEGER NOT NULL,`mainrecno` TEXT DEFAULT NULL,`questionrecno` TEXT DEFAULT NULL,`answer` INTEGER NOT NULL,  `answerimage` TEXT DEFAULT NULL, `answeroptions` TEXT DEFAULT NULL,  PRIMARY KEY (`recno` AUTOINCREMENT) ) ;',
 surveyanswerCreateSQL: 
 'CREATE TABLE IF NOT EXISTS `surveyanswer` ( `recno` INTEGER NOT NULL,`tenant` INTEGER NOT NULL, `shortguid` INTEGER NOT NULL,`domainrecno` TEXT DEFAULT NULL,`customerrecno` INTEGER DEFAULT NULL,  `fname` TEXT NOT NULL, `mobile` TEXT DEFAULT NULL, `latitude` TEXT DEFAULT NULL, `longitude` INTEGER NOT NULL, `trdate` INTEGER NOT NULL, `trtime` INTEGER NOT NULL, `mname` INTEGER NOT NULL, `lname` INTEGER NOT NULL, `surveyername` INTEGER NOT NULL, `serveyerrecno` INTEGER NOT NULL, `status` TEXT NOT NULL, PRIMARY KEY (`recno` AUTOINCREMENT) ) ;',

//status
//  p=>pending
//  c=>completed
//  s=>sync



  };

const initialAppState = {
  register: "false",
};

function reducer(prev, action) {
  switch (action.type) {
    case 'SIGN_IN':
      console.log(action.text)
      return {
        register: action.text,
      };
    case 'SIGN_OUT':
      console.log("sigout")
      return {
        register: "false",
      };
  }
}

const Auth = () => {
  const [state, dispatch] = useReducer(reducer, initialAppState);
  const Stack = createStackNavigator();

 

  useEffect(() => {
    createtable()
    getdetails();
  }, []);

  async function getdetails() {
    try {

      let registerasync = await AsyncStorage.getItem('register');
      if(registerasync!=null){
  
        dispatch({
          type: 'SIGN_IN',
          text: registerasync,
        });
      }else{
        dispatch({
          type: 'SIGN_IN',
          text: "false",
        });
      }
      
    } catch (e) {
      console.log(e)
      
    }
  

  }

  async function createtable(){
    try {
      
    //   console.log("create table fun call")
    //   await AppFunctions.ExecuteQuery( 'drop table IF EXISTS qnsans', );
    //   await AppFunctions.ExecuteQuery( 'drop table IF EXISTS surveyanswer', );
    //   await AppFunctions.ExecuteQuery( 'drop table IF EXISTS surveyanswerfooter', );
      AppFunctions.ExecuteQuery(dbCreateSql.qnsansCreateSQL)
      AppFunctions.ExecuteQuery(dbCreateSql.surveyanswerCreateSQL)
      AppFunctions.ExecuteQuery(dbCreateSql.surveyanswerfooterCreateSQL)
    } catch (error) {
      console.log("Error:",error)
      
    }


  }


  console.log("state",state.register)
  console.log(state.register=="false")
  console.log(state.register==false)


  return (state.register =="false" ) ? (
    <AuthContext.Provider value={{state: state, dispatch: dispatch}}>
      <NavigationContainer>
        <Stack.Navigator>
        {/* <Stack.Screen name="SplashScreen" component={SplashScreen} /> */}
        <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Selectpage" component={Selectpage} />
          <Stack.Screen name="First" component={First} />
          <Stack.Screen name="Start" component={Start} />
          <Stack.Screen name="Questionspage" component={Questionspage} />
          <Stack.Screen name="Register" component={Register} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  ) : (
    <AuthContext.Provider value={{state: state, dispatch: dispatch}}>
      <NavigationContainer>
        <Stack.Navigator>
        {/* <Stack.Screen name="SplashScreen" component={SplashScreen} /> */}
          <Stack.Screen name="Selectpage" component={Selectpage} />
          {/* <Stack.Screen name="Login" component={Login} /> */}

          <Stack.Screen name="First" component={First} />
          <Stack.Screen name="Questionspage" component={Questionspage} />
          <Stack.Screen name="Register" component={Register} />
          <Stack.Screen name="Start" component={Start} />

          {/* <Stack.Screen name="Login" component={Login} /> */}

        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default Auth;
