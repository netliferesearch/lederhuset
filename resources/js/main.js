import '../scss/main.scss';

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
  threshold: 0.5,
  location: 0,
  distance: 100,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: ['title', 'url']
};

//do this when focus on searchfield
searchfield.on("focus", function() {
  if (!$('body').hasClass('search-open')) {
    searchFadeOut();
  }
});

//do this on keyup change searchfield
searchfield.on('keyup change', function(e) {
  tosearch = searchfield.val();
  fuse = new Fuse(data.responseJSON.data, options);
  result = fuse.search(tosearch);
  console.log(result);
  populateResults();
});

//do this when you click on exit
closeSearch.on('click', function() {
  $('body').removeClass('search-open');
  searchfield.attr("placeholder", 'Søk på noe');
  searchfield.val("");
  $('.search__typed-cursor').css('display', 'block');
  tl.reverse();
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
    $("#searchResults ul").append("<li class=\"list__item pb--xsmall pt--xsmall-optical paragraph font-neutral\"><a href='"+ value.url +"' class='font-neutral'>" + value.title + "</a></li>");
    return index<7;
  })
}



/*** scrollto ***/
var sticky = new Sticky('.sticky');
new Sticky('.sticky', { wrap: true });


$('.article-anchor').click(function(e){
  e.preventDefault();
  var href = $(this).attr("href");
  var offset = Math.floor($(href).offset().top);
  console.log(href + ' offset: ' + offset);

  TweenLite.to(window, .5, {scrollTo:{y:offset, offsetY:100, ease: Sine.easeOut}});

  $('.article-anchor').each(function () {
    $(this).removeClass('active');
  });

  $(this).addClass('active');
});



//Remove empty p tags from article
$('p').each(function(index, item) {
  if($.trim($(item).text()) === "") {
    $(item).remove();
  }
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




/*** toggle menu ***/
function toggleActive(elem){
  elem.classList.toggle('active');
}

//menu, login and registration form
$('[data-show="login"], [data-show="registration"], [data-show="menu"]').on('click', function(e) {
  var thisAttr = '#' + $(this).attr('data-show');
  var thisExit = thisAttr + ' .search__close';
  var menuElemToHide;
  var menuWrapper;
  e.preventDefault();
  toggleActive(this);

  if ( $(this).hasClass('menu__toggle')) {
    menuElemToHide = $('.menu__logo-wrap, .menu__login'),
    menuWrapper = thisAttr + ' .inline-wrapper';
  } else {
    menuElemToHide = $('.page-header'),
    menuWrapper = thisAttr + ' .login__wrapper';
  }

  if( $(this).hasClass('active') ){
    TweenMax.to(thisAttr, .2, {autoAlpha:1, opacity:1, ease: Quad.easeIn, force3D:true});
    TweenLite.fromTo(menuWrapper, .9, {opacity:0, y:30}, {opacity:1, y:0, ease:Expo.easeOut, force3D:true});
    TweenMax.to(menuElemToHide, .15, {autoAlpha:0, opacity:0, ease: Quad.easeIn});
    TweenLite.to(thisExit, .5, {opacity:1, autoAlpha: 1, ease: Quad.easeIn});
    $('body').addClass('formOpen');
  } else {
    TweenMax.to(thisAttr, .2, {autoAlpha:0, opacity:0, ease: Quad.easeIn, delay:.1});
    TweenLite.fromTo(menuWrapper, .8, {opacity:1, y:0}, {opacity:0, y:50, ease:Expo.easeOut});
    TweenMax.to(menuElemToHide, .15, {autoAlpha:1, opacity:1, ease: Quad.easeIn, delay:.1});
    TweenLite.to(thisExit, .5, {opacity:0, autoAlpha: 0, ease: Quad.easeOut});
    $('body').removeClass('formOpen');
  }

  $(thisExit).on('click', function() {
    TweenMax.to(thisAttr, .2, {autoAlpha:0, opacity:0, ease: Quad.easeIn, delay:.1});
    TweenLite.fromTo(menuWrapper, .8, {opacity:1, y:0}, {opacity:0, y:50, ease:Expo.easeOut});
    TweenMax.to(menuElemToHide, .15, {autoAlpha:1, opacity:1, ease: Quad.easeIn, delay:.1});
    TweenLite.to(thisExit, .5, {opacity:0, autoAlpha: 0, ease: Quad.easeOut});
    $('body').removeClass('formOpen');
  });
});

$('.list__item--hover').each(function(){
  var listItemLink = $(this).find('a');

  $(this).mouseenter(function(){
    TweenMax.to(listItemLink, .3, {x:20, ease: Expo.easeOut});
  });

  $(this).mouseleave(function(){
    TweenMax.to(listItemLink, .3, {x:0, ease: Expo.easeOut});
  });
});



function checkInputVal(){
  if( $(this).val().length === 0 ) {
    $(this).parent().removeClass('input__wrapper--filled');
  } else {
    $(this).parent().addClass('input__wrapper--filled');
  }
}

$('.login__input').blur(checkInputVal);
$('.login__input').each(checkInputVal);

/*** pathfinder module ***/
var clickedPath = [];

$('.pathfinder__question').each(function(){
  var thisQuestion = $(this),
      btnAnswer = $(this).find('.pathfinder__answer'),
      btnExit = $('.exit-guide'),
      showResultId;

  //show result
  btnAnswer.on("click", function(){
    showResultId = $(this).attr("data-show");
    var thisBtn = $(this);
    var thisParent = $(this).parent().parent();

    if (showResultId == "") {
      alert('Beklager - dette svaret har ingen sti!');
    } else {
      clickedPath.push(showResultId);
      console.log(clickedPath);
      //if the question has been clicked on before
      if ( $(thisParent).hasClass('clicked') ){
        //if the button clicked has class clicked
        if ( $(this).hasClass('clicked') ) {
          // do nothing: both parent and button has been clicked before
        } else {
          //else there's a different button
          console.log(thisParent);

          var removeFromArray = $(this).parent().parent().attr('id');
          clickedPath.splice(clickedPath.indexOf(removeFromArray), 1);
          console.log('elements to be removed: ' + clickedPath);
          $(thisParent).find('button').removeClass('clicked');
          $(this).addClass('clicked');
          for(var i = 0; i < clickedPath.length; i++){
            var element = clickedPath[i];
            TweenLite.fromTo($('#' + element), 0.5, {opacity:1, y:0}, {opacity:0, y:20, display:'none', ease:Expo.easeOut, onComplete:showQuestion});
            $('#' + element).removeClass('clicked clicked__result');
          }
        }
      //the question has not been clicked on before
      } else {
        if (showResultId == "") {
          alert('Beklager - dette svaret har ingen sti!');
        } else if ((showResultId !== "") && ($('#' + showResultId).hasClass('clicked__result'))) {
          scrollToQuestion();
        } else {
          showQuestion();
        }
      }
    }

    function showQuestion(){
      TweenLite.to(thisQuestion, .3, {backgroundColor:'#fcd9cd', ease:Quad.easeOut});
      TweenLite.fromTo($('#' + showResultId), 0.5, {opacity:0, y:20}, {opacity:1, y:0, display:'block', ease:Expo.easeOut, delay:.2, onComplete:scrollToQuestion});
      $(thisBtn).add(thisQuestion).addClass('clicked');
      $('#' + showResultId).addClass('clicked__result');
    }
  });

  //exit guide
  btnExit.on("click", function(){
    resetAll();
  });

  function scrollToQuestion(){
    TweenLite.to(window, .4, {scrollTo:{y:$('#' + showResultId).offset().top - 50}, ease: Sine.easeOut});
  }

  function resetAll(){
    $(thisQuestion).add('.pathfinder__block button').removeClass('clicked clicked__result');
    TweenLite.to(window, .6, {scrollTo:{y:0}, ease: Sine.easeInOut});
    TweenLite.fromTo($('.pathfinder__block:not(:first-of-type)'), 0.7, {opacity:1, y:0}, {opacity:0, y:20, display:'none', ease:Expo.easeOut});
    TweenLite.to(thisQuestion, .3, {backgroundColor:'#c3eee8', ease:Quad.easeOut});
    clickedPath = [];
  }

  var checkboxes = $(this).find('input[type=checkbox]');
  checkboxes.change(function(){
    if($('#check1').is(':checked') && $('#check2').is(':checked')) {
      $('#question20 button').attr("disabled", false);
    } else {
      $('#question20 button').attr("disabled", true);
    }
  });

});


//pathfinder popup
$('.pathfinder__popup').on("click", function(e){
  e.preventDefault();
  var popUpText = $(this).attr('data-text'),
      popUpUrl = $(this).attr('data-url'),
      popUpUrlText = $(this).attr('data-url-title'),
      popUpContainer = $('#pathfinder__popup'),
      popUpTitle = $(this).text(),
      popUpWrapper = $('#pathfinder__popup .popup__inner');

  if (popUpUrl) {
    popUpWrapper.empty().append("<button class='search__close' id='pathfinderClose'><span class='close__icon'></span></button><h3 class='mb--xsmall'>" + popUpTitle + "</h3><p class='paragraph font-neutral'>" + popUpText + "</p><p class='font-neutral mt--xxsmall'><a target='_blank' href='"+ popUpUrl +"'>"+popUpUrlText +"<svg width='10' height='10' viewBox='0 0 126 126'><path d='M78.2,31.6L46.9,0.3L125.5,0l0.3,78.8L94,47.1l-78.3,78.3L0.1,109.9L78.2,31.6z'/></svg></a></p>");
  } else {
    popUpWrapper.empty().append("<button class='search__close' id='pathfinderClose'><span class='close__icon'></span></button><h3 class='mb--xsmall'>" + popUpTitle + "</h3><p class='paragraph font-neutral'>" + popUpText + "</p>");
  }

  TweenLite.to(popUpContainer, .2, {opacity:1, autoAlpha:1, ease: Quad.easeIn});
  TweenLite.fromTo(popUpWrapper, .7, {opacity:0, y:-50}, {opacity:1, y:0, ease: Elastic.easeOut.config(1, 0.75)});
  TweenLite.to($('#pathfinderClose'), .5, {opacity:1, autoAlpha: 1, ease: Quad.easeIn});

  $(document).mouseup(function(event){
    if (!popUpWrapper.is(event.target) && popUpWrapper.has(event.target).length === 0) {
      TweenLite.to(popUpContainer, .3, {opacity:0, autoAlpha:0, ease: Quad.easeOut});
      TweenLite.to($('#pathfinderClose'), .5, {opacity:0, autoAlpha: 0, ease: Quad.easeOut});
    }
  });

  $('#pathfinderClose').on("click", function(){
    TweenLite.to(popUpContainer, .3, {opacity:0, autoAlpha:0, ease: Quad.easeOut});
    TweenLite.to($('#pathfinderClose'), .5, {opacity:0, autoAlpha: 0, ease: Quad.easeOut});
  });

});
