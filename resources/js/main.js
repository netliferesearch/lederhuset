import '../scss/main.scss';
import './toggle'

//plugins
import $ from 'jquery';
import {TweenMax, Power2, TimelineLite} from "gsap";
import ScrollToPlugin from "gsap/ScrollToPlugin";

$(".menu__search-input").one( "click", function() {
  $('#searchTags').focus();
  TweenMax.to($("#search"), .5, {autoAlpha:1, opacity:1, ease: Power4.easeIn});
});

$('#startSearch').click(function(){
  var data = {
    action: 'ajaxsearch/controllers/AjaxSearch_SearchEntryController',
    options: $("#searchTags").val()
  };
    $.ajax({
       type: "post",
       url: '/',
       data: data,
       success: function(response){
         alert('test');
       },
       error: function (jqXHR, exception) {
         var msg = '';
         if (jqXHR.status === 0) {
           msg = 'Not connect.\n Verify Network.';
         } else if (jqXHR.status == 404) {
           msg = 'Requested page not found. [404]';
         } else if (jqXHR.status == 500) {
           msg = 'Internal Server Error [500].';
         } else if (exception === 'parsererror') {
           msg = 'Requested JSON parse failed.';
         } else if (exception === 'timeout') {
           msg = 'Time out error.';
         } else if (exception === 'abort') {
           msg = 'Ajax request aborted.';
         } else {
           msg = 'Uncaught Error.\n' + jqXHR.responseText;
         }
         console.log(msg)
       }
   });
});
