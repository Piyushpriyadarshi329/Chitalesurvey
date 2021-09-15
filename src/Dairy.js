import React, {useState,useEffect} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import axios from 'axios';
import AppConstants from './AppConstants';

const Dairy = ({navigation,route}) => {
    const { data } = route.params;
    console.log("data",data)
  const [selected, setSelected] = useState();
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const [allmember, setallmember] = useState([]);



useEffect(() => {
    navigation.navigate('Question',{data:data})
   getallmember()
}, [])


async function getallmember(){

    var res=await axios.post(AppConstants.ChitaleSurveyAPIUrl+"/getmemtypesurvey/",{memtype:data.recno})
    console.log("response",res.data)
    setallmember(res.data.Message)
    
    
    }
    

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 10}}> 
        <ScrollView>
          <View style={{flex: 1, alignItems: 'center'}}>
            <View style={{backgroundColor: 'lightgray', width: windowWidth}}>
              <Text style={{fontSize: 28, textAlign: 'center'}}>
                Dairy
              </Text>
            </View>
            {allmember.map(itm => {
              return (
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <RadioButton
                    value="first"
                    status={selected === itm.recno ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setSelected(itm.recno);
                    }}
                  />
                  <Text style={{marginTop: 8}}> {itm.descn}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <View style={{flex: 1}}>
        <TouchableOpacity
          style={{
            backgroundColor: 'dodgerblue',
            marginHorizontal: 100,
            borderRadius: 10,
          }}>
          <View>
            <Text style={{fontSize: 28, textAlign: 'center'}}>Next</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Dairy;
