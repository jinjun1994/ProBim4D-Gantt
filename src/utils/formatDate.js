export default {
  /** 
   * 判断日期是否在区间内，在区间内返回true，否返回false 
   * @param dateString 日期字符串 
   * @param startDateString 区间开始日期字符串 
   * @param endDateString 区间结束日期字符串 
   * @returns {Number} 
   */
  compareDate(startDate, endDate) {
    let endTimes, startTimes;
    if ((typeof startDate == 'string') && startDate.constructor == String) {
      if (startDate.length >= 8 && startDate.length <= 10) {
        startTimes = new Date(startDate).getTime()
      } else {
        startTimes = new Date(startDate.split(' ')[0]).getTime()
      }
    } else {
      startTimes = new Date(startDate).getTime()
    }
    if ((typeof endDate == 'string') && endDate.constructor == String) {
      if (endDate.length >= 8 && endDate.length <= 10) {
        endTimes = new Date(endDate).getTime()
      } else {
        endTimes = new Date(endDate.split(' ')[0]).getTime()
      }
    } else {
      endTimes = new Date(endDate).getTime()
    }
    if (endTimes < startTimes) {
      return -1;
    }
    return 1;
  },
  isDateBetween(dateString, startDateString, endDateString) {
    var flag = false;
    var startFlag = (this.compareDate(dateString, startDateString) < 1);
    var endFlag = (this.compareDate(dateString, endDateString) > -1);
    if (startFlag && endFlag) {
      flag = true;
    }
    return flag;
  },
  /**
   *
   *获取两个日期对象差值
   * @param {*} sDate1 日期 date对象 或者 字符串
   * @param {*} sDate2   日期 date对象 或者 字符串
   * @returns
   */
  DateDiff(sDate1, sDate2) { 
    var aDate, oDate1, oDate2, iDays
    oDate1 = new Date(sDate1).getTime()
    oDate2 = new Date(sDate2).getTime()
    iDays = parseInt((oDate1 - oDate2) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数   
    return iDays
  },
  /**
   *
   *
   * @param {*} date //日期
   * @param {*} T //根据切割
   */
  dateSplit(date,T){
      return date.split(T)[0]
  },
  /**
   *
   *初始化日期对象 返回 年-月-日
   * @param {*} date
   * @returns
   */
  dateInit(date){
    if( (typeof date=='string')&&date.constructor==String){
        if(date.indexOf('T') != -1){
             return date.split('T')[0]
        }else{
            return date.split(' ')[0]
        }
    }else{
        let a = new Date(date)
        var m,d;
        a.getMonth() + 1 >=  10?m=a.getMonth() + 1:m = '0'+(a.getMonth() + 1)
        a.getDate() >= 10? d = a.getDate(): d = '0' + a.getDate()
        return a.getFullYear() + '-'+ m + '-' + d
    }
  },
  /**
   *
   *
   * @param {*} arr 数组
   * @param {*} field 字段
   * @returns
   */
  arrUnique(arr,field){
    var map = {};
    var res = [];
    for (var i = 0; i < arr.length; i++) {
        if (!map[arr[i][field]]) {
            map[arr[i][field]]=1;
            res.push(arr[i]);
        }
    }
     return res;
},
/**
 *
 *
 * @param {*} arr
 * @param {*} field 根据什么字段去重
 * @returns
 */
arrUnique(arr, field) {
  var map = {};
  var res = [];
  for (var i = 0; i < arr.length; i++) {
    if (!map[arr[i][field][2]]) {
      map[arr[i][field][2]] = 1;
      res.push(arr[i]);
    }
  }
  return res;
},
NumberOfDays(planDate,newDate){
  return Math.abs(this.DateDiff(newDate,planDate))
}

}


