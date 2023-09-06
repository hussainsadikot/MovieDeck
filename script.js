const API_KEY = "fdc55a7112c7642f658e7643f2721d35"

let movies = [];

//store  page number
let currentPage = 1;

const movieList = document.getElementById('movies-list');






//fetch movie data

async function fetchMovies(page) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US&page=${page}`)
        const result = await response.json();
        movies = result.results
        renderMovies(movies)
        console.log(movies)

    }
    catch (error) {
        console.log(error)
    }
}
fetchMovies(currentPage)


function getMovieListFromLocalStorage() {
    const favouriteMovies = JSON.parse(localStorage.getItem("favouriteMovies"))
    return favouriteMovies === null ? [] : favouriteMovies
}

function addMovieNameToLocalStorage(movieName) {
    const favouriteMovies = getMovieListFromLocalStorage()
    localStorage.setItem("favouriteMovies", JSON.stringify([...favouriteMovies, movieName]))
}

function removeMoviesFromLocalStorage(movieName) {
    const favouriteMovies = getMovieListFromLocalStorage()
    let filterdMovies = favouriteMovies.filter((movie) => movie !== movieName)
    localStorage.setItem("favouriteMovies", JSON.stringify(filterdMovies))
}

const renderMovies = (movies) => {
    const favouriteMovies = getMovieListFromLocalStorage()

    movieList.innerHTML = ""
    movies.map((movie) => {
        const { poster_path, title, vote_count, vote_average } = movie
        let listItem = document.createElement("li")
        listItem.className = 'card'
        let imgSrc = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : "https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png";
        listItem.innerHTML += `<img class="poster" src =${imgSrc} alt=${title} />
        <p class="title">${title}</p>  
        <section class="vote-favoriteIcon">
        <section class="vote">
            <p class="vote-count">Votes: ${vote_count}</p>
            <p class="vote-average">Rating: ${vote_average}</p>
        </section>
        <i class="favourite-icon ${favouriteMovies.includes(title) ? "fa-solid" : null} fa-regular fa-heart fa-2xl" id="${title}"></i>
    </section> `
        const favouriteIconBtn = listItem.querySelector('.favourite-icon');
        favouriteIconBtn.addEventListener('click',(event)=>{
            const {id} =event.target
            console.log(event.target)
            if (favouriteIconBtn.classList.contains("fa-solid")) {
                removeMoviesFromLocalStorage(id);
                favouriteIconBtn.classList.remove("fa-solid");
            } else {
                //add the movie name to local storage and to favourite array
                addMovieNameToLocalStorage(id);
                //add this class to favouriteIconBtn
                favouriteIconBtn.classList.add("fa-solid");

            }
        })
        movieList.appendChild(listItem)
    })
}

const sortByDateButton = document.getElementById('sort-by-date');

sortByDateButton.addEventListener("click", sortByDate)
let firstSortByDate= true 
function sortByDate(){
    let sortedMovies;
    if(firstSortByDate){
        sortedMovies=movies.sort(function(a,b){
            return new Date(a.relese_date) - new Date(b.relese_date)
        })
        sortByDateButton.textContent ="Sort by date (latet to oldest)"
        firstSortByDate= false
    }
    else if(!firstSortByDate)
    {
        sortedMovies = movies.sort(function(a,b){
            return new Date(b.release_date) -new Date(a.release_date)
        })
        sortByDateButton.textContent = "Sort by date (oldest to latest)";
        firstSortByDate = true;
    }
    renderMovies(sortedMovies)
}

const sortByRatingButton = document.getElementById('sort-by-rating')
let firstSortByRating=true
function sortByRating()
{
    let sortedMovies;
    if(firstSortByRating)
    {
        sortedMovies = movies.sort(function(a,b){
            return a.vote_average - b.vote_average
        })
        sortByRatingButton.textContent="Sort by rating (most to least)"
        firstSortByRating= false
    }
    else if (!firstSortByRatingClicked) {
        //use the sort fucntion to create a new array of movies sorted based on votr average on descending order
        sortedMovies = movies.sort(function (a, b) {
            return b.vote_average - a.vote_average
        });
        sortByRatingButton.textContent = "Sort by rating (least to most)";
        firstSortByRating = true
    }

    renderMovies(sortedMovies);

}
sortByRatingButton.addEventListener('click', sortByRating)

const pagnination = document.querySelector("div.pagnination");
const prevButton = document.querySelector("button#prev-button");
// const pageNumberButton = document.querySelector("button#page-number-button");
const nextButton = document.querySelector("button#next-button");

prevButton.addEventListener('click', () => {
    //decrease the current pafe by 1;
    currentPage--;
    //fetch the movies for the previous page
    fetchMovies(currentPage);
    //update the page number button text
    // pageNumberButton.textContent = `Current Page: ${currentPage}`;
    //Disable the previous button when the current page is 1
    if (currentPage === 1) {
        prevButton.disabled = true;
        nextButton.disabled = false;
    } else if (currentPage === 2) {
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
});
nextButton.addEventListener('click', () => {
    //increase the current page by 1
    currentPage++;
    //fetch the movies based on current page
    fetchMovies(currentPage);
    //update current page number
    // pageNumberButton.textContent = `Current Page: ${currentPage}`;
    //Disable the next  button when the current page is 3
    if (currentPage === 3) {
        prevButton.disabled = false;
        nextButton.disabled = true;
    } else if (currentPage === 2) {
        prevButton.disabled = false;
        nextButton.disabled = false;
    }
});


const searchMovies = async (searchedMovie) => {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchedMovie}&api_key=${API_KEY}&include_adult=false&language=en-US&page=1`);
        const result = await response.json();
        movies = result.results;
        renderMovies(movies)
    } catch (error) {
        console.log(error);
    }
}
const searchButton = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');

searchButton.addEventListener('click', () => {
    searchMovies(searchInput.value);
    pagnination.style.display = 'none';

})


const allTab = document.getElementById("all-tab");

const favouritesTab = document.getElementById('favourites-tab');

const sortBtns = document.querySelector('.sorting-options');


const getMovieByName = async (movieName) => {
    console.log('movieName', movieName)
    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=${API_KEY}&include_adult=false&language=en-US&page=1`);
        const result = await response.json();

        // console.log(result);
        return result.results[0];
    } catch (error) {
        console.log(error)
    }
}

const showFavourites = (favMovie) => {
    console.log(favMovie)
    const { poster_path, title, vote_average, vote_count } = favMovie;
    let listItem = document.createElement('li');

    listItem.className = 'card';

    let imgSrc = poster_path ? `https://image.tmdb.org/t/p/original/${poster_path}` : "https://w7.pngwing.com/pngs/116/765/png-transparent-clapperboard-computer-icons-film-movie-poster-angle-text-logo-thumbnail.png";


    listItem.innerHTML += `

    <img
         class="poster"
         src=${imgSrc}
         alt=${title}
    />

    <p class="title">${title}</p>

    <section class="vote-favoriteIcon">
    <section class="vote">
        <p class="vote-count">Votes: ${vote_count}</p>
        <p class="vote-average">Rating: ${vote_average}</p>
    </section>
    <i class="favourite-icon fa-solid fa-xmark fa-2xl xmark" id="${title}"></i>
</section>

    `;

    const removeFromWishListBtn = listItem.querySelector(".xmark");

    removeFromWishListBtn.addEventListener('click', (event) => {
        const { id } = event.target;

        removeMovieNameFromLocalStorage(id);
        fetchWishListMovie();
    })

    movieList.appendChild(listItem);
}

const fetchWishListMovie = async () => {
    movieList.innerHTML = "";

    const movieNamesList = getMovieNamesFromLocalStorage();

    for (let i = 0; i < movieNamesList.length; i++) {
        const movieName = movieNamesList[i];

        let movieDataFromName = await getMovieByName(movieName);
        showFavourites(movieDataFromName);
    }




}
//will display based on the active tab
function displayMovies() {

    if (allTab.classList.contains("active-tab")) {
        renderMovies(movies);
        sortBtns.style = "revert";
        pagnination.style = "revert";
    } else if (favouritesTab.classList.contains("active-tab")) {
        fetchWishListMovie();
        sortBtns.style.display = "none";
        pagnination.style.display = "none";
    }
}

function switchTab(event) {
    //remove the active-tab class fom both the tabs
    allTab.classList.remove("active-tab");
    favouritesTab.classList.remove("active-tab");


    //add the active-tab class to the clicked tab

    event.target.classList.add("active-tab");

    //display the movies for that tab
    displayMovies();



}

allTab.addEventListener('click', switchTab);
favouritesTab.addEventListener('click', switchTab);