var ScrollBar = function () {
  this.width = 0
  this.oLoadDiv = false
}
ScrollBar.prototype = {
  init: function () {
    this.creatStyle()
    this.creatLoadDiv()
  },
  setWidth: function (w) {
    if (!this.oLoadDiv) {this.init()}
    var oLoadDiv = this.oLoadDiv
    var width = Number(w);
    // (width < this.width) ? width = this.width : this.width = width
    oLoadDiv.className = 'animation_paused'
    oLoadDiv.style.width = width + '%'
    if(width>0&&width<20){
      oLoadDiv.style.background="#6ed4ff";
    }else if(width>20&&width<40){
      oLoadDiv.style.background="#6ea5ff";
    }else if(width>40&&width<60){
      oLoadDiv.style.background="#756eff";
    }else if(width>60&&width<80){
      oLoadDiv.style.background="#b96eff";
    }else{
      oLoadDiv.style.background="#f36eff";
    }
    oLoadDiv.className = ''
    //if (width === 100) {this.over(oLoadDiv)}
  },
  over: function (obj) {
    setTimeout(function () {
      obj.style.display = 'none'
    }, 1000)
  },
  creatLoadDiv: function () {
    var div = document.createElement('div')
    div.id = 'LoadingBar'
    document.body.appendChild(div)
    this.oLoadDiv = document.getElementById('LoadingBar')
  },
  creatStyle: function () {
    var nod = document.createElement('style'),
      str = '#LoadingBar{transition:all 1s;-moz-transition:all 1s;-webkit-transition:all 1s;-o-transition:all 1s;background-color:#6ef4ff;height: 4px;width:0; position: fixed;top: 0;z-index: 99999;left: 0;font-size: 0;z-index:9999999;_position:absolute;_top:expression(eval(document.documentElement.scrollTop));}.animation_paused{-webkit-animation-play-state:paused;-moz-animation-play-state:paused;-ms-animation-play-state:paused;animation-play-state:paused;};'
    nod.type = 'text/css'
    nod.styleSheet ? nod.styleSheet.cssText = str : nod.innerHTML = str
    document.getElementsByTagName('head')[0].appendChild(nod)
  }
}
export default ScrollBar
