document.addEventListener("DOMContentLoaded", () => {
  const moviesApiUrl = "https://japceibal.github.io/japflix_api/movies-data.json";
  const searchButton = document.getElementById("btnBuscar");
  const searchInput = document.getElementById("inputBuscar"); 
  const movieListContainer = document.getElementById("lista"); 

  fetch(moviesApiUrl)
    .then(response => response.json())
    .then(data => {
      console.log("Datos cargados desde la API:", data); 
      localStorage.setItem("movies-data-json", JSON.stringify(data));
    })
    .catch(error => console.error("Error al cargar los datos:", error));

  searchButton.addEventListener("click", () => {
    movieListContainer.innerHTML = ''; 

    const searchQuery = searchInput.value.toLowerCase(); 
    if (!searchQuery) return; 

    const movies = JSON.parse(localStorage.getItem("movies-data-json"));
    if (!movies) {
      console.error("No se encontraron datos en localStorage");
      return;
    }

    console.log("Películas almacenadas:", movies); 

    const filteredMovies = movies.filter(movie =>
      movie.title.toLowerCase().includes(searchQuery) ||
      movie.tagline.toLowerCase().includes(searchQuery) ||
      movie.overview.toLowerCase().includes(searchQuery) ||
      movie.genres.some(genre => genre.name.toLowerCase().includes(searchQuery))
    );

    if (filteredMovies.length === 0) {
      alert("No se encontraron resultados para la búsqueda.");
      return;
    }

    filteredMovies.forEach(movie => {
      movieListContainer.appendChild(createMovieElement(movie)); 
    });
  });
});

function createMovieElement(movie) {
  const li = document.createElement('li');
  li.className = 'list-group-item bg-secondary movie-item';

  li.innerHTML = `
    <div class="d-flex justify-content-between align-items-center">
      <div class="d-flex flex-column">
        <span class="text-light">${movie.title}</span>
        <span class="text-muted">${movie.tagline}</span>
      </div>
      <div class="text-light">
        ${generateStars(movie.vote_average)}
      </div>
    </div>
  `;

  li.addEventListener("click", () => { showMovieDetails(movie); });

  return li;
}

function generateStars(rating) { 
  const stars = Math.round(rating / 2);        

  let starsHtml = '';     

  for (let i = 1; i <= 5; i++) {
    if (i <= stars) {
      starsHtml += '<span class="fa fa-star checked"></span>';
    } else {
      starsHtml += '<span class="fa fa-star"></span>';
    }
  }
  return starsHtml; 
}

function showMovieDetails(movie) {
  const movieOverview = document.getElementById("movieOverview");
  const movieTitle = document.getElementById("movieTitle");
  const movieGenres = document.getElementById("movieGenres");
  const movieYear = document.getElementById("movieYear");
  const movieRuntime = document.getElementById("movieRuntime");
  const movieBudget = document.getElementById("movieBudget");
  const movieRevenue = document.getElementById("movieRevenue");

  movieOverview.innerText = movie.overview;
  movieTitle.innerText = movie.title;
  movieYear.innerText = movie.release_date.split('-')[0];  
  movieRuntime.innerText = movie.runtime + ' mins';
  movieBudget.innerText = '$' + movie.budget;
  movieRevenue.innerText = '$' + movie.revenue;

  movieGenres.innerHTML = '';
  movie.genres.forEach(genre => {
    const listItem = document.createElement('li');
    listItem.textContent = genre.name;
    movieGenres.appendChild(listItem);
  });

  const movieDetailCanvas = document.getElementById('offcanvas-movie-details');
  const offcanvas = new bootstrap.Offcanvas(movieDetailCanvas);
  offcanvas.show();
}