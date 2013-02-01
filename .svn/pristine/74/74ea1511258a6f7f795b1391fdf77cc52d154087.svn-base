// game.js
// Contains the game initializations.

(function() {

    window.onload = (function () {
        Crafty.init(GLOBAL.viewport.w, GLOBAL.viewport.h);
        Crafty.canvas.init();

        // Set background color to black
        document.body.setAttribute("bgcolor", "#000000");

        // Center game screen
        var cr_stage = document.getElementById("cr-stage");
        cr_stage.style.top = "-325px";
        document.body.removeChild(cr_stage);

        var horizon = document.createElement("div");
        horizon.style.position = "absolute";
        horizon.style.top = "50%";
        horizon.style.width = "100%";
        document.body.appendChild(horizon);
        horizon.appendChild(cr_stage);

        // Add menu music here.
        Crafty.scene("startScreen");
    });

})();