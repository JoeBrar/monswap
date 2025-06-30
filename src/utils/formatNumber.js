export const formatNumber=(number, fractionDigits=2, useGrouping=true)=>{
  return number.toLocaleString('en-US', {maximumFractionDigits: fractionDigits, useGrouping: useGrouping});
}