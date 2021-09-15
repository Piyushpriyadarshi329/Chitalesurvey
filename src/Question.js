import React, {useState, useEffect} from 'react';
import {View, Text} from 'react-native';

import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import axios from 'axios';
import AppConstants from './AppConstants';
import RNLocation from 'react-native-location';


const Question = ({navigation, route}) => {
  const {data,recno} = route.params;
  console.log('dataqu',"recno", data,recno);

  const [Data, setData] = useState({
    parentrecno: data.recno,
    alternatedescn: '',
    latitude: '',
    longitude: '',
    mobile: '',
    alternatemobile:'',
    email: '',
    status: '',
    type: '',
    vehicletype:""
  });


  const [selected, setSelected] = useState({recno: null});
  const [latitude, setlatitude] = useState('');
  const [longitude, setlongitude] = useState('');
  const [allvehicle, setallvehicle] = useState([])


  useEffect(() => {
    getvechile()
    getlocation();
  },[selected]);

async function getvechile(){

  var res = await axios.get( AppConstants.ChitaleSurveyAPIUrl + '/getvehicletype/' );
  setallvehicle(res.data.Message)


}

useEffect(()=>{
  const unsubscribe = RNLocation.subscribeToLocationUpdates(locations => {
    console.log("Location Updated:",locations);
    setlatitude(locations.latitude);
    setlongitude(locations.longitude);




  })
  return ()=>{unsubscribe()}
  },[]);

  async function getlocation() {
    alert("update location")
    RNLocation.configure({
      distanceFilter: 50.0,
      // desiredAccuracy:"highAccuracy"
      desiredAccuracy:{
        ios:'best',
        android:'highAccuracy'
      }
      
    });

   
    
    // unsubscribe();


    let permission = await RNLocation.checkPermission({
      ios: 'whenInUse', // or 'always'
      android: {
        detail: 'coarse', // or 'fine'
      },
    });

    if (!permission) {
      permission = await RNLocation.requestPermission({
        ios: 'whenInUse',
        android: {
          detail: 'fine',
          rationale: {
            title: 'We need to access your location',
            message: 'We use your location to show where you are on the map',
            buttonPositive: 'OK',
            buttonNegative: 'Cancel',
          },
        },
      });
    }

    var location = await RNLocation.getLatestLocation({timeout: 60000});
    console.log('location...............', location);
    // setData(prev => {
    //   (prev.latitude = location.latitude),
    //     (prev.longitude = location.longitude);

    //   return {
    //     ...prev,
    //   };
    // });
    setlatitude(location.latitude);
    setlongitude(location.longitude);


    
  }





if(recno==2){

  var locoption=[
   
    {
      recno: 3,
      descn: 'Super Gavali',
      active: 1,
    },
    {
      recno: 4,
      descn: 'Gavali',
      active: 1,
    },
    {
      recno: 5,
      descn: 'Sub Gavali',
      active: 1,
    },
    {
      recno: 6,
      descn: 'Utpadak Centre',
      active: null,
    },
  ]
}else if(recno==3){

  var locoption=[
   
    
    {
      recno: 4,
      descn: 'Gavali',
      active: 1,
    },
    {
      recno: 5,
      descn: 'Sub Gavali',
      active: 1,
    },
    {
      recno: 6,
      descn: 'Utpadak Centre',
      active: null,
    },
  ]

}else if(recno==4){


  var locoption=[
   
   
    {
      recno: 5,
      descn: 'Sub Gavali',
      active: 1,
    },
    {
      recno: 6,
      descn: 'Utpadak Centre',
      active: null,
    },
  ]
}else if(recno==5){


  var locoption=[
   
  
    {
      recno: 6,
      descn: 'Utpadak Centre',
      active: null,
    },
  ]
}else{

  var locoption=[
   
    {
      recno: 2,
      descn: 'Chilling Centre',
      active: 1,
    },
    {
      recno: 3,
      descn: 'Super Gavali',
      active: 1,
    },
    {
      recno: 4,
      descn: 'Gavali',
      active: 1,
    },
    {
      recno: 5,
      descn: 'Sub Gavali',
      active: 1,
    },
    {
      recno: 6,
      descn: 'Utpadak Centre',
      active: null,
    },
  ]
}




  const [option, setoption] = useState(locoption);

  async function submithandler() {

if(latitude==''){
  alert("Please switch on loction")
  return
}

    var senddataapi = {
      ...Data,
      latitude: latitude,
      longitude: longitude,
      type: selected.recno,
    };

    if (selected.recno == 6) {
      senddataapi.status = 'C';
    } else {
      senddataapi.status = 'P';
    }

    var res = await axios.post(
      AppConstants.ChitaleSurveyAPIUrl + '/addsurvey/',
      senddataapi,
    );
    console.log('response', res.data);
    if(res.data.Success){
      alert("Survey Add Successfully")



      setData({
        parentrecno: data.recno,
        descn: '',
        latitude: '',
        longitude: '',
        mobile: '',
        email: '',
        status: '',
        type: '',
      });
      setSelected({recno:null})
    }else{
      alert(res.data.Success)
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        marginHorizontal: 20,
        marginTop: 20,
      }}>
      <ScrollView>
        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 20}}>Name:</Text>
          </View>
          <View style={{flex: 2}}>
            <TextInput
              style={{flex: 1, borderWidth: 1, borderRadius: 5}}
              value={Data.descn}
              onChangeText={text => {
                setData(prev => {
                  prev.descn = text;

                  return {...prev};
                });
              }}></TextInput>
          </View>
        </View>
        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 20}}>Alternate Name:</Text>
          </View>
          <View style={{flex: 2}}>
            <TextInput
              style={{flex: 1, borderWidth: 1, borderRadius: 5}}
              value={Data.alternatedescn}
              onChangeText={text => {
                setData(prev => {
                  prev.alternatedescn = text;

                  return {...prev};
                });
              }}></TextInput>
          </View>
        </View>

        
        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 20}}>Location lat:</Text>
          </View>
          <View style={{flex: 2}}>
            <Text>
              {data.latitude}
            </Text>
          </View>
        </View>

        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 20}}>Location long:</Text>
          </View>
          <View style={{flex: 2}}>
            <Text>
              {data.longitude}
            </Text>
          </View>
        </View>


        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 20}}>Mobile:</Text>
          </View>
          <View style={{flex: 2}}>
            <TextInput
              style={{flex: 1, borderWidth: 1, borderRadius: 5}}
              value={Data.mobile}
              keyboardType='numeric'

              onChangeText={text => {
                setData(prev => {
                  prev.mobile = text;

                  return {...prev};
                });
              }}></TextInput>
          </View>
        </View>
        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 20}}>Alternate mobile:</Text>
          </View>
          <View style={{flex: 2}}>
            <TextInput
              style={{flex: 1, borderWidth: 1, borderRadius: 5}}
              value={Data.alternatemobile}
              keyboardType='numeric'

              onChangeText={text => {
                setData(prev => {
                  prev.alternatemobile = text;

                  return {...prev};
                });
              }}></TextInput>
          </View>
        </View>
        <View style={{flex: 1, flexDirection: 'row', marginTop: 10}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 20}}>Email Id:</Text>
          </View>

          <View style={{flex: 2}}>
            <TextInput
              style={{flex: 1, borderWidth: 1, borderRadius: 5}}
              value={Data.email}

              onChangeText={text => {
                setData(prev => {
                  prev.email = text;

                  return {...prev};
                });
              }}></TextInput>
          </View>
        </View>

        {/* <View style={{flex: 1,flexDirection:'row',marginTop:10}}>
       
       
        <View style={{flex: 1}}>
          <Text style={{fontSize:20}}>Chilling Centre Code:</Text>
        </View>
        <View style={{flex: 2}}>
          <TextInput
            style={{flex: 1, borderWidth: 1, borderRadius: 5}}></TextInput>
        </View>
      </View> */}


<View style={{flex: 3, flexDirection: 'row', marginTop: 20}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 28}}>Vehicle:</Text>
          </View>

          <View style={{flex: 1}}>
            {allvehicle.map(itm => {
              return (
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <RadioButton
                    value="first"
                    status={
                      Data.vehicletype === itm.recno ? 'checked' : 'unchecked'
                    }
                    onPress={() => {
                      setData(prev => {
                        prev.vehicletype = itm.recno;
      
                        return {...prev};
                      });                    }}
                  />
                  <Text style={{marginTop: 8}}> {itm.descn}</Text>
                </View>
              );
            })}
          </View>
        </View>



        <View style={{flex: 3, flexDirection: 'row', marginTop: 20}}>
          <View style={{flex: 1}}>
            <Text style={{fontSize: 28}}>Who Are You ?</Text>
          </View>

          <View style={{flex: 1}}>
            {option.map(itm => {
              return (
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <RadioButton
                    value="first"
                    status={
                      selected.recno === itm.recno ? 'checked' : 'unchecked'
                    }
                    onPress={() => {
                      setSelected(itm);
                    }}
                  />
                  <Text style={{marginTop: 8}}> {itm.descn}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: 'dodgerblue',
              marginHorizontal: 10,
              borderRadius: 5,
              marginTop: 10,
              marginLeft: 20,
            }}
            onPress={submithandler}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 20, textAlign: 'center', padding: 5}}>
                Stop
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: 'dodgerblue',
              marginHorizontal: 10,
              borderRadius: 5,
              marginTop: 10,
            }}
            onPress={submithandler}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 20, textAlign: 'center', padding: 5}}>
                Next
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: 'dodgerblue',
              marginHorizontal: 10,
              borderRadius: 5,
              marginTop: 10,
            }}
            onPress={submithandler}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 20, textAlign: 'center', padding: 5}}>
                Pause
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: 'dodgerblue',
              marginHorizontal: 10,
              borderRadius: 5,
              marginTop: 10,
            }}
            onPress={getlocation}>
            <View style={{flex: 1}}>
              <Text style={{fontSize: 20, textAlign: 'center', padding: 5}}>
                getlocation
              </Text>
            </View>
          </TouchableOpacity>

        </View>

        <View style={{flex: 3, backgroundColor: 'red'}}></View>
      </ScrollView>
    </View>
  );
};

export default Question;
