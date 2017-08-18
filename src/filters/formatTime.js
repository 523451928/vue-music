export default function(val) {
  var second = ''
  var minute = ''
  second = Math.floor(val / 60)
  if (val % 60 == 0) {
    minute = '00'
  } else if (val % 60 >= 10) {
    minute = val % 60
  } else {
    minute = '0' + val % 60
  }
  return second + ':' + minute
}
