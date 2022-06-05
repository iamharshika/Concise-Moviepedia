var parent = document.querySelector(".result");
var simMedia;
var mediaId;
var tokens;
var currentPage;

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

      var sim_str = location.search.substring(1);
      if(sim_str === "") {
            noResults();
            return;
      }

      tokens = sim_str.split('&');
      console.log(tokens);

      if ((tokens[0] !== "movie" && tokens[0] !== "tv") || tokens.length <= 2 || tokens[2] === "") {
            noResults();
            return;
      }

      simMedia = tokens[0];
      mediaId = tokens[1];
      currPage = tokens[2];
      getSimilarMedia();
});

function getSimilarMedia() {
      query_url = getQueryUrl("/" + simMedia + "/" + mediaId + "/similar")([orderby.popularity, options.page(currPage)]);
      fetchData(query_url, displaySimilarResults);
}

function displaySimilarResults(data) {
      console.log(data);
      if(data.total_results == 0) {
            noResults();
            return;
      }
      var final_str = "";
      data.results.forEach(element => {
            final_str += constructHTMLStr(element, simMedia);
      });
      parent.innerHTML = final_str + getFooter();
      document.querySelector('footer span').textContent = data.page;
      // event listeener for details 
      addEventListenerToItems();
      // adding event listener to the buttons
      addEventListenerToButtons(data.page, data.total_pages);
}

function addEventListenerToButtons(currentPage, totalPages) {
      var prevBtn = document.querySelector('.prev-btn');
      var nextBtn = document.querySelector('.next-btn');
      nextBtn.addEventListener('click', function() {
            if(currentPage < totalPages) {
                  window.location.assign('similar_media.html?' + simMedia + '&' + mediaId + '&' + (currentPage + 1));
            } else {
                  alert("This is the last page!")
            }
      });
      prevBtn.addEventListener('click', function() {
            if(currentPage >= 2) {
                  window.location.assign('similar_media.html?' + simMedia + '&' + mediaId + '=' + (currentPage - 1));
            } else {
                  alert("This is the first page!");
            }
      });
}

function noResults() {
      document.querySelector('.main-content').innerHTML = '<h1 style="text-align:center"><i style="color: #affc41" class="fa fa-frown-o" aria-hidden="true"></i> No results found!</h1>';
}