//TODO: Make this code more readable
var lightFX = (function lightingFX() {

    var lightCanvas;
    var lightCtx;
    var staticLightingImage;
    var staticCtx;
    var SAMPLES = 10;
    return {
        initialize: function() {
                lightCanvas = document.createElement("canvas");
                document.body.appendChild(lightCanvas);
                lightCtx = lightCanvas.getContext("2d");

                lightCanvas.setAttribute('style', 'position: absolute; z-index: 1;');
                var doc = document.getElementsByTagName('div');
                doc[1].appendChild(lightCanvas);
                lightCanvas.width = GLOBAL.viewport.w;
                lightCanvas.height = GLOBAL.viewport.h;
                lightCtx.globalAlpha = 1;
                lightCtx.globalCompositeOperation = "destination-out";
                staticLightingImage = document.createElement("canvas");
                staticLightingImage.width = lightCanvas.width;
                staticLightingImage.height = lightCanvas.height;

//                staticLightingImage.setAttribute('style', 'position: absolute; z-index: -1;');
  //              doc[1].appendChild(staticLightingImage);
                staticCtx = staticLightingImage.getContext("2d");
        },

        reset:function () {
            lightCtx.globalAlpha = 1;
            lightCtx.globalCompositeOperation = "destination-out";
            lightCtx.fillRect(0, 0, lightCanvas.width, lightCanvas.height);
        },

        deleteCanvas: function() {
            var doc = document.getElementsByTagName('div');
            doc[1].removeChild(lightCanvas);
            delete staticLightingImage;
        },

        hideCanvas: function() {
            lightCanvas.style.display = "none";
        },

        showCanvas: function() {
            lightCanvas.style.display = "inline";
        },

        loadStaticLights: function() {
            this.reset();
            lightCtx.globalCompositeOperation = "source-over";
            lightCtx.globalAlpha = 1;
            lightCtx.drawImage(staticLightingImage,0,0);
        },

        createDarkMap: function() {
            staticCtx.clearRect(0,0,staticLightingImage.width, staticLightingImage.height);
            staticCtx.globalCompositeOperation = "source-over";
            staticCtx.globalAlpha = 1;
            staticCtx.fillRect(0,0,staticLightingImage.width,staticLightingImage.height);
        },

        createLightMap: function(x, y, radius) {
            staticCtx.globalCompositeOperation = "destination-out";
            staticCtx.globalAlpha = .025;
            staticCtx.save();
            //staticCtx.fillRect(0, 0, lightCanvas.width, lightCanvas.height);
            if (x < lightCanvas.width / 2) {
                staticCtx.beginPath();
                staticCtx.lineTo(0,0);
                staticCtx.lineTo(lightCanvas.width / 2,0);
                staticCtx.lineTo(lightCanvas.width / 2, lightCanvas.height);
                staticCtx.lineTo(0, lightCanvas.height);
                staticCtx.lineTo(0,0);
                staticCtx.closePath();
                staticCtx.clip();
            } else {
                staticCtx.beginPath();
                staticCtx.lineTo(lightCanvas.width / 2,0);
                staticCtx.lineTo(lightCanvas.width,0);
                staticCtx.lineTo(lightCanvas.width, lightCanvas.height);
                staticCtx.lineTo(lightCanvas.width / 2, lightCanvas.height);
                staticCtx.lineTo(lightCanvas.width / 2, 0);
                staticCtx.closePath();
                staticCtx.clip();
            }

            for (var sample = 0; sample < SAMPLES * 8; sample++) {
                staticCtx.beginPath();
                staticCtx.arc(x, y, sample, 0, Math.PI * 2, false);
                staticCtx.closePath();
                staticCtx.fill();
            }
            staticCtx.globalAlpha = .01;

            for (var sample = 0; sample < SAMPLES * 4; sample++) {
                staticCtx.beginPath();
                staticCtx.arc(x, y, sample + radius + 25, 0, Math.PI * 2, false);
                staticCtx.closePath();
                staticCtx.fill();
            }
            staticCtx.restore();

        },
        resetLightMap: function() {
            staticLightingImage.getContext("2d").fillRect(0,0,staticLightingImage.width, staticLightingImage.height);
        },

        createLightCircle: function(x, y, radius) {
            lightCtx.globalCompositeOperation = "destination-out";
            lightCtx.globalAlpha = .05;

            //Clips light that extends to other side of the canvas
            lightCtx.save();

            if (x < lightCanvas.width / 2) {
                lightCtx.beginPath();
                lightCtx.lineTo(0,0);
                lightCtx.lineTo(lightCanvas.width / 2,0);
                lightCtx.lineTo(lightCanvas.width / 2, lightCanvas.height);
                lightCtx.lineTo(0, lightCanvas.height);
                lightCtx.lineTo(0,0);
                lightCtx.closePath();
                lightCtx.clip();
            } else {
                lightCtx.beginPath();
                lightCtx.lineTo(lightCanvas.width / 2,0);
                lightCtx.lineTo(lightCanvas.width,0);
                lightCtx.lineTo(lightCanvas.width, lightCanvas.height);
                lightCtx.lineTo(lightCanvas.width / 2, lightCanvas.height);
                lightCtx.lineTo(lightCanvas.width / 2, 0);
                lightCtx.closePath();
                lightCtx.clip();
            }


            for (var sample = 0; sample < SAMPLES; sample++) {
                lightCtx.beginPath();
                lightCtx.arc(x, y, sample * 2 + radius, 0, Math.PI * 2, false);
                lightCtx.closePath();
                lightCtx.fill();
            }
            lightCtx.restore();
        },
        createLightCone: function(x, y, direction, length) {
            var angle = Math.PI / 2;

            //Clips light that extends to other side of the canvas
            lightCtx.save();
            if (x < lightCanvas.width / 2) {
                lightCtx.beginPath();
                lightCtx.lineTo(0,0);
                lightCtx.lineTo(lightCanvas.width / 2,0);
                lightCtx.lineTo(lightCanvas.width / 2, lightCanvas.height);
                lightCtx.lineTo(0, lightCanvas.height);
                lightCtx.lineTo(0,0);
                lightCtx.clip();
            } else {
                lightCtx.beginPath();
                lightCtx.lineTo(lightCanvas.width / 2,0);
                lightCtx.lineTo(lightCanvas.width,0);
                lightCtx.lineTo(lightCanvas.width, lightCanvas.height);
                lightCtx.lineTo(lightCanvas.width / 2, lightCanvas.height);
                lightCtx.lineTo(lightCanvas.width / 2, 0);
                lightCtx.clip();
            }

            if (direction === GLOBAL.direction.right) {
                angle = 0;
            }
            else if (direction === GLOBAL.direction.left) {
                angle = Math.PI;
            }
            else if (direction === GLOBAL.direction.up) {
                angle = -Math.PI / 2;
            }
            else if (direction === GLOBAL.direction.down) {
                angle = Math.PI / 2;
            }
            lightCtx.globalAlpha = .08;

            for (var sample = 0; sample < SAMPLES; sample++) {
                //draw cone for flashlight
                lightCtx.beginPath();
                lightCtx.lineTo(x, y);
                //ccwx == counterclockwise
                var cwx = x + (length + sample*2) * (Math.cos(angle + Math.PI/8 - sample / (30*Math.PI)));
                var ccwx = x + (length + sample*2) * (Math.cos(angle - Math.PI/8 + sample / (30*Math.PI)));


                lightCtx.lineTo(cwx, y +(length + sample*2) * (Math.sin(angle + Math.PI/8 - sample / (30*Math.PI ))));
                lightCtx.lineTo(ccwx, y + (length + sample*2) * (Math.sin(angle - Math.PI/8 + sample / (30*Math.PI ))));
                lightCtx.lineTo(x, y);
                lightCtx.closePath();
                lightCtx.fill();
            }
            lightCtx.restore();
        }

    }

}())