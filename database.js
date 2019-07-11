var oracledb = require('oracledb');

var mypw = 'passme'  // set mypw to the hr schema password


module.exports = {

    
    run: async function(){

        let connection;
    
        try {
        connection = await oracledb.getConnection(  {
            user          : "nico",
            password      : mypw,
            connectString : "localhost:1521/xe"
        });
    
        let result = await connection.execute(
            `SELECT 2 FROM dual`,
            {},  // bind value for :id
        );
        console.log(result.rows);
    
        } catch (err) {
        console.error(err);
        } finally {
        if (connection) {
            try {
                await connection.close();
                } catch (err) {
                console.error(err);
                }
            }
        }
    }

}