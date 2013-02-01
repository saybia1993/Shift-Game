// miscComponents.js
// Contains all components that
// are not world objects or items.
// This includes: player, inventory, etc.

(function() {

    /* Component Tags
        Unlisted components (these components are just tags)
            - Collides
    */


    Crafty.c("MapTile", {
        defaultAlpha: 0
    });

    Crafty.c("Player", {
        interactingObject : null,
        HP : GLOBAL.MaxHP,
        //Tiles that player has walked
        path : [],
        direction : 0,
        speed : 1.5,
        old_pos : [0,0],

        player : function(playerNumber) {
            this.HP = GLOBAL.MaxHP;
            var up = false;
            var down = false;
            var left = false;
            var right = false;
            var interact = false;

            var upKey;
            var downKey;
            var leftKey;
            var rightKey;
            var interactKey;
            var itemKey;
            var itemDropKey;

            if (playerNumber === 1) {
                upKey = GLOBAL.p1Keys.Up;
                downKey = GLOBAL.p1Keys.Down;
                leftKey = GLOBAL.p1Keys.Left;
                rightKey = GLOBAL.p1Keys.Right;
                interactKey = GLOBAL.p1Keys.Interact;
                itemKey = GLOBAL.p1Keys.UseItem;
                itemDropKey = GLOBAL.p1Keys.DropItem;
                this.addComponent('Inventory');
            }
            else {
                upKey = GLOBAL.p2Keys.Up;
                downKey = GLOBAL.p2Keys.Down;
                leftKey = GLOBAL.p2Keys.Left;
                rightKey = GLOBAL.p2Keys.Right;
                interactKey = GLOBAL.p2Keys.Interact;
                itemKey = GLOBAL.p2Keys.UseItem;
                itemDropKey = GLOBAL.p2Keys.DropItem;
                this.addComponent('Inventory2');
            }

            this.addComponent('SpriteAnimation');
            this.addComponent('Collision');
            this.addComponent('MovingLight');
            this.animate("walk_left", 0,2,1);
            this.animate("walk_right", 2,2,3);
            this.animate("walk_up", 0,1,3);
            this.animate("walk_down", 0,0,3);
            this.addComponent("PlayerText");
            this.stop();

            this.bind('KeyDown', function(e) {

                //if keys are down, set the direction
                if(e.keyCode === leftKey) {
                    left = true;
                    right = false;
                    up = false;
                    down = false;
                    this.direction = GLOBAL.direction.left;
                    this.setLightDir(makeVector(-1,0));
                }
                if(e.keyCode === rightKey) {
                    left = false;
                    right = true;
                    up = false;
                    down = false;
                    this.direction = GLOBAL.direction.right;
                    this.setLightDir(makeVector(1,0));
                }
                if(e.keyCode === upKey) {
                    left = false;
                    right = false;
                    up = true;
                    down = false;
                    this.direction = GLOBAL.direction.up;
                    this.setLightDir(makeVector(0,-1));
                }
                if(e.keyCode === downKey) {
                    left = false;
                    right = false;
                    up = false;
                    down = true;
                    this.direction = GLOBAL.direction.down;
                    this.setLightDir(makeVector(0,1));
                }

                if(e.keyCode === itemDropKey) {
                    if(this.getCurrentItem() != null){
                        this.getCurrentItem().drop(this, this.direction);
                    }
                }

                if(e.keyCode === itemKey) {
                    if(this.getCurrentItem() != null){
                        this.getCurrentItem().use(this, this.direction);
                    }
                }

                if(e.keyCode === interactKey){
                    GLOBAL.p1Interacting = true;
                    if(this.nextToAndFace(this.interactingObject)){
                        this.interactingObject.interact();
                    }
                }
            });

            this.bind('KeyUp', function(e) {
                //if key is released, stop moving
                if(e.keyCode === leftKey) left = false;
                if(e.keyCode === rightKey) right = false;
                if(e.keyCode === upKey) up = false;
                if(e.keyCode === downKey) down = false;
                if(e.keyCode === interactKey)GLOBAL.p1Interacting = false;
                if (e.keyCode === interactKey) interact = false;
                if (e.keyCode === itemKey) this.getCurrentItem().beingUsed = false;

                this.stop();
            });

            this.bind('EnterFrame', function() {
                //move the player in a direction depending on the booleans
                //only move the player in one direction at a time (up/down/left/right)
                this.old_pos = [this.x, this.y];
                if(right) {
                    this.x += this.speed;
                    if(!this.isPlaying("walk_right"))
                        this.stop().animate("walk_right", 10);

                }
                if(left) {
                    this.x -= this.speed;
                    if(!this.isPlaying("walk_left"))
                        this.stop().animate("walk_left", 10);
                }

                if(up) {
                    this.y -= this.speed;
                    if(!this.isPlaying("walk_up"))
                        this.stop().animate("walk_up", 10);
                }

                if(down) {
                    this.y += this.speed;
                    if(!this.isPlaying("walk_down"))
                        this.stop().animate("walk_down", 10);
                }

                //If curTile not equals to the last tile in the path (moved to a new tile), push new tile.
                var curTile = getTileCoord(this);
                if(curTile.x != this.path[this.path.length-1].x || curTile.y != this.path[this.path.length-1].y){
                    this.path.push(curTile);
                }

                //If the hp of the player is 0, game over
                if(this.HP <= 0){
                    Crafty.scene("gameOverScreen");
                }

            /*
              var lightCtx = GLOBAL.lightCtx;
                lightCtx.globalAlpha = 1;
                lightCtx.globalCompositeOperation = "source-over";
                lightCtx.fillRect(0, 0, GLOBAL.viewport.w, GLOBAL.viewport.h);

                lightCtx.globalCompositeOperation = "destination-out";
                var angle;
                var position;
                if (this.direction === GLOBAL.direction.right) {
                    angle = 0;
                }
                else if (this.direction === GLOBAL.direction.left) {
                    angle = Math.PI;
                }
                else if (this.direction === GLOBAL.direction.up) {
                    angle = -Math.PI / 2;
                }
                else if (this.direction === GLOBAL.direction.down) {
                    angle = Math.PI / 2;
                }
                lightCtx.globalAlpha = .1;

                for (var i = 0; i < 10; i++) {
                    lightCtx.beginPath();
                    lightCtx.globalAlpha = .05;
                    lightCtx.arc(this.x + this.w / 2, this.y + this.h / 2, i * 2 + 35, 0, Math.PI * 2, false);

//                    lightCtx.arc(this.x + this.w / 2, this.y + this.h / 2, 200 + (i*5), angle + -Math.PI / 6 + i / (10*Math.PI), angle + Math.PI / 6 - i / (10*Math.PI), clockwise);
                   // lightCtx.globalAlpha = .1;
                    lightCtx.closePath();
                    lightCtx.fill();

                    lightCtx.beginPath();
                    lightCtx.lineTo(this.x + this.w / 2 + (200 + i*2) * (Math.cos(angle + Math.PI/8 - i / (30*Math.PI))), this.y + this.h / 2 + (200 + i*2) * (Math.sin(angle + Math.PI/8 - i / (30*Math.PI ))));
                    lightCtx.lineTo(this.x + this.w / 2 + (200 + i*2) * (Math.cos(angle - Math.PI/8 + i / (30*Math.PI))), this.y + this.h / 2 + (200 + i*2) * (Math.sin(angle - Math.PI/8 + i / (30*Math.PI ))));
                    lightCtx.lineTo(this.x + this.w / 2, this.y + this.h / 2);
                    lightCtx.closePath();
                    lightCtx.fill();

                }*/
            });

            this.bind('DoLighting', function() {

                var lightCtx = GLOBAL.lightCtx;

                lightCtx.globalCompositeOperation = "destination-out";
                var angle = 0;
                var position;

                //this.direction does not seem to recall an object. Problem with linux, or problem with logic????
                if (this.direction === GLOBAL.direction.right) {
                    angle = 0;
                }
                else if (this.direction === GLOBAL.direction.left) {
                    angle = Math.PI;
                }
                else if (this.direction === GLOBAL.direction.up) {
                    angle = -Math.PI / 2;
                }
                else if (this.direction === GLOBAL.direction.down) {
                    angle = Math.PI / 2;
                }
                lightCtx.globalAlpha = .1;
                for (var i = 0; i < 10; i++) {

                    //draw circle around player
                    lightCtx.beginPath();
                    lightCtx.globalAlpha = .1;
                    lightCtx.arc(this.x + this.w / 2, this.y + this.h / 2, i * 2 + 35, 0, Math.PI * 2, false);
                    lightCtx.closePath();
                    lightCtx.fill();

                    lightCtx.globalAlpha = .1;

                    //draw cone for flashlight
                    lightCtx.beginPath();
                    lightCtx.lineTo(this.x + this.w / 2, this.y + this.h / 2);
                    lightCtx.lineTo(this.x + this.w / 2 + (200 + i*2) * (Math.cos(angle + Math.PI/8 - i / (30*Math.PI))), this.y + this.h / 2 + (200 + i*2) * (Math.sin(angle + Math.PI/8 - i / (30*Math.PI ))));
                    lightCtx.lineTo(this.x + this.w / 2 + (200 + i*2) * (Math.cos(angle - Math.PI/8 + i / (30*Math.PI))), this.y + this.h / 2 + (200 + i*2) * (Math.sin(angle - Math.PI/8 + i / (30*Math.PI ))));
                    lightCtx.lineTo(this.x + this.w / 2, this.y + this.h / 2);
                    lightCtx.closePath();
                    lightCtx.fill();
                }

            });



            // ADD SPECIAL CHARACTERISTICS

            this.onHit("Pushable", function(hit) {
                if(left)
                    hit[0].obj.x = hit[0].obj.x - (this.speed)/2;
                if(right)
                    hit[0].obj.x = hit[0].obj.x + (this.speed)/2;
                if(up)
                    hit[0].obj.y = hit[0].obj.y - (this.speed)/2;
                if(down)
                    hit[0].obj.y = hit[0].obj.y + (this.speed)/2;
            });

            this.onHit("Lamp", function(obj){
                this.interactingObject = obj[0].obj;
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
            });

            return this;
        },
        //next to something and face it
        nextToAndFace : function(obj){
            var playerCoord = getTileCoord(this);
            var objCoord = getTileCoord(obj);
            if(this.direction === GLOBAL.direction.left && playerCoord.x - objCoord.x === 1 && playerCoord.y === objCoord.y){
                return true;
            }
            if(this.direction === GLOBAL.direction.right && objCoord.x - playerCoord.x === 1 && playerCoord.y === objCoord.y){
                return true;
            }
            if(this.direction === GLOBAL.direction.up && playerCoord.y - objCoord.y === 1 && playerCoord.x === objCoord.x){
                return true;
            }
            if(this.direction === GLOBAL.direction.down && objCoord.y - playerCoord.y === 1 && playerCoord.x === objCoord.x){
                return true;
            }
            return false;
        },
        //next to something
        nextTo : function(obj){
            var playerCoord = getTileCoord(this);
            var objCoord = getTileCoord(obj);
            if(playerCoord.x - objCoord.x === 1 && playerCoord.y === objCoord.y){
                return true;
            }
            if(objCoord.x - playerCoord.x === 1 && playerCoord.y === objCoord.y){
                return true;
            }
            if(playerCoord.y - objCoord.y === 1 && playerCoord.x === objCoord.x){
                return true;
            }
            if(objCoord.y - playerCoord.y === 1 && playerCoord.x === objCoord.x){
                return true;
            }
            return false;
        },
        resetPath : function(){
            this.path = [];
            this.path[0] = makeVector(0,0);
            this.path[1] = getTileCoord(this);
        }
    });

    Crafty.c("Pushable", {
        oldBlockPos : [this.x, this.y],
        init: function() {
            this.z = 5;
            this.addComponent("Collision").onHit("Collides", function() {
                this.x = this.oldBlockPos[0];
                this.y = this.oldBlockPos[1];
            });

            this.bind('EnterFrame', function() {
                this.oldBlockPos = [this.x, this.y];
            });
        }
    });


    Crafty.c("MovingLight", {
        init: function() {

        }
    });

    Crafty.c("PopUpText", {
        popUpText: ""
    });

    Crafty.c("NoLight", {
        init: function() {

        }
    });

    // To access current inventory item use: this.getCurrentItem()
    // To add an inventory item use: this.addNewItem(item)
    Crafty.c("Inventory", {
        items: [],
        currentItemNumber: 0,

        init: function() {
            var inventoryActive = false;
            var activationTime;
            this.items.push(Crafty.e("2D, Canvas, I_redFlashLight, Item, Persist, FlashLight").attr( {z: 20, visible: false} ));
            this.items.push(Crafty.e("2D, Canvas, I_blueFlashLight, Item, Persist, FlashLight2").attr( {z: 20, visible: false} ));
            this.items.push(Crafty.e("2D, Canvas, I_yellowFlashLight, Item, Persist, FlashLight3").attr( {z: 20, visible: false} ));
            this.items.push(Crafty.e("2D, Canvas, I_sandwich, Food, Item, Persist").attr( {z: 20, visible: false} ));
            this.items.push(Crafty.e("2D, Canvas, I_fryingPan, Item, Persist, FryingPan").attr( {z:20, visible:false}));
            this.items.push(Crafty.e("2D, Canvas, I_equipbroom, Item, Persist, Broom").attr( {z:20, visible:false}));
            this.items.push(Crafty.e("2D, Canvas, I_wetPlunger, Item, Persist, Plunger").attr( {z:20, visible:false}));
            this.items.push(Crafty.e("2D, Canvas, I_GemGreen, Item, Persist").attr( {z:20, visible:false}));
            this.items.push(Crafty.e("2D, Canvas, I_GemBlue, Item, Persist").attr( {z:20, visible:false}));
            this.items.push(Crafty.e("2D, Canvas, I_GemRed, Item, Persist").attr( {z:20, visible:false}));
            this.items.push(Crafty.e("2D, Canvas, I_brokenLamp, Item, Persist").attr( {z:20, visible:false}));

            this.bind('KeyDown', function(e) {
                if (e.keyCode === GLOBAL.p1Keys.Inventory) {
                    inventoryActive = true;

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

                    activationTime = new Date().getSeconds();
                }

              /*  else if (e.keyCode === GLOBAL.p1Keys.DropItem) {
                    var oldItem = this.items.splice(this.currentItemNumber, 1);
                    // Place item on ground
                    oldItem.attr( {x: this.x, y: this.y - GLOBAL.tileW, visible: true} );
                    // Rotate items
                    if (this.items.length > 1) {
                        if (this.currentItemNumber < this.items.length - 1) {
                            this.items[this.currentItemNumber].attr( {visible: false} );
                            this.currentItemNumber++;
                            this.items[this.currentItemNumber].attr( {visible: true} );
                        }
                        else {
                            this.items[this.currentItemNumber].attr( {visible: false} );
                            this.currentItemNumber = 0;
                            this.items[this.currentItemNumber].attr( {visible: true} );
                        }
                    }
                } */
            });

            this.bind("EnterFrame", function() {
            if(this.items[this.currentItemNumber] != null){
                this.items[this.currentItemNumber].attr( {x: this.x, y: this.y - GLOBAL.tileW} );
                if (inventoryActive && activationTime + 2 < new Date().getSeconds()) {
                    inventoryActive = false;
                    this.items[this.currentItemNumber].visible = false;
                }
            }
            });
        },

        getCurrentItem: function() {
            if (this.items.length > 0)
                return this.items[this.currentItemNumber];
            else
                return null;
        },


        removeCurrentItem: function() {
            this.items.splice(this.currentItemNumber, 1);
            this.currentItemNumber = 0;
        },

        addNewItem: function(item) {
            if (this.items.length <= 4) {
                this.items.push(item);
                this.currentItemNumber = this.items.length - 1;
                this.items[this.currentItemNumber].attr( {visible: false} )
            }
            else {
                var oldItem = this.items.splice(this.currentItemNumber, 1, item);
                oldItem[0].attr( {visible: true} );
                // Draw the oldItem on the floor.
                Crafty.e("2D, Canvas, " + oldItem)
                    .attr( {x: item.x, y: item.y, z: item.z} );
            }
        }
    });

    Crafty.c("Inventory2", {
        items: [],
        currentItemNumber: 0,

        init: function() {
            var inventoryActive = false;
            var activationTime;
            this.items.push(Crafty.e("2D, Canvas, I_redFlashLight, Item, Persist, FlashLight").attr( {z: 20, visible: false} ));
            this.items.push(Crafty.e("2D, Canvas, I_blueFlashLight, Item, Persist, FlashLight2").attr( {z: 20, visible: false} ));
            this.items.push(Crafty.e("2D, Canvas, I_yellowFlashLight, Item, Persist, FlashLight3").attr( {z: 20, visible: false} ));
            this.items.push(Crafty.e("2D, Canvas, I_sandwich, Food, Item, Persist").attr( {z: 20, visible: false} ));
            this.items.push(Crafty.e("2D, Canvas, I_fryingPan, Item, Persist, FryingPan").attr( {z:20, visible:false}));
            this.items.push(Crafty.e("2D, Canvas, I_equipbroom, Item, Persist, Broom").attr( {z:20, visible:false}));
            this.items.push(Crafty.e("2D, Canvas, I_wetPlunger, Item, Persist, Plunger").attr( {z:20, visible:false}));
            this.items.push(Crafty.e("2D, Canvas, I_GemGreen, Item, Persist").attr( {z:20, visible:false}));
            this.items.push(Crafty.e("2D, Canvas, I_GemBlue, Item, Persist").attr( {z:20, visible:false}));
            this.items.push(Crafty.e("2D, Canvas, I_GemRed, Item, Persist").attr( {z:20, visible:false}));
            this.items.push(Crafty.e("2D, Canvas, I_brokenLamp, Item, Persist").attr( {z:20, visible:false}));

            this.bind('KeyDown', function(e) {
                if (e.keyCode === GLOBAL.p2Keys.Inventory) {
                    inventoryActive = true;

                    // Rotate items
                    if (this.items.length >= 1) {
                        if (this.currentItemNumber < this.items.length - 1) {
                            this.items[this.currentItemNumber].visible = false;
                            this.currentItemNumber++;
                            this.items[this.currentItemNumber].visible = true;
                        } else {
                            this.items[this.currentItemNumber].visible = false;
                            this.currentItemNumber = 0;
                            this.items[this.currentItemNumber].visible = true;
                        }
                    }

                    activationTime = new Date().getSeconds();
                }

                /*  else if (e.keyCode === GLOBAL.p1Keys.DropItem) {
                 var oldItem = this.items.splice(this.currentItemNumber, 1);
                 // Place item on ground
                 oldItem.attr( {x: this.x, y: this.y - GLOBAL.tileW, visible: true} );
                 // Rotate items
                 if (this.items.length > 1) {
                 if (this.currentItemNumber < this.items.length - 1) {
                 this.items[this.currentItemNumber].attr( {visible: false} );
                 this.currentItemNumber++;
                 this.items[this.currentItemNumber].attr( {visible: true} );
                 }
                 else {
                 this.items[this.currentItemNumber].attr( {visible: false} );
                 this.currentItemNumber = 0;
                 this.items[this.currentItemNumber].attr( {visible: true} );
                 }
                 }
                 } */
            });

            this.bind("EnterFrame", function() {
                if(this.items[this.currentItemNumber] != null){
                    this.items[this.currentItemNumber].attr( {x: this.x, y: this.y - GLOBAL.tileW} );
                    if (inventoryActive && activationTime + 2 < new Date().getSeconds()) {
                        inventoryActive = false;
                        this.items[this.currentItemNumber].visible = false;
                    }
                }
            });
        },

        getCurrentItem: function() {
            if (this.items.length > 0)
                return this.items[this.currentItemNumber];
            else
                return null;
        },


        removeCurrentItem: function() {
            this.items.splice(this.currentItemNumber, 1);
            this.currentItemNumber = 0;
        },

        addNewItem: function(item) {
            if (this.items.length <= 4) {
                this.items.push(item);
                this.currentItemNumber = this.items.length - 1;
                this.items[this.currentItemNumber].attr( {visible: false} )
            }
            else {
                var oldItem = this.items.splice(this.currentItemNumber, 1, item);
                oldItem[0].attr( {visible: true} );
                // Draw the oldItem on the floor.
                Crafty.e("2D, Canvas, " + oldItem)
                    .attr( {x: item.x, y: item.y, z: item.z} );
            }
        }
    });

})();