function openNav() {
      // document.getElementById("mynavbar").style.width = "70%";
      if (document.getElementById("mynavbar").style.width == "100%") {
            document.getElementById("mynavbar").style.width = "0";
            if(document.querySelector('.selected')) {
                  document.querySelector('.selected').click();
            }
      } else {
            document.getElementById("mynavbar").style.width = "100%";
      }
}
/* for opening up links when the main links are clicked */
var links = document.querySelectorAll('.navbar-links>div');

for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
            var curr = document.querySelector('.selected');
            var currCaret = document.querySelectorAll('.selected>a>i')[1];

            if (curr == this) {
                  curr.classList.remove('selected');
                  swapCaretClass(currCaret);
            } else {
                  if (curr) {
                        curr.classList.remove('selected');
                        swapCaretClass(currCaret);
                  }
                  this.classList.add('selected');
                  var caret = document.querySelectorAll('.selected>a>i')[1];
                  swapCaretClass(caret);
            }
      });
}

function swapCaretClass(el) {
      if (el.classList.contains('fa-caret-down')) {
            el.classList.remove('fa-caret-down');
            el.classList.add('fa-caret-up');
      } else if (el.classList.contains('fa-caret-up')) {
            el.classList.remove('fa-caret-up');
            el.classList.add('fa-caret-down');
      }
}