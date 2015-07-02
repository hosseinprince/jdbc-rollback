jdbc-rollback
=========

JDBC transaction for node.js

Latest Version
--------------
0.0.15

Support for commit transaction has been added.  Set "isAutoCommit" in "open" method false, so a transaction is started.  As of release 0.0.9, the minimum version of node.js has been increased 
to v0.10.  If you need to use this with node.js v0.8, use version 0.0.8 of node-jdbc.
Support  procedure call has benn added.

Please visit [jdbc-rollback](https://www.npmjs.org/package/jdbc-rollback) for information on installing with npm.



Initialize
----------
```javascript
var jdbc = new ( require('jdbc') );

var config = {
  libpath: __dirname + 'path/to/jdbc.jar',
  libs: [__dirname + 'path/to/other/jars.jar'],
  drivername: 'com.java.driverclass',
  url: 'url/to/database',
  // optionally  
  user: 'user',
  password: 'secret',
};

jdbc.initialize(config, function(err, res) {
  if (err) {
    console.log(err);
  }
});
```
Open Connection, Execute Queries, Close
---------------------------------------
```javascript
var genericQueryHandler = function(err, results) {
  if (err) {
    console.log(err);
  } else if (results) {
    console.log(results);
  }
  
  jdbc.close(function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("Connection closed successfully!");
    }
  });

};

jdbc.open(isAutoCommit,function(err, conn) {
  if (conn) {
   
    // Use non-generic callbacks to handle queries individually and/or to nest queries
    jdbc.executeUpdate("INSERT INTO table VALUES (value)", function(err, results) {
      
      if(results > some_arbitrary_value) {
        jdbc.commit();
        jdbc.executeQuery("SELECT * FROM table where column = value", genericQueryHandler);
      }
    
    });
  }
});


```

procedure
----------
```javascript

var query = "{call insert_test(?,?,?,?)}";
        var param_in = [];
        var out_type = [];
        param_in.push({id: 1, value: "bi_report", type: "nvarchar"}, {id: 2, value: "id", type: "nvarchar"},
             {id: 3, value: "insert into bi_report(CREATED) VALUES(sysdate)", type: "nvarchar"});
        out_type.push({id: 4, type: "int"});
        jdbc.prepareCall(query, param_in, out_type)
            .then(function (result) {

              console.log("**************************************************", result);

        })
                  

```


API
---------------------------------

### initialize(config, callback)
 - see above example for config object
 - callback(error)

### open(isAutoCommit,callback)
 - opens a new connection
 - default for "isAutoCommit" is true
 - callback(error)

### close(callback)
 - closes any existing connection
 - callback(error)

### executeQuery(sql, callback)
 - SELECT commands.
 - callback(error, rset)

### executeUpdate(sql, callback) 
 - table modifying commands (INSERT, UPDATE, DELETE, etc).
 - callback(error, num_rows) where @num_rows is the number of rows modified
 
### commit()
- commit a transaction

###prepareCall(sql,param_in,out_type,callback)
- procedure query command
- inputs parameter object
- outputs parameter object
- callback(error,result) where @result is object of the number of rows modified
