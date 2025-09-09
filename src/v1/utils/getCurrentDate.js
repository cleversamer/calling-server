module.exports = () => {
  let strDate = new Date().toLocaleString();
  strDate = strDate.split(", ");
  let part1 = strDate[0];

  let date = `${part1}`;
  date = date.split("/").join("-");
  return date;
};
