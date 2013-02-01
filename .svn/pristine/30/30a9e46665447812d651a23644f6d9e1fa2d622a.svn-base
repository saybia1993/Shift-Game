// player.js
// Contains the player component.

(function() {

    Crafty.c("Player", {
        HP: GLOBAL.MaxHP,
        //Tiles that player has walked
        playersArray: [],
        path: [],
        speed: 1.5,
        old_pos: [0,0],
        whichPlayer : 1,
        leftTile : null,
        rightTile : null,
        upTile : null,
        downTile : null,
        timer : 0,
        action : "",

        player: function(playerNumber) {
            // DEBUG
            healthValue.innerHTML = GLOBAL.MaxHP;

            this.playersArray.push(this);

            if(objInLeftSide(this)){
                this.whichPlayer = 1;
            }else{
                this.whichPlayer = 2;
            }
            var upKey;
            var downKey;
            var leftKey;
            var rightKey;
            var interactKey;
            var inventoryKey;
            var leftKeyDown = false;
            var rightKeyDown = false;
            var upKeyDown = false;
            var downKeyDown = false;

            var interactingObject;
            // interactDelayer used for inventory item dropping and picking up
            var interactDelayer = Crafty.e("Delay");
            var itemDropped = false;
            var itemPickUpReady = false;
            var interactionBegun = false;

            if (playerNumber === 1) {
                upKey = GLOBAL.p1Keys.Up;
                downKey = GLOBAL.p1Keys.Down;
                leftKey = GLOBAL.p1Keys.Left;
                rightKey = GLOBAL.p1Keys.Right;
                interactKey = GLOBAL.p1Keys.Interact;
                inventoryKey = GLOBAL.p1Keys.Inventory;
            }
            else {
                upKey = GLOBAL.p2Keys.Up;
                downKey = GLOBAL.p2Keys.Down;
                leftKey = GLOBAL.p2Keys.Left;
                rightKey = GLOBAL.p2Keys.Right;
                interactKey = GLOBAL.p2Keys.Interact;
                inventoryKey = GLOBAL.p2Keys.Inventory;
            }

            this.addComponent('Inventory, Movable, Animated, Collision, MovingLight, PopUpTextGen')
                .setPlayerAnimation();
            //this.stopAnimation();

            this.bind('KeyDown', function(e) {
                //if keys are down, set the direction
                if (e.keyCode === leftKey) {
                     this.direction = GLOBAL.direction.left;
                     this.setLightDir(makeVector(-1,0));
                     Audio.playMusic("walk");
                     leftKeyDown = true;
                     rightKeyDown = false;
                     upKeyDown = false;
                     downKeyDown = false;
                }
                if (e.keyCode === rightKey) {
                     this.direction = GLOBAL.direction.right;
                     this.setLightDir(makeVector(1,0));
                     Audio.playMusic("walk");
                    leftKeyDown = false;
                    rightKeyDown = true;
                    upKeyDown = false;
                    downKeyDown = false;
                }
                if (e.keyCode === upKey) {
                     this.direction = GLOBAL.direction.up;
                     this.setLightDir(makeVector(0,-1));
                     Audio.playMusic("walk");
                    leftKeyDown = false;
                    rightKeyDown = false;
                    upKeyDown = true;
                    downKeyDown = false;
                }
                if (e.keyCode === downKey) {
                     this.direction = GLOBAL.direction.down;
                     this.setLightDir(makeVector(0,1));
                     Audio.playMusic("walk");
                    leftKeyDown = false;
                    rightKeyDown = false;
                    upKeyDown = false;
                    downKeyDown = true;
                }

                // Context sensitive key:
                //    - If the button is held:
                //          - If inventory open, shows popUpText of current item, otherwise...
                //          - Interacts with adjacent, facing objects, if none then...
                //              - If Inventory is pressed while adjacent object interaction occurs,
                //                  - Object is picked up.
                //    - If button is quickly released:
                //          - Uses current object.
                if (e.keyCode === interactKey) {
                    if (this.inventoryActive) {
                        var player = this;
                        interactDelayer.delay(function() {
                            interactionBegun = true;
                            player.getCurrentItem().interact(player, GLOBAL.direction.up);
                        }, 1000);
                    }
                    else if (interactingObject != null) {
                        var player = this;
                        interactDelayer.delay(function() {
                            interactionBegun = true;
                            if (interactingObject != null) {
                                // If the object is an item, you can just stand on top of the item.
                                if (interactingObject.has("Item")) {
                                    interactingObject.interact(player, player.direction);
                                    itemPickUpReady = true;
                                }
                                // If it's a world object, it's probably collidable and you have to stand and face it.
                                else {
                                    var faceDirection = player.nextToAndFace(interactingObject);
                                    if (faceDirection) {
                                        interactingObject.interact(player, faceDirection);
                                    }
                                }
                            }
                            else {
                                Audio.playSound("error");
                            }
                        }, 1000);
                    }
                }
                // Context sensitive key:
                //    - Cycles through inventory when released (defined in "KeyUp")
                //    - If held, drops current item (defined here).
                if (e.keyCode === inventoryKey) {
                    if (!itemPickUpReady) {
                        var player = this;
                        interactDelayer.delay(function() {
                            itemDropped = true;
                            var item = player.removeCurrentItem();
                            if (item != null) {
                                if (player.direction === GLOBAL.direction.up) {
                                    item.attr( {x: player.x, y: player.y - GLOBAL.tileW, visible: true} )
                                }
                                else if (player.direction === GLOBAL.direction.down) {
                                    item.attr( {x: player.x, y: player.y + GLOBAL.tileW, visible: true} )
                                }
                                else if (player.direction === GLOBAL.direction.left) {
                                    item.attr( {x: player.x - GLOBAL.tileW, y: player.y, visible: true} )
                                }
                                else {
                                    item.attr( {x: player.x + GLOBAL.tileW, y: player.y, visible: true} )
                                }
                            }
                            else {
                                Audio.playSound("error");
                            }
                        }, 1000);
                    }
                }
            });

            this.bind('KeyUp', function(e) {
                //if key is released, stop moving
                if (e.keyCode === leftKey) {
                    leftKeyDown = false;
                }
                if (e.keyCode === rightKey) {
                    rightKeyDown = false;
                }
                if (e.keyCode === upKey) {
                    upKeyDown = false;
                }
                if (e.keyCode === downKey) {
                    downKeyDown = false;
                }

                if (e.keyCode === interactKey) {
                    if (interactionBegun) {
                        interactionBegun = false;
                        itemPickUpReady = false;
                    }
                    else if (this.items.length > 0) {
                        this.useCurrentItem(this, this.direction, interactingObject);

                        interactDelayer.destroy();
                        interactDelayer = Crafty.e("Delay");
                    }
                    else {
                        Audio.playSound("error");
                    }
                }

                if (e.keyCode === inventoryKey) {
                    if (itemPickUpReady) {
                        this.addNewItem(interactingObject);
                        itemPickUpReady = false;
                    }
                    else if (itemDropped) {
                        this.cycleItems();
                        itemDropped = false;

                    }
                    else {
                        if (this.items.length > 0) {
                            this.cycleAndDisplayItems();
                        }
                        interactDelayer.destroy();
                        interactDelayer = Crafty.e("Delay");
                    }
                }

                this.stop();

                Audio.stop("walk");
            });

            this.bind('EnterFrame', function() {
                //move the player in a direction depending on the booleans
                //only move the player in one direction at a time (up/down/left/right)
                this.old_pos = [this.x, this.y];
                if(this.leftTile){
                    this.leftTile.x = this.x - this.w;
                    this.leftTile.y = this.y;
                    this.rightTile.x = this.x + this.w;
                    this.rightTile.y = this.y;
                    this.upTile.x = this.x;
                    this.upTile.y = this.y - this.h;
                    this.downTile.x = this.x;
                    this.downTile.y = this.y + this.h;
                }

                    if (leftKeyDown) {
                        this.velocity.x = -this.speed;
                        this.velocity.y = 0;
                        if(this.whichPlayer === 1){
                            this.playAnimation(this.animation.player1Left);
                        }else{
                            this.playAnimation(this.animation.player2Left);
                        }
                    }
                    if (rightKeyDown) {
                        this.velocity.x = this.speed;
                        this.velocity.y = 0;
                        if(this.whichPlayer === 1){
                            this.playAnimation(this.animation.player1Right);
                        }else{
                            this.playAnimation(this.animation.player2Right);
                        }
                    }
                    if (upKeyDown) {
                        this.velocity.x = 0;
                        this.velocity.y = -this.speed;
                        if(this.whichPlayer === 1){
                            this.playAnimation(this.animation.player1Up);
                        }else{
                            this.playAnimation(this.animation.player2Up);
                        }
                    }
                    if (downKeyDown) {
                        this.velocity.x = 0;
                        this.velocity.y = this.speed;
                        if(this.whichPlayer === 1){
                            this.playAnimation(this.animation.player1Down);
                        }else{
                            this.playAnimation(this.animation.player2Down);
                        }
                    }

                if(leftKeyDown || rightKeyDown || upKeyDown || downKeyDown) {
                    this.timer = 0;
                    interactingObject = null;
                    this.updatePosition();
                    //If curTile not equals to the last tile in the path (moved to a new tile), push new tile.
                    var curTile = getTileCoord(this);
                    for(var i = 1; i < this.path.length; i ++){
                        if (curTile.x != this.path[i][this.path[i].length-1].x || curTile.y != this.path[i][this.path[i].length-1].y){
                            this.path[i].push(curTile);
                        }
                    }
                } else if(this.timer > 0){
                    this.playActionAnimation(this.action);
                    this.timer-=2;
                }
            });

            // ADD SPECIAL CHARACTERISTICS
            this.onHit("Moveable", function(hit) {
                if (this.direction === GLOBAL.direction.left) {
                    hit[0].obj.x = hit[0].obj.x - (this.speed);
                    hit[0].obj.connectedObj.x = hit[0].obj.connectedObj.x - (this.speed);
                }
                else if (this.direction === GLOBAL.direction.right) {
                    hit[0].obj.x = hit[0].obj.x + (this.speed);
                    hit[0].obj.connectedObj.x = hit[0].obj.connectedObj.x + (this.speed);
                }
                else if (this.direction === GLOBAL.direction.up) {
                    hit[0].obj.y = hit[0].obj.y - (this.speed);
                    hit[0].obj.connectedObj.y = hit[0].obj.connectedObj.y - (this.speed);
                }
                else if (this.direction === GLOBAL.direction.down){
                    hit[0].obj.y = hit[0].obj.y + (this.speed);
                    hit[0].obj.connectedObj.y = hit[0].obj.connectedObj.y + (this.speed);
                }
            });

            this.onHit("Interactable", function(obj){
                interactingObject = obj[0].obj;
            });

            this.onHit("Collides", function() {
                this.x = this.old_pos[0];
                this.y = this.old_pos[1];
            });

            // Allows player to move slightly into the door
            this.onHit("Door", function(colArray) {
                var collidedDoor = colArray[0].obj;

                switch (collidedDoor.entranceDirection) {
                    // To top
                    case 0:
                        if (this.y < collidedDoor.y + collidedDoor.w - 2)
                            this.y = this.old_pos[1];
                        break;
                    // To right
                    case 1:
                        if (this.x + this.w > collidedDoor.x + 2)
                            this.x = this.old_pos[0];
                        break;
                    // To bottom
                    case 2:
                        if (this.y + this.w > collidedDoor.y + 2)
                            this.y = this.old_pos[1];
                        break;
                    // To left
                    case 3:
                        if (this.x < collidedDoor.x + collidedDoor.w - 2)
                            this.x = this.old_pos[0];
                }
            });

            this.bind("SceneChange", function() {
                if (playerNumber === 1) {
                    this.x = GLOBAL.p1EntrancePosition[0];
                    this.y = GLOBAL.p1EntrancePosition[1];
                }
                else {
                    this.x = GLOBAL.p2EntrancePosition[0];
                    this.y = GLOBAL.p2EntrancePosition[1];
                }

                this.setAdjacentTile(
                    Crafty.e("2D, Canvas, I_empty, Animated, Persist")
                        .attr({x:this.x - this.w, y: this.y, w: this.w, h: this.h}),
                    Crafty.e("2D, Canvas, I_empty, Animated, Persist")
                        .attr({x:this.x + this.w, y: this.y, w: this.w, h: this.h}),
                    Crafty.e("2D, Canvas, I_empty, Animated, Persist")
                        .attr({x:this.x, y: this.y - this.h, w: this.w, h: this.h}),
                    Crafty.e("2D, Canvas, I_empty, Animated, Persist")
                        .attr({x:this.x, y: this.y + this.h, w: this.w, h: this.h}));
                this.setPlayerActionAnimation();
            });

            return this;
        },

        addPath : function(){
            var coord = getTileCoord(this);
            this.path.push([[0,0],[coord.x, coord.y]]);
            return this.path.length -1;
        },

        setPlayerActionAnimation : function(){

            this.setActionAnimation(this.actionAnimation.playerTile.plunger.left);
            this.leftTile.setActionAnimation(this.actionAnimation.leftTile.plunger.left);
            this.rightTile.setActionAnimation(this.actionAnimation.rightTile.plunger.left);
            this.upTile.setActionAnimation(this.actionAnimation.upTile.plunger.left);
            this.downTile.setActionAnimation(this.actionAnimation.downTile.plunger.left);

            this.setActionAnimation(this.actionAnimation.playerTile.plunger.right);
            this.leftTile.setActionAnimation(this.actionAnimation.leftTile.plunger.right);
            this.rightTile.setActionAnimation(this.actionAnimation.rightTile.plunger.right);
            this.upTile.setActionAnimation(this.actionAnimation.upTile.plunger.right);
            this.downTile.setActionAnimation(this.actionAnimation.downTile.plunger.right);

            this.setActionAnimation(this.actionAnimation.playerTile.plunger.up);
            this.leftTile.setActionAnimation(this.actionAnimation.leftTile.plunger.up);
            this.rightTile.setActionAnimation(this.actionAnimation.rightTile.plunger.up);
            this.upTile.setActionAnimation(this.actionAnimation.upTile.plunger.up);
            this.downTile.setActionAnimation(this.actionAnimation.downTile.plunger.up);

            this.setActionAnimation(this.actionAnimation.playerTile.plunger.down);
            this.leftTile.setActionAnimation(this.actionAnimation.leftTile.plunger.down);
            this.rightTile.setActionAnimation(this.actionAnimation.rightTile.plunger.down);
            this.upTile.setActionAnimation(this.actionAnimation.upTile.plunger.down);
            this.downTile.setActionAnimation(this.actionAnimation.downTile.plunger.down);

            this.setActionAnimation(this.actionAnimation.playerTile.broom.left);
            this.leftTile.setActionAnimation(this.actionAnimation.leftTile.broom.left);
            this.rightTile.setActionAnimation(this.actionAnimation.rightTile.broom.left);
            this.upTile.setActionAnimation(this.actionAnimation.upTile.broom.left);
            this.downTile.setActionAnimation(this.actionAnimation.downTile.broom.left);

            this.setActionAnimation(this.actionAnimation.playerTile.broom.right);
            this.leftTile.setActionAnimation(this.actionAnimation.leftTile.broom.right);
            this.rightTile.setActionAnimation(this.actionAnimation.rightTile.broom.right);
            this.upTile.setActionAnimation(this.actionAnimation.upTile.broom.right);
            this.downTile.setActionAnimation(this.actionAnimation.downTile.broom.right);

            this.setActionAnimation(this.actionAnimation.playerTile.broom.up);
            this.leftTile.setActionAnimation(this.actionAnimation.leftTile.broom.up);
            this.rightTile.setActionAnimation(this.actionAnimation.rightTile.broom.up);
            this.upTile.setActionAnimation(this.actionAnimation.upTile.broom.up);
            this.downTile.setActionAnimation(this.actionAnimation.downTile.broom.up);

            this.setActionAnimation(this.actionAnimation.playerTile.broom.down);
            this.leftTile.setActionAnimation(this.actionAnimation.leftTile.broom.down);
            this.rightTile.setActionAnimation(this.actionAnimation.rightTile.broom.down);
            this.upTile.setActionAnimation(this.actionAnimation.upTile.broom.down);
            this.downTile.setActionAnimation(this.actionAnimation.downTile.broom.down);

            this.setActionAnimation(this.actionAnimation.playerTile.fryingPan.left);
            this.leftTile.setActionAnimation(this.actionAnimation.leftTile.fryingPan.left);
            this.rightTile.setActionAnimation(this.actionAnimation.rightTile.fryingPan.left);
            this.upTile.setActionAnimation(this.actionAnimation.upTile.fryingPan.left);
            this.downTile.setActionAnimation(this.actionAnimation.downTile.fryingPan.left);

            this.setActionAnimation(this.actionAnimation.playerTile.fryingPan.right);
            this.leftTile.setActionAnimation(this.actionAnimation.leftTile.fryingPan.right);
            this.rightTile.setActionAnimation(this.actionAnimation.rightTile.fryingPan.right);
            this.upTile.setActionAnimation(this.actionAnimation.upTile.fryingPan.right);
            this.downTile.setActionAnimation(this.actionAnimation.downTile.fryingPan.right);

            this.setActionAnimation(this.actionAnimation.playerTile.fryingPan.up);
            this.leftTile.setActionAnimation(this.actionAnimation.leftTile.fryingPan.up);
            this.rightTile.setActionAnimation(this.actionAnimation.rightTile.fryingPan.up);
            this.upTile.setActionAnimation(this.actionAnimation.upTile.fryingPan.up);
            this.downTile.setActionAnimation(this.actionAnimation.downTile.fryingPan.up);

            this.setActionAnimation(this.actionAnimation.playerTile.fryingPan.down);
            this.leftTile.setActionAnimation(this.actionAnimation.leftTile.fryingPan.down);
            this.rightTile.setActionAnimation(this.actionAnimation.rightTile.fryingPan.down);
            this.upTile.setActionAnimation(this.actionAnimation.upTile.fryingPan.down);
            this.downTile.setActionAnimation(this.actionAnimation.downTile.fryingPan.down);
        },

        playActionAnimation : function(action){
            if(this.direction === GLOBAL.direction.left){
                this.playAnimation(this.actionAnimation.playerTile[action].left);
                this.leftTile.playAnimation(this.actionAnimation.leftTile[action].left);
                this.rightTile.playAnimation(this.actionAnimation.rightTile[action].left);
                this.upTile.playAnimation(this.actionAnimation.upTile[action].left);
                this.downTile.playAnimation(this.actionAnimation.downTile[action].left);

            }else if(this.direction === GLOBAL.direction.right){
                this.playAnimation(this.actionAnimation.playerTile[action].right);
                this.leftTile.playAnimation(this.actionAnimation.leftTile[action].right);
                this.rightTile.playAnimation(this.actionAnimation.rightTile[action].right);
                this.upTile.playAnimation(this.actionAnimation.upTile[action].right);
                this.downTile.playAnimation(this.actionAnimation.downTile[action].right);

            }else if(this.direction === GLOBAL.direction.up){
                this.playAnimation(this.actionAnimation.playerTile[action].up);
                this.leftTile.playAnimation(this.actionAnimation.leftTile[action].up);
                this.rightTile.playAnimation(this.actionAnimation.rightTile[action].up);
                this.upTile.playAnimation(this.actionAnimation.upTile[action].up);
                this.downTile.playAnimation(this.actionAnimation.downTile[action].up);

            }else if(this.direction === GLOBAL.direction.down){
                this.playAnimation(this.actionAnimation.playerTile[action].down);
                this.leftTile.playAnimation(this.actionAnimation.leftTile[action].down);
                this.rightTile.playAnimation(this.actionAnimation.rightTile[action].down);
                this.upTile.playAnimation(this.actionAnimation.upTile[action].down);
                this.downTile.playAnimation(this.actionAnimation.downTile[action].down);

            }
        },

        setPlayerAnimation:function () {
            if (this.whichPlayer === 1) {
                this.setAnimation(this.animation.player1Left);
                this.setAnimation(this.animation.player1Right);
                this.setAnimation(this.animation.player1Up);
                this.setAnimation(this.animation.player1Down);
            } else {
                this.setAnimation(this.animation.player2Left);
                this.setAnimation(this.animation.player2Right);
                this.setAnimation(this.animation.player2Up);
                this.setAnimation(this.animation.player2Down);
            }
        },

        setAdjacentTile : function(leftTile, rightTile, upTile, downTile) {
            this.leftTile = leftTile;
            this.rightTile = rightTile;
            this.upTile = upTile;
            this.downTile = downTile;
        },

        heal: function(hpGained) {
            this.HP += hpGained;

            if (this.HP > GLOBAL.MaxHP) {
                this.HP = GLOBAL.MaxHP;
            }

            // DEBUG
            healthValue.innerHTML = this.HP;
        },
        takeDamage: function(hpLost) {
            Audio.playSound("damage");
            flashFX.flash("red", .2);
            this.HP -= hpLost;

            // DEBUG
            healthValue.innerHTML = this.HP;

            //If the hp of the player is 0, game over
            if (this.HP <= 0) {
                Audio.playSound("death");

                for (var i = 0; i < this.playersArray.length; i++) {
                    this.playersArray[i].removeComponent("Persist")
                        .dePersistifyInventory();
                }
                Crafty.scene("gameOverScreen");
            }
        },
        //next to something and face it
        nextToAndFace : function(obj){
            var playerCoord = getTileCoord(this);
            var objCoord = getTileCoord(obj);
            if (this.direction === GLOBAL.direction.left && playerCoord.x - objCoord.x === 1 && playerCoord.y === objCoord.y){
                return GLOBAL.direction.left;
            }
            if (this.direction === GLOBAL.direction.right && objCoord.x - playerCoord.x === 1 && playerCoord.y === objCoord.y){
                return GLOBAL.direction.right;
            }
            if (this.direction === GLOBAL.direction.up && playerCoord.y - objCoord.y === 1 && playerCoord.x === objCoord.x){
                return GLOBAL.direction.up;
            }
            if (this.direction === GLOBAL.direction.down && objCoord.y - playerCoord.y === 1 && playerCoord.x === objCoord.x){
                return GLOBAL.direction.down;
            }
            return 0;
        },
        //next to something
        nextTo : function(obj){
            var playerCoord = getTileCoord(this);
            var objCoord = getTileCoord(obj);
            if (playerCoord.x - objCoord.x === 1 && playerCoord.y === objCoord.y){
                return true;
            }
            if (objCoord.x - playerCoord.x === 1 && playerCoord.y === objCoord.y){
                return true;
            }
            if (playerCoord.y - objCoord.y === 1 && playerCoord.x === objCoord.x){
                return true;
            }
            if (objCoord.y - playerCoord.y === 1 && playerCoord.x === objCoord.x){
                return true;
            }
            return false;
        },
        resetPath : function(idx){
            this.path[idx] = [];
            this.path[idx][0] = makeVector(0,0);
            this.path[idx][1] = getTileCoord(this);
        }
    });

    Crafty.c("Inventory", {
        currentItemNumber: 0,
        init: function() {
            this.items = [];
            this.inventoryActive = false;
            this.activationTime = 0;
            this.items.push(Crafty.e("2D, Canvas, I_redFlashLight, Persist, FlashLight").attr( {z: 9, visible: false} ));
//            this.items.push(Crafty.e("2D, Canvas, I_blueFlashLight, Persist, FlashLight2").attr( {z: 9, visible: false} ));
//            this.items.push(Crafty.e("2D, Canvas, I_yellowFlashLight, Persist, FlashLight3").attr( {z: 9, visible: false} ));
            this.items.push(Crafty.e("2D, Canvas, I_sandwich, Food, Persist").attr( {z: 9, visible: false} ));
            this.items.push(Crafty.e("2D, Canvas, I_fryingPan, Persist, FryingPan").attr( {z:9, visible:false}));
            this.items.push(Crafty.e("2D, Canvas, I_equipbroom, Persist, Broom").attr( {z:9, visible:false}));
            this.items.push(Crafty.e("2D, Canvas, I_wetPlunger, Persist, Plunger").attr( {z:9, visible:false}));
            this.items.push(Crafty.e("2D, Canvas, I_ironKey, Persist, BlackKey").attr( {z:9, visible:false} ));
            this.items.push(Crafty.e("2D, Canvas, I_GemGreen, Persist, GemGreen").attr( {z:9, visible:false}));
            this.items.push(Crafty.e("2D, Canvas, I_GemBlue, Persist, GemBlue").attr( {z:9, visible:false}));
            this.items.push(Crafty.e("2D, Canvas, I_GemRed, Persist, GemRed").attr( {z:9, visible:false}));

            for (var i = 0; i < this.items.length; i++) {
                this.items[i].removeComponent("Interactable");
            }

            // TODO: Consider optimization.
            this.bind("EnterFrame", function() {
                if (this.items[this.currentItemNumber] != null) {
                    this.items[this.currentItemNumber].attr( {x: this.x, y: this.y - GLOBAL.tileW} );
                    if (this.inventoryActive && this.activationTime + 1 < new Date().getSeconds()) {
                        this.inventoryActive = false;
                        this.items[this.currentItemNumber].attr({ visible: false, x: 0, y: 0 });
                    }
                }
            });
        },

        cycleAndDisplayItems: function() {
            this.inventoryActive = true;
            Audio.playSound("inventory");

            // Rotate items
            if (this.items.length >= 1) {
                if (this.currentItemNumber < this.items.length - 1) {
                    this.items[this.currentItemNumber].visible = false;
                    this.currentItemNumber++;
                    this.items[this.currentItemNumber].visible = true;
                }
                else {
                    this.items[this.currentItemNumber].visible = false;
                    this.currentItemNumber = 0;
                    this.items[this.currentItemNumber].visible = true;
                }
            }

            this.activationTime = new Date().getSeconds();
        },

        cycleItems: function() {
            if (this.items.length >= 1) {
                if (this.currentItemNumber < this.items.length - 1) {
                    this.currentItemNumber++;
                }
                else {
                    this.currentItemNumber = 0;
                }
            }
        },

        useCurrentItem: function(player, playerDirection, interactingObject) {
            if (this.getCurrentItem() != null) {
                if (this.getCurrentItem().use(player, playerDirection, interactingObject)) {
                    this.removeCurrentItem();
                }
            }
        },

        getCurrentItem: function() {
            if (this.items.length > 0)
                return this.items[this.currentItemNumber];
        },

        removeCurrentItem: function() {
            if (this.items.length > 0) {
                Audio.playSound("itemDrop");
                var removedItemArr = this.items.splice(this.currentItemNumber, 1);
                this.cycleItems();

                removedItemArr[0].removeComponent("Persist");
                removedItemArr[0].addComponent("Interactable");
                return removedItemArr[0];
            }

            return null;
        },

        addNewItem: function(item) {
            // Remove interactable so it doesn't autoset as the interactable item
            // when you have your inventory open.
            item.removeComponent("Interactable");
//            if (this.items.length <= 4) {
                Audio.playSound("itemPickup");
                item.addComponent("Persist");
                item.z = 9;
                this.items.push(item);
                this.currentItemNumber = this.items.length - 1;
                this.items[this.currentItemNumber].visible = false;

//            }
//            else {
//                var oldItem = this.items.splice(this.currentItemNumber, 1, item);
//                oldItem[0].attr( {visible: true} );
//                // Draw the oldItem on the floor.
//                Crafty.e("2D, Canvas, " + oldItem)
//                    .attr( {x: item.x, y: item.y, z: item.z} );
//            }
        },

        dePersistifyInventory: function() {
            for (var i = 0; i < this.items.length; i++) {
                this.items[i].removeComponent("Persist");
            }
        }
    });

    Crafty.c("PopUpTextGen", {
        currentlyDisplaying: false,
        displayDescription : function(interactingObject, faceDirection) {
            if (!this.currentlyDisplaying) {
                this.currentlyDisplaying = true;
                var textGenerator = Crafty.e("2D, DOM, Persist, TextPrinter")
                    .attr( {x: 20, y: 20, w: 100, z: 20} );
                // Lots of magic numbers here to optimize text positioning.
                if (faceDirection === GLOBAL.direction.left) {
                    textGenerator.attr( {x: interactingObject.x - GLOBAL.tileW - 95, y: interactingObject.y - 20} );
                }
                else if (faceDirection === GLOBAL.direction.right) {
                    textGenerator.attr( {x: interactingObject.x + GLOBAL.tileW, y: interactingObject.y - 20} );
                }
                else if (faceDirection === GLOBAL.direction.up) {
                    textGenerator.attr( {x: interactingObject.x - 50, y: interactingObject.y - GLOBAL.tileW - 40} );
                }
                else if (faceDirection === GLOBAL.direction.down) {
                    textGenerator.attr( {x: interactingObject.x - 50, y: interactingObject.y + GLOBAL.tileW + 2} );
                }
                textGenerator.print(interactingObject.popUpText);

                var player = this;

                textGenerator.bind("EnterFrame", function() {
                    if (player.x != player.old_pos[0] || player.y != player.old_pos[1]) {
                        player.currentlyDisplaying = false;
                        textGenerator.deleteText();
                        textGenerator.destroy();
                    }
                })
            }
        }
    });

})();