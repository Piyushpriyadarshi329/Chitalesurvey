import React, {useState,useEffect} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {RadioButton} from 'react-native-paper';
import axios from 'axios';
import AppConstants from './AppConstants';

const Pending = ({navigation}) => {
    
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;
    
    const [selected, setSelected] = useState();
    const [memtype, setmemtype] = useState([]);

  const [Dairy, setdairt] = useState([
    {label: 'Chitale Dairy', value: 'Chitale Dairy'},
  ]);

useEffect(() => {



    getmemtype()
 
}, [])

async function getmemtype(){

var res=await axios.get(AppConstants.ChitaleSurveyAPIUrl+"/memtype/")
console.log("response",res.data)
setmemtype(res.data.Message)


}




[
    {
        "recno": 1,
        "descn": "Chitale Dairy",
        "active": 1
    },
    {
        "recno": 2,
        "descn": "Chilling Center",
        "active": 1
    },
    {
        "recno": 3,
        "descn": "Super Gavali",
        "active": 1
    },
    {
        "recno": 4,
        "descn": "Gavali",
        "active": 1
    },
    {
        "recno": 5,
        "descn": "Sub Gavali",
        "active": 1
    },
    {
        "recno": 6,
        "descn": "Utpadak",
        "active": null
    }
]



function navigationfun(item){

    if(item.recno==1){

        navigation.navigate("Dairy",        {data:item}
        )
    }else if(item.recno==2){

        navigation.navigate("Chillingcentre",
        {data:item}
        )

    }else if(item.recno==3){

        navigation.navigate("Supergavali",
        
        {data:item}
        )

    }else if(item.recno==4){

        navigation.navigate("Gavali",
        
        {data:item}
        )

    }else if(item.recno==5){

        navigation.navigate("Subgavali",
        
        {data:item}
        )

    }else if(item.recno==6){

        navigation.navigate("Utpadakcentre",
        
        {data:item}
        )

    }



}


  return (
    <View style={{flex: 1}}>
      <View style={{flex: 10}}>
        <ScrollView>




{memtype.map((item)=>{


return(
    <TouchableOpacity style={{flex: 1, alignItems: 'center',marginTop:20,marginHorizontal:50,borderRadius:10}}
           onPress={()=>{

            navigationfun(item)

          }}
          >
            <View style={{backgroundColor: 'dodgerblue', width: windowWidth}}>
              <Text style={{fontSize: 28, textAlign: 'center'}}>{item.descn}</Text>
            </View>
          
          </TouchableOpacity>


)
})


}



{/* 
          <TouchableOpacity style={{flex: 1, alignItems: 'center',marginTop:20,marginHorizontal:50,borderRadius:10}}
           onPress={()=>{
            navigation.navigate("Dairy")

          }}
          >
            <View style={{backgroundColor: 'dodgerblue', width: windowWidth}}>
              <Text style={{fontSize: 28, textAlign: 'center'}}>Dairy</Text>
            </View>
          
          </TouchableOpacity>

          <TouchableOpacity style={{flex: 1, alignItems: 'center',marginTop:20,marginHorizontal:50,borderRadius:10}}
          onPress={()=>{
            navigation.navigate("Chillingcentre")

          }}
          >
            <View style={{backgroundColor: 'dodgerblue', width: windowWidth}}>
              <Text style={{fontSize: 28, textAlign: 'center'}}>
                Chilling Centre
              </Text>
            </View>
           
          </TouchableOpacity>

          <TouchableOpacity style={{flex: 1, alignItems: 'center',marginTop:20,marginHorizontal:50,borderRadius:10}}
            onPress={()=>{
                navigation.navigate("Supergavali")
    
              }}
          >
            <View style={{backgroundColor: 'dodgerblue', width: windowWidth}}>
              <Text style={{fontSize: 28, textAlign: 'center'}}>
                Super Gavali
              </Text>
            </View>
          
          </TouchableOpacity>

          <TouchableOpacity style={{flex: 1, alignItems: 'center',marginTop:20,marginHorizontal:50,borderRadius:10}}
           onPress={()=>{
            navigation.navigate("Subgavali")

          }}
          >
            <View style={{backgroundColor: 'dodgerblue', width: windowWidth}}>
              <Text style={{fontSize: 28, textAlign: 'center'}}>
                Sub Gavali
              </Text>
            </View>
          
          </TouchableOpacity>

          <TouchableOpacity style={{flex: 1, alignItems: 'center',marginTop:20,marginHorizontal:50,borderRadius:10}}
                   onPress={()=>{
                    navigation.navigate("Utpadakcentre")
        
                  }}
          >
            <View style={{backgroundColor: 'dodgerblue', width: windowWidth}}>
              <Text style={{fontSize: 28, textAlign: 'center'}}>
                Utpadak Centre
              </Text>
            </View>


       
      
            </TouchableOpacity>
   
   
    */}
   
        </ScrollView>
      </View>
    </View>
  );
};

export default Pending;
