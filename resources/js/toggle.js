import $ from 'jquery';
import {TweenMax, Power2, TimelineLite} from "gsap";

function toggleActive(elem){
  elem.classList.toggle('active');
}

document.getElementById('menu__toggle').onclick = function() {
  toggleActive(this);
  if( $(this).hasClass('active') ){
    TweenMax.to($("#menu"), .4, {autoAlpha:1, opacity:1, ease: Power4.easeIn});
  } else {
    TweenMax.to($("#menu"), .4, {autoAlpha:0, opacity:0, ease: Power4.easeIn});
  }
}
