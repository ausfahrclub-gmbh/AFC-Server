$(function () {

    $('button').on('click',function(e) {
        e.preventDefault()
        var $rating = $(this).parent()

        var movieTitle = $rating.find('h3').text()
        var starRating = $rating.find('.form-group select option:selected').text()
        var comment = $rating.find('.form-group textarea').val() 

        console.log('Rating:', movieTitle + '|' +  starRating + '|' + comment)

        var data = {}

        data.movieTitle = movieTitle
        data.starRating = starRating
        data.comment = comment

        $.ajax({
            type: "POST",
            url: '/movieRating',
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
                console.log('Posted Data:', data)    
            },
            fail: function(xhr, textStatus, errorThrown){
                alert('request failed - ois im oasch');
             }
          });
    })
});