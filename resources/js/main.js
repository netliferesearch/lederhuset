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
var result, fuse, tosearch,
    searchfield = $('#mainSearch'),
    closeSearch = $('#searchClose'),
    fadeOutContent = $('#page-header, #allEntries'),
    tl = new TimelineLite({onReverseComplete:emptySearch});
    tl.to($("#searchResults ul"), .3, {y:0, opacity:1, ease:Quad.easeOut});
    tl.pause();

// get search data from json api
var data = $.ajax({
  url: "/api.json",
  success: function(result) {
    console.log(result);
  }
});

// fuse options for search
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

//do this when focus on searchfield
searchfield.on("focus", function() {
  if ($('body').hasClass('search-open')) {
    //do nothing
  } else {
    searchFadeOut();
    TweenMax.to($('.search__wrapper'), .2, {css:{borderBottomColor:'#000'}, ease: Circ.easeIn, delay:.1});
  }
});

//do this on keyup change searchfield
searchfield.on('keyup change', function(e) {
  tosearch = searchfield.val();
  fuse = new Fuse(data.responseJSON.data, options);
  result = fuse.search(tosearch);
  populateResults();
});

//do this when you click on exit
closeSearch.on('click', function() {
  $('body').removeClass('search-open');
  searchfield.attr("placeholder", 'Søk etter noe');
  searchfield.val("");
  $('.search__typed-cursor').css('display', 'block');
  tl.reverse();
  TweenMax.to($('.search__wrapper'), .3, {css:{borderBottomColor:'transparent'}, ease: Circ.easeOut});
  TweenLite.to(fadeOutContent, .5, {opacity:1, ease: Quad.easeIn, delay:.2});
  TweenLite.to(closeSearch, .5, {opacity:0, autoAlpha: 0, ease: Quad.easeOut});
});

function emptySearch(){
  $("#searchResults ul").empty();
}

function searchFadeOut() {
  $('body').addClass('search-open');
  searchfield.attr("placeholder", '');
  $('.search__typed-cursor').css('display', 'none');
  TweenLite.to(fadeOutContent, .5, {opacity:0, ease: Expo.easeOut, onComplete:populateResults});
  TweenLite.to(closeSearch, .5, {opacity:1, autoAlpha: 1, ease: Quad.easeIn});
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
$('.a-toggle').each(function(){
  var bottom = $(this).find('.a-toggle__content'),
      bottomContent = $(this).find('.a-toggle__inner'),
      btnSvg = $(this).find('.a-toggle__arrow');

  function showContent() {
    $(this).add(btnSvg).addClass('clicked');
    $(bottomContent).fadeIn();
    TweenLite.set(bottom, {css: {height:"auto"}});
    TweenLite.from(bottom, .3, {css: {height:0}, ease: Expo.easeInOut, y: 0 });
    TweenLite.to(bottom, .1, {css: {opacity:1}, delay:0.1, ease: Quad.easeIn, y: 0 });
    $(this).one("click", hideContent);
  }

  function hideContent() {
    $(this).add(btnSvg).removeClass('clicked');
    $(bottomContent).fadeOut();
    TweenLite.to(bottom, .3, {css: {height:0}, opacity:0, delay:.1, ease: Expo.easeInOut, y: 0 });
    $(this).one("click", showContent);
  }

  $($(this).find('.a-toggle__button')).one("click", showContent);
});



/*** pathfinder module ***/
$('.pathfinder__question').each(function(){
  var thisQuestion = $(this);
  var btnAnswer = $(this).find('.pathfinder__answer');

  $(btnAnswer).on("click", function(){
    var showResult = '#' + $(this).attr("data-show");
    TweenLite.to(thisQuestion, .3, {y:15, opacity:0, autoAlpha: 0, ease:Quad.easeOut, onComplete:hideQuestion});
  });

  function hideQuestion(){
    thisQuestion.css('display', 'none');
  }

});
