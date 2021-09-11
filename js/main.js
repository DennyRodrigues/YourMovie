$(document).ready(() => {
    // It will be used in the movie information page, it will request the movie information from the database when the page load
    showInformation();
    // Add functionality to search form, calling the function "searchAnswer" . It will also prevent the page to reload(the default action of a form)
    $('#searchForm').on('submit', (e) => {
        let searchQuery  = $('#searchQuery').val();
        searchAnswer(searchQuery);
        searchGenres();
        e.preventDefault();
    });
    // Add functionality to popular button on the navbar. It will call the function popular_movies
    $("#popular").on("click", (e) =>{
    popular_movies();
    });
});
//Shows the results requests from the search in the page.
function outputResults(results){
    let movies = results;
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
                            <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="Movie Poster" class="card-img-top">
                            <h5 class="card-title text-center">${movie.title}</h5>
                            <button type="button" class="btn btn-info stretched-link  text-center" onclick="movieInformation('${movie.id}')"> More information </button>
                        </div>
                    </div> 
                </div>`;
            });
        }
        $('#movies').html(output);

}
// It will use API to get access  to the movies database and get the ones that match the search
function searchAnswer(searchQuery){
    $.ajax(`https://api.themoviedb.org/3/search/movie?api_key=2c7a7142763b8809159d99fdf307fbb8&language=en-US&query=${searchQuery}&page=1&include_adult=false`).then((response) => {
        console.log(response);
        results = response.results
        outputResults(results)
    }).catch((err) =>{
        console.log(err);
    });
}
// Request acess to popular movies
function popular_movies(){
    $.ajax(`https://api.themoviedb.org/3/movie/popular?api_key=2c7a7142763b8809159d99fdf307fbb8&language=en-US&page=1`).then((response) => {
    results = response.results
    outputResults(results)
}).catch((err) =>{
    console.log(err);
});

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
    //Makes two requests.The first one for movie information and other for the people(actores, writings and directors) from the movie. 
    $.when($.ajax(`https://api.themoviedb.org/3/movie/${movieId}?api_key=2c7a7142763b8809159d99fdf307fbb8&language=en-US`),$.ajax(`https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=2c7a7142763b8809159d99fdf307fbb8&language=en-US`)).done((response1, response2) => {
        let movie = response1[0];
        let crew = response2[0].crew;
        // Get the genres from the movie information response
        let genres = [];
        movie.genres.forEach(e => {
            genres.push(" "+e.name )
        });
        //Divide the crew in writings and directors from the movie response.
        let writings = [];
        let directors = [];
        crew.forEach(e => {
            if (e.known_for_department == "Writing"){
                writings.push(" "+e.name)
            }
            else if (e.known_for_department == "Directing"){
                directors.push(" "+e.name)
            }
        });
        
        // Output will later contain an html format using information from the database answer
        let output = `
        <div class="row border border-dark m-1 right">
            <h1 class="text-center text-uppercase">${movie.title}</h1>
            <div class="col-sm img-container">
                    <img src="https://image.tmdb.org/t/p/original${movie.poster_path}" alt="Movie Poster">
            </div>
            <div  class="col-sm col-6 left ">
                <ul class="list-group list-group-flush">
                    <li class="list-group-item">Genres: ${genres}.</li>
                    <li class="list-group-item"> Directors: ${directors}.</li>
                    <li class="list-group-item"> Writings: ${writings}.</li>
                    <li class="list-group-item"> Release Date: ${movie.release_date}.</li>
                    <li class="list-group-item">Rating: ${movie.vote_average}.</li>
                    </ul>
            </div>
            
        </div> 
        <div class="row border border-dark m-1 p-1" id="plot-summary">
            <h4 class="text-center fw-bold"> Plot summary </h4>
            <p> ${movie.overview} </p>
        </div> `
        $("#information").html(output);
    }).catch((err) =>{
        console.log(err);
    });
}
