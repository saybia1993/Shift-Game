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

        if (document.getElementsByTagName("table")[1] == undefined)
            generateDebugTable();

        // Add menu music here.
        Audio.playMusic("start");
        Crafty.scene("loadScreen");
    });

    function generateDebugTable() {
        var table = document.createElement("table");
        table.border = "1px";
        table.style.position = "fixed";
        table.style.bottom = "5%";
        table.style.left = "50%";

        document.body.appendChild(table);

        var key = document.createElement("tr");
        var value = document.createElement("tr");
        table.appendChild(key);
        table.appendChild(value);

        var lightingKey = document.createElement("th");
        lightingKey.innerHTML = "Light On/Off";
        var lightingValue = document.createElement("th");
        lightingValue.innerHTML = "Y";
        key.appendChild(lightingKey);
        value.appendChild(lightingValue);

        var health = document.createElement("th");
        health.innerHTML = "HEALTH";
        key.appendChild(health);
        // GLOBAL
        healthValue = document.createElement("th");
        value.appendChild(healthValue);
        healthValue.innerHTML = "???";
    }

})();