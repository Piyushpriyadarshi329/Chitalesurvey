import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {ScrollView, TextInput, TouchableOpacity} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';

const New = ({navigation}) => {
  const [selected, setSelected] = useState();

  const [option, setoption] = useState([
    {label: 'Chitale Dairy', value: 'Chitale Dairy'},
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
      <View style={{flex: 1, flexDirection: 'row',marginTop:10}}>
        <View style={{flex: 1}}>
          <Text style={{fontSize:20}}>Name:</Text>
        </View>
        <View style={{flex: 2}}>
          <TextInput
            style={{flex: 1, borderWidth: 1, borderRadius: 5}}></TextInput>
        </View>
      </View>
      <View style={{flex: 1, flexDirection: 'row',marginTop:10}}>
        <View style={{flex: 1}}>
          <Text style={{fontSize:20}}>Mobile:</Text>
        </View>
        <View style={{flex: 2}}>
          <TextInput
            style={{flex: 1, borderWidth: 1, borderRadius: 5}}></TextInput>
        </View>
      </View>
      <View style={{flex: 1,flexDirection:'row',marginTop:10}}>
        <View style={{flex: 1}}>
          <Text style={{fontSize:20}}>Email Id:</Text>
        </View>
      
      
        <View style={{flex: 2}}>
          <TextInput
            style={{flex: 1, borderWidth: 1, borderRadius: 5}}></TextInput>
        </View>
      </View>
      <View style={{flex: 1,flexDirection:'row',marginTop:10}}>
       
       
        <View style={{flex: 1}}>
          <Text style={{fontSize:20}}>Chilling Centre Code:</Text>
        </View>
        <View style={{flex: 2}}>
          <TextInput
            style={{flex: 1, borderWidth: 1, borderRadius: 5}}></TextInput>
        </View>
      </View>
      <View style={{flex: 3,flexDirection:'row',marginTop:20}}>
          <View style={{flex:1}}>

        <Text style={{fontSize: 28}}>To Whom ?</Text>
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

        navigation.navigate("Whoru")
    }}
    >
        <View style={{flex:1}}>
            <Text style={{fontSize:20,textAlign:'center'}}>
Next
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

export default New;
