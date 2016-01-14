function dbHandler() {
    return (function() {
        var sqlite3 = require("sqlite3").verbose();

        function openDatabase() {
            var db = new sqlite3.Database("data.db");
            return db;
        }

        function handleGet(limit, offset, dataToSend, callback) {
            var database = openDatabase();
            database.serialize(function() {
                database.all("SELECT COUNT(_id) FROM address", function(err, row) {
                    dataToSend["totalRecords"] = row[0]["COUNT(_id)"];
                    
                });
                database.all("SELECT * FROM address LIMIT ? OFFSET ?", [limit, offset], function(err, row) {
                    dataToSend["data"] = row;
                    database.close();
                    callback();
                });
            });
        }

        function handlePost(dataToInsert, callback) {
            var database = openDatabase();   
            database.run("INSERT INTO address (state, city, street) VALUES (?, ?, ?)", dataToInsert, function(err) {
                database.close(); 
                callback();
            });
        }
        
        function handleDelete(id, callback) {
            var database = openDatabase(); 
            database.run("DELETE FROM address WHERE _id = ?", id, function(err) {
                database.close(); 
                callback();
            });
        }

        return {
            handleGet: handleGet,
            handlePost: handlePost,
            handleDelete: handleDelete
        }
    })();
};

exports.dbHandler = dbHandler;
