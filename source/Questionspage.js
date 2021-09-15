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




const Questionspage = ({route, navigation}) => {
  const {surveyType, mainrecno, mobile, newsurvey, shortguid} = route.params;
  const [num, setnum] = useState(0);
  const [srn, setsrn] = useState({
    num: 0,
    back: false,
  });
  const [Questions, setQuestions] = useState([]);
  const [answer, setanswer] = useState([]);
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
  }

  function insert(arr, setfun, index, newItem) {
    if (setfun == 'question') {
      setQuestions([...arr.slice(0, index), newItem, ...arr.slice(index)]);
    } else {
      setanswer([...arr.slice(0, index), newItem, ...arr.slice(index)]);
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
        localquestion.push({...item, removable: false});
     
      });
      res.data.Message.map(item => {
        localquestion.push({...item, removable: false});
    
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
   

      var localanswer = [];
      for (var i = 0; i < localquestion.length; i++) {
        if (localquestion[i].autofilled == 1) {
          var localnwedata = await AsyncStorage.getItem(
            localquestion[i].recno.toString(),
          );
          if (localnwedata == null) {
            var newdata = {
              mainrecno: mainrecno,
              questionrecno: localquestion[i].recno,
              answer: '',
              answerimage: '',
              answeroptions: '',
              mandatory: localquestion[i].mandatory,
              groupshortguid: '',
              questiontype: localquestion[i].questiontype,
            };
          } else {
            var localnwedata = JSON.parse(localnwedata);


            var newdata = {
              mainrecno: mainrecno,
              questionrecno: localquestion[i].recno,
              answer: localnwedata.answer,
              answerimage: localnwedata.answerimage,
              answeroptions: localnwedata.answeroptions,
              mandatory: localquestion[i].mandatory,
              groupshortguid: '',
              questiontype: localquestion[i].questiontype,
            };
          }
        } else {
          var newdata = {
            mainrecno: mainrecno,
            questionrecno: localquestion[i].recno,
            answer: '',
            answerimage: '',
            answeroptions: '',
            mandatory: localquestion[i].mandatory,
            groupshortguid: '',
            questiontype: localquestion[i].questiontype,
          };
        }

        // var tenant = await AsyncStorage.getItem('tenant');

        localanswer.push(newdata);
      }

    
      setanswer(localanswer);
      setQuestions(localquestion);

      let dataasync = await AsyncStorage.getItem(mobile.toString());
      dataasync = JSON.parse(dataasync);

      dataasync.answer = localanswer;
      dataasync.question = localquestion;
      dataasync.localgroupquestion = localgroupquestion;
      AsyncStorage.setItem(mobile.toString(), JSON.stringify(dataasync));

  
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


    console.log("savaanswer",answer)
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
            AsyncStorage.setItem(
              item.questionrecno.toString(),
              JSON.stringify(item),
            );

            if (item.questiontype == 6) {
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
              });
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
    <View style={{flex: 1}}>
      <View style={{flex: 1, marginTop: 30}}>
        <Text style={{textAlign: 'center', fontSize: 28}}>Survey</Text>
      </View>
      <View style={{flex: 10}}>
        <ScrollView>
          {Questions.map((item, index) => {
            if (item.questiontype == 1) {
              return (
                <View style={{flexDirection: 'row', margin: 8}}>
                  <View style={{flex: 1}}>
                    <Text>{item.questionname}</Text>
                  </View>
                  <View style={{flex: 1}}>
                    <TextInput
                    value={answer[index].answer}
                      style={{flex: 1, borderWidth: 1, borderRadius: 5}}
                      onChangeText={text => {
                        setanswer(p => {
                          p[index].answer = text;
                          return [...p];
                        });
                      }}></TextInput>
                  </View>
                </View>
              );
            } else if (item.questiontype == 4) {
              return (
                <View style={{flexDirection: 'row', margin: 10}}>
                  <View style={{flex: 1}}>
                    <Text>{item.questionname}</Text>
                  </View>

                  <View>
                    {item.optionlist.map(itm => {
                      return (
                        <View style={{flexDirection: 'row', marginTop: 10}}>
                          <RadioButton
                            value="first"
                            status={
                              answer[index].answer === itm.value
                                ? 'checked'
                                : 'unchecked'
                            }
                            onPress={() => {
                              setanswer(p => {
                                p[index].answer = itm.value;
                                console.log("p",p)
                                return [...p];
                              });
                            }}
                          />
                          <Text style={{marginTop: 8}}> {itm.label}</Text>
                        </View>
                      );
                    })}
                  </View>
             
             
             
                </View>
              );
            }
          })}

          <View style={{flex: 1}}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: 'dodgerblue',
                height: 40,
                marginHorizontal: 100,
                borderRadius: 5,
                alignItems: 'center',
              }}
              onPress={saveanswer}>
              <View>
                <Text style={{fontSize: 20, marginTop: 5}}>Submit</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
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
