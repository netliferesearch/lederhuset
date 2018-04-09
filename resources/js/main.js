import '../scss/main.scss';
import './toggle'

//plugins
import $ from 'jquery';
import {TweenMax, Power2, TimelineLite} from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import Fuse from 'fuse.js'
import Typed from 'typed.js';
import Sticky from 'sticky-js';
import tocbot from 'tocbot';




/* typed */
var searchfield = $('#mainSearch');
var typedOptions = {
  strings: [
    "Søk etter ledelse...",
    "Søk etter ferie...",
    "Søk etter ansettelse...",
  ],
  typeSpeed: 60,
  loop: true,
  attr: 'placeholder'
}

if ($(searchfield).length){
  var typed = new Typed("#mainSearch", typedOptions);
}



/* fuse search */
var result, fuse, tosearch;
var data = $.ajax({
  url: "/api.json",
  success: function(result) {
    console.log(result);
  }
});

var options = {
  shouldSort: true,
  threshold: 0.6,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ['title'],
  id: 'title'
};

searchfield.on('keyup change', function(e) {
  tosearch = searchfield.val();
  fuse = new Fuse(data.responseJSON.data, options);
  result = fuse.search(tosearch);
  if (tosearch.length == 0) {
    // do nothing if there is no search string
  } else {
    populateResults();  
  }
});

function populateResults() {
  $("#allEntries").empty();
  $.each(result, function(index, value) {
    $("#allEntries").append("<tr>" + "<td class=\"center-align\">" + value + "</td>" + "</tr>")
  })
};



/* scrollto */
var sticky = new Sticky('.sticky');

$('.article-anchor').click(function(e){
  e.preventDefault();
  var href = $(this).attr("href");
  TweenLite.to(window, .5, {scrollTo:{y:href, offsetY:100, ease: Sine.easeOut}});
  $('.article-anchor').each(function () {
    $(this).removeClass('active');
  });
  $(this).addClass('active');
});






/* menu
$(".menu__search-input").one( "click", function() {
  TweenMax.to($("#search"), .2, {autoAlpha:1, opacity:1, ease: Circ.easeOut, onComplete: focusSearch});
  typed = null;
});

function focusSearch(){
  $('#search__field').focus();
}

$("#search__form").submit(function(event) {
  event.preventDefault();
  TweenMax.set($("#results"), {opacity:0, autoAlpha:0, y:20});

  var $form = $(this),
    term = $form.find("input").val(),
    url = $form.attr("action");

  $.get(url, {q: term}).done(function(data) {
    var content = data;
    TweenMax.to($("#results"), .5, {autoAlpha:1, y:0, opacity:1, ease: Circ.easeOut});
    if (term === "") return;
    $("#results").html(content);
  });
 });*/
