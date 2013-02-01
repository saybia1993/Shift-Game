// flashEffects.js
// Contains functions that flash the game screen
// in different ways using a 2nd overlay canvas.

var flashFX = (function FX(){

    var fxCanvas;
    var fxCtx;

    return {
        initialize: function() {
            fxCanvas = document.createElement("canvas");
            document.body.appendChild(fxCanvas);
            fxCtx = fxCanvas.getContext("2d");

            fxCanvas.setAttribute('style', 'position: absolute; z-index: 2;');

            fxCanvas.width = window.innerWidth;
            fxCanvas.height = window.innerHeight;
        }
        ,
        deleteCanvas: function() {
            document.body.removeChild(fxCanvas);
        }
        ,
        fadeIn: function(color) {
            fxCtx.fillStyle = color;
            fxCtx.fillRect(0, 0, fxCanvas.width, fxCanvas.height);

            var interval = setInterval(function() {
                if (fxCtx.globalAlpha > .06) {
                    fxCtx.globalAlpha -= .06;

                    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
                    fxCtx.fillRect(0, 0, fxCanvas.width, fxCanvas.height);
                }
                else {
                    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
                    clearInterval(interval);
                }
            }, 20);
        }
        ,
        fadeOut: function(color, midpointFunction) {
            fxCtx.fillStyle = color;
            fxCtx.fillRect(0, 0, fxCanvas.width, fxCanvas.height);

            var interval = setInterval(function() {
                if (fxCtx.globalAlpha < .90) {
                    fxCtx.globalAlpha += 0.1;

                    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
                    fxCtx.fillRect(0, 0, fxCanvas.width, fxCanvas.height);
                }
                else {
                    midpointFunction();
                    clearInterval(interval);
                }
            }, 20);
        }
        ,
        flash: function(color, riseFlashAdder, fallFlashAdder, finishFlag, midpointFunction) {
            if (finishFlag != undefined) {
                finishFlag.value = true;
            }

            fxCanvas.width = window.outerWidth;
            fxCanvas.height = window.outerHeight;
            fxCtx.fillStyle = color;
            fxCtx.globalAlpha = 0;

            var interval = setInterval(function() {
                if (fxCtx.globalAlpha < riseFlashAdder * (1 / riseFlashAdder - 1)) {
                    fxCtx.globalAlpha += riseFlashAdder;

                    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
                    fxCtx.fillRect(0, 0, fxCanvas.width, fxCanvas.height);
                }
                else {
                    if (midpointFunction != undefined) {
                        midpointFunction();
                    }

                    clearInterval(interval);
                    var interval2 = setInterval(function() {
                        if (fxCtx.globalAlpha > fallFlashAdder) {
                            fxCtx.globalAlpha -= fallFlashAdder;
                            // ctx.fillStyle = get_random_color();

                            fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
                            fxCtx.fillRect(0, 0, fxCanvas.width, fxCanvas.height);
                        }
                        else {
                            fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
                            clearInterval(interval2);
                            if (finishFlag != undefined) {
                                finishFlag.value = false;
                            }
                        }
                    }, 25)
                }
            }, 25);
        }

    }

}())