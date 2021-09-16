import React from 'react'
import { View, Text } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

const Main = ({navigation}) => {
    return (
        <View style={{flex:1}}>


            <TouchableOpacity  style={{backgroundColor:'dodgerblue',marginTop:200,marginHorizontal:100,borderRadius:5}}
               onPress={()=>{
                navigation.navigate("New")
                            }}
            >
               <View>
               <Text style={{fontSize:28,textAlign:'center'}}>
                    New
                    </Text>
               </View>

            </TouchableOpacity>
            <TouchableOpacity  style={{backgroundColor:'dodgerblue',marginTop:20,marginHorizontal:100,borderRadius:5}}
               onPress={()=>{
                navigation.navigate("Pending")
                            }}
            >
               <View>
               <Text style={{fontSize:28,textAlign:'center'}}>
                    Pending
                    </Text>
               </View>

            </TouchableOpacity>
            <TouchableOpacity  style={{backgroundColor:'lightgray',marginTop:20,marginHorizontal:100,borderRadius:5}}
            onPress={()=>{
navigation.navigate("Edit")
            }}
            >
               <View>
               <Text style={{fontSize:28,textAlign:'center'}}>
                    Edit
                    </Text>
               </View>

            </TouchableOpacity>

            {/* <TouchableOpacity  style={{backgroundColor:'lightgray',marginTop:20,marginHorizontal:100,borderRadius:5}}
            onPress={()=>{
navigation.navigate("Testing")
            }}
            >
               <View>
               <Text style={{fontSize:28,textAlign:'center'}}>
                    Testing
                    </Text>
               </View>

            </TouchableOpacity> */}
            <TouchableOpacity  style={{backgroundColor:'lightgray',marginTop:20,marginHorizontal:100,borderRadius:5}}
            onPress={()=>{
navigation.navigate("Maptest")
            }}
            >
               <View>
               <Text style={{fontSize:28,textAlign:'center'}}>
                    Map
                    </Text>
               </View>

            </TouchableOpacity>
        </View>
    )
}

export default Main
