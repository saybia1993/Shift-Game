// worldObjects.js
// Contains components for entities
// that exist in the world and cannot
// be picked up by the players.

(function() {

    Crafty.c("_Door", {
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
                return null;
            }

            var otherDoor = getOtherDoor();
            if (otherDoor != null) {
                otherDoor.entranceDirection = this.entranceDirection;
            }

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
                },
            function() {
                this.playerAtDoor = false;
            });
        }
    })

    Crafty.c("Door", {
        init: function() {
            if (!this.has("LockedDoor") && !this.has("PressureDoor") && !this.has("BlackDoor")) {
                this.addComponent("_Door");
            }
        }
    });

    // TODO: Revise this to incorporate the original Door.
    Crafty.c("LockedDoor", {
        playerAtDoor: false,
        // The three variables below are set
        // if the doors are successfully linked.
        connectedRoom: null,
        connectedDoor: null,
        entranceDirection: null,
        doorUnlocked: false,

        // NEW FUNCTION FOR LOCKED DOORS.
        init: function() {
            this.addComponent("Interactable, PopUpText, Door")
                .setPopUpText("The door is locked.");
        },

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
                return null;
            }

            var otherDoor = getOtherDoor();
            if (otherDoor != null) {
                otherDoor.entranceDirection = this.entranceDirection;
            }

            // Get the tile in front of the door
            this.addComponent("Collision")
                .onHit("Player", function() {
                    this.playerAtDoor = true;
                    if (otherDoor != null && otherDoor.playerAtDoor && (this.doorUnlocked || otherDoor.doorUnlocked)) {
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
                },
            function() {
                this.playerAtDoor = false;
            });

            // NEW CODE
            for (var i = 0; i < GLOBAL.unlockedDoors.length; i++) {
                if (this.connectedDoor === GLOBAL.unlockedDoors[i].connectedDoor && this.connectedRoom === GLOBAL.unlockedDoors[i].connectedRoom) {
                    this.doorUnlocked = true;
                }
            }
        }
    });

    Crafty.c("PressureDoor", {
        playerAtDoor: false,
        // The three variables below are set
        // if the doors are successfully linked.
        connectedRoom: null,
        connectedDoor: null,
        entranceDirection: null,
        doorUnlocked: false,

        // NEW FUNCTION FOR LOCKED DOORS.
        init: function() {
            this.addComponent("Interactable, PopUpText, Door")
                .setPopUpText("The door is locked, but there's no keyhole.");
        },

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
                return null;
            }

            var otherDoor = getOtherDoor();
            if (otherDoor != null) {
                otherDoor.entranceDirection = this.entranceDirection;
            }

            // Get the tile in front of the door
            this.addComponent("Collision")
                .onHit("Player", function() {
                    this.playerAtDoor = true;
                    if (otherDoor != null && otherDoor.playerAtDoor && (this.doorUnlocked || otherDoor.doorUnlocked)) {
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
                },
            function() {
                this.playerAtDoor = false;
            });

            // NEW CODE
            for (var i = 0; i < GLOBAL.unlockedDoors.length; i++) {
                if (this.connectedDoor === GLOBAL.unlockedDoors[i].connectedDoor && this.connectedRoom === GLOBAL.unlockedDoors[i].connectedRoom) {
                    this.doorUnlocked = true;
                }
            }
        }
    });

    // TODO: Revise this to incorporate the original Door.
    Crafty.c("BlackDoor", {
        playerAtDoor: false,
        // The three variables below are set
        // if the doors are successfully linked.
        connectedRoom: null,
        connectedDoor: null,
        entranceDirection: null,
        doorUnlocked: false,

        // NEW FUNCTION FOR LOCKED DOORS.
        init: function() {
            this.addComponent("Interactable, PopUpText, Door")
                .setPopUpText("This door is black and locked.");
        },

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
                return null;
            }

            var otherDoor = getOtherDoor();
            if (otherDoor != null) {
                otherDoor.entranceDirection = this.entranceDirection;
            }

            // Get the tile in front of the door
            this.addComponent("Collision")
                .onHit("Player", function() {
                    this.playerAtDoor = true;
                    if (otherDoor != null && otherDoor.playerAtDoor && (this.doorUnlocked || otherDoor.doorUnlocked)) {
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
                },
            function() {
                this.playerAtDoor = false;
            });

            // NEW CODE
            for (var i = 0; i < GLOBAL.unlockedDoors.length; i++) {
                if (this.connectedDoor === GLOBAL.unlockedDoors[i].connectedDoor && this.connectedRoom === GLOBAL.unlockedDoors[i].connectedRoom) {
                    this.doorUnlocked = true;
                }
            }
        }
    });

    Crafty.c("FinalDoors", {
        init: function() {
            var playersAtDoor = 0;
            var currentlyEnding = {value: false};
            this.addComponent("Collision")
                .onHit("Player", function(colArray) {
                    if (colArray.length > 1 && !currentlyEnding.value) {
                        flashFX.flash("#FFFFFF", 0.1, 0.06, currentlyEnding, function() {
                            Crafty("Player").each(function() {
                                this.removeComponent("Persist");
                                this.destroy();
                            })
                        });

                        Crafty.e("Delay")
                            .delay(function() {
                                flashFX.fadeIn("#000000");
                                Crafty.unbind("EnterFrame", "lightingFX");
                                Crafty.scene("endingScreen");
                            }, 2000);
                    }
                    else {
                        var player = colArray[0].obj;
                        player.x = player.old_pos[0];
                        player.y = player.old_pos[1];
                    }
                })
        }
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
            this.addComponent("Interactable");
        },

        //switch lamp
        interact : function() {

        }

    });

    //Todo: Should combine Pressure and PressureTemp, since they have similar things.
    Crafty.c("Pressure", {
        touched : false,
        init: function(){
            this.touched = false;
            this.attr({w:25, h:25});

            this.addComponent("Collision").onHit("Collides", function(obj) {
                alert("BOOM");
                if (this.touched == false){
                    this.color('Green');
                    this.touched = true;
                };
            });
            this.addComponent("Collision").onHit("I_player", function(obj) {
                alert("BOOM!");
                if (this.touched == false){
                    this.color('Green');
                    this.touched = true;
                };
            });
        }
    });

    Crafty.c("SafePressurePlate", {
        touched : false,
        init: function(){
            this.addComponent("Collision, Interactable, PopUpText").onHit("Moveable", function(obj) {
                if (this.touched === false) {
                    this.removeComponent("I_pressurePlateOff");
                    this.addComponent("I_pressurePlateOn");

                    Crafty("PressureDoor, Chest, Safe").each(function() {
                        // If the room contains pressure doors
                        // (has the doorUnlocked attribute), unlock them...
                        if (this.doorUnlocked !== undefined) {
                            Audio.playSound("doorUnlocking");
                            this.doorUnlocked = true;
                        }
                    });

                    this.touched = true;
                }
            }, function() {
                this.touched = false;
                this.removeComponent("I_pressurePlateOn");
                this.addComponent("I_pressurePlateOff");

                Crafty("PressureDoor, Chest, Safe").each(function() {
                    if (this.doorUnlocked !== undefined) {
                        Audio.playSound("doorLocking");
                        this.doorUnlocked = false;
                    }
                });
            })
                .setPopUpText("It looks like a pressure plate. It'll need something heavy on it.");
        }
    });

    Crafty.c("PressureTemp", {
        linkedItem: this,
        touched : false,

        init: function(){
            this.touched = false;
            var timer = 10;
            this.addComponent("I_pressurePlateOff");

            if (this.touched == false){
                this.addComponent("Collision").onHit("Collides", function(obj) {
                    if (this.touched == false){
                        this.removeComponent("I_pressurePlateOff");
                        this.addComponent("I_pressurePlateOn");
                        this.timer = 2;
                        this.linkedItem.activate();
                        this.touched = true;
                    }

                });
                this.addComponent("Collision").onHit("I_player", function(obj) {
                    if (this.touched == false){
                        this.removeComponent("I_pressurePlateOff");
                        this.addComponent("I_pressurePlateOn");
                        this.linkedItem.activate();
                        this.touched = true;
                        this.timer = 2;
                    }
                });};

            this.bind('EnterFrame', function() {
                if (this.timer > 0){
                    this.timer = this.timer - 1;
                    if (this.timer <= 0){
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


    Crafty.c ("Lever", {
        activated : false,
        init : function(){
            this.addComponent("I_leverOff");
            this.activated = false;
            //alert("Lever init called");
            this.addComponent("Collision").onHit("Player", function(player) {
                alert("collides called");
                if (player.interact == true){
                    if (this.activated == false){
                        this.activated = true;
                        this.addComponent("I_leverOn");
                        this.removeComponent("I_leverOff");
                        if (ShouldChestOpen()){
                            Crafty("Chest").each(function() {
                                this.activate();
                            })
                        }
                    }

//                    else if (this.activated == true){
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
        Crafty("Lever").each(function(){
            if (!this.activated){shouldOpen = false}
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

    Crafty.c ("Safe",{
        init : function(){
            this.addComponent("Interactable, PopUpText").setPopUpText("A secure safe, it's secrets hidden behind a mysterious lock.");
        }
    });

    Crafty.c ("SafeLock",{
        init: function() {


        }


    });


    // BrokenLamp:  “This is a lamp. It’s broken”
    Crafty.c ("BrokenLamp", {
        PopUpText : " ",
        beingUsed : false,
        init: function() {
            this.addComponent("Interactable, PopUpText").setPopUpText("This is a lamp. It’s broken");
        }
    });

    Crafty.c ("Fire",{
        target : null,
        isOn : false,
        lever : null,
        init: function(){
            this.addComponent("I_fire");
            this.addComponent("HasTarget");
            Audio.playSound("fire");
            this.bind("EnterFrame", function(){
                //if fire is on
                if (this.isOn){
                    //if player stands on the fire
                    if (getTileCoord(this).x === getTileCoord(this.target).x && getTileCoord(this).y === getTileCoord(this.target).y){
                        this.target.takeDamage(1);
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
//                if (!this.lever.activated){
//                    this.isOn = true;
//                    this.removeComponent("I_noFire");
//                    this.addComponent("I_fire");
//                }else{
//                    this.isOn = false;
//                    this.removeComponent("I_fire");
//                    this.addComponent("I_noFire");
//                }
            });
        }
    });

    Crafty.c ("Fire2",{
        init: function(){
            this.addComponent("Fire");
            this.bind("EnterFrame", function(){
                // TODO: Fix bug under here.
//                if (this.lever.activated){
//                    this.isOn = true;
//                    this.removeComponent("I_noFire");
//                    this.addComponent("I_fire");
//                }else{
//                    this.isOn = false;
//                    this.removeComponent("I_fire");
//                    this.addComponent("I_noFire");
//                }
            });
        }
    });

    Crafty.c ("StatueKey", {
        hasRedGem: false,
        hasBlueGem: false,
        hasGreenGem: false,
        interactText : "A lone statue stands in the center of the room. It has 3 gem-shaped slots in its base.",
        gemInserted: false,
        init: function() {
            this.addComponent("Interactable, PopUpText")
                .setPopUpText(this.interactText);
        },
        updatePopUp: function() {
            var text = this.interactText;
            if (this.hasRedGem) {
                text = text + " A red gem is inserted.";
            }
            if (this.hasBlueGem) {
                text = text + " A blue gem is inserted.";
            }
            if (this.hasGreenGem) {
                text = text + " A green gem is inserted.";
            }
            this.setPopUpText(text);
            if (this.hasRedGem && this.hasBlueGem && this.hasGreenGem) {

                Crafty.e("Canvas, 2D, I_ironKey, BlackKey").attr({
                    x:this.x,
                    y:this.y - 25
                });
            }
        }

    })

})();