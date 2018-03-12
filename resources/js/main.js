import '../scss/main.scss';
import './toggle'

//plugins
import $ from 'jquery';
import {TweenMax, Power2, TimelineLite} from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";

$(".menu__search-input").one( "click", function() {
  TweenMax.to($("#search"), .2, {autoAlpha:1, opacity:1, ease: Circ.easeOut, onComplete: focusSearch});
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

  $.post( url, {s: term}).done(function(data) {
    var content = data;
    TweenMax.to($("#results"), .5, {autoAlpha:1, y:0, opacity:1, ease: Circ.easeOut});
    $("#results").html(content);
  });
 });
