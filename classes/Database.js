var mysql = require("mysql");
// : 'utf8mb4' // In order to save emojis correctly
module.exports = class Database {
    constructor(host, user, password, database, charset) {
        this.host = host;
        this.user = user;
        this.password = password;
        this.database = database;
        this.charset = charset;
        this.connection = this.connection;
    }

    #createConnection() {
      this.connection = mysql.createPool({
            host: this.host,
            user: this.user,
            password: this.password,
            database: this.database,
            charset: this.charset
        });
    }   

    createTable() {
        this.#createConnection();
        // Create database
        const query = "CREATE TABLE IF NOT EXISTS emojiquiz (guildID BIGINT(20), guildName VARCHAR(255), channelID BIGINT(20), emojiMsgID BIGINT(20), bulkDeleteCounter BIGINT(20), data longtext, PRIMARY KEY (guildID))";
        this.connection.query(query, function (err, result) {
            if (err) {
                console.log("Something went wrong check your database details.");
                return;
            }
            console.log("Successfully created emojiquiz table!");
          });
    }

}


