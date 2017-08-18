export default function(el,obj){
  for(var key in obj.value){
    el.style[key]=obj.value[key];
  }
  el.onmousedown=function(e){
    var disX=e.clientX-el.offsetLeft;
    var disY=e.clientY-el.offsetTop;
    document.onmousemove=function(e){
      var l=e.clientX-disX;
      var t=e.clientY-disY;
      el.style.left=l+"px";
      el.style.top=t+"px";
    }
    document.onmouseup=function(){
      document.onmouseup=null;
      document.onmousemove=null;
    }
  }
}
