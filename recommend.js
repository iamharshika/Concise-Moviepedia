function displayRecommendedMedia(media, dataArray) {
      if (dataArray[0] == undefined || dataArray[1] == undefined) {
            recommendMedia(media);
            return;
      }

      var parent = document.querySelector(".result");
      var final_str = "";
      dataArray.forEach(element => {
            final_str += constructHTMLStr(element, media);
      });
      parent.innerHTML = final_str;
      // listener for detail of media
      addEventListenerToItems();
}

function getRandom(limit) {
      var r = parseInt(Math.random() * limit);
      return (r + 1) % (limit + 1);
}

function recommendMedia(media) {
      // a random pages
      var randPage = getRandom(25);
      // two diff random items from the page
      // 20 results on the page
      var index1 = getRandom(20);          
      var index2 = index1;
      while (index2 === index1) {
            index2 = getRandom(20);
      }

      var filters = [orderby.vote_count, options.page(randPage)];
      query_url = getQueryUrl("/discover/" + media)(filters);

      fetch(query_url)
            .then(checkResponse)
            .then(function (response) {
                  console.log("All Ok!");
                  return response.json();
            })
            .then(function (data) {
                  displayRecommendedMedia(media, [data.results[index1], data.results[index2]]);
            })
            .catch(function (error) {
                  console.log(error);
            });

}

window.addEventListener('DOMContentLoaded', (event) => {
      var media = location.search.substring(1);
      if(media === "movie" || media === "tv") {
            recommendMedia(media);
      } else {
            noResult();
            return;
      }

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
});

function noResult () {
      document.querySelector('.main-content').innerHTML = '<h1 style="text-align:center"><i style="color: #AFFC41" class="fa fa-frown-o" aria-hidden="true"></i> No results found!</h1>';
}