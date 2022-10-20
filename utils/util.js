const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}
//格式化时间
function  formatTimeSong (time){
  var minute=Math.floor(time/60)%60;
  var second=Math.floor(time)%60
  return (minute<10?'0'+minute:minute)+':'+(second<10?'0'+second:second)
  }

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

module.exports = {
  formatTime,
  formatTimeSong,
}
