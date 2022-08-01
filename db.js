const Database = require('./classes/Database.js')
const emojiquiz = new Database();
emojiquiz.host = "localhost";
emojiquiz.user = "root";
emojiquiz.password = "";
emojiquiz.database = "emojiquiz";
emojiquiz.charset = 'utf8mb4';

emojiquiz.createTable();