$(document).ready(function() {
  var pathname = window.location.pathname;
  console.log(pathname);
  if (pathname !== '/') {
    $('#headerlink').hover(function() {
      $('#l').css('color', '#0090FF');
    }, function() {
      $('#l').css('color', '#000');
    })
  };
});