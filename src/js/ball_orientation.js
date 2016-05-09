/**
 * Created by wrynnsun on 2016/4/21.
 */
$(document).ready(function(){
    let $ball = $('.ball');
    let $log = $('.log');
    let halfHeight = $(window).height() / 2;
    let halfWidth = $(window).width() / 2;

    function handleOrientation(event) {
        //hanld gamma
        let gamma = max90Angle(event.gamma);
        let gammaPercent = gamma/90;
        //handle beta
        let beta = max90Angle(event.beta);
        let betaPercent = beta / 90;
        //hsow current gamma and beta
        let text = 'gamma:' + gammaPercent + '\n' +
            'beta:' + betaPercent;
        $log.text(text);

        //caculate the tranform
        let tranformY = betaPercent * halfHeight;
        let tranformX = gammaPercent * halfWidth;

        //setTranslate($ball[0], tranformX, tranformY);
        //requestAnimationFrame(setTranslate($ball[0], tranformX, tranformY));
        setTimeout(function () {
            setTranslate($ball[0], tranformX, tranformY);
        },1000/60);

    }

    function max90Angle(angle) {
        angle > 90 ? angle = 90 : angle = angle;
        angle < -90 ? angle = -90 : angle = angle;
        return angle;
    }

    function setTranslate (elem,x,y) {
        let tranformText = 'translate3d(' + x + 'px,'+ y +'px,0)';
        elem.style.transform = tranformText;
        elem.style['-weblit-transfrom'] = tranformText;
    }

    function setRequestAnimationFrame(){
        return requestAnimationFrame ||
            webkitRequestAnimationFrame ||
            mozRequestAnimationFrame ||
            oRequestAnimationFrame ||
            msRequestAnimationFrame ||
            setTimeout(callback,)

    }

    window.addEventListener('deviceorientation', handleOrientation, false);
});

if(document.all && !document.setTimeout.isPolyfill){
    let __nativeST__ = window.setTimeout;
    window.setTimeout = function (callBack,delay) {
        let args = Array.prtotype.slice.call(arguments, 2);
        return __nativeST__(callBack instanceof Function ? function () {
            callBack.apply(null, args);
        } : callBack, delay);
    };
}