/**
 * Created by wrynnsun on 2016/4/19.
 */
$('body').append('<p>'+navigator.userAgent+'</p>');
window.addEventListener('deviceorientation', function (e) {
    $('#beta').text(e.beta);
    $('#alpha').text(e.alpha);
    $('#gamma').text(e.gamma);
    $('#absolute').text(e.absolute);
},true);
var time = 0;
window.addEventListener('orientationchange', function () {
    $('#time').text(++time);
    $('#orientation').text(window.orientation);
});