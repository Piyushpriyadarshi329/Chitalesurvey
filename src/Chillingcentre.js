import React, {useState, useEffect} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import axios from 'axios';
import AppConstants from './AppConstants';

const Chillingcentre = ({navigation, route}) => {
  const {data} = route.params;
  console.log('data', data);



  const [selected, setSelected] = useState({recno:null});
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  const [allmember, setallmember] = useState([]);

  useEffect(() => {
    getallmember();
  }, []);

  async function getallmember() {
    var res = await axios.post(
      AppConstants.ChitaleSurveyAPIUrl + '/getmemtypesurvey/',
      {memtype: data.recno},
    );
    console.log('response', res.data);
    setallmember(res.data.Message);
  }

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 10}}>
        <ScrollView>
          <View style={{flex: 1, alignItems: 'center'}}>
            <View style={{backgroundColor: 'lightgray', width: windowWidth}}>
              <Text style={{fontSize: 28, textAlign: 'center'}}>
                Chilling Centre
              </Text>
            </View>
            {allmember.map(itm => {
              return (
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <RadioButton
                    value="first"
                    status={selected.recno === itm.recno ? 'checked' : 'unchecked'}
                    onPress={() => {
                      // setanswer(p => {
                      //   p[index].answer = itm.value;
                      //   console.log('p', p);
                      //   return [...p];
                      // });
                      setSelected(itm);
                    }}
                  />
                  <Text style={{marginTop: 8}}> {itm.descn}</Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
{selected.recno==null?(


<View style={{flex: 1}}>
<TouchableOpacity
  style={{
    backgroundColor: 'lightgray',
    marginHorizontal: 100,
    borderRadius: 10,
  }}
  onPress={()=>{

    alert('please select Chilling Centre')
  }}
  >
  <View>
    <Text style={{fontSize: 28, textAlign: 'center'}}>Next</Text>
  </View>
</TouchableOpacity>
</View>



):(
<View style={{flex: 1}}>
{selected.latitude==""?(

<TouchableOpacity
style={{
  backgroundColor: 'dodgerblue',
  marginHorizontal: 100,
  borderRadius: 10,
}}
onPress={()=>{navigation.navigate('Update',{data:selected})}}
>
<View>
  <Text style={{fontSize: 28, textAlign: 'center'}}>Update</Text>
</View>
</TouchableOpacity>
):(

<TouchableOpacity
  style={{
    backgroundColor: 'dodgerblue',
    marginHorizontal: 100,
    borderRadius: 10,
  }}
  onPress={()=>{

    navigation.navigate('Question',{data:selected,
    recno:data.recno
    })
  }}
  >
  <View>
    <Text style={{fontSize: 28, textAlign: 'center'}}>Next</Text>
  </View>
</TouchableOpacity>

)


}



</View>

)





}
    </View>
 
 
 );
};

export default Chillingcentre;
