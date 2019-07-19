var oracledb = require('oracledb');

const DataProcessor = require('./dataprocessor');

//var dbuser = 'C##AFC'
var dbuser = 'C##AFC'
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
                `SELECT * FROM afc_movie ORDER BY releaseDate`,
                {},  // bind value for :id
            );

            let keys = ['movieName', 'genre', 'length', 'releaseDate', 'cinema'];

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

    getAllRatingsByMovie: async function (movieName) {

        let connection;

        try {
            connection = await oracledb.getConnection({
                user: dbuser,
                password: mypw,
                connectString: constrnig
            });

            let result = await connection.execute(
                `SELECT * FROM AFC_MOVIE_RANKING_V WHERE "Movie"=:movieName`,
                {movieName: movieName},  
            );

            let keys = ['movie', 'rating', 'ratingAmount'];

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

        const insertSql = "INSERT INTO AFC_MOVIE_RATING(id,username,movie,starrating,usercomment,fellAsleep) values (:i, :u, :m, :s, :c, :f)";

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
                return result;
            } // still broken
            else{
                console.log("changes not commited")
                return null;
            }

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