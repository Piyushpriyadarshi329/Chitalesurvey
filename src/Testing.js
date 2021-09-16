import React,{useState,useEffect} from 'react'
import { View, Text,Button } from 'react-native'
import GetLocation from 'react-native-get-location';
// import { Geolocation } from '@ionic-native/geolocation';
import { ScrollView } from 'react-native-gesture-handler';
import RNLocation from 'react-native-location';


const Testing = () => {
const [getlocation, setgetlocation] = useState({})
const [location, setlocation] = useState({})

useEffect(() => {
   getlocation1()
   getlocation2()
}, [])




async function getlocation1(){

alert('updatelocation')
    // Geolocation.getCurrentPosition().then((resp) => {
    //     // resp.coords.latitude
    //     // resp.coords.longitude
    //     setlocation({
    //         latitude:resp.coords.latitude,
    //         longitude:resp.coords.longitude

    //     })
        
    //    }).catch((error) => {
    //      console.log('Error getting location', error);
    //    });

    GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
    })
    .then(location => {
        console.log("location",location);
        setgetlocation(location)
    })
    .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
    })

}
async function getlocation2(){




    RNLocation.configure({
        distanceFilter: null,
        // desiredAccuracy:"highAccuracy"
        desiredAccuracy:{
          ios:'best',
          android:'highAccuracy'
        }
        
      });
  
     
     
  
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
  
      var location = await RNLocation.getLatestLocation({timeout: 100});
      console.log('location...............', location);
    
     setlocation(location)


}
    return (
        <View style={{flex:1}}>
<ScrollView>

            <View style={{flex:1}}>

            <Text>1) react-native-get-location</Text>
            <Text>latitude  {getlocation.latitude}</Text>
            <Text>longitude  {getlocation.longitude}</Text>

            </View>



            <View style={{flex:1}}>

            <Text>2) react-native-location</Text>
            <Text>latitude  {location.latitude}</Text>
            <Text>longitude  {location.longitude}</Text>

            </View>

            <Button
            title='updatelocation'
            onPress={getlocation1}
            >

            </Button>


            </ScrollView>
        </View>
    )
}

export default Testing
