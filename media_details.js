var parent = document.querySelector(".result");
var tokens;
var detailMedia;
var mediaId;
var seasonId;
var action;

window.addEventListener('DOMContentLoaded', (event) => {
      // using a loader 
      var results = document.querySelector('.result');
      var loader = document.querySelector('.loader');
      var x = setInterval(function () {
            if (results.childElementCount > 0) {
                  loader.style.display = 'none';
                  clearInterval(x);
            } else {
                  loader.style.display = 'block';
            }
      }, 100);

      var detail_str = location.search.substring(1);
      if (detail_str === "") {
            noResults();
            return;
      }

      tokens = detail_str.split('&');
      console.log(tokens);

      if ((tokens[0] !== "movie" && tokens[0] !== "tv" && tokens[0] !== "person" && tokens[0] !== "tv_season") || tokens.length == 1 || tokens[2] === "") {
            noResults();
            return;
      }

      detailMedia = tokens[0];
      mediaId = tokens[1];

      if (detailMedia === "tv_season") {
            if (tokens[2] === undefined || tokens[2] === "") {
                  noResults();
                  return;
            }
            seasonId = tokens[2];
      }
      getMediaDetails();
});

function getMediaDetails() {
      if (detailMedia === "tv_season") {
            action = "/tv/" + mediaId + "/season/" + seasonId;
      } else {
            action = "/" + detailMedia + "/" + mediaId;
      }
      query_url = getQueryUrl(action)([]);
      fetchData(query_url, function (data) {
            parent.innerHTML = constructMediaDetailsHTMLStr(data);
            if (detailMedia === "tv") {
                  addEventListenerToSeasons();
            }
            addEventListenerToButtons();
      });
}

function getImages() {
      getQueryUrl(action + "/images")(["include_image_language=en"]);
      fetchData(query_url, function (data) {
            var lastDetailBox = document.querySelector('.item').lastChild;
            var img_str = "";
            // conditions
            if (data.posters != undefined) {
                  data.posters.forEach(element => {
                        img_str += constructHTMLForImage(element, "poster");
                  });
            }
            if (data.profiles != undefined) {
                  data.profiles.forEach(element => {
                        img_str += constructHTMLForImage(element, "profiles");
                  })
            }

            if (img_str === "") {
                  lastDetailBox.innerHTML = "<h2 style='text-align: center'>No images found</h2>";
            } else {
                  lastDetailBox.innerHTML = "<div class='media-image-box'>" + img_str + "</div>";
            }
      });
}

function getVideos() {
      getQueryUrl(action + "/videos")([]);
      fetchData(query_url, function (data) {
            var lastDetailBox = document.querySelector('.item').lastChild;
            var video_str = "";

            if (data.results != undefined) {
                  data.results.forEach(element => {
                        video_str += constructHTMLForVideo(element);
                  });
            }

            if (video_str === "") {
                  lastDetailBox.innerHTML = "<h2 style='text-align: center'>No videos found</h2>";
            } else {
                  lastDetailBox.innerHTML = "<div class='media-video-box'>" + video_str + "</div>";
                  addEventListenerToVideos();
            }
      });
}

// to display season details add listener 
function addEventListenerToSeasons() {
      var allSeasons = document.querySelectorAll('.season');
      for (var i = 0; i < allSeasons.length; i++) {
            allSeasons[i].addEventListener('click', function () {
                  window.location.assign('media_details.html?tv_season&' + mediaId + '&' + this.id);
            });
      }
}

// listener for similar media 
function addEventListenerToButtons() {
      var btns = document.querySelectorAll('.button-box button');

      for (var i = 0; i < btns.length; i++) {
            if (btns[i].id === 'similar') {
                  btns[i].addEventListener('click', function () {
                        window.location.assign('similar_media.html?' + detailMedia + '&' + mediaId + '&1');
                  });
            } else if (btns[i].id === 'images') {
                  btns[i].addEventListener('click', function () {
                        addLoader2();
                        getImages();
                  });
            } else if (btns[i].id === 'videos') {
                  btns[i].addEventListener('click', function () {
                        addLoader2();
                        getVideos();
                  });
            }
      }
}

function addLoader2() {
      var lastDetailBox = document.querySelector('.item').lastChild;
      lastDetailBox.innerHTML = "<div id='loader2' class='loader'></div>";
      var loader2 = document.querySelectorAll('.loader')[1];
      var x = setInterval(function () {
            if (lastDetailBox.firstChild.id != "loader2") {
                  loader2.style.display = 'none';
                  clearInterval(x);
            } else {
                  loader2.style.display = 'block';
            }
      }, 100);
}

// click to open youtube video
function addEventListenerToVideos() {
      var videos = document.querySelectorAll('.media-video');
      videos.forEach(element => {
            element.addEventListener('click', function () {
                  if (confirm("Do you want to proceed to Youtube?")) {
                        var url = "https://www.youtube.com/watch?v=" + element.id;
                        var win = window.open(url, '_blank');
                        win.focus();
                  }
            });
            var ytScr = element.firstChild.src;
            element.addEventListener('mouseenter', function() {
                  element.firstChild.src = './images/youtube-logo.png';
            });
            element.addEventListener('mouseleave', function() {
                  element.firstChild.src = ytScr;
            });
      });
}

function noResults() {
      document.querySelector('.main-content').innerHTML = '<h1 style="text-align:center"><i style="color: #AFFC41" class="fa fa-frown-o" aria-hidden="true"></i> No results found!</h1>';
}

function constructMediaDetailsHTMLStr(element) {
      item_str = "";
      if (detailMedia === "movie") {
            item_str = "<div class='item movie' id=" + element.id + ">";
            item_str += "<div class='detail-box'>";
            item_str += "<div class='poster'>";
            if (element.poster_path == null) {
                  item_str += "<img src=./images/media.png alt='poster'>"
            } else {
                  item_str += "<img src=https://image.tmdb.org/t/p/w500" + element.poster_path + " alt='poster' >";
            }
            item_str += "</div>";
            item_str += "<div class='info'>";
            item_str += "<h2>" + element.title + " (" + element.release_date.substring(0, 4) + ")" + "</h2>";
            if (element.tagline) {
                  item_str += "<p style='position: relative; top: -15px;'><b>" + element.tagline + "</b></p>";
            }
            item_str += "<div>";
            item_str += "<span><i style='color: #742ce8' class='fa fa-calendar'></i>" + element.release_date + "</span>";
            item_str += "<span><i style='color: #0380A3' class='fa fa-language'></i>" + languages[element.original_language] + "</span>";
            item_str += "</div>";
            item_str += "<div>";
            var runtimeHours = Math.floor(element.runtime / 60);
            var runtimeMins = element.runtime % 60;
            item_str += "<span><i style='color: #ff8c12' class='fa fa-clock-o'></i>" + runtimeHours + "h " + (runtimeMins > 0 ? runtimeMins + "m" : "") + "</span>";
            item_str += "<span><i style='color: #4fcf00' class='fa fa-thumbs-up'></i>" + Math.floor(element.popularity * 1000) + "</span>";
            item_str += "</div>";
            item_str += "<div>";
            item_str += "<span><i style='color: #FFCB38' class='fa fa-star-o'></i>" + element.vote_average + "</span>";
            item_str += "<span><i style='color: #FE316C'  class='fa fa-heart-o'></i>" + element.vote_count + "</span>";
            item_str += "</div>";
            item_str += "<p style='padding: 10px 0'><i style='color: #968462' class='fa fa-video-camera' aria-hidden='true'></i>";
            item_str += element.production_companies.map(el => {
                  return el.name;
            }).join(', ');
            item_str += "</p>";
            item_str += "<p>" + element.overview + "</p>";
            if (element.homepage) {
                  item_str += "<p><a href=" + element.homepage + " target='new'>" + element.homepage + "</a></p>";
            }
            item_str += "</div>";
            item_str += "</div>";
            item_str += "<div class='detail-box'>";
            item_str += "<p class='button-box' style='padding-top: 15px'>";
            item_str += "<button id='similar'>Similar Movies</button>";
            item_str += "<button id='videos'>Videos</button>";;
            item_str += "<button id='images'>Images</button>";
            item_str += "</p>";
            item_str += "</div>";

            item_str += "<div class='detail-box'>";
            item_str += "</div>";
            item_str += "</div>";

      } else if (detailMedia === "tv") {
            item_str = "<div class='item tv' id=" + element.id + ">";
            item_str += "<div class='detail-box'>";
            item_str += "<div class='poster'>";
            if (element.poster_path == null) {
                  item_str += "<img src=./images/media.png alt='poster'>"
            } else {
                  item_str += "<img src=https://image.tmdb.org/t/p/w500" + element.poster_path + " alt='poster' >";
            }
            item_str += "</div>";
            item_str += "<div class='info'>";
            item_str += "<h2>" + element.name + " (" + element.first_air_date.substring(0, 4) + ")" + "</h2>";
            item_str += "<div>";
            item_str += "<span><i style='color: #870afc' class='fa fa-calendar'></i>" + element.first_air_date + "</span>";
            item_str += "<span><i style='color: #0380A3' class='fa fa-language'></i>" + languages[element.original_language] + "</span>";
            item_str += "</div>";
            item_str += "<div>";
            var runtimes = element.episode_run_time.map(el => {
                  var rTime = "";
                  var hrs = Math.floor(el / 60);
                  var mins = el % 60;
                  if (hrs > 0) {
                        rTime += hrs + "h ";
                  }
                  if (mins > 0) {
                        rTime += mins + "m ";
                  }
                  return rTime;
            }).join(', ');
            item_str += "<span><i style='color: #ff8c12' class='fa fa-clock-o'></i>" + runtimes + "</span>";
            item_str += "<span><i style='color: #4fcf00' class='fa fa-thumbs-up'></i>" + Math.floor(element.popularity * 1000) + "</span>";
            item_str += "</div>";
            item_str += "<div>";
            item_str += "<span><i style='color: #FFCB38' class='fa fa-star-o'></i>" + element.vote_average + "</span>";
            item_str += "<span><i style='color: #FE316C'  class='fa fa-heart-o'></i>" + element.vote_count + "</span>";
            item_str += "</div>";
            var createdBy = element.created_by.map(el => {
                  return el.name;
            }).join(', ');
            item_str += "<p><i style='color: #515152' class='fa fa-pencil'></i>" + createdBy + "</p>";
            var networks = element.networks.map(el => {
                  return el.name;
            }).join(', ');
            item_str += "<p><i style='color: #00c2a2' class='fa fa-rss' aria-hidden='true'></i>" + networks + "</p>";
            var productionComps = element.production_companies.map(el => {
                  return el.name;
            }).join(', ');
            item_str += "<p><i style='color: #968462' class='fa fa-video-camera' aria-hidden='true'></i>" + productionComps + "</p>";
            item_str += "<p>" + element.overview + "</p>";
            if (element.homepage) {
                  item_str += "<p style='padding-top: 10px; flex: 100%'><a href=" + element.homepage + " target='new'>" + element.homepage + "</a></p>";
            }
            item_str += "</div>";
            // detail box ends
            item_str += '</div>';

            // season details and other details
            item_str += "<div class='detail-box'>";
            item_str += "<div class='seasons-box'>";
            element.seasons.forEach(season => {
                  var season_str = "<div class='season' id=" + season.season_number + ">";
                  if (season.poster_path == null) {
                        season_str += "<img src=./images/media.png alt='poster'>";
                  } else {
                        season_str += "<img src=https://image.tmdb.org/t/p/w154" + season.poster_path + " alt='poster' >";
                  }
                  season_str += "<p>" + season.name + "</p>";
                  season_str += "</div>";
                  item_str += season_str;
            });;
            item_str += "</div>";
            item_str += "<p class='button-box' style='padding-top: 15px; flex: 100%'>";
            item_str += "<button id='similar'>Similar Shows</button>";
            item_str += "<button id='videos'>Videos</button>";
            item_str += "<button id='images'>Images</button>";
            item_str += "</p>";
            item_str += "</div>";

            item_str += "<div class='detail-box'>";
            item_str += "</div>";
            item_str += "</div>";

      } else if (detailMedia === "person") {
            item_str = "<div class='item'>";
            item_str += "<div class='detail-box'>";
            item_str += "<div class='poster'>";
            if (element.profile_path == null) {
                  item_str += "<img src=./images/user.png alt='poster'>"
            } else {
                  item_str += "<img src=https://image.tmdb.org/t/p/w500" + element.profile_path + " alt='poster' >";
            }
            item_str += "</div>";
            item_str += "<div class='info'>";
            item_str += "<h2>" + element.name + "</h2>";
            item_str += "<div>";
            item_str += "<span><i style='color: #1295FF' class='fa fa-dot-circle-o'></i>" + element.known_for_department + "</span>";
            item_str += "<span><i style='color: #AE3FFF' class='fa fa-thumbs-up'></i>" + Math.floor(element.popularity * 1000) + "</span>";
            item_str += "</div>";
            item_str += "<div>";
            item_str += "<span><i style='color: #ff4599' class='fa fa-birthday-cake'></i>" + element.birthday + "</span>";
            item_str += "<span><i style='color: #e61700' class='fa fa-map-marker'></i>" + element.place_of_birth + "</span>";
            item_str += "</div>";
            item_str += "<p style='padding: 10px'>" + element.biography + "</p>"
            if (element.homepage) {
                  item_str += "<p><a href=" + element.homepage + " target='new'>" + element.homepage + "</a></p>";
            }
            item_str += "</div>";
            item_str += "</div>";
            item_str += "<div class='detail-box'>";
            item_str += "<p class='button-box' style='padding-top: 15px'>";
            item_str += "<button id='images'>Images</button>";
            item_str += "</p>";
            item_str += "</div>";
            item_str += "<div class='detail-box'>";
            item_str += "</div>";
            item_str += "</div>";

      } else if (detailMedia === "tv_season") {
            item_str = "<div class='item'>";
            item_str += "<div class='detail-box'>"
            item_str += "<div class='poster'>";
            if (element.poster_path == null) {
                  item_str += "<img src=./images/user.png alt='poster'>"
            } else {
                  item_str += "<img src=https://image.tmdb.org/t/p/w500" + element.poster_path + " alt='poster' >";
            }
            item_str += "</div>";
            item_str += "<div class='info'>";
            item_str += "<h2>" + element.name + " (" + element.air_date.substring(0, 4) + ")" + "</h2>";
            item_str += "<p>" + element.overview + "</p>"
            item_str += "</div>";
            item_str += "</div>";
            item_str += "<div class='detail-box'>";
            item_str += "<div class='seasons-box'>";
            element.episodes.forEach(project => {
                  var proj_str = "<div class='episode'>";
                  if (project.still_path == null) {
                        proj_str += "<img src=./images/media.png alt='poster'>"
                  } else {
                        proj_str += "<img src=https://image.tmdb.org/t/p/w185" + project.still_path + " alt='poster' >";
                  }
                  proj_str += "<p>" + project.name + "</p>";
                  proj_str += "</div>";
                  item_str += proj_str;
            });
            item_str += "</div>";
            item_str += "<p class='button-box' style='padding-top: 15px'>";
            item_str += "<button id='videos'>Videos</button>";;
            item_str += "<button id='images'>Images</button>";
            item_str += "</p>";
            item_str += "</div>";

            item_str += "<div class='detail-box'>";
            item_str += "</div>";
      }
      return item_str;
}

function constructHTMLForImage(element, type) {
      var sz = "original";
      if (type == "poster") {
            sz = "w342";
      } else if ("profiles") {
            sz = "h632";
      }
      var item_str = "<div class='media-image'>";
      item_str += "<img src=https://image.tmdb.org/t/p/" + sz + element.file_path + " alt='poster' >";
      item_str += "</div>";
      return item_str;
}

function constructHTMLForVideo(element) {
      var item_str = "<div class='media-video' id=" + element.key + ">";
      item_str += "<img src=https://img.youtube.com/vi/" + element.key + "/mqdefault.jpg alt='thumbnail'>";
      item_str += "<p>" + element.name + "</p>";
      item_str += "</div>";
      return item_str;
}