import '../scss/main.scss';

/*** plugins ***/
import $ from 'jquery';
import {TweenMax, Power2, TimelineLite} from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import Fuse from 'fuse.js'
import Sticky from 'sticky-js';
import tocbot from 'tocbot';
import inview from 'jquery-inview';
import picturefill from 'picturefill';
import Headroom from 'headroom.js';

var imagesLoaded = require('imagesloaded');

// Picture element HTML5 shiv
document.createElement( "picture" );

if( $('.toc-wrapper').length ){
  tocbot.init({
    tocSelector: '.toc-wrapper',
    contentSelector: '.article',
    headingSelector: 'h1',
    scrollSmoothDuration:720,
    linkClass: 'toc__link',
    listItemClass: 'font-neutral',
    activeLinkClass: 'active',
    listClass: 'list'
  });
};



var sticky = new Sticky('.sticky');
new Sticky('.sticky', { wrap: true });


/*** revealing elements ***/
TweenLite.set($('[data-reveal]'), {y:30});

$('[data-reveal]').each(function(index, elem){
  $(this).one('inview', function (event, visible) {
    if (visible == true) {
      $(this).addClass('revealed');
      TweenMax.to(elem, .8, {opacity:1, ease:Sine.easeInOut});
      TweenMax.to(elem, 1.2, {y:0, ease:Expo.easeOut});
    }
  });
});


/*** search module ***/
var result, fuse, tosearch,
    searchfield = $('#mainSearch, #resourcesSearch'),
    closeSearch = $('#searchClose'),
    placeholderText = $(searchfield).attr('placeholder'),
    fadeOutContent = $('#page-header .menu__non-nav-inner, #allEntries, #allFormEntries, #virke-header .virke-header__wrapper'),
    tl = new TimelineLite({onReverseComplete:emptySearch});
    tl.to($("#searchResults ul, #resourcesSearchResults ul"), .3, {y:0, opacity:1, ease:Quad.easeOut});
    tl.pause();

// get search data from json api
var data = $.ajax({
  url: "/api.json",
});

var resourcesData = $.ajax({
  url: "/resourcesApi.json",
});

// fuse options for search
var options = {
  shouldSort: true,
  threshold: 0.4,
  location: 0,
  distance: 70,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [{
      name: 'title',
      weight: 0.7
    }, {
      name: 'url',
      weight: 0.7
    }, {
      name: 'blocks.title',
      weight: 0.3
    }]
};

// fuse options for resources search
var resourcesOptions = {
  shouldSort: true,
  threshold: 0.4,
  location: 0,
  distance: 70,
  maxPatternLength: 32,
  minMatchCharLength: 1,
  keys: [{
      name: 'title',
      weight: 0.7
    }, {
      name: 'file',
      weight: 0.7
    }, {
      name: 'description',
      weight: 0.1
    }, {
      name: 'category.title',
      weight: 0.3
    }]
};

//do this when focus on searchfield
searchfield.on("focus", function() {
  if (!$('body').hasClass('search-open')) {
    searchFadeOut();
  }
});

//do this on keyup change searchfield
searchfield.on('keyup change', function(e) {
  if(e.which === 13){
    //do nothing
  } else {
    if ($('#resourcesSearch').length){
      fuse = new Fuse(resourcesData.responseJSON.data, resourcesOptions);
      $("#resourcesSearchResults ul li:first-child").removeClass('active');
    } else {
      fuse = new Fuse(data.responseJSON.data, options);
      $("#searchResults ul li:first-child").removeClass('active');
    }
    tosearch = searchfield.val();
    result = fuse.search(tosearch);
    populateResults();
  }
});

//do this when you click on exit
closeSearch.on('click', function() {
  $('body').removeClass('search-open');
  searchfield.attr("placeholder", placeholderText);
  searchfield.val("");
  $('.search__typed-cursor').css('display', 'block');
  tl.reverse();
  TweenLite.to(fadeOutContent, .5, {opacity:1, ease: Quad.easeIn, delay:.2});
  TweenLite.to(closeSearch, .5, {opacity:0, autoAlpha: 0, ease: Quad.easeOut});
});

function emptySearch(){
  $("#searchResults ul, #resourcesSearchResults ul").empty();
}

function searchFadeOut() {
  $('body').addClass('search-open');
  searchfield.attr("placeholder", '');
  $('.search__typed-cursor').css('display', 'none');
  TweenLite.to(fadeOutContent, .5, {opacity:0, ease: Expo.easeOut, onComplete:populateResults});
  TweenLite.to(closeSearch, .5, {opacity:1, autoAlpha: 1, ease: Quad.easeIn});
}


function listItemHoverEffect(){
  $('.list__item--hover, .accordion__button').each(function(){
    var listItemLink;

    if ( $(this).hasClass('a-toggle__button') ) {
      listItemLink = $(this).find('span');
    } else {
      listItemLink = $(this).find('a');
    }

    $(this).mouseenter(function(){
      TweenMax.to(listItemLink, .2, {x:12, ease: Circ.easeOut});
    });

    $(this).mouseleave(function(){
      TweenMax.to(listItemLink, .2, {x:0, ease: Circ.easeOut});
    });
  });
}


listItemHoverEffect();

function populateResults() {
  if (searchfield.val() == '') {
    tl.reverse();
  } else {
    emptySearch();
    tl.play();
  }

  if ( result != null) {
    if ( result.length === 0 ) {
      $("#searchResults ul, #resourcesSearchResults ul").append("<li class=\"list__item pb--xsmall pt--xsmall-optical paragraph font-neutral\">Ingen resultater</li>");
    }

    $.each(result, function(index, value) {
      if ( $(searchfield).is('#resourcesSearch') ) {
        $("#resourcesSearchResults ul").append("<li class=\"list__item list__item--hover list__item--resources\"><a class='font-neutral paragraph pb--xsmall pt--xsmall-optical' href='"+ value.file +"' class='font-neutral'>" + "<span class='list__title'>" + value.title + "</span><span class='list__description'>" + value.description + "</span><svg class='list__arrow-download search__arrow-download arrow-download' width='20' height='13' viewBox='0 0 171 254'><path d='M102.6,168.6h67.6l-84.4,84.8L0.6,168.6H69V0.2h33.6V168.6z'/></svg>" + "</a></li>");
      } else {
        $("#searchResults ul").append("<li class=\"list__item list__item--hover\"><a class='pb--xsmall pt--xsmall-optical paragraph font-neutral' href='"+ value.url +"' class='font-neutral'>" + value.title + "</a></li>");
      }
      return index<7;
    });

  }
  listItemHoverEffect();
}

$('#mainSearchWrapper').submit(function(event) {
  event.preventDefault();
  $("#searchResults ul li:first-child").addClass('active');
  TweenMax.to($("#searchResults ul li:first-child a"), .25, {x:15, ease: Expo.easeOut});
});





/***** edit profile *****/
$('.edit-form').each(function(){
  var editBtn = $(this).find('.edit-form__edit-btn'),
      saveBtn = $(this).find('.edit-form__save-btn'),
      currentInput = $(this).find('.edit-form__input'),
      marginBtn = saveBtn.css('margin-top'),
      dots = $(this).find('.edit-form__dots');

  $(editBtn).on('click', function(ev){
    ev.preventDefault();
    currentInput.prop('disabled', false).focus().addClass('active');
    TweenMax.to(editBtn, .4, {y:20, autoAlpha:0, ease: Expo.easeOut});
    TweenMax.to(saveBtn, .4, {marginTop:0, autoAlpha:1, ease: Expo.easeOut, delay:.2});
  });

  $(this).submit(function(ev) {
    TweenMax.to(saveBtn, .4, {y:20, autoAlpha:0, ease: Expo.easeOut});
    TweenMax.to(dots, .4, {marginTop:0, autoAlpha:1, ease: Expo.easeOut, delay:.2});

    ev.preventDefault();
    $.post({
      url: '/',
      dataType: 'json',
      data: $(this).serialize(),
      success: function(response) {
        if (response.success) {
          currentInput.prop('disabled', true).removeClass('active');
          TweenMax.to(dots, .4, {y:20, autoAlpha:0, ease: Expo.easeOut});
          TweenMax.to(editBtn, .4, {y:0, autoAlpha:1, ease: Expo.easeOut, delay:.2});
        } else {
          alert('An error occurred. Please try again.');
        }
      }
    });
  });
});






var $window = $(window);

function resizeCheck(){
  var pageWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var pageHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  var footerHeight = $('.page-footer').height();

  $('main').css('margin-bottom', footerHeight);

  if ( pageWidth <= 769 ) {
  } else {
  }
}

resizeCheck();
$window.resize(resizeCheck);




/*** show more list items and example module ***/
$('[data-showmore], .example').each(function(){
  if ( $(this).hasClass('list__item') ) {
    var bottom = $(this).parent().find('.list__item__wrapper');
    var bottomBtn = $(this).find('button');
    var bottomText = ('Vis flere');
  } else {
    var bottom = $(this).find('.example__bottom');
    var bottomBtn = $(this).find('button');
    var bottomText = ('Vis hele');
  }

  function showContent() {
    TweenMax.set(bottom, {height:"auto"});
    TweenMax.from(bottom, .32, {height:0, ease:Circ.easeInOut});
    $(bottomBtn).addClass('active').find('span').text('Vis mindre');
    $(this).one("click", hideContent);
  }

  function hideContent() {
    TweenMax.to(bottom, .32, {height:0, ease: Circ.easeInOut});
    $(bottomBtn).removeClass('active').find('span').text(bottomText);
    $(this).one("click", showContent);
  }

  $(this).one("click", showContent);
});




/*** images loaded ***/
$('.image__container').each(function () {
  var _thisImg = $(this).find('img');
  var _thisBgImg = $(this).find('.image__notloaded');

  imagesLoaded(_thisImg, function() {
    TweenLite.to(_thisImg, .4, {opacity:1, ease: Quad.easeIn, delay:.2});
    TweenLite.to(_thisBgImg, .4, {opacity:0, autoAlpha: 0, ease: Quad.easeOut, delay:.2});
  });

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
$('[data-show="menu"]').on('click', function(e) {
  var thisAttr = '#' + $(this).attr('data-show');
  var thisExit = thisAttr + ' .search__close';
  var menuElemToHide = $('.menu__logo-wrap, .menu__login');
  var menuWrapper = thisAttr + ' .inline-wrapper';
  e.preventDefault();
  toggleActive(this);

  function exitMenu(){
    TweenMax.to(thisAttr, .2, {autoAlpha:0, opacity:0, ease: Quad.easeIn, delay:.1});
    TweenMax.to($('.page-header'), .2, {backgroundColor:'#fff', ease: Quad.easeIn, delay:.1});
    TweenLite.fromTo(menuWrapper, .8, {opacity:1, y:0}, {opacity:0, y:50, ease:Expo.easeOut});
    TweenMax.to(menuElemToHide, .15, {autoAlpha:1, opacity:1, ease: Quad.easeIn, delay:.1});
    TweenLite.to(thisExit, .5, {opacity:0, autoAlpha: 0, ease: Quad.easeOut});
    $('body').removeClass('formOpen');
  }

  if( $(this).hasClass('active') ){
    TweenMax.to(thisAttr, .2, {autoAlpha:1, opacity:1, ease: Quad.easeIn, force3D:true});
    TweenMax.to($('.page-header'), .2, {backgroundColor:'#c3eee8', ease: Quad.easeIn});
    TweenLite.fromTo(menuWrapper, .9, {opacity:0, y:30}, {opacity:1, y:0, ease:Expo.easeOut, force3D:true});
    TweenMax.to(menuElemToHide, .15, {autoAlpha:0, opacity:0, ease: Quad.easeIn});
    TweenLite.to(thisExit, .5, {opacity:1, autoAlpha: 1, ease: Quad.easeIn});
    $('body').addClass('formOpen');
  } else {
    exitMenu();
  }

  $(thisExit).on('click', function() {
    exitMenu();
  });
});

$('[data-show="login"], [data-show="registration"]').each(function(){
  $(this).on('click', function(e) {
    var thisAttr = '#' + $(this).attr('data-show');
    var thisExit = thisAttr + ' .search__close';
    var menuElemToHide = $('.page-header');
    var menuWrapper = thisAttr + ' .login__wrapper';
    e.preventDefault();
    toggleActive(this);

    TweenMax.to(thisAttr, .2, {autoAlpha:1, opacity:1, ease: Quad.easeIn, force3D:true});
    TweenLite.fromTo(menuWrapper, .9, {opacity:0, y:30}, {opacity:1, y:0, ease:Expo.easeOut, force3D:true});
    TweenMax.to(menuElemToHide, .15, {autoAlpha:0, opacity:0, ease: Quad.easeIn, delay:.1});
    TweenLite.to(thisExit, .5, {opacity:1, autoAlpha: 1, ease: Quad.easeIn});
    $('body').addClass('formOpen');

    $(thisExit).on('click', function() {
      TweenMax.to(thisAttr, .2, {autoAlpha:0, opacity:0, ease: Quad.easeIn, delay:.1});
      TweenLite.fromTo(menuWrapper, .8, {opacity:1, y:0}, {opacity:0, y:50, ease:Expo.easeOut});
      TweenMax.to(menuElemToHide, .15, {autoAlpha:1, opacity:1, ease: Quad.easeIn, delay:.1});
      TweenLite.to(thisExit, .5, {opacity:0, autoAlpha: 0, ease: Quad.easeOut});
      $('body').removeClass('formOpen');
    });

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



// Select all links with hashes and scroll to
$('.article-anchor').click(function(event) {
  if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
    var target = $(this.hash);
    target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
    if (target.length) {
      event.preventDefault();
      $('html, body').animate({
        scrollTop: target.offset().top
      }, 1000);
    }
  }
});


// Check for mobile devices
var isMobile = {
  Android: function() {
    return navigator.userAgent.match(/Android/i);
  },
  BlackBerry: function() {
    return navigator.userAgent.match(/BlackBerry/i);
  },
  iOS: function() {
    return navigator.userAgent.match(/iPhone|iPad|iPod/i);
  },
  Opera: function() {
    return navigator.userAgent.match(/Opera Mini/i);
  },
  Windows: function() {
    return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
  },
  any: function() {
    return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
  }
};

if (isMobile.any()) {
  $('body').removeClass('using-mouse');
} else {
  $('body').addClass('using-mouse');
}



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
