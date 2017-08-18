export function getYearWeek(d){
  var date=new Date(d)
  var date2 = new Date(date.getFullYear(), 0, 1)
  var day1 = date.getDay()
  if (day1 == 0) {day1 = 7}
  var day2 = date2.getDay()
  if (day2 == 0) {day2 = 7}
  d = Math.round((date.getTime() - date2.getTime() + (day2 - day2) * (24 * 60 * 60 * 1000)) / 86400000)
  return Math.ceil(d / 7)-1
}
// function getWeekNumber (src) {
//   const date = new Date(src.getTime());
//   date.setHours(0, 0, 0, 0);
//   // Thursday in current week decides the year.
//   date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
//   // January 4 is always in week 1.
//   const week1 = new Date(date.getFullYear(), 0, 4);
//   // Adjust to Thursday in week 1 and count number of weeks from date to week 1.
//   return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
// }
