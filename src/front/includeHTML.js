export let current_id = 1;

export function includeHTML() {
    var z, i, elmnt, file, xhttp;
    /* Loop through a collection of all HTML elements: */
    z = document.getElementsByTagName("*");
    for (i = 0; i < z.length; i++) {
      elmnt = z[i];
      /*search for elements with a certain atrribute:*/
      file = elmnt.getAttribute("w3-include-html");
      if (file) {
        /* Make an HTTP request using the attribute value as the file name: */
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
          if (this.readyState == 4) {
            if (this.status == 200) {elmnt.innerHTML = this.responseText;}
            if (this.status == 404) {elmnt.innerHTML = "Page not found.";}
            /* Remove the attribute, and call this function once more: */
            elmnt.removeAttribute("w3-include-html");
            includeHTML();
          }
        }
        xhttp.open("GET", file, true);
        xhttp.send();
        /* Exit the function: */
        return;
      }
    }
    change_active_nav();
}

function change_active_nav() {
  document.querySelectorAll('.nav-item').forEach(e => e.classList.remove('active'));
  const path = window.location.pathname;
  switch (path) {
      case ('/'):
          document.getElementById("nav-game").classList.add('active');
          break;
      case ('/myStats'):
          document.getElementById("nav-stats").classList.add('active');
          break;
      case ('/bestPlayers'):
          document.getElementById("nav-best").classList.add('active');
          break;
  }
}
