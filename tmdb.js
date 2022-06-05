
var base_url = "https://api.themoviedb.org/3";
var api_key = "?api_key=89affa2cbcf8890a6f1ad6287012fd67";
var base_image_url = "https://image.tmdb.org/t/p";
var query_url;

var movie_genres = {};
var tv_genres = {};
var countries = {};
var languages = {};

options = {
      query: function (str) {
            return "query=" + str;
      },
      page: function (pageNo) {
            return "page=" + pageNo;
      },
      cast: function (castIds) {
            return "with_cast=" + castIds.join();
      },
      genres: function (genreIds) {
            return "with_genres=" + genreIds.join();
      },
      release_year: function (year) {
            var date_beg = year + "-01-01";
            var date_end = year + "-12-31";
            return "primary_release_date.gte=" + date_beg + "&primary_release_date.lte=" + date_end;
      }
}

orderby = {
      popularity: "sort_by=popularity.desc",
      vote_count: "sort_by=vote_count.desc",
      revenue: "sort_by=revenue.desc",
}


/* Getting AJAX response */

function getQueryUrl(action) {
      query_url = base_url + action + api_key;
      return function inner(args) {
            args.push("language=en-US");
            query_url += "&" + args.join("&");
            return query_url;
      }
}

function checkResponse(response) {
      if (!response.ok) {
            throw Error(response.status);
      }
      return response;
}

function fetchData(query_url, responseFunction) {
      fetch(query_url)
            .then(checkResponse)
            .then(function (response) {
                  console.log("All Ok!");
                  return response.json();
            })
            .then(responseFunction)
            .catch(function (error) {
                  console.log(error);
            });
}


/* Genres and language */

function fillGenresMovie(data) {
      data.genres.forEach(function (element) {
            movie_genres[element.id] = element.name;
      });
}

function fillGenresTv(data) {
      data.genres.forEach(function (element) {
            tv_genres[element.id] = element.name;
      });
}

function getAllGenres() {
      if (Object.keys(movie_genres).length === 0 && movie_genres.constructor === Object) {
            query_url = getQueryUrl("/genre/movie/list")([]);
            fetchData(query_url, fillGenresMovie);
      }
      if (Object.keys(tv_genres).length === 0 && tv_genres.constructor === Object) {
            query_url = getQueryUrl("/genre/tv/list")([]);
            fetchData(query_url, fillGenresTv);
      }
}

function fillLanguages(data) {
      data.forEach(element => {
            languages[element.iso_639_1] = element.english_name;
      });
      // console.log(languages);
}

function getLanguages() {
      if (Object.keys(languages).length === 0 && tv_genres.constructor === Object) {
            query_url = getQueryUrl("/configuration/languages")([]);
            fetchData(query_url, fillLanguages)
      }
}

getAllGenres();
getLanguages();


function getSearchString(media) {
      var keywords = media.split(" ");
      return keywords.join("+");
}

// constructs html string for particular media with a given media 
function constructHTMLStr(element, media) {
      item_str = "";
      if (media === "multi") {
            media = element.media_type;
      } 
      
      if (media === "movie") {
            item_str = "<div class='item movie' id=" + element.id + ">";
            item_str += "<div class='poster'>";
            if (element.poster_path == null) {
                  item_str += "<img src=./images/media.png alt='poster'>"
            } else {
                  item_str += "<img src=https://image.tmdb.org/t/p/w500" + element.poster_path + " alt='poster' >";
            }
            item_str += "</div>";
            item_str += "<div class='info'>";
            item_str += "<div class='main-info'>";
            item_str += "<h2>" + element.title + "</h2>";
            item_str += "<div>";
            item_str += "<span><i style='color: #742ce8' class='fa fa-calendar'></i>" + element.release_date + "</span>";
            item_str += "<span><i style='color: #0380A3' class='fa fa-language'></i>" + languages[element.original_language] + "</span>";
            item_str += "</div>";
            genres = element.genre_ids.map(function (id) {
                  return movie_genres[id];
            });
            item_str += "<p><i style='color: #BE5300' class='fa fa-film'></i>" + genres.join(", ") + "</p>";
            item_str += "</div>";
            item_str += "<div class='extra-info'>";
            item_str += "<p>" + element.overview + "</p>";
            item_str += "<div>";
            item_str += "<span><i style='color: #FFCB38' class='fa fa-star-o'></i>" + element.vote_average + "</span>";
            item_str += "<span><i style='color: #FE316C'  class='fa fa-heart-o'></i>" + element.vote_count + "</span>";
            item_str += "</div>";
            item_str += "</div>";
            item_str += "<div class='extra-info' style='margin-top: 10px;'>";
            item_str += "<p><button> More ...</button></p>";
            item_str += "</div>";
            item_str += "</div>";
            item_str += "</div>";
      
      } else if (media === "tv") {
            item_str = "<div class='item tv' id=" + element.id + ">";
            item_str += "<div class='poster'>";
            if (element.poster_path == null) {
                  item_str += "<img src=./images/media.png alt='poster'>"
            } else {
                  item_str += "<img src=https://image.tmdb.org/t/p/w500" + element.poster_path + " alt='poster' >";
            }
            item_str += "</div>";
            item_str += "<div class='info'>";
            item_str += "<div class='main-info'>";
            item_str += "<h2>" + element.name + "</h2>";
            item_str += "<div>";
            item_str += "<span><i style='color: #742ce8' class='fa fa-calendar'></i>" + element.first_air_date + "</span>";
            item_str += "<span><i style='color: #0380A3' class='fa fa-language'></i>" + languages[element.original_language] + "</span>";
            item_str += "</div>";
            genres = element.genre_ids.map(function (id) {
                  return tv_genres[id];
            });
            item_str += "<p><i style='color: #BE5300' class='fa fa-film'></i>" + genres.join(", ") + "</p>";
            item_str += "</div>";
            item_str += "<div class='extra-info'>";
            item_str += "<p>" + element.overview + "</p>";
            item_str += "<div>";
            item_str += "<span><i style='color: #FFCB38' class='fa fa-star-o'></i>" + element.vote_average + "</span>";
            item_str += "<span><i style='color: #FE316C'  class='fa fa-heart-o'></i>" + element.vote_count + "</span>";
            item_str += "</div>";
            item_str += "</div>";
            item_str += "<div class='extra-info' style='margin-top: 10px;'>";
            item_str += "<p><button> More ...</button></p>";
            item_str += "</div>";
            item_str += "</div>";
            item_str += "</div>";
      
      } else if (media === "person") {
            item_str = "<div class='item person' id=" + element.id + ">";
            item_str += "<div class='poster'>";
            if (element.profile_path == null) {
                  item_str += "<img src=./images/user.png alt='poster'>"
            } else {
                  item_str += "<img src=https://image.tmdb.org/t/p/w500" + element.profile_path + " alt='poster' >";
            }
            item_str += "</div>";
            item_str += "<div class='info'>";
            item_str += "<div class='main-info'>";
            item_str += "<h2>" + element.name + "</h2>";
            item_str += "<div>";
            item_str += "<span><i style='color: #1295FF' class='fa fa-dot-circle-o'></i>" + element.known_for_department + "</span>";
            item_str += "<span><i style='color: #AE3FFF' class='fa fa-thumbs-up'></i>" + Math.floor(element.popularity * 1000) + "</span>";
            item_str += "</div>";
            item_str += "</div>";
            item_str += "<div class='known-for'>";
            element.known_for.forEach(project => {
                  var proj_str = "<div class='project " + project.media_type + "' id=" + project.id + ">";
                  if (project.poster_path == null) {
                        proj_str += "<img src=./images/media.png alt='poster'>"
                  } else {
                        proj_str += "<img src=https://image.tmdb.org/t/p/w300" + project.poster_path + " alt='poster' >";
                  }
                  if (project.media_type == "movie") {
                        proj_str += "<p>" + project.title + "</p>";
                  } else {
                        proj_str += "<p>" + project.name + "</p>";
                  }
                  proj_str += "</div>";
                  item_str += proj_str;
            });
            item_str += "</div>";
            item_str += "<div class='extra-info' style='margin-top: 10px;'>";
            item_str += "<p><button> More ...</button></p>";
            item_str += "</div>";
            item_str += "</div>";
            item_str += "</div>";
      }

      return item_str;
}

// listener for detail of media
function addEventListenerToItems () {
      var movieItems = document.querySelectorAll('.movie');
      var tvItems = document.querySelectorAll('.tv');
      var personItems = document.querySelectorAll('.person');
      var project = document.querySelectorAll('.project');

      // for movies listed on person item
      project.forEach(element => { 
            element.addEventListener('click', function(event) {
                  event.stopPropagation();
                  window.location.assign('media_details.html?movie&' + element.id);
            });
      });

      movieItems.forEach(element => {
            element.addEventListener('click', function () {
                  window.location.assign('media_details.html?movie&' + element.id);
            });
      });

      tvItems.forEach(element => {
            element.addEventListener('click', function () {
                  window.location.assign('media_details.html?tv&' + element.id);
            });
      });

      personItems.forEach(element => {
            element.addEventListener('click', function () {
                  window.location.assign('media_details.html?person&' + element.id);
            });
      });
}

// footer with next and previous buttons
function getFooter() {
      var footer_str = "<footer>";
      footer_str += "<div>";
      footer_str += "<button class = 'prev-btn'><i class='fa fa-arrow-left' aria-hidden='true'></i></button>";
      footer_str += "<span>0</span>";
      footer_str += "<button class = 'next-btn'><i class='fa fa-arrow-right' aria-hidden='true'></i></button>";
      footer_str += "</div>";
      footer_str += "</footer>";
      return footer_str;
}