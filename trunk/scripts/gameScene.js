//gameScene.js
//Contains the scene in
//which the game is played.
//Level initializations and
//room-switching occurs here.

(function() {

    Crafty.scene("gameScreen", function() {
        // When the first level is loaded, initialize everything in here.
        if (GLOBAL.firstLevel) {
            Audio.stop("start");

            // CHANGE LEVEL HERE -------------------------------------------------------->
            GLOBAL.currentLevel = level.spawnRoom;
            // CHANGE LEVEL HERE -------------------------------------------------------->
            GLOBAL.evilOnLeft = false;
            GLOBAL.unlockedDoors = [];
            GLOBAL.p1EntrancePosition = [GLOBAL.viewport.w / 4 - GLOBAL.tileW, GLOBAL.viewport.h / 2];
            GLOBAL.p2EntrancePosition = [GLOBAL.viewport.w / 4 * 3 - GLOBAL.tileW, GLOBAL.viewport.h / 2];

            flashFX.initialize();
            lightFX.initialize();
            var player1 = Crafty.e("2D, Canvas, I_player1, Player, FlashLight, Persist, Halo")
                .attr({w: GLOBAL.tileW - 2 * GLOBAL.delta, h: GLOBAL.tileW - 2 * GLOBAL.delta, z: 10, path : [{x:0,y:0}]})
                .player(1);

            var player2 = Crafty.e("2D, Canvas, I_player2, Player, FlashLight, Persist, Halo")
                .attr({w: GLOBAL.tileW - 2 * GLOBAL.delta, h: GLOBAL.tileW - 2 * GLOBAL.delta, z: 10, path : [{x:0,y:0}]})
                .player(2);

            player1.x = GLOBAL.p1EntrancePosition[0];
            player1.y = GLOBAL.p1EntrancePosition[1];
            player2.x = GLOBAL.p2EntrancePosition[0];
            player2.y = GLOBAL.p2EntrancePosition[1];

            Crafty.bind("EnterFrame", function lightingFX() {
                lightFX.loadStaticLights();
                Crafty.trigger("DoLighting", null);
            })

            // INSTANTIATE TEST OBJECTS HERE!------------------------------------------------------>

            // STOP INSTANTIATING TEST OBJECTS HERE!----------------------------------------------->

            // Is lighting on or off.
            var lightingOn = true;

            // Bind Dimension switch to key.
            var currentlyShifting = { value: false };
            player1.bind("KeyDown", function(e) {
                if (e.key == Crafty.keys['SPACE'] && !currentlyShifting.value){
                    currentlyShifting.value = true;
                    Audio.playSound("shift");
                    flashFX.flash("#FFFFFF", 0.1, 0.06, currentlyShifting, function(){
                        switchDimensions(player1, player2);

                        if (GLOBAL.evilOnLeft) {
                            GLOBAL.evilOnLeft = false;
                        }
                        else {
                            GLOBAL.evilOnLeft = true;
                        }
                    })

                    //player1.HP -= 10;
                    //player2.HP -= 10;
                }

                // Debug key
                else if (e.key == Crafty.keys['Y']) {
                    if (lightingOn) {
                        lightFX.hideCanvas();
                        lightingOn = false;
                    }
                    else {
                        lightFX.showCanvas();
                        lightingOn = true;
                    }
                }
            });
            flashFX.fadeIn("#000000");

            GLOBAL.firstLevel = false;
        }

        Audio.stop(GLOBAL.currentBGM);
        switch(GLOBAL.currentLevel){
            case level.ghostlyWallRoom1:
                GLOBAL.currentBGM = "goblinSound";
                Audio.playMusic(GLOBAL.currentBGM);
                break;
            case level.ghostlyWallRoom2:
                GLOBAL.currentBGM = "goblinSound";
                Audio.playMusic(GLOBAL.currentBGM);
                break;
            case level.ghostlyWallRoom3:
                GLOBAL.currentBGM = "goblinSound";
                Audio.playMusic(GLOBAL.currentBGM);
                break;
            case level.spawnRoom:
                GLOBAL.currentBGM = "eerieSynth";
                Audio.playMusic(GLOBAL.currentBGM);
                break;
            case level.statueRoom:
                GLOBAL.currentBGM = "pianoEnd";
                Audio.playMusic(GLOBAL.currentBGM);
                break;
            case level.kitchenPuzzle:
                GLOBAL.currentBGM = "pianoEnd";
                Audio.playMusic(GLOBAL.currentBGM);
                break;
            default:
        }

        generateRoom();

        if (GLOBAL.evilOnLeft) {
            switchDimensions(player1, player2);
        }

        //set target of objects that have target
        Crafty("HasTarget").each(function() {
            this.resetTarget();
        });
        Audio.stop("blobbyTracking");
        Audio.playSound("doorClosing");

    });

    function generateRoom() {
        var curLevel = Crafty.e("TiledLevel").tiledLevel(GLOBAL.currentLevel.room, "Canvas");
        curLevel.initMatrices();
        curLevel.neutralTiles = [];
        curLevel.dangerousTiles = [];
        function putIntoWorlds(object) {
            //console.log(curLevel.neutralTiles.length + 'before');
            //object.alpha = 0;
            curLevel.getRelevantTiles(object).push(object);
            //console.log(curLevel.neutralTiles.length + 'after');
        }

        // Generate matrix, prepare for lighting
        Crafty("MapTile").each(function() {
            putIntoWorlds(this);
        });

        // Set lighted tiles and light them
        lightFX.reset();
        lightFX.resetLightMap();
        lightFX.createDarkMap();
        Crafty("Lamp").each(function() {
//            this.lightedTiles = curLevel.getRelevantTiles(this);
            lightFX.createLightMap(this.x + this.w /2, this.y + this.h / 2, 30);
            //this.light();
        });
        // Static lighting
        // Obtained alphas from light
        Crafty("MapTile").each(function() {
            this.defaultAlpha = this.alpha;
        });

        Crafty("FlashLight").each(function() {
//            this.lightedTiles = curLevel.getRelevantTiles(this);
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
                    if (doorList[i].connectedRoom === undefined){
                        alert("Couldn't find level!");
                    }

                    doorList[i].connectedDoor = GLOBAL.currentLevel.doors[j].connectedDoor;
                    doorList[i].entranceDirection = GLOBAL.currentLevel.doors[j].entranceDirection;

                    break; // Break out of inner loop.
                }
            }
            doorList[i].linkDoor(doorList);
        }

        var moveableObjList = [];
        Crafty("Moveable").each(function() {
            moveableObjList.push(this);
        });

        for (var i = 0; i < moveableObjList.length; i++) {
            moveableObjList[i].linkObjects(moveableObjList);
        }
    }

    function switchDimensions(player, player2) {
        var neutralTiles = [];
        var dangerousTiles = [];
        //find tiles
        if (GLOBAL.evilOnLeft) {
            Crafty("MapTile").each(function() {
                //tiles in the left half move to right
                objSwitchDimension(this);
                if (objInLeftSide(this)) {
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
                if (objInLeftSide(this)) {
                    dangerousTiles.push(this);
                }
                else {
                    neutralTiles.push(this);
                }
            });
        }

        Crafty("Player").each(function() {
            this.path = [];
        });

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