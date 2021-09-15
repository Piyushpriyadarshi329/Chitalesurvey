import React from 'react'
import { View, Text,Modal, StyleSheet,Button,Image} from 'react-native'
import ImagePicker from 'react-native-image-crop-picker';
import RNFS from 'react-native-fs';



const Imagecomponent = ({modalVisible,setModalVisible,setimagefun,showimg,setshowimg}) => {
    const onCamara = () => {
        ImagePicker.openCamera({
          width: 800,
          height: 1000,
          cropping: true,
        }).then((image) => {
          convertImage(image.path);
        });
      };
    
      async function convertImage(image) {
        var data = await RNFS.readFile(image, 'base64').then((res) => {
          return res;
        });
        setshowimg(data)
        setimagefun(data)
      }
    
      const openLibrary = () => {
        ImagePicker.openPicker({
          width: 800,
          height: 1000,
          cropping: true,
        }).then((image) => {
          convertImage(image.path);
        });
      };





    return (
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={localstyles.centeredView}>
          <View style={localstyles.modalView}>

<View style={{justifyContent:'flex-start'}}>
    <Button
    style={{alignItems:""}}
    title="Back"
    onPress={()=>{


        setModalVisible(!modalVisible);


    }}
    >


    </Button>
</View>

            <View>


              <Text style={{fontSize:20}}>Upload Image</Text>
            </View>

            <View style={{marginTop:20}}>

              {showimg!=''?(


              <Image
                style={localstyles.avatar}
                source={{uri: `data:image/gif;base64,${showimg}`}}
              />
              ):null}
            </View>

            <View style={{flexDirection: 'row'}}>
            <View style={{marginTop: 20, marginHorizontal: 10,width:"40%"}}>
            <Button title="Camara" onPress={onCamara} />
          </View>
              <View style={{marginTop: 20, marginHorizontal: 10,width:"40%"}}>
                <Button title="Gallary" onPress={openLibrary} />
              </View>
            </View>
          </View>
        </View>
      </Modal>

    )
}

export default Imagecomponent



const localstyles = StyleSheet.create({
    title: {
      fontSize: 16,
      height: 40,
      textAlignVertical: 'center',
    },
    title1: {
      height: 40,
      padding: 2,
    },
    input: {
      borderWidth: 1,
      minWidth: 100,
      borderRadius: 5,
    },
  
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: 22,
    },
    selectBox: {
      borderColor: 'red',
      borderWidth: 3,
      height: 40,
      width: 75,
      borderRadius: 10,
      marginTop: 5,
    },
    box: {
      borderColor: 'red',
      borderWidth: 1,
      height: 40,
      width: 75,
      borderRadius: 10,
      marginTop: 5,
    },
    box1: {
      borderColor: 'red',
      borderWidth: 1,
      height: 40,
      borderRadius: 5,
      textAlign: 'center',
      margin: 4,
    },
    key: {
      fontSize: 20,
      height: 40,
      width: 60,
    },
    text: {fontSize: 24, textAlign: 'center'},
    headerInputView: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
    modalView: {
        width:'80%',
        height:400,
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    avatar: {
        paddingTop: 20,
        height: 200,
        width: 200,
        // borderRadius: 100,
        padding: 20,
        borderWidth: 1,
      },
  });