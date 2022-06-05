var parent = document.querySelector(".result");
var genres;
var QueryStr;
var searchType;

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
      
      var search_str = location.search.substring(1);
      var tokens = search_str.split("=");
      console.log(tokens);

       // Validating the URL  
      if(tokens[0] == undefined || tokens[1] == undefined || tokens[2] == undefined || tokens[2] == "") {
            noResults();
            return;
      }

      searchType = tokens[0];
      if (tokens[0] === "multi" || tokens[0] === "movie" || tokens[0] === "tv" || tokens[0] === "person") {
            QueryStr = tokens[1];
            searchMedia(tokens[0], tokens[1], tokens[2]);
      } else {
            noResults();
            return;
      }
});

function searchMedia(media, query_str, pageNo) {
      var filters = [
            options.query(getSearchString(query_str)),
            orderby.popularity,
            options.page(pageNo)
      ]
      query_url = getQueryUrl("/search/" + media)(filters);
      fetchData(query_url, displaySearchResults);
}

function displaySearchResults(data) {
      if(data.total_results == 0) {
            noResults();
            return;
      }
      var final_str = "";
      data.results.forEach(element => {
            final_str += constructHTMLStr(element, searchType);
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
                  window.location.assign('search_results.html?' + searchType + '=' + QueryStr + '=' + (currentPage + 1));
            } else {
                  alert("This is the last page!")
            }
      });
      prevBtn.addEventListener('click', function() {
            if(currentPage >= 2) {
                  window.location.assign('search_results.html?' + searchType + '=' + QueryStr + '=' + (currentPage - 1));
            } else {
                  alert("This is the first page!");
            }
      });
}

function noResults() {
      document.querySelector('.main-content').innerHTML = '<h1 style="text-align:center"><i style="color: #AFFC41" class="fa fa-frown-o" aria-hidden="true"></i> No results found!</h1>';
}