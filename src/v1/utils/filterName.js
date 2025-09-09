module.exports = (name = "") => {
  return name.split(" ").join("_").split(":").join("_").split("/").join("_");
};
