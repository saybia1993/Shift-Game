// items.js
// Contains component definitions for
// all pickupable entities.

// All items that are destroyed upon usage return true;

(function() {

    // Item interface definition
    Crafty.c ("Item",{
        init: function() {
            this.addComponent("Interactable");
            this.addComponent("PopUpText");
        }
    });

    // Broom - Attacks with broom or picks it up, attacking pushes monster back around 3 tiles
    // "useful for sweeping or keeping monsters at bay"
    Crafty.c("Broom", {
        PopUpText : " ",
        beingUsed : false,
        init: function() {
            this.addComponent("Item").setPopUpText("A sturdy broom");
        },
        use: function(player, dir){
            this.beingUsed = true;
            Audio.playSound("shortAttack");
            player.timer = 30;
            player.action = "broom";
        }
    });

    // FryingPan - Attacks with frying pan or picks it up, attacking pushes monster back around 3 tiles
    // "A frying pan, used mainly for hitting things"
    Crafty.c ("FryingPan",{
        PopUpText : " ",
        beingUsed : false,
        init: function() {
            this.addComponent("Item").setPopUpText("A frying pan, used mainly for hitting things");
        },
        use: function(player, dir){
            this.beingUsed = true;
            Audio.playSound("shortAttack");
            player.timer = 30;
            player.action = "fryingPan";
        }
    });

    // Plunger - Attacks with plunger or picks it up, attacking pushes monster back around 3 tiles
    // "A sturdy plunger, great for plunging toilets"
    Crafty.c ("Plunger",{
        PopUpText : " ",
        beingUsed : false,
        init: function() {
            this.addComponent("Item").setPopUpText("A sturdy plunger, great for plunging toilets");
        },
        use: function(player, dir){
            this.beingUsed = true;
            Audio.playSound("shortAttack");
            player.timer = 30;
            player.action = "plunger";
        }
    });

    Crafty.c("Key", {
        init: function() {
            this.addComponent("Item").setPopUpText("This could unlock a door.");
        },
        use: function(player, dir, interactingObject) {
            if (interactingObject.has("LockedDoor") && !interactingObject.doorUnlocked) {
                Audio.playSound("doorUnlocking");
                interactingObject.doorUnlocked = true;
                interactingObject.setPopUpText("The door is unlocked!");

                GLOBAL.unlockedDoors.push(interactingObject);

                return true;
            }
        }
    });

    Crafty.c("BlackKey", {
        init: function() {
            this.addComponent("Item").setPopUpText("This looks like it could unlock the front door.");
        },
        use: function(player, dir, interactingObject) {
            if (interactingObject.has("BlackDoor") && !interactingObject.doorUnlocked) {
                Audio.playSound("doorUnlocking");
                interactingObject.doorUnlocked = true;
                interactingObject.setPopUpText("The black door is unlocked!");

                GLOBAL.unlockedDoors.push(interactingObject);

                return true;
            }
        }
    });

    // Gem - These sit in your inventory, you need to give three of them to the statue to get the black key (The thing with StatueKey)
    Crafty.c ("GemGreen",{
        PopUpText : " ",
        beingUsed : false,
        init: function() {
            this.addComponent("Item").setPopUpText("Green Gem.");
        },
        use: function(player, dir, interactingObject) {
            if (interactingObject.has("StatueKey")) {
                Audio.playSound("doorUnlocking");
                interactingObject.hasGreenGem = true;
                interactingObject.updatePopUp();
                return true;
            }
        }
    });

    Crafty.c ("GemBlue",{
        PopUpText : " ",
        beingUsed : false,
        init: function() {
            this.addComponent("Item").setPopUpText("Blue Gem.");
        },
        use: function(player, dir, interactingObject) {
            if (interactingObject.has("StatueKey")) {
                Audio.playSound("doorUnlocking");
                interactingObject.hasBlueGem = true;
                interactingObject.updatePopUp();
                return true;
            }
        }

    });

    Crafty.c ("GemRed",{
        PopUpText : " ",
        beingUsed : false,
        init: function() {
            this.addComponent("Item").setPopUpText("Red Gem.");
        },
        use: function(player, dir, interactingObject) {
            if (interactingObject.has("StatueKey")) {
                Audio.playSound("doorUnlocking");
                interactingObject.hasRedGem = true;
                interactingObject.updatePopUp();
                return true;
            }
        }

    });

    // Food
    Crafty.c("Food", {       // engine
        HpRecovery : 25,     // variable (all)
        init: function() {
            this.addComponent("Item").setPopUpText("Food: A tasty sandwich");
        },

        use : function(player,dir){
            player.heal(this.HpRecovery);
            Audio.playSound("eatingFood");
            // Destroy food after use.
            return true;
            //put health recovery animation and other things...
        }
    });

    // FlashLight-main
    Crafty.c("FlashLight", {
        lightedTiles : [],
        range : 250,
        angle :.7,//cosine TODO: Does this actually work?
        dir : makeVector(0,1),
        isOn : false,
        isActivated : false,
        init: function() {
            this.addComponent("Item")
                .setPopUpText("A flashlight. Useful for lighting up dark areas.");
        },
        use: function(player, dir) {
            Audio.playSound("flashlightOnOff");
            if (!player.isActivated) {
                player.isActivated = true;
                // TODO: Change this to look at the player input.
                Crafty.bind("EnterFrame", function() {
                    if (player.isOn) {
                        player.light();
                    }
                });
            }

            player.isOn = !player.isOn;
        },
        light: function() {
            lightFX.createLightCone(this.x + this.w / 2, this.y + this.h /2, this.direction, this.range);
        },

        setLightRange : function(range){
            this.range = range;
        },

        setLightAngle : function(angle){
            this.angle = angle;
        },

        setLightDir : function(dir){
            this.dir = dir;
        }
    });

    // FlashLight2
    Crafty.c("FlashLight2", {
        /*
        use : function(player, facing) {
            player.attr({
                range : 400,
                angle : .7});

        }
        */
    });

    // FlashLight3
    Crafty.c("FlashLight3", {
        /*
        use : function(player, facing) {
            player.attr({
                range : 200,
                angle :-.9});
        }
        */
    });


    // TODO: What is this?
    Crafty.c ("BoxDrop", {
        init: function(){
            this.addComponent('Color');
            this.attr({h: GLOBAL.tileW, w: GLOBAL.tileW});
            this.color('Purple');
        },
        use: function(player, dir){
            var box = player.removeCurrentItem();
            box.addComponent("Collides");
            if (dir === GLOBAL.direction.up){
                box.attr( {x: player.x, y: player.y - GLOBAL.tileW, visible: true})
            }
            if (dir === GLOBAL.direction.down){
                box.attr( {x: player.x, y: player.y + GLOBAL.tileW, visible: true})
            }
            if (dir === GLOBAL.direction.left){
                box.attr( {x: player.x - GLOBAL.tileW, y: player.y, visible: true})
            }
            if (dir === GLOBAL.direction.right){
                box.attr( {x: player.x + GLOBAL.tileW, y: player.y, visible: true})
            }
        }
    });

})();