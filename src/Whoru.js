import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {ScrollView, TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';

const Whoru = ({navigation}) => {
  const [selected, setSelected] = useState();

  const [option, setoption] = useState([
    {label: 'Chilling Centre', value: 'Chilling Centre'},
    {label: 'Super Gavali', value: 'Super Gavali'},
    {label: 'Sub Gavali', value: 'Sub Gavali'},
    {label: 'Utpadak Centre', value: 'Utpadak Centre'},
  ]);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 20,
      }}>
          <ScrollView>



     
     
      <View style={{flex: 3,flexDirection:'row',marginTop:20}}>
          <View style={{flex:1}}>

        <Text style={{fontSize: 28}}>Who R You ?</Text>
          </View>

        <View style={{flex:1}}>
          {option.map(itm => {
            return (
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <RadioButton
                  value="first"
                  status={selected === itm.value ? 'checked' : 'unchecked'}
                  onPress={() => {
                    // setanswer(p => {
                    //   p[index].answer = itm.value;
                    //   console.log('p', p);
                    //   return [...p];
                    // });
                    setSelected(itm.value);
                  }}
                />
                <Text style={{marginTop: 8}}> {itm.label}</Text>
              </View>
            );
          })}
        </View>
      </View>



<View>

    <TouchableOpacity style={{flex:1,backgroundColor:"dodgerblue",marginHorizontal:100,borderRadius:5,marginTop:10}}
    onPress={()=>{

navigation.navigate('Question')

    }}
    >
        <View style={{flex:1}}>
            <Text style={{fontSize:20,textAlign:'center'}}>
Start
            </Text>
        </View>
    </TouchableOpacity>
    </View>
<View>

    <TouchableOpacity style={{flex:1,backgroundColor:"dodgerblue",marginHorizontal:100,borderRadius:5,marginTop:10}}
       onPress={()=>{

        navigation.navigate('Question')
        
            }}
    >
        <View style={{flex:1}}>
            <Text style={{fontSize:20,textAlign:'center'}}>
Pause
            </Text>
        </View>
    </TouchableOpacity>
    </View>


    
        <View style={{flex:3,backgroundColor:'red'}}>

        </View>
        </ScrollView>
    </View>
  );
};

export default Whoru;
