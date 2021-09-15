import {NativeModules} from 'react-native';
const Buffer = require('buffer').Buffer;
import uuid from 'uuid-random';
import axios from 'axios';
import _ from 'lodash';
import AppConstants from '../AppConstants';

var RNFS = require('react-native-fs');

var SQLite = require('react-native-sqlite-storage');
var db = SQLite.openDatabase(
  
    {name: 'surveyappDB',
     location: 'default'},
  () => console.log('AUTH', 'Databse Opened.'),
  (e) => console.error('Error1: ', e),
);

const formatAMPM = (date) => {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  console.debug('hours: ', hours, 'minutes: ', minutes);
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return strTime;
};
const log = (namespace, ...text) => {
    if (
      namespace == 'SHOP' ||
      namespace == 'SHOPReducer' ||
      namespace == 'STATE' ||
      namespace == 'CUSTMODAL' ||
      namespace == 'storeDatatoCust' ||
      namespace == 'custDescn'
    )
      return;
    // RNFS.appendFile(
    //   path,
    //   `\n/AppFunctionsLog: ${new Date().toLocaleDateString()}::${new Date().toLocaleTimeString()} ${namespace}, ': ', ${[
    //     ...text,
    //   ].map((item) => JSON.stringify(item))} :AppFunctionsLog/`,
    // ).catch((e) => {});
    console.log(namespace, ': ', ...text, ' :', namespace);
  };
  const insertQuestionMarks = (count) => {
    // returns ?,?,...count no of times., ?
    let retString = '';
    for (let i = 0; i < count; i++) {
      retString = retString + '?,';
    }
    retString = retString.substring(0, retString.length - 1);
    return retString;
  };

const ExecuteQuery = (sql, params = [], print = true) => {
  // if (print) log('SQliteCall', sql, params);
  return new Promise((resolve, reject) => {
    db.transaction((trans) => {
      trans.executeSql(
        sql,
        params,
        (trans, results) => {
          resolve(results);
        },
        (error) => {
          reject(error);
        },
      );
    });
  });
};


const AppFunctions = {
 
  ExecuteQuery: ExecuteQuery,
  formatAMPM: formatAMPM,
  log: log,
  insertQuestionMarks:insertQuestionMarks,

  convertdate: (date) => {
    if (!date) return;
    if (date == 0) return '00/00/0000';
    date = date.toString();
    return (
      date.substring(6) +
      '/' +
      date.substring(4, 6) +
      '/' +
      date.substring(0, 4)
    );
  },
  converttime: (time) => {
    if (!time) return;
    let hour = time.substring(0, 2);
    let ampm = 'am';
    if (hour >=12) {
      ampm = 'pm';
    }
    if (hour >12) {
      hour = hour % 12;
    }
  
    return hour + ':' + time.substring(2, 4) + ' ' + ampm;
  },

 
 
 
};

export default AppFunctions;
