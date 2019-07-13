
module.exports = {

  processData: function (result, keys) {
      var data = [];
      var movie;

      for (let i = 0; i < result.length; i++) {
          movie = {};
          for (let j = 0; j < result[i].length; j++) {
            movie[keys[j]] = result[i][j];
          }
          data.push(movie);
      }
      
      if(data.length == 1){
        return data[0];
      }

      return data;
  }

}