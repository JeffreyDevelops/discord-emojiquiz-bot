
const Database = require('./classes/Database.js')
const emojiquizMYSQL = new Database();
emojiquizMYSQL.host = "localhost";
emojiquizMYSQL.user = "root";
emojiquizMYSQL.password = "";
emojiquizMYSQL.database = "emojiquiz";
emojiquizMYSQL.charset = 'utf8mb4';
module.exports = {emojiquizMYSQL};
