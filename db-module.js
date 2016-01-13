function dbHandler() {
    return (function() {
        var sqlite3 = require("sqlite3").verbose();

        function openDatabase() {
            var db = new sqlite3.Database("data.db");
            return db;
        }

        function handleGet(limit, offset, dataToSend, res) {
            var database = openDatabase();
            database.serialize(function() {
                database.all("SELECT COUNT(_id) FROM address", function(err, row) {
                    dataToSend["totalRecords"] = row[0]["COUNT(_id)"];
                    
                });
                database.all("SELECT * FROM address LIMIT ? OFFSET ?", [limit, offset], function(err, row) {
                    dataToSend["data"] = row;
                    database.close(); 
                    res.json(dataToSend);
                });
            });
        }

        function handlePost(req, res) {
            var database = openDatabase();   
            database.run("INSERT INTO address (state, city, street) VALUES (?, ?, ?)", [req.body.state, req.body.city, req.body.street], function(err) {
                database.close(); 
                res.end();
            });
        }

        function handleDelete(req, res) {
            var database = openDatabase(); 
            database.run("DELETE FROM address WHERE _id = ?", [req.params.id], function(err) {
                database.close(); 
                res.end();
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
