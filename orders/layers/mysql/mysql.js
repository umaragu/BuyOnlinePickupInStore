let AWS = require('aws-sdk');
var mysql2 = require('mysql2/promise'); //https://www.npmjs.com/package/mysql2

let connection;

const connectionOptions = {
  // type: 'mysql',
  host: process.env.DB_PROXY, // This is the RDS Proxy host and NOT the db host
  port: 3306,
  user: process.env.DB_USER,  // This needs to be the same user you have stored in secretsmanager 
  database: process.env.DB_NAME,
};


const getDBConfig = () => {
  // Since we have IAM enabled on our proxy, we will make use of the token to authenticate and connect to the db.
  const signer = new AWS.RDS.Signer({
    region: process.env.DB_REGION || 'us-east-1',
    username: connectionOptions.user,
    hostname: connectionOptions.host,
    port: connectionOptions.port,
  });

  const token = signer.getAuthToken({
    username: connectionOptions.user,
  });
  console.debug("IAM Token obtained\n ", token.length);

  return {
    ...connectionOptions,
    password: token,
    ssl: { rejectUnauthorized: false },
    authSwitchHandler: (data, cb) => {
      if (data.pluginName === 'mysql_clear_password') {
        // See https://dev.mysql.com/doc/internals/en/clear-text-authentication.html
        let password = token + '\0';
        let buffer = Buffer.from(password);
        cb(null, password);
      }
    }
  };

};

exports.getConnection = async (event) => {
  console.log("create connection")
  connection = await mysql2.createConnection(getDBConfig());
  console.log('connected as id ' + connection.threadId + "\n");


  return connection;
}
exports.closeConnection = async (con) => {
  try {
    await con.end()
  } catch (error) {
    console.log("Error ", error)
  }

}

