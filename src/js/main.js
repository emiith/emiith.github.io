 // Get the current URL path
 var currentUrl = window.location.href;
  // console.log(currentUrl);
  
 // Get all the links in the navbar
 var links = document.getElementsByClassName('nav-link');
// console.log(links);

 // Loop through the links
 for (var i = 0; i < links.length; i++) {
   // If the link's href matches the current URL, add the active class
   if (links[i] === currentUrl && links[i].href!="#"|| currentUrl.includes(links[i].href) && links[i].href!="#") {
  // if(links[i] === './'+currentUrl.split('/')[currentUrl.split('/').length-1]){ 
     links[i].classList.add('active');
    //  console.log(links[i].href);
   }
 }