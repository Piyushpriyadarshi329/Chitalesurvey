// In App.js in a new project

import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import Auth from './src/Auth';


const Stack = createStackNavigator();

function App() {
  return (
<Auth />
    
    // <NavigationContainer>
    //   <Stack.Navigator>
    //     {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
    //     <Stack.Screen name="First" component={First} />
    //     <Stack.Screen name="Questionspage" component={Questionspage} />
        

    //   </Stack.Navigator>
    // </NavigationContainer>
  );
}

export default App;