import '../scss/main.scss';
import './toggle'

/*** plugins ***/
import $ from 'jquery';
import {TweenMax, Power2, TimelineLite} from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import Fuse from 'fuse.js'
import Sticky from 'sticky-js';
import tocbot from 'tocbot';


/*** search module ***/
var searchfield = $('#mainSearch');
var tl = new TimelineLite({onReverseComplete:emptySearch});
tl.to($("#searchResults ul"), .3, {y:0, opacity:1, ease:Quad.easeOut});
tl.pause();

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
  keys: ['title', 'url'],
  id: 'title'
};

searchfield.one( "focus", function() {
  searchFadeOut();
  TweenMax.to($('.search__wrapper'), 2, {css:{borderBottomColor:'#000'}, ease: Circ.easeOut, delay:.2});
});

searchfield.on('keyup change', function(e) {
  tosearch = searchfield.val();
  fuse = new Fuse(data.responseJSON.data, options);
  result = fuse.search(tosearch);
  populateResults();
});

searchfield.one( "keyup change", function() {
  tl.play();
});

function emptySearch(){
  $("#searchResults ul").empty();
}

function searchFadeOut() {
  var fadeOutContent = $('#page-header, #allEntries');
  TweenLite.to(fadeOutContent, .5, {opacity:0, ease: Expo.easeInOut, onComplete:populateResults});
  searchfield.attr("placeholder", "");
  $('.search__typed-cursor').remove();
}

function populateResults() {
  if (searchfield.val() == '') {
    tl.reverse();
  } else {
    emptySearch();
    tl.play();
  }
  $.each(result, function(index, value) {
    $("#searchResults ul").append("<li class=\"list__item\"><a href='' class='font-neutral'>" + value + "</a></li>")
  })
}



/*** scrollto ***/
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



/*** accordion module ***/
$('.article .accordion').each(function(){
  var bottom = $(this).find('.accordion__content');
  var bottomContent = $(this).find('.accordion__inner');
  var btnSvg = $(this).find('.accordion__arrow');

  function showContent() {
    $(this).addClass('clicked');
    $(btnSvg).addClass('clicked');
    $(bottomContent).fadeIn();
    TweenLite.set(bottom, {css: {height:"auto"}});
    TweenLite.from(bottom, .3, {css: {height:0}, ease: Expo.easeInOut, y: 0 });
    TweenLite.to(bottom, .3, {css: {opacity:1}, delay:0.1, ease: Expo.easeInOut, y: 0 });
    $(this).one("click", hideContent);
  }
  function hideContent() {
    $(this).removeClass('clicked');
    $(btnSvg).removeClass('clicked');
    $(bottomContent).fadeOut();
    TweenLite.to(bottom, .3, {css: {height:0}, opacity:0, delay:.1, ease: Expo.easeInOut, y: 0 });
    $(this).one("click", showContent);
  }

  $($(this).find('.accordion__button')).one("click", showContent);
});
