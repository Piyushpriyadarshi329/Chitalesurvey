import React from 'react'
import { View, Text,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


const Start = ({navigation}) => {




    async function submithandler() {
        try {
    
          let registerasync = await AsyncStorage.getItem('register');
          if(registerasync!=null){
      
            navigation.navigate("Selectpage")
          }else{
            navigation.navigate("Login")

          }
          
        } catch (e) {
          console.log(e)
          
        }
      
    
      }
    return (
        <View style={{flex:1}}>


<View style={{flex:4,alignItems:'center',justifyContent:'center'}}>
            <Text style={{fontSize:24,fontWeight:'bold'}} >नोंदणीकृत होण्यासाठी खाली क्लिक करा</Text>
        </View>

        <TouchableOpacity 
        style={{flex:1,backgroundColor:'dodgerblue',marginHorizontal:100,borderRadius:10}}
        onPress={submithandler}
        >
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontSize:24,fontWeight:'bold'}}>Start</Text>
            </View>
        </TouchableOpacity>
        <View style={{flex:4}}>

        </View>
    </View>
    )
}

export default Start
