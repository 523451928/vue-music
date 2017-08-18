export function removeRepeat(json,id,cid){
  var tem={},arr=[];
  for(var i=0;i<json.length;i++){
    if(!tem[json[i][id][cid]]){
      arr.push(json[i]);
      tem[json[i][id][cid]]=1;
    }
  }
  return arr;
}
