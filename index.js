var count=10;

window.addEventListener('DOMContentLoaded', function () {

      /* for controlling the type of search done */

      var baseSearchResultLocation = 'search_results.html';
      var searchResultLocation = baseSearchResultLocation + "?multi=";
      var finalSearchLocation;
      var searchLinks = document.querySelectorAll('.link-yellow .sub-links > li');
      var searchBtn = document.querySelector('.search-form > button');
      var searchInput = document.querySelector('.search-form > input');

      function addListenerForSearchLinks(link, str) {
            link.addEventListener('click', function () {
                  if(window.screen.width <= 900) {
                        openNav();
                  }
                  searchInput.focus();
                  if(str === "multi") {
                        searchInput.placeholder = "Search Movies, TV Shows, Celebs ...";
                  } else if(str === "movie") {
                        searchInput.placeholder = "Search Movies";
                  } else if(str === "tv") {
                        searchInput.placeholder = "Search TV Shows";
                  } else {
                        searchInput.placeholder = "Search Celebs";
                  }
            });
      }

      addListenerForSearchLinks(searchLinks[0].firstChild, "multi");
      addListenerForSearchLinks(searchLinks[1].firstChild, "movie");
      addListenerForSearchLinks(searchLinks[2].firstChild, "tv");
      addListenerForSearchLinks(searchLinks[3].firstChild, "person");

      searchInput.addEventListener('keyup', function (event) {
            if (event.keyCode === 13) {
                  searchBtn.click();
            }
      });

      searchBtn.addEventListener('click', function () {
            var inputVal = searchInput.value;
            // add Input validation - regex 
            if (inputVal === "") {
                  alert("input box was left empty!");
            } else {
                  finalSearchLocation = searchResultLocation + inputVal.trim().split(' ').join('+') + "=1";
                  window.location.assign(finalSearchLocation);
            }
      });

      getTrendingMovies();
      getTrendingTVShowes();
      getTrendingCelebs();
});

function getTrendingMovies() {
      query_url = getQueryUrl('/trending/movie/day')([]);
      var parent = document.querySelector('.movie-slideshow');

      var slide_str = "<h3>Trending Movies</h>";
      slide_str += "<div class='slideshow-container'>";
      fetchData(query_url, function (data) {
            for (var i = 0; i < count; i++) {
                  slide_str += constructHTMLStrForMovie(data.results[i], i);
            }

            slide_str += "<a class='prev' onclick='plusMovieSlides(-1)'>&#10094;</a>";
            slide_str += "<a class='next' onclick='plusMovieSlides(1)'>&#10095;</a>";

            slide_str += "</div>";
            slide_str += "<div style='text-align:center'>";
            for (var i = 0; i < count; i++) {

                  slide_str += "<span class='dot movieDot' onclick='currentMovieSlide(" + (i + 1) + ")'></span>"
            }
            slide_str += "</div>";

            parent.innerHTML = slide_str;
            showMovieSlides(movieSlideIndex);
      });
}

function getTrendingTVShowes() {
      query_url = getQueryUrl('/trending/tv/day')([]);
      var parent = document.querySelector('.tv-slideshow');

      var slide_str = "<h3>Trending TV Showes</h>";
      slide_str += "<div class='slideshow-container'>";
      fetchData(query_url, function (data) {
            for (var i = 0; i < count; i++) {
                  slide_str += constructHTMLStrForTV(data.results[i], i);
            }

            slide_str += "<a class='prev' onclick='plusTVSlides(-1)'>&#10094;</a>";
            slide_str += "<a class='next' onclick='plusTVSlides(1)'>&#10095;</a>";

            slide_str += "</div>";
            slide_str += "<div style='text-align:center'>";
            for (var i = 0; i < count; i++) {

                  slide_str += "<span class='dot tvDot' onclick='currentTVSlide(" + (i + 1) + ")'></span>"
            }
            slide_str += "</div>";

            parent.innerHTML = slide_str;
            showTVSlides(tvSlideIndex);
      });
}

function getTrendingCelebs() {
      query_url = getQueryUrl('/trending/person/day')([]);
      var parent = document.querySelector('.celeb-slideshow');

      var slide_str = "<h3>Trending Celebs</h>";
      slide_str += "<div class='slideshow-container'>";
      fetchData(query_url, function (data) {
            for (var i = 0; i < count; i++) {
                  slide_str += constructHTMLStrForCeleb(data.results[i], i);
            }

            slide_str += "<a class='prev' onclick='plusCelebSlides(-1)'>&#10094;</a>";
            slide_str += "<a class='next' onclick='plusCelebSlides(1)'>&#10095;</a>";

            slide_str += "</div>";
            slide_str += "<div style='text-align:center'>";
            for (var i = 0; i < count; i++) {

                  slide_str += "<span class='dot celebDot' onclick='currentCelebSlide(" + (i + 1) + ")'></span>"
            }
            slide_str += "</div>";

            parent.innerHTML = slide_str;
            showCelebSlides(celebSlideIndex);
      });
}

function constructHTMLStrForMovie(element, index) {
      var item_str = "";
      item_str += "<div class='mySlides fade movieSlides'>";
      item_str += "<div class='numbertext'>" + (index + 1) + " / " + count + "</div>";
      if (element.poster_path == null) {
            item_str += "<img src=./images/media.png alt='poster' style='width: 100%'>"
      } else {
            item_str += "<img src=https://image.tmdb.org/t/p/w500" + element.poster_path + " alt='poster' style='width: 100%'>";
      }
      item_str += "<div class='text'>" + element.title + "</div>";
      item_str += "</div>";
      return item_str;
}

function constructHTMLStrForTV(element, index) {
      var item_str = "";
      item_str += "<div class='mySlides fade tvSlides'>";
      item_str += "<div class='numbertext'>" + (index + 1) + " / " + count + "</div>";
      if (element.poster_path == null) {
            item_str += "<img src=./images/media.png alt='poster' style='width: 100%'>"
      } else {
            item_str += "<img src=https://image.tmdb.org/t/p/w500" + element.poster_path + " alt='poster' style='width: 100%'>";
      }
      item_str += "<div class='text'>" + element.name + "</div>";
      item_str += "</div>";
      return item_str;
}

function constructHTMLStrForCeleb(element, index) {
      var item_str = "";
      item_str += "<div class='mySlides fade celebSlides'>";
      item_str += "<div class='numbertext'>" + (index + 1) + " / " + count + "</div>";
      if (element.profile_path == null) {
            item_str += "<img src=./images/user.png alt='poster' style='width: 100%'>"
      } else {
            item_str += "<img src=https://image.tmdb.org/t/p/w500" + element.profile_path + " alt='poster' style='width: 100%'>";
      }
      item_str += "<div class='text'>" + element.name + "</div>";
      item_str += "</div>";
      return item_str;
}


/* slideshow for movies */


var movieSlideIndex = 1;
function plusMovieSlides(n) {
      showMovieSlides(movieSlideIndex += n);
}
function currentMovieSlide(n) {
      showMovieSlides(movieSlideIndex = n);
}
function showMovieSlides(n) {
      var i;
      var slides = document.getElementsByClassName("movieSlides");
      var movieDots = document.getElementsByClassName("movieDot");
      if (n > slides.length) { movieSlideIndex = 1 }
      if (n < 1) { movieSlideIndex = slides.length }
      for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
      }
      for (i = 0; i < movieDots.length; i++) {
            movieDots[i].className = movieDots[i].className.replace(" active", "");
      }
      slides[movieSlideIndex - 1].style.display = "block";
      movieDots[movieSlideIndex - 1].className += " active";
}


/* slideshow for tv shows */


var tvSlideIndex = 1;
function plusTVSlides(n) {
      showTVSlides(tvSlideIndex += n);
}
function currentTVSlide(n) {
      showTVSlides(tvSlideIndex = n);
}
function showTVSlides(n) {
      var i;
      var slides = document.getElementsByClassName("tvSlides");
      var Dots = document.getElementsByClassName("tvDot");
      if (n > slides.length) { tvSlideIndex = 1 }
      if (n < 1) { tvSlideIndex = slides.length }
      for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
      }
      for (i = 0; i < Dots.length; i++) {
            Dots[i].className = Dots[i].className.replace(" active", "");
      }
      slides[tvSlideIndex - 1].style.display = "block";
      Dots[tvSlideIndex - 1].className += " active";
}



/* slideshow for celebs */


var celebSlideIndex = 1;
function plusCelebSlides(n) {
      showCelebSlides(celebSlideIndex += n);
}

function currentCelebSlide(n) {
      showCelebSlides(celebSlideIndex = n);
}

function showCelebSlides(n) {
      var i;
      var slides = document.getElementsByClassName("celebSlides");
      var Dots = document.getElementsByClassName("celebDot");
      if (n > slides.length) { celebSlideIndex = 1 }
      if (n < 1) { celebSlideIndex = slides.length }
      for (i = 0; i < slides.length; i++) {
            slides[i].style.display = "none";
      }
      for (i = 0; i < Dots.length; i++) {
            Dots[i].className = Dots[i].className.replace(" active", "");
      }
      slides[celebSlideIndex - 1].style.display = "block";
      Dots[celebSlideIndex - 1].className += " active";
}