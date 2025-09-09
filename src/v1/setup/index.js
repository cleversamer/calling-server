const setupSanitization = require("./sanitize");
const setupMongoDB = require("./db");
const routes = require("../routes");
const { server } = require("../config/system");
const {
  errorHandler,
  errorConverter,
  unsupportedRouteHandler,
} = require("../middleware/apiError");
const setupScheduling = require("./scheduling");

module.exports = (app) => {
  setupMongoDB();
  setupSanitization(app);
  app.use("/api", routes);
  app.use(unsupportedRouteHandler);
  app.use(errorConverter);
  app.use(errorHandler);

  app.listen(server.PORT, () => {
    console.log(`App is listening on port ${server.PORT}`);
  });

  setupScheduling();
};
