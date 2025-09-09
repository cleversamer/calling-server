const router = require("express").Router();
const phoneNumbersRoute = require("./phoneNumbers.route");

const routes = [
  {
    path: "/phoneNumbers",
    route: phoneNumbersRoute,
  },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
