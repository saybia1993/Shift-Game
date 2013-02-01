// miscComponents.js
// Contains all components that
// are not world objects or items.

(function() {

    /* Component Tags
        Unlisted components (these components are just tags)
            - Collides
    */

    Crafty.c("MapTile", {
        defaultAlpha: 0
    });

    Crafty.c("Movable", {
        velocity : 0,
        direction: GLOBAL.direction.none,
        init : function() {
            this.velocity = makeVector(0,0);
        },
        updatePosition : function(){
            this.x += this.velocity.x;
            this.y += this.velocity.y;
        },
        scaleSpeed : function(factor){
            this.velocity.x *= factor;
            this.velocity.y *= factor;
        }
    });

    Crafty.c("Moveable", {
        oldBlockPos : [this.x, this.y],
        connectedObj : null,
        init: function() {
            this.z = 5;
            this.addComponent("Collision").onHit("Collides", function() {
                this.x = this.oldBlockPos[0];
                this.y = this.oldBlockPos[1];
            });

            this.bind('EnterFrame', function() {
                this.oldBlockPos = [this.x, this.y];
            });
        },

        linkObjects: function(objList) {
            var thisObj = this;
            function getOtherMoveableObject() {
                for (var i = 0; i < objList.length; i++) {
                    if (thisObj.x < GLOBAL.viewport.w / 2) {
                        if (thisObj.x + GLOBAL.viewport.w / 2 === objList[i].x &&
                            thisObj.y === objList[i].y) {
                            return objList[i];
                        }
                    }
                    else {
                        if (thisObj.x === objList[i].x + GLOBAL.viewport.w / 2 &&
                            thisObj.y === objList[i].y) {
                            return objList[i];
                        }
                    }
                }
                alert("Item not found!");
                return null;
            }

            this.connectedObj = getOtherMoveableObject();
        }
    });

    Crafty.c("Halo", {
        haloRadius: 40,
        init:function() {
            this.bind("DoLighting", function() {
                lightFX.createLightCircle(this.x + this.w / 2, this.y + this.h /2 , this.haloRadius);
//                lightFX.createLightCone(this.x + this.w / 2, this.y + this.h /2, this.direction, 0);
            })
        }
    })

    Crafty.c("PopUpText", {
        setPopUpText: function(text) {
            this.popUpText = text;
        },
        interact : function(player, faceDirection) {
            if (faceDirection === GLOBAL.direction.left && player.x < 100) {
                player.displayDescription(this, GLOBAL.direction.right);
            }
            else if (faceDirection === GLOBAL.direction.up && player.y < 100) {
                player.displayDescription(this, GLOBAL.direction.down);
            }
            else if (faceDirection === GLOBAL.direction.right && player.x > GLOBAL.viewport.h - 100) {
                player.displayDescription(this, GLOBAL.direction.left);
            }
            else if (faceDirection === GLOBAL.direction.down && player.x > GLOBAL.viewport.w - 100) {
                player.displayDescription(this, GLOBAL.direction.up);
            }
            else {
                player.displayDescription(this, faceDirection);
            }
        }
    });
 
    // Push function, animation
    // TODO: Check if is this used?
    Crafty.c("Push",{
        facing : 0,
        life : 60,
        init: function(){
            this.addComponent("Collision");
            this.bind("EnterFrame", function() {
                if (this.facing ==  GLOBAL.direction.up){this.y -= 2}
                if (this.facing ==  GLOBAL.direction.down){this.y += 2}
                if (this.facing ==  GLOBAL.direction.left){this.x -= 2}
                if (this.facing ==  GLOBAL.direction.right){this.x += 2}
                this.life --;
                if (this.life <= 0){this.destroy()}
            });
            this.onHit("Moveable", function(hit) {
                if (this.facing ==  GLOBAL.direction.left)
                    hit[0].player.x = hit[0].player.x - 1;
                if (this.facing ==  GLOBAL.direction.right)
                    hit[0].player.x = hit[0].player.x + 1;
                if (this.facing ==  GLOBAL.direction.up)
                    hit[0].player.y = hit[0].player.y - 1;
                if (this.facing ==  GLOBAL.direction.down)
                    hit[0].player.y = hit[0].player.y + 1;
            });
        }
    });

    Crafty.c("TextPrinter", {
        init: function() {
            this.addComponent("Delay")
                .css({"font": "10pt Courier", "color": "#FFF", "text-align": "center"});
        },
        // 14 = Line width
        print: function(inputText) {
            var spacedText = "";
            var allCharsInArray = false;
            var start = 0;
            var lineLength = 14;

            while (!allCharsInArray) {
                if (start + lineLength >= inputText.length) {
                    spacedText = spacedText.concat(inputText.substring(start, inputText.length));
                    allCharsInArray = true;
                }
                else {
                    for (var i = start + lineLength; i > start; i--) {
                        if (inputText.charAt(i) === " ") {
                            spacedText = spacedText.concat(inputText.substring(start, i) + "<br />");
                            start = i + 1;
                            break;
                        }
                    }
                }
            }

            this.text = document.createElement('div');
            // 120px width means max font characters/line is 14.
            this.text.setAttribute("style", "position: absolute; font-style: normal; font-variant: normal; font-weight: normal;" +
                " font-size: 10pt; line-height: normal; font-family: Courier; color: rgb(255, 255, 255); text-align: center;" +
                " visibility: visible; width: 120px; z-index: 20; opacity: 1; -webkit-transform: translate3d(" + this.x + "px, " + this.y + "px, 0);");
            document.getElementById("cr-stage").appendChild(this.text);

            var start = [0, 0, 0, 0];
            var end = 0;
            for (var i = 0; i < spacedText.length; i++) {
                this.delay(function() {
                    // If the char is a line break...
                    if (spacedText.charAt(end - 1) === "<") {
                        if (start[1] === 0) {
                            start[1] = end + 5;
                            end += 5;
                        }
                        else if (start[2] === 0) {
                            start[2] = end + 5;
                            end += 5;
                        }
                        else if (start[3] === 0) {
                            start[3] = end + 5;
                            end += 5;
                        }
                        else {
                            start[0] = start[1];
                            start[1] = start[2];
                            start[2] = start[3];
                            start[3] = end + 5;
                            end += 5;
                        }
                    }
                    else {
                        this.text.innerHTML = spacedText.substring(start[0], end);
                        end++;
                    }
                }, i * 50 - Math.random() * 25);
            }
        },
        deleteText: function() {
            document.getElementById("cr-stage").removeChild(this.text);
        }
    });

})();