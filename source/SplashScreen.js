import React,{useEffect} from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


const SplashScreen = ({navigation}) => {

   
  useEffect(() => {


    setTimeout(() => { console.log("World!"); }, 2000);
    setTimeout(() => {  navigation.navigate("Start") }, 2000);
    var now = new Date().getTime();
    console.log("now",now)
  }, [])


    return (

        <View style={{flex:1}}>

        <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:24,fontWeight:'bold'}} >ऊसतोड कामगार सर्वेक्षण</Text>
        </View>


        {/* <View style={{flex:1}}>

<TouchableOpacity 
style={{flex:1}}
onPress={submithandler}
>
<View style={{flex:1,alignItems:'center',}}>
        <Text style={{fontSize:20}}>Start</Text>
    </View>
</TouchableOpacity>
</View> */}
     
        </View>
    )
}

export default SplashScreen
