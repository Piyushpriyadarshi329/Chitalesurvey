const AppConstants = {
ChitaleSurveyAPIUrl : 'http://dev.sutradhar.tech/chitalepop/api/v1/',
today : () => new Date().getFullYear().toString() + ('0'+(new Date().getMonth() + 1).toString()).slice(-2)+('0'+(new Date().getDate()).toString()).slice(-2),
dateSendConvert:(date) => date.getFullYear().toString() + ('0'+(date.getMonth() + 1).toString()).slice(-2)+('0'+(date.getDate()).toString()).slice(-2),
datetime: (today)=> ('0'+today.getDate()).slice(-2)+('0'+(today.getMonth() + 1).toString()).slice(-2)+today.getFullYear()+('0'+today.getHours()).slice(-2)+('0'+today.getMinutes()).slice(-2)+('0'+today.getSeconds()).slice(-2),
now: ()=> {let now = new Date(); return ('0'+now.getHours()).slice(-2)+('0'+now.getMinutes()).slice(-2)+('0'+now.getSeconds()).slice(-2)},
timeSendConvert: (now) =>('0'+now.getHours()).slice(-2)+('0'+now.getMinutes()).slice(-2)+('0'+now.getSeconds()).slice(-2),

}

export default AppConstants;



// http://dev.sutradhar.tech/chitalepop/api/v1/getsurveydata/