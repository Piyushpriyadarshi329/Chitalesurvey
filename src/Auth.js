import React, {useEffect, useState, useReducer} from 'react';
import {View, Text} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import First from './First';
import Main from './Main';
import Edit from './Edit';
import Pending from './Pending';
import New from './New';
import Question from './Question';
import Whoru from './Whoru';
import Chillingcentre from './Chillingcentre';
import Supergavali from './Supergavali';
import Subgavali from './Subgavali';
import Utpadakcentre from './Utpadakcentre';
import Dairy from './Dairy';
import Gavali from './Gavali';
import Update  from './Update';
// adb shell screenrecord --output-format=h264 - | ffplay -



const Auth = () => {
  const Stack = createStackNavigator();

 

 

 return(
    <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Main" component={Main}options={{headerShown:false}}  />
      <Stack.Screen name="New" component={New}options={{headerShown:false}}  />
      <Stack.Screen name="Question" component={Question}options={{headerShown:false}}  />
      <Stack.Screen name="First" component={First}options={{headerShown:false}}  />
      <Stack.Screen name="Whoru" component={Whoru}options={{headerShown:false}}  />
      <Stack.Screen name="Chillingcentre" component={Chillingcentre}options={{headerShown:false}}  />
      <Stack.Screen name="Supergavali" component={Supergavali}options={{headerShown:false}}  />
      <Stack.Screen name="Subgavali" component={Subgavali}options={{headerShown:false}}  />
      <Stack.Screen name="Dairy" component={Dairy}options={{headerShown:false}}  />
      <Stack.Screen name="Gavali" component={Gavali}options={{headerShown:false}}  />
      <Stack.Screen name="Utpadakcentre" component={Utpadakcentre}options={{headerShown:false}}  />
      <Stack.Screen name="Pending" component={Pending}options={{title:'Pending'}}  />
      <Stack.Screen name="Edit" component={Edit}options={{title:"Edit"}}  />
      <Stack.Screen name="Update" component={Update}options={{title:"Update"}}  />
  
    </Stack.Navigator>
  </NavigationContainer>
 );
};

export default Auth;
