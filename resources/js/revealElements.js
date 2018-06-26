import $ from 'jquery';
import {TweenMax, Power2, TimelineLite} from "gsap";
import inview from 'jquery-inview';

export default function init() {
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
}
