var _ = require('underscore');
var java = require('java');
java.options.push('-Xrs');

function trim1(str) {
    return (str || '').replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function JDBCConn() {
    this._config = {};
    this._conn = null;
}

JDBCConn.prototype.initialize = function (config, callback) {
    var self = this;
    self._config = config;

    if (self._config.libpath) {
        java.classpath.push(self._config.libpath);
    }
    if (self._config.libs) {
        java.classpath.push.apply(java.classpath, self._config.libs);
    }

    java.newInstance(self._config.drivername, function (err, driver) {
        if (err) {
            return callback(err);
        } else {
            java.callStaticMethod('java.sql.DriverManager', 'registerDriver', driver, function (err, result) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, self._config.drivername);
                }
            });
        }
    });
};

JDBCConn.prototype.open = function (callback,isAutoCommit) {
    var self = this;

    if (self._config.user || self._config.password) {
        java.callStaticMethod('java.sql.DriverManager', 'getConnection', self._config.url, self._config.user, self._config.password, function (err, conn) {
            if (err) {
                return callback(err);
            } else {
                conn.setAutoCommit(isAutoCommit);
                self._conn = conn;
                return callback(null, conn);
            }
        });
    } else {
        java.callStaticMethod('java.sql.DriverManager', 'getConnection', self._config.url, function (err, conn) {
            if (err) {
                return callback(err);
            } else {
                conn.setAutoCommit(isAutoCommit);
                self._conn = conn;
                return callback(null, conn);
            }
        });
    }
};

JDBCConn.prototype.close = function (callback) {
    var self = this;

    if (self._conn) {
        self._conn.close(function (err) {
            if (err) {
                return callback(err);
            } else {
                self._conn = null;
                return callback(null);
            }
        });
    }
};

JDBCConn.prototype.executeQuery = function (sql, callback) {
    var self = this;

    self._conn.createStatement(function (err, statement) {
        if (err) {
            return callback(err);
        } else {
            statement.executeQuery(sql, function (err, resultset) {
                if (err) {
                    return callback(err);
                } else if (resultset) {
                    resultset.getMetaData(function (err, rsmd) {
                        if (err) {
                            return callback(err);
                        } else {
                            var results = [];
                            var cc = rsmd.getColumnCountSync();
                            var columns = [''];
                            for (var i = 1; i <= cc; i++) {
                                var colname = rsmd.getColumnNameSync(i);
                                columns.push(colname);
                            }
                            var next = resultset.nextSync();
                            var processRow = function (next) {
                                if (next) {
                                    setImmediate(function () {
                                        var row = {};
                                        for (var a = 1; a <= cc; a++) {
                                            row[columns[a]] = trim1(resultset.getStringSync(a));
                                        }
                                        results.push(row);
                                        next = resultset.nextSync();
                                        processRow(next);
                                    });
                                } else {
                                    callback(null, results);
                                }
                            };
                            processRow(next);
                        }
                    });
                } else {
                    return callback(null, null);
                }
            });
        }
    });
};

JDBCConn.prototype.executeUpdate = function (sql, callback) {
    var self = this;

    self._conn.createStatement(function (err, statement) {
        if (err) {
            return callback(err);
        } else {
            statement.executeUpdate(sql, function (err, rowcount) {
                if (err) {
                    return callback(err);
                } else {
                    return callback(null, rowcount);
                }
            });
            //return callback(null, rowcount);
        }
    });
};

JDBCConn.prototype.setSavepoint = function (savepointName, callback) {
    var self = this;
    //var savepoint = {getSavepointId: "1", getSavepointName: "a"};
    self._conn.setSavepoint(savepointName, function (err, savepoint) {

        if (err) {
            return callback(err);
        } else {

            return callback(null, savepoint);
        }


    });


};

JDBCConn.prototype.commit = function (callback) {
    var self = this;

    if (self._conn) {
        self._conn.commit(function (error) {

            if (error)
                return callback(error);
            else
                return callback(null);


        });

    }

};
JDBCConn.prototype.rollback = function (savepointName, callback) {
    var self = this;
    self._conn.rollback(function (result) {

        if (result)
            return callback(result);
        else
            return callback(null);


    });


};

JDBCConn.prototype.prepareCall = function (sql, param_in, out_type, callback) {
    var self = this;

    self._conn.prepareCall(sql, function (err, statement) {
        if (err) {
            return callback(err);
        } else {
            var getInt = function (id, inCall) {
                statement.getInt(id, function (e, r) {
                    return inCall(r);
                });

            }
            var getDouble = function (id, inCall) {
                statement.getDouble(id, function (e, r) {
                    return inCall(r);
                });
            }
            var getFloat = function (id, inCall) {
                statement.getFloat(3, function (e, r) {
                    return inCall(r);
                });
            }
            var getString = function (id, inCall) {
                statement.getString(3, function (e, r) {
                    return inCall(r);
                });
            }
            var getDate = function (id, inCall) {
                statement.getDate(3, function (e, r) {
                    return inCall(r);
                });
            }
            var getNString = function (id, inCall) {
                statement.getNString(3, function (e, r) {
                    return inCall(r);
                });
            }
            var getChar = function (id, inCall) {
                statement.getString(3, function (e, r) {
                    return inCall(r);
                });
            }
            var setDouble = function (id, value) {
                statement.setDouble(id, value);
            }
            var setFloat = function (id, value) {
                statement.setFloat(id, value);
            }
            var setString = function (id, value) {
                statement.setString(id, value);
            }
            var setChar = function (id, value) {
                statement.setChar(id, value);
            }
            var setDate = function (id, value) {
                statement.setDate(id, value);
            }
            var setNString = function (id, value) {
                statement.setNString(id, value);
            }
            var setInt = function (id, value) {
                statement.setInt(id, value);
            }
            var types = [
                {name: "int", value: "4", getKey: getInt, setKey: setInt},
                {name: "double", value: "8", getKey: getDouble, setKey: setDouble},
                {name: "float", value: "6", getKey: getFloat, setKey: setFloat},
                {name: "varchar", value: "12", getKey: getString, setKey: setString},
                {name: "char", value: "1", getKey: getChar, setKey: setChar},
                {name: "date", value: "91", getKey: getDate, setKey: setDate},
                {name: "nvarchar", value: "-9", getKey: getNString, setKey: setNString}];


            for (var p = 0; p < param_in.length; p++) {
                for (var j = 0; j < types.length; j++) {
                    if (param_in[p].type == types[j].name) {
                        types[j].setKey(param_in[p].id, param_in[p].value);
                       
                    }


                }
            }
            for (var i = 0; i < out_type.length; i++) {

                for (var j = 0; j < types.length; j++) {
                    if (out_type[i].type == types[j].name) {
                        var value = types[j].value;
                        statement.registerOutParameter(out_type[i].id, parseInt(value));
                    }
                }
            }
            statement.executeUpdate(function (err, re) {
                var res = [];
                if (err) {
                    return callback(err);
                } else {

                    for (var i = 0; i < out_type.length; i++) {
                        for (var j = 0; j < types.length; j++) {
                            if (out_type[i].type == types[j].name) {
                                    types[j].getKey(out_type[i].id, function (r, e) {
                                    res.push(r);
                                })
                            }
                        }
                    }

                }

                return callback(null, res);
            });

        }
    })

}

module.exports = JDBCConn;
