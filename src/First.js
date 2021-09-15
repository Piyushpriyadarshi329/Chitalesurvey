import React,{useState} from 'react'
import { View, Text } from 'react-native';
import {Picker} from '@react-native-community/picker';
import { TouchableOpacity } from 'react-native-gesture-handler';


const First = () => {
    const [selected, setSelected] = useState();


const [type, settype] = useState([
{label:"Chilling Centre",value:'Chilling Centre'},
{label:"Super Gavali",value:'Super Gavali'},
{label:"Sub Gavali",value:'Sub Gavali'},
{label:"Chitale Dairy",value:'Chitale Dairy'},
{label:"Utpadak Centre",value:'Utpadak Centre'},

])


    return (
        <View style={{flex:1}}>
          <View style={{padding: 10, flexDirection: 'row', marginTop: 40}}>
            <Text style={{flex: 1}}> Who are you: </Text>

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
                {type.map(item => {
                  return <Picker.Item label={item.label} value={item.value} />;
                })}
              </Picker>
            </View>
          </View>
          <TouchableOpacity style={{justifyContent:'center',backgroundColor:'dodgerblue',marginHorizontal:100,borderRadius:5,marginTop:20}}>
              <View>
                  <Text style={{textAlign:'center',fontSize:20}}>
                      Submit
                  </Text>
              </View>
          </TouchableOpacity>


        </View>
    )
}

export default First
