
const Emojiquiz = require('./classes/Emojiquiz.js')
const emojiquiz = new Emojiquiz();
emojiquiz.host = "localhost";
emojiquiz.user = "root";
emojiquiz.password = "";
emojiquiz.database = "emojiquiz";
emojiquiz.charset = 'utf8mb4';
module.exports = {emojiquiz};
