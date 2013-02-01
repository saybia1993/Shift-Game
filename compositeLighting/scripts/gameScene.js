//gameScene.js
//Contains the scene in
//which the game is played.
//Level initializations and
//room-switching occurs here.

(function() {

    Crafty.scene("gameScreen", function() {

        if (GLOBAL.firstLevel) {
            Audio.stop("start");
            Audio.playMusic("bgm");

            var lightCanvas = document.createElement("canvas");
            lightCanvas.setAttribute("id", "lightCanvas");
            document.body.appendChild(lightCanvas);
            GLOBAL.lightCtx = lightCanvas.getContext('2d');
            var lightCtx = GLOBAL.lightCtx;

            var doc = document.getElementsByTagName('div');
            doc[1].appendChild(lightCanvas);

            var fxCanvas = document.createElement("canvas");
            document.body.appendChild(fxCanvas);
            var fxCtx = fxCanvas.getContext("2d");

            lightCanvas.setAttribute('style', 'position: absolute; z-index: 0;');
            fxCanvas.setAttribute('style', 'position: absolute; z-index: 0;');

            fxCanvas.width = window.innerWidth;
            fxCanvas.height = window.innerHeight;
            fxCtx.fillStyle = "#000000";
            fxCtx.fillRect(0, 0, fxCanvas.width, fxCanvas.height);

            lightCanvas.width = GLOBAL.viewport.w;
            lightCanvas.height = GLOBAL.viewport.h;
            lightCtx.fillStyle = "#000000";
            lightCtx.globalAlpha = 1;
            lightCtx.fillRect(0, 0, lightCanvas.width, lightCanvas.height);

//            lightCtx.save();

            lightCtx.globalCompositeOperation = "destination-out";
            lightCtx.beginPath();
            lightCtx.arc(300, 300, 100, 0, Math.PI*2, false);
            lightCtx.globalAlpha = .8;
            lightCtx.fill();

//            lightCtx.restore();

            player = Crafty.e("2D, Canvas, I_player, Player, FlashLight, Persist")
                .attr({w: GLOBAL.tileW - 2 * GLOBAL.delta, h: GLOBAL.tileW - 2 * GLOBAL.delta, z: 10, path : [{x:0,y:0}]})
                .player(1);

            player2 = Crafty.e("2D, Canvas, I_player, Player, FlashLight, Persist")
                .attr({x: GLOBAL.viewport.w, w: GLOBAL.tileW - 2 * GLOBAL.delta, h: GLOBAL.tileW - 2 * GLOBAL.delta, z: 10, path : [{x:0,y:0}]})
                .player(2);

            var lever = Crafty.e("2D, Canvas, Switch")
                .attr({x:150, y:150, w:25,h:25,z:9});
            var fire1 = Crafty.e("2D, Canvas, Fire1")
                .attr({x:175, y:175, w:25,h:25,z:4})
                .setRelatedLever(lever);
            var fire2 = Crafty.e("2D, Canvas, Fire2")
                .attr({x:175, y:100, w:25,h:25,z:4})
                .setRelatedLever(lever);
            var currentlyShifting = false;

            //create lighting bind

            this.bind('EnterFrame', function() {
                var lightCtx = GLOBAL.lightCtx;
                lightCtx.globalAlpha = 1;
                lightCtx.globalCompositeOperation = "source-over";
                lightCtx.fillRect(0, 0, GLOBAL.viewport.w, GLOBAL.viewport.h);
                Crafty.trigger('DoLighting',null)
            });

            this.bind("KeyDown", function(e) {
                // Flash the screen.
                if (e.key === Crafty.keys['SPACE'] && !currentlyShifting){
                    currentlyShifting = true;

                    fxCanvas.width = window.outerWidth;
                    fxCanvas.height = window.outerHeight;
                    fxCtx.fillStyle = "#FFFFFF";
                    fxCtx.globalAlpha = 0;

                    var interval = setInterval(function() {
                        if (fxCtx.globalAlpha < .90) {
                            fxCtx.globalAlpha += 0.1;

                            fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
                            fxCtx.fillRect(0, 0, fxCanvas.width, fxCanvas.height);
                        }
                        else {
                            switchDimensions();


                            if (GLOBAL.evilOnLeft) {
                                GLOBAL.evilOnLeft = false;
                            }
                            else {
                                GLOBAL.evilOnLeft = true;
                            }
//
                            clearInterval(interval);
                            var interval2 = setInterval(function() {
                                if (fxCtx.globalAlpha > 0.06) {
                                    fxCtx.globalAlpha -= 0.06;

                                    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
                                    fxCtx.fillRect(0, 0, fxCanvas.width, fxCanvas.height);
                                }
                                else {
                                    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
                                    clearInterval(interval2);
                                    currentlyShifting = false;
                                }
                            }, 25)
                        }
                    }, 25);
                }


            });

            GLOBAL.firstLevel = false;

//            if(GLOBAL.currentLevel != GLOBAL){
//                Crafty.scene("endingScreen");
//            }

            // Fade in screen
            var interval = setInterval(function() {
                if (fxCtx.globalAlpha > .06) {
                    fxCtx.globalAlpha -= 0.06;

                    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
                    fxCtx.fillRect(0, 0, fxCanvas.width, fxCanvas.height);
                }
                else {
                    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
                    clearInterval(interval);
                }
            }, 20);
        }

        generateRoom();

        if (GLOBAL.evilOnLeft) {
            switchDimensions();
        }

        //set target of objects that have target
        Crafty("HasTarget").each(function() {
            this.resetTarget();
        });

    });

    function generateRoom() {
        var curLevel = Crafty.e("TiledLevel").tiledLevel(GLOBAL.currentLevel.room, "Canvas");
        curLevel.initMatrices();
        curLevel.neutralTiles = [];
        curLevel.dangerousTiles = [];
        function putIntoWorlds(object) {
            //console.log(curLevel.neutralTiles.length + 'before');
            object.alpha = 0;
            curLevel.getRelevantTiles(object).push(object);
            //console.log(curLevel.neutralTiles.length + 'after');

        }

        // Generate matrix, prepare for lighting
        Crafty("MapTile").each(function() {
            putIntoWorlds(this);
        });

        // Set lighted tiles and light them
        Crafty("Lamp").each(function() {
            this.lightedTiles = curLevel.getRelevantTiles(this);
            this.light();
        });
        // Static lighting
        // Obtained alphas from light
        Crafty("MapTile").each(function() {
            this.defaultAlpha = this.alpha;
        });

        Crafty("FlashLight").each(function() {
            this.lightedTiles = curLevel.getRelevantTiles(this);
        });

        var doorList = [];
        Crafty("Door").each(function() {
            doorList.push(this);
        });

        for (var i = 0; i < doorList.length; i++) {
            // GLOBAL.currentLevel is a reference to the doors the level should have.
            for (var j = 0; j < GLOBAL.currentLevel.doors.length; j++) {
                // If this door has theoretical level equivalent.
                if (GLOBAL.currentLevel.doors[j].coor[0] === doorList[i].x &&
                    GLOBAL.currentLevel.doors[j].coor[1] === doorList[i].y) {
                    //A trick that converts string to attribute name
                    doorList[i].connectedRoom = level[GLOBAL.currentLevel.doors[j].connectedRoom];
                    if(doorList[i].connectedRoom === undefined){
                        alert("Couldn't find level!");
                    }

                    doorList[i].connectedDoor = GLOBAL.currentLevel.doors[j].connectedDoor;
                    doorList[i].entranceDirection = GLOBAL.currentLevel.doors[j].entranceDirection;

                    break; // Break out of inner loop.
                }
            }
            doorList[i].linkDoor(doorList);
        }
    }

    function switchDimensions() {

        // Reset lighted tiles of each side to nonlit alphas.
        var tileLen = player.lightedTiles.length;
        for (var i = tileLen; i--;) {
            player.lightedTiles[i].alpha = player.lightedTiles[i].defaultAlpha;
        }
        tileLen = player2.lightedTiles.length;
        for (var i = tileLen; i--;) {
            player2.lightedTiles[i].alpha = player2.lightedTiles[i].defaultAlpha;
        }

        var neutralTiles = [];
        var dangerousTiles = [];
        //find tiles
        if (GLOBAL.evilOnLeft) {
            Crafty("MapTile").each(function() {
                //tiles in the left half move to right
                objSwitchDimension(this);
                if(objInLeftSide(this)) {
                    neutralTiles.push(this);
                }
                else {
                    dangerousTiles.push(this);
                }
            });
        }
        else {
            Crafty("MapTile").each(function() {
                //tiles in the left half move to right
                objSwitchDimension(this);
                if(objInLeftSide(this)) {
                    dangerousTiles.push(this);
                }
                else {
                    neutralTiles.push(this);
                }
            });
        }

        Crafty("FlashLight").each(function() {
            if (this.x < GLOBAL.viewport.w / 2) {
                if (GLOBAL.evilOnLeft) {
                    this.lightedTiles = neutralTiles;
                }
                else {
                    this.lightedTiles = dangerousTiles;
                }
            }
            else {
                if (GLOBAL.evilOnLeft) {
                    this.lightedTiles = dangerousTiles;
                }
                else {
                    this.lightedTiles = neutralTiles;
                }
            }
        });

        // Call the lighting algorithm once.
  //      player.light();
    //    player2.light();

        //reset target of objects that have target
        Crafty("HasTarget").each(function() {
            this.resetTarget();
        });

        //clear the path record of players
       // player.path = [{x:0,y:0}];
       // player2.path = [{x:0,y:0}];

        //reset target of objects that have target
        Crafty("Blobby").each(function() {
            this.startToWander();
        });
    }

})();