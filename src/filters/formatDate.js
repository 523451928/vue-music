export default function(date,fmt){
  typeof date=="number"?date=new Date(date):date;
  if(/(y+)/.test(fmt)){
    fmt=fmt.replace(RegExp.$1,(date.getFullYear()+"").substr(4-RegExp.$1.length));
  }
  var obj={
    "M+":date.getMonth()+1,
    "d+":date.getDate(),
    "h+":date.getHours(),
    "m+":date.getMinutes(),
    "s+":date.getSeconds()
  };
  for(var k in obj){
    if(new RegExp("("+k+")").test(fmt)){
      var str=obj[k]+"";
      fmt=fmt.replace(RegExp.$1,(RegExp.$1.length===1)?str:padLeftZero(str));
    }
  }
  return fmt;
};
function padLeftZero(str){
  return ("00"+str).substr(str.length);
};
