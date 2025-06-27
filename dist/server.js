"use strict";

var _cors = _interopRequireDefault(require("cors"));
var _express = _interopRequireDefault(require("express"));
var _expressListEndpoints = _interopRequireDefault(require("express-list-endpoints"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _happyThoughtsRouter = _interopRequireDefault(require("./routes/happyThoughtsRouter.js"));
var _userRoutes = _interopRequireDefault(require("./routes/userRoutes.js"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
// Ladda in .env-filen
_dotenv["default"].config();

//moongoose
var mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/happyThoughts';
_mongoose["default"].connect(mongoUrl).then(function () {
  console.log('Connected to MongoDB Atlas');
})["catch"](function (error) {
  console.error('MongoDB connection error:', error);
});
_mongoose["default"].connection.on('error', function (error) {
  console.error('MongoDB connection error:', error);
});
var port = process.env.PORT || 8080;

// Skapa en Express-app
var app = (0, _express["default"])();

// Middleware
app.use((0, _cors["default"])()); // Aktivera CORS
app.use(_express["default"].json()); // Aktivera JSON-parsing

// Rot-endpoint: lista alla endpoints requriement
function ListEndpointsHandler(req, res) {
  var endpoints = (0, _expressListEndpoints["default"])(app);
  res.json(endpoints);
}
app.get('/', ListEndpointsHandler);

//HappyRouter montering
app.use('/api/thoughts', _happyThoughtsRouter["default"]);
app.use('/', _userRoutes["default"]);

// Hantera 404
app.use(function (req, res) {
  res.status(404).json({
    error: 'Not Found'
  });
});

//Felhantering
app.use(function (err, req, res, next) {
  console.error('💥 Server Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Starta servern
app.listen(port, function () {
  console.log("Server running on http://localhost:".concat(port));
});