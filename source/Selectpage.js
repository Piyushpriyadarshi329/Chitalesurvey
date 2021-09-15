import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, FlatList, ScrollView,Modal,StyleSheet,Pressable} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import AppConstants from '../AppConstants';
import DatePicker from 'react-native-datepicker';
import AppFunctions from '../android/AppFunctions';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';



const Selectpage = ({navigation}) => {
  const [data, setdata] = useState({});
  const [datakey, setdatakey] = useState([]);
  const [logdata, setlogdata] = useState([]);
  const [sqldata, setsqldata] = useState([]);
  const [show, setshow] = useState('');
  const [sqllength, setsqllength] = useState(0);
  const [selectValue, setSelectValue] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [modalVisible, setModalVisible]= useState(false)

  useEffect(() => {
    getalldata();
    getlog();
    getsqldata()

  }, [selectValue]);

  async function getalldata() {
    setshow('pending');
    let datakey = await AsyncStorage.getItem('datakey');
    datakey = JSON.parse(datakey);
    console.log('datakey............', datakey);

    if (datakey == null) {
      setdatakey([]);
    } else {
      console.log('datakey............', datakey);

      setdatakey(datakey);
    }

  // var sqlitestring='select * from qnsans'
  //      var sqlres=await AppFunctions.ExecuteQuery(sqlitestring,)
  //      console.log( "res...............", sqlres)


  }

  async function getlog() {
    let tenant = await AsyncStorage.getItem('tenant');

    setshow('log');
    if(selectValue==''){

      var apidata = {
        surveyerrecno: await AsyncStorage.getItem('recno'),
        tenant:tenant
      };
      console.log(apidata,"apidata")
    }else{
      var apidata = {
        surveyerrecno: await AsyncStorage.getItem('recno'),
        trdate:selectValue,
        tenant:tenant
      };
    }


    var data = await axios.post(AppConstants.url + 'surveylogs/', apidata);

    console.log(data.data.Message);
    setlogdata(data.data.Message);
  }
async function getsqldata(){
  setshow('sync');


  if(selectValue==''){

    var sqlitestring='select * from surveyanswer'

  }else{
    var sqlitestring='select * from surveyanswer where trdate='+selectValue


  }

       var sqlres=await AppFunctions.ExecuteQuery(sqlitestring,)
       console.log( "res...............", sqlres.rows.length)
       var newdata=[]

for (var i=0;i<sqlres.rows.length;i++){

  newdata.push(sqlres.rows.item(i))
}
setsqldata(newdata)

}
var count = 0;

function loadfun() {
  console.log('count', count,sqllength);

  if (count == sqllength && sqllength!= 0) {
    setModalVisible(false);
    count=0

  }
}

  function navigatefun(item) {
    navigation.navigate('Questionspage', {
      surveyType: 'selected',
      mainrecno: item.mainrecno,
      mobile: item.mobile,
      newsurvey: false,
    });
  }

  async function removekey(item) {
    var datakey = await AsyncStorage.getItem('datakey');

    datakey = JSON.parse(datakey);
    var newkey = [];
    datakey.map(data => {
      if (data.mobile == item.mobile) {
        return;
      } else {
        newkey.push(data);
      }
    });

    setdatakey(newkey);
    AsyncStorage.setItem('datakey', JSON.stringify(newkey));
    AsyncStorage.removeItem(item.mobile.toString());
  }

  const onDateChange = (date, type) => {
    console.log('clander,date', date, typeof date, type);
    setSelectedDate(date);

    setSelectValue(
      new Date(date).getFullYear().toString() +
        ('0' + (new Date(date).getMonth() + 1).toString()).slice(-2) +
        ('0' + new Date(date).getDate().toString()).slice(-2),
    );
    // setShow(false);
  };
  async function syncdata(mainshortguid) {
    count=0;

  
    var sqlitestring='select * from surveyanswerfooter where mainshortguid=?'


  

       var ressurveyanswerfooter=await AppFunctions.ExecuteQuery(sqlitestring,[mainshortguid])
  
       setsqllength(ressurveyanswerfooter.rows.length)


          for (var i=0;i<ressurveyanswerfooter.rows.length;i++){
            var item= ressurveyanswerfooter.rows.item(i)
            console.log("item.......",item)
            if (item.answerimage === '') {
              console.log('yes');
              const response = await axios.post(
                AppConstants.url + 'addasnwerfooter/',
                item,
              );

           

              console.log('response1.....', response.data);
              count = count + 1;
              loadfun();
            } else {
              console.log('no');

              console.log('imswerimage', item.answerimage);
              var localdata = item;

              // ImageResizer.createResizedImage(localdata.answerimage, 600, 800, compressFormat, quality, rotation, outputPath)
       var response2  =   await  ImageResizer.createResizedImage(localdata.answerimage, 600, 800,"JPEG",60,0,null)
              .then(response2 => {
               return response2
              })
            
              console.log('response...2', response2);


              var res = await RNFS.readFile(
                response2.path,
                'base64',
              ).then(res => {
                return res;
              });

              localdata.answerimage = res;
              console.log("answeroptions",localdata.answeroptions)

              var response = await axios.post(
                AppConstants.url + 'addasnwerfooter/',
                localdata,
              );
           

              console.log(
                'response2...',
                response.data,
                localdata.questionrecno,
              );

              count = count + 1;
              loadfun();            }

          }
    

    
  }


  return (
    <View style={{flex: 1}}>
         <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Sync........Please wait</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Back</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <ScrollView>
        <View style={{flex: 1, flexDirection: 'row', marginTop: 50}}>
          <TouchableOpacity
            style={{
              backgroundColor: 'dodgerblue',
              width: '20%',
              height: 30,
              borderRadius: 5,
              justifyContent: 'center',
              marginLeft: 10,
              marginRight: 15,
            }}
            onPress={() => {
              setshow('');

              navigation.navigate('First');
            }}>
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 16, textAlign: 'center'}}>New</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'dodgerblue',
              width: '25%',
              height: 30,
              borderRadius: 5,
              justifyContent: 'center',
              marginRight: 5,
            }}
            onPress={getalldata}>
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 16, textAlign: 'center'}}>
                Pending({datakey.length})
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              backgroundColor: 'dodgerblue',
              width: '30%',
              height: 30,
              borderRadius: 5,
              justifyContent: 'center',
            }}
            onPress={getlog}>
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 16, textAlign: 'center'}}>
                Completed({logdata.length})
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: 'dodgerblue',
              width: '20%',
              height: 30,
              borderRadius: 5,
              justifyContent: 'center',
            }}
            onPress={getsqldata}>
            <View style={{alignItems: 'center'}}>
              <Text style={{fontSize: 16, textAlign: 'center'}}>
                Sync
              </Text>
            </View>
          </TouchableOpacity>
       
       
       
        </View>

        <View style={{flex: 1}}>
          {show == 'pending' ? (
            <View style={{marginTop: 10}}>
              <Text style={{textAlign: 'center', fontSize: 20}}>Pending</Text>
              {datakey.map(item => {
                return (
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        width: '80%',
                        marginTop: 20,
                        height: 60,
                        borderRadius: 5,
                        marginRight: 10,
                      }}
                      onPress={() => {
                        navigatefun(item);
                      }}>
                      <View style={{flexDirection: 'column'}}>
                        <View>
                          <Text>Name: {item.name}</Text>
                        </View>
                        <View>
                          <Text>Mobile:{item.mobile}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        borderWidth: 1,
                        width: '15%',
                        marginTop: 20,
                        height: 60,
                        borderRadius: 5,
                      }}
                      onPress={() => {
                        removekey(item);
                        console.log('pressed');
                      }}>
                      <View>
                        <Text style={{textAlign: 'center'}}>Remove</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          ) : null}

          {show == 'log' ? (
            <View style={{marginTop: 20}}>
              <Text style={{fontSize: 28, textAlign: 'center'}}>
                
                Completed
              </Text>

              <View style={{flexDirection: 'row',marginLeft:20}}>
                <View>
                  <Text style={{fontSize: 20}}>Select Date: </Text>
                </View>

                <View>
                  <DatePicker
                    style={{width: 200}}
                    date={selectedDate}
                    mode="date"
                    placeholder="select date"
                    format="YYYY-MM-DD"
                    minDate="2010-05-01"
                    maxDate="2099-06-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {
                        marginLeft: 36,
                      },
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={date => {
                      onDateChange(date);
                    }}
                  />
                </View>
              </View>

              <View style={{marginTop: 10}}>
                {logdata.map(item => {
                  return (
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        style={{
                          borderWidth: 1,
                          width: '80%',
                          marginTop: 20,
                          height: 60,
                          borderRadius: 5,
                          marginLeft: 30,
                          padding: 10,
                        }}
                        // onPress={() => {
                        //   navigatefun(item);
                        // }}
                        >
                        <View style={{flexDirection: 'column'}}>
                          <View>
                            <Text>Name: {item.fname}</Text>
                          </View>
                          <View>
                            <Text>Mobile:{item.mobile}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>


                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}
          {show == 'sync' ? (
            <View style={{marginTop: 20}}>
              <Text style={{fontSize: 28, textAlign: 'center'}}>
                
                Sync to Server
              </Text>

              <View style={{flexDirection: 'row',marginLeft:20}}>
                <View>
                  <Text style={{fontSize: 20}}>Select Date: </Text>
                </View>

                <View>
                  <DatePicker
                    style={{width: 200}}
                    date={selectedDate}
                    mode="date"
                    placeholder="select date"
                    format="YYYY-MM-DD"
                    minDate="2010-05-01"
                    maxDate="2099-06-01"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {
                        marginLeft: 36,
                      },
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={date => {
                      onDateChange(date);
                    }}
                  />
                </View>
              </View>

              <View style={{marginTop: 10}}>
                {sqldata.map(item => {
                  return (
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        style={{
                          borderWidth: 1,
                          width: '70%',
                          marginTop: 20,
                          height: 60,
                          borderRadius: 5,
                          marginLeft: 30,
                          padding: 10,
                        }}
                    
                        >
                        <View style={{flexDirection: 'column'}}>
                          <View>
                            <Text>Name: {item.fname}</Text>
                          </View>
                          <View>
                            <Text>Mobile:{item.mobile}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>


{item.status=='P'?(

<TouchableOpacity
style={{
  borderWidth: 1,
  width: '20%',
  marginTop: 20,
  height: 60,
  borderRadius: 5,
  marginRight:10
}}
onPress={() => {
  // syncdata(item.shortguid);
  console.log("hello")

}}
>
<View>
  <Text style={{textAlign: 'center'}}>Pending</Text>
</View>
</TouchableOpacity>
           
):(

  <TouchableOpacity
  style={{
    borderWidth: 1,
    width: '20%',
    marginTop: 20,
    height: 60,
    borderRadius: 5,
    backgroundColor:'dodgerblue',
    marginRight:10
  }}
  onPress={() => {
    setModalVisible(true)
    syncdata(item.shortguid);
    console.log('pressed');
  }}>
  <View>
    <Text style={{textAlign: 'center'}}>sync</Text>
  </View>
</TouchableOpacity>
             

)}
  
                   
                    </View>
                  );
                })}
              </View>
            </View>
          ) : null}

          {show == '' ? null : null}
        </View>
      </ScrollView>
    </View>
  );
};

export default Selectpage;


const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize:28
  }
});