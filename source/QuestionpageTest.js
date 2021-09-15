import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {RadioButton} from 'react-native-paper';
import RadioButtonRN from 'radio-buttons-react-native';
import axios from 'axios';
import AppConstants from '../AppConstants';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';
import ImageResizer from 'react-native-image-resizer';
import uuid from 'uuid-random';
import AppFunctions from '../android/AppFunctions';
import RNFS from 'react-native-fs';
const _ = require('lodash');

const Pass = ({setnum, num, srn, x}) => {
  if (srn.back == false) {
    setnum(num + 1);
  } else {
    setnum(num - 1);
  }
  return (
    <View>
      <Text>hello</Text>
    </View>
  );
};
const Submitcomponent = ({saveanswer, setnum, num, setsrn, loading}) => {
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      {!loading ? (
        <>
          <View>
            <Text style={{textAlign: 'center', fontSize: 20}}>
              Do you want Submit ?
            </Text>
          </View>

          <View style={{flexDirection: 'row', flex: 1}}>
            <View style={{flex: 1, margin: 30}}>
              <Button
                style={{flex: 1}}
                title="YES"
                onPress={saveanswer}></Button>
            </View>
            <View style={{flex: 1, margin: 30}}>
              <Button
                style={{flex: 1}}
                onPress={() => {
                  if (num > 0) {
                    setnum(p => {
                      return p - 1;
                    });
                  }

                  setsrn(prev => {
                    return {...prev, back: true};
                  });
                }}
                title="Back"></Button>
            </View>
          </View>
        </>
      ) : null}
    </View>
  );
};

const QuestionsComponent = ({
  setQuestions,
  Questions,
  num,
  answer,
  setanswer,
  setnum,
  setloadpin,
  srn,
  GroupQuestions,
  setGroupanswer,
  Groupanswer,
  mainrecno,
  setdum
}) => {
  const [state, setstate] = useState('');
  const [district, setdistrict] = useState('');
  const [area, setarea] = useState('');

  function removequestion(num) {
    var newdata = [];

    Questions.map((item, index) => {
      if (index == num) return;
      newdata.push(item);
      setnum(num - 1);
    });
    setQuestions([...newdata]);

    var newdataans = [];

    answer.map((item, index) => {
      if (index == num) return;
      newdataans.push(item);
      setnum(num - 1);
    });
    setanswer([...newdataans]);
  }

  async function pincodedetails(pincode) {
    try {
      if (pincode.toString().length == 6) {
        setloadpin(true);

        const res = await axios.get(
          'https://api.postalpincode.in/pincode/' + pincode,
          {timeout: 5000},
        );
        // console.log(
        //   'res.data............................',
        //   res.data[0].PostOffice,
        // );

        if (res.data[0].Status == 'Success') {
          setstate(res.data[0].PostOffice[0].State);
          setdistrict(res.data[0].PostOffice[0].District);
          setarea(res.data[0].PostOffice[0].Name);
        } else {
          setstate('');
          setdistrict('');
          setarea('');
        }
      }
      setloadpin(false);
    } catch (e) {
      setstate('');
      setdistrict('');
      setarea('');

      setloadpin(false);

      console.log(e);
    }
  }
  // console.log("details call,,,,,,,,",area,district,state);
  // console.log("details call,,,,,,,,",answer[num]);

  if (
    Questions[num].questionname.toLowerCase() == 'state' &&
    state != '' &&
    answer[num].answer == ''
  ) {
    console.log('test');
    var newdata = answer;
    newdata[num].answer = state;
    setanswer(newdata);
  }

  if (
    Questions[num].questionname.toLowerCase() == 'district' &&
    district != '' &&
    answer[num].answer == ''
  ) {
    // console.log("distivt call,,,,,,,,");

    var newdata = answer;
    newdata[num].answer = district;
    setanswer(newdata);
  }
  if (
    Questions[num].questionname.toLowerCase() == 'area' &&
    area != '' &&
    answer[num].answer == ''
  ) {
    // console.log("distivt call,,,,,,,,");

    var newdata = answer;
    newdata[num].answer = area;
    setanswer(newdata);
  }
  if (Questions[num].questiontype == 1 && Questions[num].isgroupof == null) {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        {Questions[num].removable ? (
          <View style={{alignItems: 'flex-end', flex: 1}}>
            <TouchableOpacity
              onPress={() => {
                removequestion(num);
              }}>
              <View>
                <Icon
                  name="close"
                  style={{fontSize: 30}}
                  type="MaterialIcons"
                />
              </View>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={{flexDirection: 'row', flex: 1}}>
          {Questions[num].mandatory == 1 ? (
            <>
              <Text style={{fontSize: 24, flex: 2, textAlign: 'right'}}>
                {Questions[num].questionname}
              </Text>

              <Text style={{fontSize: 20, flex: 1.5, color: 'red'}}> * </Text>
            </>
          ) : (
            <Text style={{fontSize: 24, flex: 2, textAlign: 'center'}}>
              {Questions[num].questionname}
            </Text>
          )}
        </View>

        <View style={{flex: 1, alignItems: 'center'}}>
          <TextInput
            style={{
              borderWidth: 1,
              borderRadius: 5,
              marginTop: 10,
              width: '90%',
            }}
            value={answer[num].answer}
            onChangeText={text => {
              if (Questions[num].questionname.toLowerCase() == 'pincode') {
                pincodedetails(text);
              }

              setanswer(p => {
                p[num].answer = text;

                return [...p];
              });
            }}></TextInput>
        </View>
      </View>
    );
  } else if (
    Questions[num].questiontype == 4 &&
    Questions[num].isgroupof == null
  ) {
    return (
      <View style={{flexDirection: 'column', flex: 1}}>
        {Questions[num].removable ? (
          <>
            <View style={{alignItems: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => {
                  removequestion(num);
                }}>
                <View>
                  <Icon
                    name="close"
                    style={{fontSize: 30}}
                    type="MaterialIcons"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : null}

        <View style={{flexDirection: 'row', flex: 1}}>
          {Questions[num].mandatory == 1 ? (
            <>
              <Text style={{fontSize: 24, flex: 2, textAlign: 'right'}}>
                {Questions[num].questionname}
              </Text>

              <Text style={{fontSize: 20, flex: 1.5, color: 'red'}}> * </Text>
            </>
          ) : (
            <Text style={{fontSize: 24, flex: 2, textAlign: 'center'}}>
              {Questions[num].questionname}
            </Text>
          )}
        </View>

        <View style={{width: '100%', flex: 1}}>
          {Questions[num].optionlist.map(item => {
            return (
              <View style={{flexDirection: 'row'}}>
                <RadioButton
                  value="first"
                  status={
                    answer[num].answer === item.value ? 'checked' : 'unchecked'
                  }
                  onPress={() => {
                    setanswer(p => {
                      p[num].answer = item.label;
                      return [...p];
                    });
                  }}
                />
                <Text style={{marginTop: 8}}> {item.value}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  } else if (
    Questions[num].questiontype == 2 &&
    Questions[num].isgroupof == null
  ) {
    const onCamara = () => {
      ImagePicker.openCamera({
        width: 800,
        height: 1000,
        cropping: true,
      }).then(image => {
        convertImage(image.path);
      });
    };

    async function convertImage(image) {
      // var data = await RNFS.readFile(image, 'base64').then(res => {
      //   return res;
      // });

      setanswer(p => {
        p[num].answerimage = image;

        return [...p];
      });
    }

    const openLibrary = () => {
      ImagePicker.openPicker({
        width: 800,
        height: 1000,
        cropping: true,
      }).then(image => {
        convertImage(image.path);
      });
    };

    return (
      <View style={{flexDirection: 'column', flex: 1}}>
        {Questions[num].removable ? (
          <>
            <View style={{alignItems: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => {
                  removequestion(num);
                }}>
                <View>
                  <Icon
                    name="close"
                    style={{fontSize: 30}}
                    type="MaterialIcons"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : null}

        {/* <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
          <Text style={{fontSize: 30,flex:1,textAlign:'center'}}> {Questions[num].questionname}</Text>
        </View> */}

        <View style={{flexDirection: 'row', flex: 1}}>
          {Questions[num].mandatory == 1 ? (
            <>
              <Text style={{fontSize: 24, flex: 2, textAlign: 'right'}}>
                {Questions[num].questionname}
              </Text>

              <Text style={{fontSize: 20, flex: 1.5, color: 'red'}}> * </Text>
            </>
          ) : (
            <Text style={{fontSize: 24, flex: 2, textAlign: 'center'}}>
              {Questions[num].questionname}
            </Text>
          )}
        </View>

        {answer[num].answerimage != '' ? (
          // <Image
          //   style={localstyles.avatar}
          //   source={{uri: `data:image/gif;base64,${answer[num].answerimage}`}}
          // />
          <Image
            source={{
              uri: answer[num].answerimage,
            }}
            style={{width: 200, height: 200}}
          />
        ) : (
          <Text
            style={{
              color: 'black',
              backgroundColor: 'gold',
              textAlign: 'center',
            }}>
            Click Below to Save Image
          </Text>
        )}
        <View style={{flexDirection: 'row'}}>
          <View style={{marginTop: 20, marginHorizontal: 10}}>
            <Button title="Image From Camara" onPress={onCamara} />
          </View>
          <View style={{marginTop: 20, marginHorizontal: 10}}>
            <Button title="Image From Gallary" onPress={openLibrary} />
          </View>
        </View>
        <View style={{flex: 1, alignItems: 'center'}}>
          <TextInput
            style={{
              borderWidth: 1,
              borderRadius: 5,
              marginTop: 10,
              width: '90%',
            }}
            value={answer[num].answer}
            placeholder="Enter Name"
            onChangeText={text => {
              setanswer(p => {
                p[num].answer = text;

                return [...p];
              });
            }}></TextInput>
        </View>
      </View>
    );
  } else if (
    Questions[num].questiontype == 5 &&
    Questions[num].isgroupof == null
  ) {
    return (
      <View style={{flexDirection: 'column', flex: 1}}>
        {Questions[num].removable ? (
          <>
            <View style={{alignItems: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => {
                  removequestion(num);
                }}>
                <View>
                  <Icon
                    name="close"
                    style={{fontSize: 30}}
                    type="MaterialIcons"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : null}

        {/* <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
          <Text style={{fontSize: 30}}> {Questions[num].questionname}</Text>
        </View> */}
        <View style={{flexDirection: 'row', flex: 1}}>
          {Questions[num].mandatory == 1 ? (
            <>
              <Text style={{fontSize: 24, flex: 2, textAlign: 'right'}}>
                {Questions[num].questionname}
              </Text>

              <Text style={{fontSize: 20, flex: 1.5, color: 'red'}}> * </Text>
            </>
          ) : (
            <Text style={{fontSize: 24, flex: 2, textAlign: 'center'}}>
              {Questions[num].questionname}
            </Text>
          )}
        </View>

        <View style={{width: '100%', flex: 1}}>
          {Questions[num].optionlist.map((item, index) => {
            return (
              <>
                <View style={{justifyContent: 'center', flexDirection: 'row'}}>
                  <View style={{flex: 1, marginTop: 10}}></View>

                  <View style={{flexDirection: 'row'}}>
                    <Text style={{fontSize: 18}}> </Text>

                    <Pressable
                      style={{marginHorizontal: 10, marginTop: 10}}
                      onPress={() => {
                        var text = '';

                        setQuestions(p => {
                          p[num].optionlist[index].select =
                            !p[num].optionlist[index].select;

                          for (var i = 0; i < p[num].optionlist.length; i++) {
                            if (p[num].optionlist[i].select == true) {
                              text =
                                text + p[num].optionlist[i].select.value + ',';
                            }
                          }

                          return [...p];
                        });

                        setanswer(prev => {
                          prev[num].answer = text;

                          return [...prev];
                        });
                      }}>
                      <View
                        style={{
                          borderWidth: 2,
                          width: 40,
                          height: 40,
                          borderRadius: 3,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        {item.select == true ? (
                          <Icon
                            name="check"
                            style={{fontSize: 30}}
                            type="MaterialIcons"
                          />
                        ) : null}
                      </View>
                    </Pressable>
                  </View>

                  <View style={{flex: 1, marginTop: 10}}>
                    <Text style={{textAlign: 'left'}}>{item.label}</Text>
                  </View>
                  <View style={{flex: 0.5, marginTop: 10}}></View>
                </View>
              </>
            );
          })}
        </View>
        {/* </ScrollView> */}
      </View>
    );
  } else if (
    Questions[num].questiontype == 3 &&
    Questions[num].isgroupof == null
  ) {
    return (
      <View style={{flexDirection: 'column', flex: 1}}>
        {Questions[num].removable ? (
          <>
            <View style={{alignItems: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => {
                  removequestion(num);
                }}>
                <View>
                  <Icon
                    name="close"
                    style={{fontSize: 30}}
                    type="MaterialIcons"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : null}

        <View style={{flexDirection: 'row', flex: 1}}>
          {Questions[num].mandatory == 1 ? (
            <>
              <Text style={{fontSize: 24, flex: 2, textAlign: 'right'}}>
                {Questions[num].questionname}
              </Text>

              <Text style={{fontSize: 20, flex: 1.5, color: 'red'}}> * </Text>
            </>
          ) : (
            <Text style={{fontSize: 24, flex: 2, textAlign: 'center'}}>
              {Questions[num].questionname}
            </Text>
          )}
        </View>

        <View style={{width: '100%', flex: 1}}>
          {Questions[num].optionlist.map(item => {
            return (
              <View style={{flexDirection: 'row'}}>
                <RadioButton
                  value="first"
                  status={
                    answer[num].answer === item.value ? 'checked' : 'unchecked'
                  }
                  onPress={() => {
                    setanswer(p => {
                      p[num].answer = item.label;
                      return [...p];
                    });
                  }}
                />
                <Text style={{marginTop: 8}}> {item.value}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  } else if (
    Questions[num].questiontype == 6 &&
    Questions[num].isgroupof == null
  ) {
    var localgroupanswer=[]
    var localgroupQuestions = GroupQuestions.filter( itm => itm.isgroupof == Questions[num].recno, );
    getasyncgroupanswer()
async function getasyncgroupanswer(){

  let asyncgroupanswer = await AsyncStorage.getItem(answer[num].answer);
 if(asyncgroupanswer==null){

  localgroupQuestions.map((item)=>{

    localgroupanswer.push({
      mainrecno: mainrecno,
      questionrecno: item.recno,
      answer: '',
      answerimage: '',
      answeroptions: '',
      mandatory: item.mandatory,
      groupshortguid: answer[num].answer,
      questiontype:item.questiontype
    })

  })

  console.log("localgroupanswer............",localgroupanswer)
  setGroupanswer(localgroupanswer)
  // Groupanswer,
  AsyncStorage.setItem(answer[num].answer, JSON.stringify(localgroupanswer));


 }else{
  setGroupanswer(JSON.parse(asyncgroupanswer));

 }
}



    return (
      <View style={{flexDirection: 'column', flex: 1}}>
        {Questions[num].removable ? (
          <>
            <View style={{alignItems: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => {
                  removequestion(num);
                }}>
                <View>
                  <Icon
                    name="close"
                    style={{fontSize: 30}}
                    type="MaterialIcons"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : null}

        <View style={{flexDirection: 'row', flex: 1}}>
          {Questions[num].mandatory == 1 ? (
            <>
              <Text
                style={{
                  fontSize: 24,
                  flex: 2,
                  textAlign: 'right',
                  fontWeight: 'bold',
                }}>
                {Questions[num].questionname}
              </Text>

              <Text style={{fontSize: 20, flex: 1.5, color: 'red'}}> * </Text>
            </>
          ) : (
            <Text
              style={{
                fontSize: 24,
                flex: 2,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              {Questions[num].questionname}
            </Text>
          )}
        </View>

        <View
          style={{
            marginVertical: 5,
            borderWidth: 1,
          }}></View>

        <ScrollView>
          <View style={{width: '100%', flex: 1}}>
            {localgroupQuestions.map((item,index )=> {
              if (item.questiontype == 1 && Groupanswer.length!=0) {
             
               

                return (
                  <View
                    style={{flex: 1, flexDirection: 'column', marginTop: 5}}>
                    <View style={{flexDirection: 'row', flex: 1}}>
                      {item.mandatory == 1 ? (
                        <>
                          <Text
                            style={{fontSize: 24, flex: 2, textAlign: 'right'}}>
                            {item.questionname}
                          </Text>

                          <Text style={{fontSize: 20, flex: 1.5, color: 'red'}}>
                           
                          </Text>
                        </>
                      ) : (
                        <Text
                          style={{fontSize: 24, flex: 2, textAlign: 'center'}}>
                          {item.questionname}
                        </Text>
                      )}
                    </View>

                    <View style={{flex: 1, alignItems: 'center'}}>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderRadius: 5,
                          marginTop: 10,
                          width: '90%',
                        }}
                        value={Groupanswer[index].answer}
                        onChangeText={text => {
                          if (item.questionname.toLowerCase() == 'pincode') {
                            pincodedetails(text);
                          }
                          // Groupanswer[index].answer=text
                          // AsyncStorage.setItem(answer[num].answer, JSON.stringify(newdata));
                          setGroupanswer(p=>{
                            var newdata=p
                            newdata[index].answer=text
                            AsyncStorage.setItem(answer[num].answer, JSON.stringify(newdata));

                            return [...newdata]


                          })
                         
                        }}></TextInput>
                    </View>
                    <View
                      style={{
                        marginVertical: 5,
                        borderWidth: 0.7,
                      }}></View>
                  </View>
                );
              } else if (item.questiontype == 4  && Groupanswer.length!=0) {
                var optiondata = item.optionlist;
                return (
                  <View
                    style={{flexDirection: 'column', flex: 1, marginTop: 5}}>
                    <View style={{flexDirection: 'row', flex: 1}}>
                      {item.mandatory == 1 ? (
                        <>
                          <Text
                            style={{fontSize: 24, flex: 2, textAlign: 'right'}}>
                            {item.questionname}
                          </Text>

                          <Text style={{fontSize: 20, flex: 1.5, color: 'red'}}>
                          
                          </Text>
                        </>
                      ) : (
                        <Text
                          style={{fontSize: 24, flex: 2, textAlign: 'center'}}>
                          {item.questionname}
                        </Text>
                      )}
                    </View>

                    <View style={{width: '100%', flex: 1}}>
                      {optiondata.map(itm => {
                        return (
                          <View style={{flexDirection: 'row'}}>
                            <RadioButton
                              value="first"
                              status={
                                Groupanswer[index].answer === itm.value
                                  ? 'checked'
                                  : 'unchecked'
                              }
                              onPress={() => {
                                // setanswer(p => {
                                //   p[num].answer = itm.label;
                                //   return [...p];
                                // });
                                setGroupanswer(p=>{
                                  var newdata=p
                                  newdata[index].answer=itm.label
                                  AsyncStorage.setItem(answer[num].answer, JSON.stringify(newdata));
      
                                  return [...newdata]
      
      
                                })
                              }}
                            />
                            <Text style={{marginTop: 8}}> {itm.value}</Text>
                          </View>
                        );
                      })}
                    </View>
                    <View
                      style={{
                        marginVertical: 5,
                        borderWidth: 0.7,
                      }}></View>
                  </View>
                );
              } else if (item.questiontype == 2  && Groupanswer.length!=0) {
                const onCamara = () => {
                  ImagePicker.openCamera({
                    width: 800,
                    height: 1000,
                    cropping: true,
                  }).then(image => {
                    convertImage(image.path);
                  });
                };

                async function convertImage(image) {
                  // var data = await RNFS.readFile(image, 'base64').then(res => {
                  //   return res;
                  // });

                  // setanswer(p => {
                  //   p[num].answerimage = image;

                  //   return [...p];
                  // });
                  setGroupanswer(p=>{
                    var newdata=p
                    newdata[index].answerimage=image
                    AsyncStorage.setItem(answer[num].answer, JSON.stringify(newdata));

                    return [...newdata]


                  })

                }

                const openLibrary = () => {
                  ImagePicker.openPicker({
                    width: 800,
                    height: 1000,
                    cropping: true,
                  }).then(image => {
                    convertImage(image.path);
                  });
                };

                return (
                  <View style={{flexDirection: 'column', flex: 1}}>
                    {item.removable ? (
                      <>
                        <View style={{alignItems: 'flex-end'}}>
                          <TouchableOpacity
                            onPress={() => {
                              removequestion(num);
                            }}>
                            <View>
                              <Icon
                                name="close"
                                style={{fontSize: 30}}
                                type="MaterialIcons"
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : null}

               

                    <View style={{flexDirection: 'row', flex: 1}}>
                      {item.mandatory == 1 ? (
                        <>
                          <Text
                            style={{fontSize: 24, flex: 2, textAlign: 'right'}}>
                            {item.questionname}
                          </Text>

                          <Text style={{fontSize: 20, flex: 1.5, color: 'red'}}>
                         
                          </Text>
                        </>
                      ) : (
                        <Text
                          style={{fontSize: 24, flex: 2, textAlign: 'center'}}>
                          {item.questionname}
                        </Text>
                      )}
                    </View>

                    {Groupanswer[index].answerimage != '' ? (
                      // <Image
                      //   style={localstyles.avatar}
                      //   source={{uri: `data:image/gif;base64,${answer[num].answerimage}`}}
                      // />
                      <Image
                        source={{
                          uri: Groupanswer[index].answerimage,
                        }}
                        style={{width: 200, height: 200}}
                      />
                    ) : (
                      <Text
                        style={{
                          color: 'black',
                          backgroundColor: 'gold',
                          textAlign: 'center',
                        }}>
                        Click Below to Save Image
                      </Text>
                    )}
                    <View style={{flexDirection: 'row'}}>
                      <View style={{marginTop: 20, marginHorizontal: 10}}>
                        <Button title="Image From Camara" onPress={onCamara} />
                      </View>
                      <View style={{marginTop: 20, marginHorizontal: 10}}>
                        <Button
                          title="Image From Gallary"
                          onPress={openLibrary}
                        />
                      </View>
                    </View>
                    <View style={{flex: 1, alignItems: 'center'}}>
                      <TextInput
                        style={{
                          borderWidth: 1,
                          borderRadius: 5,
                          marginTop: 10,
                          width: '90%',
                        }}
                        value={Groupanswer[index].answer}
                        placeholder="Enter Name"
                        onChangeText={text => {
                          // setanswer(p => {
                          //   p[num].answer = text;

                          //   return [...p];
                          // });
                          setGroupanswer(p=>{
                            var newdata=p
                            newdata[index].answer=text
                            AsyncStorage.setItem(answer[num].answer, JSON.stringify(newdata));
        
                            return [...newdata]
        
        
                          })
                        }}></TextInput>
                    </View>
                    <View
                      style={{
                        marginVertical: 5,
                        borderWidth: 0.7,
                      }}></View>
                  </View>
                );
              } else if (item.questiontype == 5  && Groupanswer.length!=0) {
                return (
                  <View style={{flexDirection: 'column', flex: 1}}>
                    <View style={{flexDirection: 'row', flex: 1}}>
                      {item.mandatory == 1 ? (
                        <>
                          <Text
                            style={{fontSize: 24, flex: 2, textAlign: 'right'}}>
                            {item.questionname}
                          </Text>

                          <Text style={{fontSize: 20, flex: 1.5, color: 'red'}}>
                        
                          </Text>
                        </>
                      ) : (
                        <Text
                          style={{fontSize: 24, flex: 2, textAlign: 'center'}}>
                          {item.questionname}
                        </Text>
                      )}
                    </View>
                    <View style={{width: '100%', flex: 1}}>
                      {item.optionlist.map((item, index) => {
                        return (
                          <>
                            <View
                              style={{
                                justifyContent: 'center',
                                flexDirection: 'row',
                              }}>
                              <View style={{flex: 1, marginTop: 10}}></View>

                              <View style={{flexDirection: 'row'}}>
                                <Text style={{fontSize: 18}}> </Text>

                                <Pressable
                                  style={{marginHorizontal: 10, marginTop: 10}}
                                  onPress={() => {
                                    var text = '';

                                    setQuestions(p => {
                                      p[num].optionlist[index].select =
                                        !p[num].optionlist[index].select;

                                      for (
                                        var i = 0;
                                        i < p[num].optionlist.length;
                                        i++
                                      ) {
                                        if (
                                          p[num].optionlist[i].select == true
                                        ) {
                                          text =
                                            text +
                                            p[num].optionlist[i].select.value +
                                            ',';
                                        }
                                      }

                                      return [...p];
                                    });

                                    // setanswer(prev => {
                                    //   prev[num].answer = text;

                                    //   return [...prev];
                                    // });

                                    setGroupanswer(p=>{
                                      var newdata=p
                                      newdata[index].answer=text
                                      AsyncStorage.setItem(answer[num].answer, JSON.stringify(newdata));
          
                                      return [...newdata]
          
          
                                    })


                                  }}>
                                  <View
                                    style={{
                                      borderWidth: 2,
                                      width: 40,
                                      height: 40,
                                      borderRadius: 3,
                                      justifyContent: 'center',
                                      alignItems: 'center',
                                    }}>
                                    {item.select == true ? (
                                      <Icon
                                        name="check"
                                        style={{fontSize: 30}}
                                        type="MaterialIcons"
                                      />
                                    ) : null}
                                  </View>
                                </Pressable>
                              </View>

                              <View style={{flex: 1, marginTop: 10}}>
                                <Text style={{textAlign: 'left'}}>
                                  {item.label}
                                </Text>
                              </View>
                              <View style={{flex: 0.5, marginTop: 10}}></View>
                            </View>
                          </>
                        );
                      })}
                    </View>
                    <View
                      style={{
                        marginVertical: 5,
                        borderWidth: 0.7,
                      }}></View>{' '}
                  </View>
                );
              } else if (item.questiontype == 3  && Groupanswer.length!=0) {
                return (
                  <View style={{flexDirection: 'column', flex: 1}}>
                    {item.removable ? (
                      <>
                        <View style={{alignItems: 'flex-end'}}>
                          <TouchableOpacity
                            onPress={() => {
                              removequestion(num);
                            }}>
                            <View>
                              <Icon
                                name="close"
                                style={{fontSize: 30}}
                                type="MaterialIcons"
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </>
                    ) : null}

                    <View style={{flexDirection: 'row', flex: 1}}>
                      {item.mandatory == 1 ? (
                        <>
                          <Text
                            style={{fontSize: 24, flex: 2, textAlign: 'right'}}>
                            {item.questionname}
                          </Text>

                          <Text style={{fontSize: 20, flex: 1.5, color: 'red'}}>
                        
                          </Text>
                        </>
                      ) : (
                        <Text
                          style={{fontSize: 24, flex: 2, textAlign: 'center'}}>
                          {item.questionname}
                        </Text>
                      )}
                    </View>

                    <View style={{width: '100%', flex: 1}}>
                      {item.optionlist.map(item => {
                        return (
                          <View style={{flexDirection: 'row'}}>
                            <RadioButton
                              value="first"
                              status={
                                Groupanswer[index].answer === item.value
                                  ? 'checked'
                                  : 'unchecked'
                              }
                              onPress={() => {
                                // setanswer(p => {
                                //   p[num].answer = item.label;
                                //   return [...p];
                                // });
                                setGroupanswer(p=>{
                                  var newdata=p
                                  newdata[index].answer=item.label
                                  AsyncStorage.setItem(answer[num].answer, JSON.stringify(newdata));
      
                                  return [...newdata]
      
      
                                })
                              }}
                            />
                            <Text style={{marginTop: 8}}> {item.value}</Text>
                          </View>
                        );
                      })}
                    </View>
                    <View
                      style={{
                        marginVertical: 5,
                        borderWidth: 0.7,
                      }}></View>
                  </View>
                );
              }
            })}
          </View>
        </ScrollView>
      </View>
    );
  } else if (
    Questions[num].questiontype == 7 &&
    Questions[num].isgroupof == null
  ) {
    var string = Questions[num].questionname.split(' ');
    console.log('string??????????', string);
    var count = 0;
    for(var i = 0; i < string.length; ++i){
        if(string[i] == '()')
            count++;
    }
    return (
      <View style={{flexDirection: 'column', flex: 1}}>
        {Questions[num].removable ? (
          <>
            <View style={{alignItems: 'flex-end'}}>
              <TouchableOpacity
                onPress={() => {
                  removequestion(num);
                }}>
                <View>
                  <Icon
                    name="close"
                    style={{fontSize: 30}}
                    type="MaterialIcons"
                  />
                </View>
              </TouchableOpacity>
            </View>
          </>
        ) : null}




        <View style={{flex: 1, margin: 20, padding: 5}}>
          {Questions[num].mandatory == 1 ? (
            <>
              <View style={{flex: 1}}>
                <Text style={{fontSize: 24, flex: 1}}>
                  {Questions[num].questionname}
                </Text>
              </View>

              <View style={{flex: 1}}>
             
              </View>

              <Text style={{fontSize: 20, flex: 1.5, color: 'red'}}> * </Text>
            </>
          ) : (
            <Text style={{fontSize: 24, flex: 2, textAlign: 'center'}}>
              {Questions[num].questionname}
            </Text>
          )}
        </View>
      </View>
    );
  } else {
    if (srn.back == true) {
      if (Questions[num].isgroupof != null) {
        setnum(p => {
          var newdata = p;
          return newdata - 1;
        });
      }
    } else {
      setnum(p => {
        var newdata = p;
        return newdata + 1;
      });
    }

    return (
      <View>
        <Text>Next</Text>
      </View>
    );
  }
};

const Questionspage = ({route, navigation}) => {
  const {surveyType, mainrecno, mobile, newsurvey, shortguid} = route.params;
  const [num, setnum] = useState(0);
  const [srn, setsrn] = useState({
    num: 0,
    back: false,
  });
  const [Questions, setQuestions] = useState([]);
  const [answer, setanswer] = useState([]);
  const [GroupQuestions, setGroupQuestions] = useState([]);
  const [Groupanswer, setGroupanswer] = useState([]);
  const [loading, setloading] = useState(false);
  const [loadpin, setloadpin] = useState(false);
  const [dum, setdum] = useState(false);


  var count = 0;
  useEffect(() => {
    updateasyncstorage();
    updatesqlite();
  }, [answer, Questions]);

  function loadfun() {
    // console.log('count', count);

    if (count == answer.length && answer.length != 0) {
      setloading(false);

      navigation.navigate('Selectpage');
    }
  }

  useEffect(() => {
    if (newsurvey == true) {
      getSurveyQuestions();
    } else {
      getSurveyQuestionsfromasync();
    }
  }, []);

  async function updateasyncstorage() {
    let dataasync = await AsyncStorage.getItem(mobile.toString());
    dataasync = JSON.parse(dataasync);

    dataasync.answer = answer;
    dataasync.question = Questions;

    AsyncStorage.setItem(mobile.toString(), JSON.stringify(dataasync));
  }

  async function updatesqlite() {
    try {
      let updateqnsans =
        'UPDATE qnsans  SET question = ?, answer = ? WHERE  shortguid = ? ;';
      await AppFunctions.ExecuteQuery(updateqnsans, [
        JSON.stringify(Questions),
        JSON.stringify(answer),
        shortguid,
      ]);
    } catch (e) {
      console.log('Error:=>updatesqlite', e);
    }
  }

  async function getSurveyQuestionsfromasync() {
    let dataasync = await AsyncStorage.getItem(mobile.toString());
    dataasync = JSON.parse(dataasync);

    setanswer(dataasync.answer);
    setQuestions(dataasync.question);
    setGroupQuestions(dataasync.localgroupquestion);
  }

  function insert(arr, setfun, index, newItem) {
    if (setfun == 'question') {
      setQuestions([
        ...arr.slice(0, index),
        newItem,
        ...arr.slice(index),
      ]);
    } else {
      setanswer([
        ...arr.slice(0, index),
        newItem,
        ...arr.slice(index),
      ]);
    }
  }

  async function getSurveyQuestions() {
    try {
      var tenant = await AsyncStorage.getItem('tenant');

      var localquestion = [];
      var localgroupquestion = [];
      const res = await axios.post(AppConstants.url + 'questionbysurveytype/', {
        surveytype: surveyType,
        tenant: tenant,
      });

      const commonres = await axios.post(
        AppConstants.url + 'getcommonquestions/',
        {
          tenant: tenant,
        },
      );

      commonres.data.Message.map(item => {
        if (item.isgroupof == null) {
          localquestion.push({...item, removable: false});
        } else {
          localgroupquestion.push({...item, removable: false});
        }
      });
      res.data.Message.map(item => {
        if (item.isgroupof == null) {
          localquestion.push({...item, removable: false});
        } else {
          localgroupquestion.push({...item, removable: false});
        }
      });

      localquestion = _.sortBy(localquestion, ['questionsrno']);

      localquestion.map((item, index) => {
        if (
          item.questiontype == 4 ||
          item.questiontype == 5 ||
          item.questiontype == 3
        ) {
          var option = [];
          Object.values(item.optionlist.split(',')).map((item, index) => {
            var newdata = {
              index: index,
              label: item,
              value: item,
              select: false,
            };
            option.push(newdata);
          });

          localquestion[index].optionlist = option;
        }
      });
      localgroupquestion.map((item, index) => {
        if (
          item.questiontype == 4 ||
          item.questiontype == 5 ||
          item.questiontype == 3
        ) {
          var option = [];
          Object.values(item.optionlist.split(',')).map((item, index) => {
            var newdata = {
              index: index,
              label: item,
              value: item,
              select: false,
            };
            option.push(newdata);
          });

          localgroupquestion[index].optionlist = option;
        }
      });

      var localanswer = [];

      for (var i = 0; i < localquestion.length; i++) {
        if (localquestion[i].questiontype == 6) {
          var newdata = {
            mainrecno: mainrecno,
            questionrecno: localquestion[i].recno,
            answer: uuid(),
            answerimage: '',
            answeroptions: '',
            mandatory: localquestion[i].mandatory,
            groupshortguid: '',
            questiontype: localquestion[i].questiontype
          };
        } else {
          var newdata = {
            mainrecno: mainrecno,
            questionrecno: localquestion[i].recno,
            answer: '',
            answerimage: '',
            answeroptions: '',
            mandatory: localquestion[i].mandatory,
            groupshortguid: '',
            questiontype: localquestion[i].questiontype

          };
        }

        localanswer.push(newdata);
      }
      setanswer(localanswer);
      setQuestions(localquestion);
      setGroupQuestions(localgroupquestion);

      let dataasync = await AsyncStorage.getItem(mobile.toString());
      dataasync = JSON.parse(dataasync);

      dataasync.answer = localanswer;
      dataasync.question = localquestion;
      dataasync.localgroupquestion = localgroupquestion;
      AsyncStorage.setItem(mobile.toString(), JSON.stringify(dataasync));

      //  var sqlitestring='select * from qnsans where shortguid=?'
      //    var sqlres=await AppFunctions.ExecuteQuery(sqlitestring,[shortguid])
      //    console.log( "res...............", sqlres)

      let updateqnsans =
        'UPDATE qnsans  SET question = ?, answer = ? WHERE  shortguid = ? ;';
      await AppFunctions.ExecuteQuery(updateqnsans, [
        JSON.stringify(localquestion),
        JSON.stringify(localanswer),
        shortguid,
      ]);
    } catch (e) {
      console.log('Error:=>getSurveyQuestions', e);
    }
  }
  async function removekey(item) {
    var datakey = await AsyncStorage.getItem('datakey');

    datakey = JSON.parse(datakey);
    var newkey = [];
    datakey.map(data => {
      if (data.mobile == item) {
        return;
      } else {
        newkey.push(data);
      }
    });

    AsyncStorage.setItem('datakey', JSON.stringify(newkey));
    AsyncStorage.removeItem(item.toString());
  }

  async function saveanswer() {
    var checkmandatory = true;
    var tenant = await AsyncStorage.getItem('tenant');

    answer.map((item, index) => {
      if (Questions[index].issubquestionof != 0) {
        var localforanswer = '';
        var localcheck = answer.filter(function (e) {
          return e.questionrecno == Questions[index].issubquestionof;
        });

        if (localcheck.length != 0) {
          localforanswer = localcheck[0].answer;
        }

        if (localforanswer == Questions[index].foranswer) {
          if (item.mandatory == 1 && item.answer == '') {
            checkmandatory = false;
            return;
          }
        }
      } else {
        if (item.mandatory == 1 && item.answer == '') {
          checkmandatory = false;
          return;
        }
      }
    });

    if (checkmandatory == false) {
      alert('please fill required fill');

      return;
    }

    Alert.alert('Survey Submition', 'Do you want Submit Survey?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          setloading(true);
          let updatesurveyanswer =
            "UPDATE surveyanswer  SET status = 'C' where shortguid=? ;";
          AppFunctions.ExecuteQuery(updatesurveyanswer, [shortguid]);
          answer.map(async (item, i) => {




if(item.questiontype==6){

  let savelocalanswer = await AsyncStorage.getItem(item.answer);
  savelocalanswer = JSON.parse(savelocalanswer);

  savelocalanswer.map(async (ans, index) => {

    var footershortguid = uuid();
    var localdata = {
      ...item,
      shortguid: footershortguid,
      tenant: tenant,
    };

    const surveyanswerfooterInsertString = `insert into  surveyanswerfooter('shortguid','tenant','mainshortguid','mainrecno', 'questionrecno', 'answer', 'answerimage', 'answeroptions','groupshortguid','questiontype') values(${AppFunctions.insertQuestionMarks(
      10,
    )})`;
    AppFunctions.ExecuteQuery(surveyanswerfooterInsertString, [
      footershortguid,
      tenant,
      shortguid,
      mainrecno,
      ans.questionrecno,
      ans.answer,
      ans.answerimage,
      ans.answeroptions,
      ans.groupshortguid,
      ans.questiontype,
    ]);




    if (ans.answerimage === '') {
      var senddataapi = {
        ...ans,
        shortguid: footershortguid,
        tenant: tenant,
      };
      //  console.log("senddataapi..........",senddataapi)

      // console.log('yes');
      const response = await axios.post(
        AppConstants.url + 'addasnwerfooter/',
        senddataapi,
      );

      // console.log('response1.....', response.data);

      // count = count + 1;
      // loadfun();
    } else {
      console.log('no');

      // console.log('imswerimage', item.answerimage);

      // ImageResizer.createResizedImage(localdata.answerimage, 600, 800, compressFormat, quality, rotation, outputPath)
      var response2 = await ImageResizer.createResizedImage(
        localdata.answerimage,
        600,
        800,
        'JPEG',
        60,
        0,
        null,
      ).then(response2 => {
        return response2;
      });

      // console.log('response...2', response2);

      var res = await RNFS.readFile(response2.path, 'base64').then(
        res => {
          return res;
        },
      );

      localdata.answerimage = res;

      var response = await axios.post(
        AppConstants.url + 'addasnwerfooter/',
        localdata,
      );
      // count = count + 1;
      // loadfun();
    }







  })



}


            var footershortguid = uuid();
            var localdata = {
              ...item,
              shortguid: footershortguid,
              tenant: tenant,
            };

            const surveyanswerfooterInsertString = `insert into  surveyanswerfooter('shortguid','tenant','mainshortguid','mainrecno', 'questionrecno', 'answer', 'answerimage', 'answeroptions','groupshortguid','questiontype') values(${AppFunctions.insertQuestionMarks(
              10,
            )})`;
            AppFunctions.ExecuteQuery(surveyanswerfooterInsertString, [
              footershortguid,
              tenant,
              shortguid,
              mainrecno,
              item.questionrecno,
              item.answer,
              item.answerimage,
              item.answeroptions,
              item.groupshortguid,
              item.questiontype,
            ]);

            // console.log('image...2', item.answerimage);

            if (item.answerimage === '') {
              var senddataapi = {
                ...item,
                shortguid: footershortguid,
                tenant: tenant,
              };
              //  console.log("senddataapi..........",senddataapi)

              // console.log('yes');
              const response = await axios.post(
                AppConstants.url + 'addasnwerfooter/',
                senddataapi,
              );

              // console.log('response1.....', response.data);

              count = count + 1;
              loadfun();
            } else {
              console.log('no');

              // console.log('imswerimage', item.answerimage);

              // ImageResizer.createResizedImage(localdata.answerimage, 600, 800, compressFormat, quality, rotation, outputPath)
              var response2 = await ImageResizer.createResizedImage(
                localdata.answerimage,
                600,
                800,
                'JPEG',
                60,
                0,
                null,
              ).then(response2 => {
                return response2;
              });

              // console.log('response...2', response2);

              var res = await RNFS.readFile(response2.path, 'base64').then(
                res => {
                  return res;
                },
              );

              localdata.answerimage = res;

              var response = await axios.post(
                AppConstants.url + 'addasnwerfooter/',
                localdata,
              );
              count = count + 1;
              loadfun();
            }
          });

          removekey(mobile);
          // let updatesurveyanswer = "UPDATE surveyanswer  SET status = 'C' where shortguid=? ;";
          //  AppFunctions.ExecuteQuery(updatesurveyanswer, [ shortguid ]);
        },
      },
    ]);
  }

  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <View style={{marginTop: 50, flex: 2}}>
        <ScrollView>
          {Questions.length > 0 &&
          answer.length > 0 &&
          num < Questions.length ? (
            Questions[num].issubquestionof == 0 ? (
              <QuestionsComponent
                setQuestions={setQuestions}
                Questions={Questions}
                num={num}
                answer={answer}
                setanswer={setanswer}
                setnum={setnum}
                setloadpin={setloadpin}
                srn={srn}
                GroupQuestions={GroupQuestions}
                setGroupanswer={setGroupanswer}
                Groupanswer={Groupanswer}
                mainrecno={mainrecno}
                setdum={setdum}
              />
            ) : null
          ) : (
            <Submitcomponent
              saveanswer={saveanswer}
              setnum={setnum}
              num={num}
              setsrn={setsrn}
              loading={loading}
            />
          )}

          {Questions.length > 0 &&
          answer.length > 0 &&
          num < Questions.length ? (
            Questions[num].issubquestionof != 0 ? (
              Questions[num].foranswer ==
                answer.filter(function (e) {
                  return e.questionrecno == Questions[num].issubquestionof;
                })[0].answer || Questions[num].foranswer == '' ? (
                <QuestionsComponent
                  setQuestions={setQuestions}
                  Questions={Questions}
                  num={num}
                  answer={answer}
                  setanswer={setanswer}
                  setnum={setnum}
                  setloadpin={setloadpin}
                />
              ) : (
                <Pass
                  num={num}
                  setnum={setnum}
                  x={Questions[num].foranswer}
                  srn={srn}
                />
              )
            ) : null
          ) : null}
        </ScrollView>
      </View>

      {num < Questions.length ? (
        <View style={{flex: 1.1}}>
          <View style={{marginTop: 20, marginHorizontal: 40}}>
            {loadpin ? (
              <View>
                <ActivityIndicator size="large" color="blue" />
              </View>
            ) : (
              <Button
                onPress={() => {
                  if (num < Questions.length) {
                    setnum(p => {
                      return p + 1;
                    });
                  }

                  setsrn(prev => {
                    return {...prev, back: false};
                  });
                  setanswer([...answer]);
                }}
                title="Save and Next"></Button>
            )}
          </View>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <View style={{flex: 1, marginHorizontal: 10}}>
              <Button
                onPress={() => {
                  if (num > 0) {
                    setnum(p => {
                      return p - 1;
                    });
                  }

                  setsrn(prev => {
                    return {...prev, back: true};
                  });
                }}
                title="Back"></Button>
            </View>

            <View style={{flex: 1, marginHorizontal: 10}}>
              <Button
                onPress={() => {
                  if (num < Questions.length) {
                    setnum(p => {
                      return p + 1;
                    });
                  }
                  setsrn(prev => {
                    return {...prev, back: false};
                  });
                }}
                title="Skip / Next"></Button>
            </View>
          </View>

          <View style={{marginTop: 20, marginHorizontal: 40}}>
            <Button
              onPress={() => {
                insert(Questions, 'question', num + 1, {
                  tenantrecno: Questions[num].tenantrecno,
                  surveytyperecno: Questions[num].surveytyperecno,
                  questionsrno: Questions[num].questionsrno,
                  questiontype: Questions[num].questiontype,
                  questionname: Questions[num].questionname,
                  optionlist: Questions[num].optionlist,
                  mandatory: Questions[num].mandatory,
                  images: Questions[num].images,
                  hassubquestions: Questions[num].hassubquestions,
                  issubquestionof: Questions[num].issubquestionof,
                  foranswer: Questions[num].foranswer,
                  isCommon: Questions[num].isCommon,
                  removable: true,
                  hasgroup: Questions[num].hasgroup,
                  isgroupof: Questions[num].isgroupof,
                  location: Questions[num].location,
                  recno: Questions[num].recno,
                });

                insert(answer, 'answer', num + 1, {
                  mainrecno: mainrecno,
                  questionrecno: Questions[num].recno,
                  answer: '',
                  answerimage: '',
                  answerimagebinary: '',
                  answeroptions: '',
                  groupshortguid: '',
                  questiontype:Questions[num].questiontype,
                  groupshortguid:uuid()
                });
                if (num < Questions.length - 1) {
                  setnum(p => {
                    return p + 1;
                  });
                  setsrn(prev => {
                    return {...prev, back: false};
                  });
                }
              }}
              title="Add Another Answer"></Button>
          </View>

          {/* {num + 1 == Questions.length ? (
  <View style={{flex: 1, marginHorizontal: 10, marginTop: 10}}>
    <Button onPress={saveanswer} title="Submit"></Button>
  </View>
) : null} */}
        </View>
      ) : null}

      {loading ? (
        <View style={{flex: 1, justifyContent: 'center'}}>
          <Text style={{textAlign: 'center', fontSize: 20}}>
            Please wait....... your answer is saving
          </Text>

          <ActivityIndicator size="large" color="blue" />
        </View>
      ) : null}
    </View>
  );
};

export default Questionspage;
const localstyles = StyleSheet.create({
  title: {},
  avatar: {
    paddingTop: 20,
    height: 200,
    width: 200,
    padding: 20,
    borderWidth: 1,
  },
});
