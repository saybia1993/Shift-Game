// worldObjects.js
// Contains components for entities
// that exist in the world and cannot
// be picked up by the players.

(function() {

    Crafty.c("Door", {
        playerAtDoor: false,
        // The three variables below are set
        // if the doors are successfully linked.
        connectedRoom: null,
        connectedDoor: null,
        entranceDirection: null,

        linkDoor: function(doorList) {
            var thisDoor = this;
            function getOtherDoor() {
                for (var i = 0; i < doorList.length; i++) {
                    if (doorList[i].x >= GLOBAL.viewport.w / 2 &&
                        thisDoor.x + GLOBAL.viewport.w / 2 === doorList[i].x &&
                        thisDoor.y === doorList[i].y) {
                        return doorList[i];
                    }
                }
                //No need return, null check is used if no door is returned below.
            }

            var otherDoor = getOtherDoor();
            if (otherDoor != null) {
                otherDoor.entranceDirection = this.entranceDirection;
            }

            this.bind("EnterFrame", function() {
                this.playerAtDoor = false;
            });

            // Get the tile in front of the door
            this.addComponent("Collision")
                .onHit("Player", function() {
                    this.playerAtDoor = true;
                    if (otherDoor != null && otherDoor.playerAtDoor) {
                        switch (this.entranceDirection) {
                            case 0:
                                GLOBAL.p1EntrancePosition = [this.connectedDoor[0], this.connectedDoor[1] - GLOBAL.tileW];
                                GLOBAL.p2EntrancePosition = [this.connectedDoor[0] + GLOBAL.viewport.w / 2, this.connectedDoor[1] - GLOBAL.tileW];
                                break;
                            case 1:
                                GLOBAL.p1EntrancePosition = [this.connectedDoor[0] + GLOBAL.tileW, this.connectedDoor[1]];
                                GLOBAL.p2EntrancePosition = [this.connectedDoor[0] + GLOBAL.viewport.w / 2 + GLOBAL.tileW, this.connectedDoor[1]];
                                break;
                            case 2:
                                GLOBAL.p1EntrancePosition = [this.connectedDoor[0], this.connectedDoor[1] + GLOBAL.tileW];
                                GLOBAL.p2EntrancePosition = [this.connectedDoor[0] + GLOBAL.viewport.w / 2, this.connectedDoor[1] + GLOBAL.tileW];
                                break;
                            case 3:
                                GLOBAL.p1EntrancePosition = [this.connectedDoor[0] - GLOBAL.tileW, this.connectedDoor[1]];
                                GLOBAL.p2EntrancePosition = [this.connectedDoor[0] + GLOBAL.viewport.w / 2 - GLOBAL.tileW, this.connectedDoor[1]];
                        }

                        GLOBAL.currentLevel = this.connectedRoom;

                        Crafty.scene("gameScreen");
                    }
                });
            }
    });

    Crafty.c("LockedDoor", function() {
//        this.addComponent("Door");
    });

    Crafty.c("WallDoor", {
        init: function() {
            this.z = 11;
            this.addComponent("Collision")
                .collision([2, 2], [23, 2], [23, 23], [2, 23])
                .onHit("Player", function(playerArray) {
                    var currentPlayer = playerArray[0].obj;
                    currentPlayer.x = currentPlayer.old_pos[0];
                    currentPlayer.y = currentPlayer.old_pos[1];
                });
        }
    });

    Crafty.c("Lamp", {
        lightedTiles : [],
        isOn : true,
        init: function(){
            this.z = 11;
            this.addComponent("Collision").onHit("Collides", function(obj) {

            });
        },

        //switch lamp
        interact : function() {
            if(this.isOn === true){
                this.isOn = false;
            }else{
                this.isOn = true;
            }
            // Set lighted tiles and light them
            Crafty("Lamp").each(function() {
                this.lightedTiles = Crafty("TiledLevel").getRelevantTiles(this);
                this.light();
            });
            // Static lighting
            // Obtained alphas from light
            Crafty("MapTile").each(function() {
                this.defaultAlpha = this.alpha;
            });
        },

        light: function() {
            var maxLightPower = 180;
            var adjacentTiles = [];
            var tileLen = this.lightedTiles.length;
            //eliminate those light cannot affect
            for (var i = tileLen; i--; ) {
                var currentTile = this.lightedTiles[i];
                var deltaX = currentTile.x - this.x;
                var deltaY = currentTile.y - this.y;
                //those light cannot affect
                if (deltaX <= maxLightPower && deltaX >= -maxLightPower && deltaY <= maxLightPower && deltaY >= -maxLightPower) {
                    adjacentTiles.push(currentTile);
                }
            }
            var level = Crafty("TiledLevel");
            var adjaLen = adjacentTiles.length;
            for (var i = adjaLen; i--; ) {
                var currentTile = adjacentTiles[i];

                var vec = makeVector(currentTile.x - this.x, currentTile.y - this.y);

                var blocked = false;

                var matrix = level.getRelevantMatrix(this);
                var coordCurTile = getTileCoord(currentTile);
                var coordLightSrc = getTileCoord(this);
                function testBlock(){

                    var lBoundX = 0;
                    var hBoundX = 0;
                    var lBoundY = 0;
                    var hBoundY = 0;
                    if(coordLightSrc.x < coordCurTile.x){
                        lBoundX = coordLightSrc.x;
                        hBoundX = coordCurTile.x;
                    }else{
                        lBoundX = coordCurTile.x;
                        hBoundX = coordLightSrc.x;
                    }
                    if(coordLightSrc.y < coordCurTile.y){
                        lBoundY = coordLightSrc.y;
                        hBoundY = coordCurTile.y;
                    }else{
                        lBoundY = coordCurTile.y;
                        hBoundY = coordLightSrc.y;
                    }
                    for(var i = lBoundX; i <= hBoundX; i ++){
                        for(var j = lBoundY; j <= hBoundY; j ++){
                            if(matrix[i][j] === level.tileType.nolight && !(coordLightSrc.x === i && coordLightSrc.y === j)){
                                blocked = true;
                                return;
                            }
                        }
                    }

                }
                testBlock();

               // if( blocked === false){
                    //calculate distance
                    var distance = Math.sqrt(vec.x * vec.x
                        + vec.y * vec.y);
                    //nearer tiles are brighter
                    var lightPower = maxLightPower - distance;
                    lightPower = lightPower / maxLightPower;

                    if (lightPower > 1)
                        lightPower = 1;
                    else if (lightPower < 0)
                        lightPower = 0;

                    if(this.isOn === false){
                        lightPower = 0;
                        currentTile.alpha = lightPower;
                    } else{
                        if (currentTile.alpha < lightPower)
                            currentTile.alpha = lightPower;
                    }
                //}


            }
        }
    });

    //Todo: Should combine Pressure and PressureTemp, since they have similar things.
    Crafty.c("Pressure", {
        touched : false,
        init: function(){
            this.touched = false;
            this.attr({w:25, h:25});

            this.addComponent("Collision").onHit("Collides", function(obj) {
                if(this.touched == false){
                    this.color('Green');
                    this.touched = true;
                };
            });
            this.addComponent("Collision").onHit("I_player", function(obj) {
                if(this.touched == false){
                    this.color('Green');
                    this.touched = true;
                };
            });
        }
    });

    Crafty.c("PressureTemp", {
        linkedItem: this,
        touched : false,

        init: function(){
            this.touched = false;
            var timer = 10;
            this.addComponent("I_pressurePlateOff");

            if(this.touched == false){
                this.addComponent("Collision").onHit("Collides", function(obj) {
                    if(this.touched == false){
                        this.removeComponent("I_pressurePlateOff");
                        this.addComponent("I_pressurePlateOn");
                        this.timer = 2;
                        this.linkedItem.activate();
                        this.touched = true;
                    }

                });
                this.addComponent("Collision").onHit("I_player", function(obj) {
                    if(this.touched == false){
                        this.removeComponent("I_pressurePlateOff");
                        this.addComponent("I_pressurePlateOn");
                        this.linkedItem.activate();
                        this.touched = true;
                        this.timer = 2;
                    }
                });};

            this.bind('EnterFrame', function() {
                if(this.timer > 0){
                    this.timer = this.timer - 1;
                    if(this.timer <= 0){
                        this.touched = false;
                        this.timer = 0;
                        this.addComponent("I_pressurePlateOff");
                        this.removeComponent("I_pressurePlateOn");
                        this.linkedItem.deactivate();
                    }
                }
            });
        },
        changeLinkedItem: function(obj){
            this.linkedItem = obj;
        }
    });


    Crafty.c ("Switch", {
        activated : false,
        init : function(){
            this.addComponent("I_switchOff");
            this.activated = false;

            this.addComponent("Collision").onHit("I_player", function(obj) {
                if(GLOBAL.p1Interacting == true){
                    if(this.activated == false){
                        this.activated = true;
                        this.addComponent("I_switchOn");
                        this.removeComponent("I_SwitchOff");
                        if(ShouldChestOpen()){
                            Crafty("Chest").each(function() {
                                this.activate();
                            })

                        }

                    }

//                    else if(this.activated == true){
//                        this.addComponent("I_switchOff");
//                        this.removeComponent("I_SwitchOn");
//                        this.activated = false;
//                    }
//
                }})
        }
    });

    function ShouldChestOpen(){
        var shouldOpen = true;
        Crafty("Switch").each(function(){
            if(!this.activated){shouldOpen = false}
        })
        return shouldOpen;
    }

    Crafty.c ("Chest", {
        opened : false,
        init: function() {
            this.opened = false;
            this.addComponent("I_chestClosed");
            this.addComponent("Collides")
        },

        activate: function(){
            this.removeComponent("I_chestClosed");
            this.addComponent("I_chestOpen");
            this.opened = true;
        },
        deactivate: function(){}

    });

    Crafty.c ("LowerableBlock", {
        raised : true,
        activate: function(){
            this.removeComponent("Collides");
            this.attr({visible: false});
            this.raised = false;
        },

        deactivate: function(){
            this.addComponent("Collides");
            this.attr({visible: true});
            this.raised = true;
        }

    });

    Crafty.c ("Fire",{
        target : null,
        isOn : false,
        lever : null,
        init: function(){
            this.addComponent("I_fire");
            this.addComponent("HasTarget");

            this.bind("EnterFrame", function(){
                //if fire is on
                if(this.isOn){
                    //if player stands on the fire
                    if(getTileCoord(this).x === getTileCoord(this.target).x && getTileCoord(this).y === getTileCoord(this.target).y){
                        this.target.HP -= 50;
                    }
                }
            });
        },
        setRelatedLever: function(lever){
            this.lever = lever;
        }
    });

    Crafty.c ("Fire1",{
        init: function(){
            this.addComponent("Fire");
            this.bind("EnterFrame", function(){
                if(!this.lever.activated){
                    this.isOn = true;
                    this.removeComponent("I_noFire");
                    this.addComponent("I_fire");
                }else{
                    this.isOn = false;
                    this.removeComponent("I_fire");
                    this.addComponent("I_noFire");
                }
            });
        }
    });

    Crafty.c ("Fire2",{
        init: function(){
            this.addComponent("Fire");
            this.bind("EnterFrame", function(){
                if(this.lever.activated){
                    this.isOn = true;
                    this.removeComponent("I_noFire");
                    this.addComponent("I_fire");
                }else{
                    this.isOn = false;
                    this.removeComponent("I_fire");
                    this.addComponent("I_noFire");
                }
            });
        }
    });


})();