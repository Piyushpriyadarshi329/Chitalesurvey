import React, {useState,useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';
import ImageComponent from './Imagecomponent';
import axios from 'axios';
import AppConstants from '../AppConstants';


// const Questionspage = ({route, navigation}) => {
//   const {surveyType, mainrecno, mobile, newsurvey} = route.params;

const Register = ({route,navigation}) => {
  const {data} = route.params;

  const [modalVisible, setModalVisible] = useState(false);
  const [showimg, setshowimg] = useState('');
  const [select, setselect] = useState('');
  const [header, setheader] = useState({})

  useEffect(() => {
    console.log(data.birthdate)
    if(data.birthdate!=null){

      var birth=((data.birthdate).toString()).slice(0,4)+"/"+((data.birthdate).toString()).slice(4,6)+'/'+((data.birthdate).toString()).slice(6,8)
      data.birthdate=birth
    }
    if(data.mobile!=null){

      data.mobile=data.mobile.toString()
    }
    if(data.accountno!=null){

      data.accountno=data.accountno.toString()
    }
    if(data.alternateno!=null){

      data.alternateno=data.alternateno.toString()
    }
    if(data.area!=null){

      data.area=data.area.toString()
    }
    if(data.bankaddress!=null){

      data.bankaddress=data.bankaddress.toString()
    }
    if(data.bankname!=null){

      data.bankname=data.bankname.toString()
    }
    if(data.education!=null){

      data.education=data.education.toString()
    }
    if(data.email!=null){

      data.email=data.email.toString()
    }
    if(data.emergencyno!=null){

      data.emergencyno=data.emergencyno.toString()
    }
    if(data.gender!=null){

      data.gender=data.gender.toString()
    }
    if(data.ifsc!=null){

      data.ifsc=data.ifsc.toString()
    }
    if(data.maritalstatus!=null){

      data.maritalstatus=data.maritalstatus.toString()
    }
    if(data.mobile!=null){

      data.mobile=data.mobile.toString()
    }

 
    


 setheader(data)
  }, [])

  async function setimagefun(image) {
    setheader(p => {
      p[select] = image;
      return {...p};
    });
  }

  async function submithandler() {
    let birthdate=header.birthdate
    var birthdatestring=birthdate.slice(0,4)+birthdate.slice(5,7)+birthdate.slice(8,10)
    console.log("birthdate...............",birthdatestring)


var senddata={...header,birthdate:Number(birthdatestring)}




    try{

      var surveyermasterdata = await axios.patch(
        AppConstants.url + 'surveyermaster/',
        senddata,
      );
      console.log("res",surveyermasterdata.data)

      if(surveyermasterdata.data.Success==true){
        navigation.navigate('Login')

        alert("You Have Successfully Register")
      }else(
        alert(surveyermasterdata.data.Message)
      )



    }catch(e){
      alert(e)
    }



  }

  return (
    <ScrollView>
      <View style={{flex: 1}}>
        <ImageComponent
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setimagefun={setimagefun}
          showimg={showimg}
          setshowimg={setshowimg}
        />

        <View style={{flex: 1, alignItems: 'center', marginTop: 40}}>
          <Text style={{fontSize: 30}}>Register page</Text>
        </View>

        <View style={{flex: 8, alignItems: 'center', marginTop: 20}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={{marginTop: 5, width: '30%', fontSize: 20}}>
              Name:
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                marginHorizontal: 10,
                width: '50%',
              }}
              value={header.descn}
              onChangeText={text => {
                setheader(p => {
                  p.descn = text;
                  return {...p};
                });
              }}></TextInput>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{marginTop: 5, width: '30%', fontSize: 20}}>
              Address:
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                marginHorizontal: 10,
                width: '50%',
              }}
              value={header.address}

              onChangeText={text => {
                setheader(p => {
                  p.address = text;
                  return {...p};
                });
              }}></TextInput>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{marginTop: 5, width: '30%', fontSize: 20}}>
              Birth Date:
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                marginHorizontal: 10,
                width: '50%',
              }}
              value={header.birthdate}
placeholder='YYYY/MM/DD'
              onChangeText={text => {



                setheader(p => {
                  p.birthdate = text;
                  return {...p};
                });
              }}></TextInput>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{marginTop: 5, width: '30%', fontSize: 20}}>
              Mobile:
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                marginHorizontal: 10,
                width: '50%',
              }}
              value={(header.mobile)}
keyboardType="numeric"
              onChangeText={text => {
                setheader(p => {
                  p.mobile = text;
                  return {...p};
                });
              }}></TextInput>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{marginTop: 5, width: '30%', fontSize: 20}}>
              Emergency No:
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                marginHorizontal: 10,
                width: '50%',
              }}
              value={header.emergencyno}
              keyboardType="numeric"

              onChangeText={text => {
                setheader(p => {
                  p.emergencyno = text;
                  return {...p};
                });
              }}></TextInput>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{marginTop: 5, width: '30%', fontSize: 20}}>
              Alternate No:
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                marginHorizontal: 10,
                width: '50%',
              }}
              value={header.alternateno}
              keyboardType="numeric"

              onChangeText={text => {
                setheader(p => {
                  p.alternateno = text;
                  return {...p};
                });
              }}></TextInput>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{marginTop: 5, width: '30%', fontSize: 20}}>
              Gender:
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                marginHorizontal: 10,
                width: '50%',
              }}
              value={header.gender}

              onChangeText={text => {
                setheader(p => {
                  p.gender = text;
                  return {...p};
                });
              }}></TextInput>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{marginTop: 5, width: '30%', fontSize: 20}}>
              Marital Status:
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                marginHorizontal: 10,
                width: '50%',
              }}
              value={header.maritalstatus}

              onChangeText={text => {
                setheader(p => {
                  p.maritalstatus = text;
                  return {...p};
                });
              }}></TextInput>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{marginTop: 5, width: '30%', fontSize: 20}}>
              Email:
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                marginHorizontal: 10,
                width: '50%',
              }}
              value={header.email}

              onChangeText={text => {
                setheader(p => {
                  p.email = text;
                  return {...p};
                });
              }}></TextInput>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{marginTop: 5, width: '30%', fontSize: 20}}>
              {' '}
              Education:
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                marginHorizontal: 10,
                width: '50%',
              }}
              value={header.education}

              onChangeText={text => {
                setheader(p => {
                  p.education = text;
                  return {...p};
                });
              }}></TextInput>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{marginTop: 5, width: '30%', fontSize: 20}}>
              Photo:
            </Text>
               
            <TouchableOpacity
              style={{width: '50%', height: 45}}
              onPress={() => {
                setselect('photo');
                setshowimg(header.photo);
                setModalVisible(true);
              }}>
              <View
                style={{
                  backgroundColor: 'dodgerblue',
                  flex: 1,
                  borderRadius: 5,
                }}>
                <Text style={{fontSize: 18, margin: 5}}>
                  Click for Image Upload
                </Text>
              </View>
            </TouchableOpacity>
         
         
         
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{marginTop: 5, width: '30%', fontSize: 20}}>
              Bank Name:
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                marginHorizontal: 10,
                width: '50%',
              }}
              value={header.bankname}

              onChangeText={text => {
                setheader(p => {
                  p.bankname = text;
                  return {...p};
                });
              }}></TextInput>
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{marginTop: 5, width: '30%', fontSize: 20}}>
              Bank Address:
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                marginHorizontal: 10,
                width: '50%',
              }}
              value={header.bankaddress}

              onChangeText={text => {
                setheader(p => {
                  p.bankaddress = text;
                  return {...p};
                });
              }}></TextInput>
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{marginTop: 5, width: '30%', fontSize: 20}}>
              Account No:
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                marginHorizontal: 10,
                width: '50%',
              }}

              value={header.accountno}
keyboardType='numeric'
              onChangeText={text => {
                setheader(p => {
                  p.accountno = text;
                  return {...p};
                });
              }}></TextInput>
          </View>
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{marginTop: 5, width: '30%', fontSize: 20}}>
              IFCS:
            </Text>
            <TextInput
              style={{
                borderWidth: 1,
                borderRadius: 10,
                marginHorizontal: 10,
                width: '50%',
              }}
              value={header.ifsc}

              onChangeText={text => {
                setheader(p => {
                  p.ifsc = text;
                  return {...p};
                });
              }}></TextInput>
          </View>

          <View style={{flexDirection: 'row', marginTop: 10}}>
            <Text style={{marginTop: 5, width: '30%', fontSize: 20}}>
              Bankdetail Image:
            </Text>
           
            <TouchableOpacity
              style={{width: '50%', height: 45}}
              onPress={() => {
                setselect('bankdetailimage');
                setshowimg(header.bankdetailimage);
                setModalVisible(true);
              }}>
              <View
                style={{
                  backgroundColor: 'dodgerblue',
                  flex: 1,
                  borderRadius: 5,
                }}>
                <Text style={{fontSize: 18, margin: 5}}>
                  Click for Image Upload
                </Text>
              </View>
            </TouchableOpacity>
         
         
         
         
          </View>

          <View style={{flexDirection: 'row', marginTop: 20, marginBottom: 30}}>
            <TouchableOpacity
              style={{
                backgroundColor: ' dodgerblue',
                borderWidth: 0,
                borderRadius: 5,
              }}
              onPress={submithandler}>
              <View style={{backgroundColor: 'dodgerblue', borderRadius: 5}}>
                <Text style={{fontSize: 20, margin: 5}}>Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default Register;
