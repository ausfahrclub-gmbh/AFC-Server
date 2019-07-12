var oracledb = require('oracledb');

const DataProcessor = require('./dataprocessor');

var dbuser = 'nico'
var mypw = 'passme'  // set mypw to the hr schema password
var constrnig = 'localhost:1521/xe'


module.exports = {


    getAllMovies: async function () {

        let connection;

        try {
            connection = await oracledb.getConnection({
                user: dbuser,
                password: mypw,
                connectString: constrnig
            });

            let result = await connection.execute(
                `SELECT * FROM afc_movie`,
                {},  // bind value for :id
            );

            let keys = ['movieName', 'genre', 'length', 'releaseDate'];

            return DataProcessor.processData(result.rows, keys);
        }
        catch (err) {
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
    },

    addMovieRating: async function (body) {

        let connection;
        let {user, movie, starRating, comment, fellAsleep} = body

        console.log(body);

        const insertSql = "INSERT INTO AFC_MOVIE_RATING(mr_id,mr_user,mr_movie,mr_star_rating,mr_comment,mr_fellAsleep) values (:i, :u, :m, :s, :c, :f)";

        const binds = 
            { i: null, u: user, m: movie, s: starRating, c: comment, f: fellAsleep }
        ;

        const options = {
            autoCommit: false,
            bindDefs: {
              i: { type: oracledb.NUMBER },
              u: { type: oracledb.STRING },
              m: { type: oracledb.STRING },
              s: { type: oracledb.NUMBER },
              c: { type: oracledb.STRING },
              f: { type: oracledb.STRING },
            }
          };

        try {
            connection = await oracledb.getConnection({
                user: dbuser,
                password: mypw,
                connectString: constrnig
            })

            result = await connection.execute(insertSql, binds, options);
            
            if(result.lenght != 0)
            {
                connection.commit();
                console.log("commited changes");
            }
            return result;

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