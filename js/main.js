$(document).ready(() => {
    // It will add functionality to search form, calling the function "searchAnswer" . It will also prevent the page to reload(the default action of a form)
    $('#searchForm').on('submit', (e) => {
        let searchQuery  = $('#searchQuery').val();
        searchAnswer(searchQuery);
        e.preventDefault();
    })
     // It will be used in the movie information page, it will request the movie information from the database
    showInformation();
});
// It will use API to get access  to the movies database and get the ones that match the search
function searchAnswer(searchQuery){
    jQuery.ajax('http://www.omdbapi.com/?apikey=80638e81&s=' + searchQuery).then((response) => {
        console.log(response);
        let movies = response.Search;
        // Output will later contain an html format using information from the database answer
        let output = '';
        // In case the database doesn't find any match
        if (!movies){
            output = `<div> <h1 class="text-center">Movies Title Not Found</h1></div>`
        }
        // In case the database find any match
        else{
            $.each(movies, (index, movie) =>{
                output += `
                <div class="col-sm">
                    <div class="card p-3">
                        <div class="card-body ">
                            <img src="${movie.Poster}" alt="Movie Poster" class="card-img-top">
                            <h5 class="card-title text-center">${movie.Title}</h5>
                            <button type="button" class="btn btn-info stretched-link  text-center" onclick="movieInformation('${movie.imdbID}')"> More information </button>
                        </div>
                    </div> 
                </div>`;
            });
        }
        $('#movies').html(output);

    }).catch((err) =>{
        console.log(err);
    });
}
// Request acess to popular movies
$("#popular").on("click", (e) =>{
    popular_movies();
    e.preventDefault();
})
function popular_movies(){

}

//We will pass the movie Id  to the movie information page
function movieInformation(id){
    sessionStorage.setItem('movieId', id);
    window.location = 'movie_information.html';
    return false;
}

// Request access  to a single movie information using API. This Function will be called everytime the movie information page is access ed. 
function showInformation(){
    let movieId = sessionStorage.getItem('movieId')
    jQuery.ajax('http://www.omdbapi.com/?apikey=80638e81&i=' + movieId).then((response) => {
        let movie = response;
        // Output will later contain an html format using information from the database answer
        let output = `
        <div class="row border border-dark m-1">
            <h1 class="text-center">${movie.Title}</h1>
            <div class="col-sm">
                    <img src="${movie.Poster}" alt="Movie Poster">
            </div>
            <div  class="col-sm left ">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Genres: ${movie.Genre}</li>
                    <li class="list-group-item"> Actors: ${movie.Actors}</li>
                    <li class="list-group-item"> Director: ${movie.Director}</li>
                    <li class="list-group-item"> Release Date: ${movie.Released}</li>
                    <li class="list-group-item">Rating: ${movie.imdbRating}</li>
                    </ul>
            </div>
            
        </div> 
        <div class="row border border-dark m-1 p-1">
            <h4 class="text-center"> Plot summary </h4>
            <p> ${movie.Plot} </p>
        </div> `
        $("#information").html(output);
    }).catch((err) =>{
        console.log(err);
    });
}
