import $ from 'jquery';
import {TweenMax, Power2, TimelineLite} from "gsap";
import Fuse from 'fuse.js'

export default function init() {
  var result, fuse, tosearch,
      searchfield = $('#mainSearch, #resourcesSearch'),
      closeSearch = $('#searchClose'),
      placeholderText = $(searchfield).attr('placeholder'),
      fadeOutContent = $('#page-header .menu__non-nav-inner, #allEntries, #allFormEntries, #virke-header .virke-header__wrapper'),
      tl = new TimelineLite({onReverseComplete:emptySearch, paused:true});
      tl.to($("#searchResults ul, #resourcesSearchResults ul"), .3, {y:0, opacity:1, ease:Quad.easeOut});

  // get search data from json api
  var data = $.ajax({
    url: "/api.json",
  });

  var resourcesData = $.ajax({
    url: "/resourcesApi.json",
  });

  var companyData = $.ajax({
    url: "https://data.brreg.no/enhetsregisteret/api/enheter",
  });

  console.log(companyData);

  // fuse options for search
  var options = {
    shouldSort: true,
    threshold: 0.4,
    location: 0,
    findAllMatches: true,
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
    $('.list__item--hover, .list__link--hover, .accordion__button, .list__item--resources').each(function(){
      var listItemLink;

      if ( $(this).hasClass('a-toggle__button') ) {
        listItemLink = $(this).find('span');
      } else if ( $(this).is('.a-list-toggle__button') ) {
        listItemLink = $(this).find('span');
      } else if ( $(this).is('.list__item--resources') ) {
        listItemLink = $(this).find('.list__title');
      } else if ( $(this).is('.list__link--hover') ) {
        listItemLink = $(this);
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
          $("#resourcesSearchResults ul").append("<li class=\"list__item list__item--resources\"><a class='font-neutral paragraph pb--xsmall pt--xsmall-optical' href='"+ value.file +"' class='font-neutral'>" + "<span class='list__title'>" + value.title + "<span class='list__description'>" + value.description + "</span></span><svg class='list__arrow-download search__arrow-download arrow-download' width='20' height='30' viewBox='0 0 171 254'><path d='M102.6,168.6h67.6l-84.4,84.8L0.6,168.6H69V0.2h33.6V168.6z'/></svg>" + "</a></li>");
        } else {
          $("#searchResults ul").append("<a class='list__item pb--xsmall pt--xsmall-optical paragraph list__link--hover' href='"+ value.url +"' class='font-neutral'>" + value.title + "</a>");
        }
        return index<7;
      });
      listItemHoverEffect();
    }
  }

  $('#mainSearchWrapper').submit(function(event) {
    event.preventDefault();
    $("#searchResults ul li:first-child").addClass('active');
    TweenMax.to($("#searchResults ul li:first-child a"), .25, {x:15, ease: Expo.easeOut});
  });

  listItemHoverEffect();
}
