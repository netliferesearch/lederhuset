import '../scss/main.scss';
import './toggle'

//plugins
import $ from 'jquery';
import {TweenMax, Power2, TimelineLite} from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import Typed from 'typed.js';

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
 });

 // Autocomplete
 $("#search__form input").on('keyup', function(event) {
   var val = this.value;
   if (val.length > 0){
    TweenMax.set($("#results"), {opacity:0, autoAlpha:0, y:20});

    var $form = $(this),
      url = $form.attr("action");
  
    $.get(url, {q: val}).done(function(data) {
      var content = data;
      TweenMax.to($("#results"), .5, {autoAlpha:1, y:0, opacity:1, ease: Circ.easeOut});
      $("#results").html(content);
    });
   } else {
    console.log("fail", this);
   }
 });

// Typed.js
var options = {
  strings: [
    "Søk etter ferie ...",
    "Søk etter ansettelse ...",
    "Søk etter ledelse ..."
  ],
  typeSpeed: 40,
  loop: true,
  attr: 'placeholder',
};
new Typed("#search__field", options);