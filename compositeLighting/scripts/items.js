// items.js
// Contains component definitions for
// all pickupable entities.

(function() {

    Crafty.c ("Item",{
        carried: false,
        init: function() {
            this.addComponent("Persist");
            this.addComponent("TextBox");
            this.attr({w:GLOBAL.tileW, h:GLOBAL.tileW});
            this.carried = false;
            this.addComponent("Collision").onHit("I_player", function(hit) {
                if(GLOBAL.p1Interacting == true){
                    if(this.carried == false){
                        this.carried = true;
                        hit[0].obj.addNewItem(this);

                        if(!GLOBAL.p1Tbox){
                            this.displayDescription(this.description);
                        }
                    }
                }
            })
        },

        drop: function(obj, facing){
          if(obj != null) {
            this.carried = false;
            this.removeComponent("Persist");
            var tempItem = obj.getCurrentItem();
            obj.removeCurrentItem();

            if(facing ==  GLOBAL.direction.up){tempItem.attr( {x: obj.x, y: obj.y - GLOBAL.tileW, visible: true})}
            if(facing ==  GLOBAL.direction.down){tempItem.attr( {x: obj.x, y: obj.y + GLOBAL.tileW, visible: true})}
            if(facing ==  GLOBAL.direction.left){tempItem.attr( {x: obj.x - GLOBAL.tileW, y: obj.y, visible: true})}
            if(facing ==  GLOBAL.direction.right){tempItem.attr( {x: obj.x + GLOBAL.tileW, y: obj.y, visible: true})}
          }
        }
    });


    // Push function, animation
    Crafty.c("Push",{
        facing : 0,
        life : 60,
        init: function(){
            this.addComponent("Collision");
            this.bind("EnterFrame", function() {
                if(this.facing ==  GLOBAL.direction.up){this.y -= 2}
                if(this.facing ==  GLOBAL.direction.down){this.y += 2}
                if(this.facing ==  GLOBAL.direction.left){this.x -= 2}
                if(this.facing ==  GLOBAL.direction.right){this.x += 2}
                this.life --;
                if(this.life <= 0){this.destroy()}
            });
            this.onHit("Pushable", function(hit) {
                if(this.facing ==  GLOBAL.direction.left)
                    hit[0].obj.x = hit[0].obj.x - 1;
                if(this.facing ==  GLOBAL.direction.right)
                    hit[0].obj.x = hit[0].obj.x + 1;
                if(this.facing ==  GLOBAL.direction.up)
                    hit[0].obj.y = hit[0].obj.y - 1;
                if(this.facing ==  GLOBAL.direction.down)
                    hit[0].obj.y = hit[0].obj.y + 1;
            });
        }
    });


    // Broom - Attacks with broom or picks it up, attacking pushes monster back around 3 tiles
    // "useful for sweeping or keeping monsters at bay"
    Crafty.c("Broom", {
        broom_push : null,
        description : " ",
        beingUsed : false,
            init: function(){
            this.addComponent("I_equipbroom");
            this.addComponent("PlayerText");
            this.addComponent("SpriteAnimation");
            this.animate("hit left",4,1,4);
            this.addComponent("Description").setDescription("A sturdy broom");
        },
        use: function(obj, dir){
            this.broom_push = Crafty.e("2D, Canvas, I_equipbroom, Push")
                .attr({x:obj.x,y:obj.y,z:9})
                .facing = dir;
            this.beingUsed = true;
        }
    });


    // FryingPan - Attacks with frying pan or picks it up, attacking pushes monster back around 3 tiles
    // "A frying pan, used mainly for hitting things"
    Crafty.c ("FryingPan",{
        broom_push : null,
        description : " ",
        beingUsed : false,
        init: function(){
            this.addComponent("I_fryingPan");
            this.addComponent("PlayerText");
            this.addComponent("SpriteAnimation");
            this.animate("hit left",4,1,4);
            this.addComponent("Description").setDescription("A frying pan, used mainly for hitting things");
        },
        use: function(obj, dir){
            this.broom_push = Crafty.e("2D, Canvas, I_fryingPan, Push")
                .attr({x:obj.x,y:obj.y,z:9})
                .facing = dir;
            this.beingUsed = true;
        }
    });


    // Plunger - Attacks with plunger or picks it up, attacking pushes monster back around 3 tiles
    // "A sturdy plunger, great for plunging toilets"
    Crafty.c ("Plunger",{
        broom_push : null,
        description : " ",
        beingUsed : false,
        init: function(){
            this.addComponent("I_wetPlunger");
            this.addComponent("PlayerText");
            this.addComponent("SpriteAnimation");
            this.animate("hit left",4,1,4);
            this.addComponent("Description").setDescription("A sturdy plunger, great for plunging toilets");
        },
        use: function(obj, dir){
            this.broom_push = Crafty.e("2D, Canvas, I_wetPlunger, Push")
                .attr({x:obj.x,y:obj.y,z:9})
                .facing = dir;
            this.beingUsed = true;
        }
    });


    // BrokenLamp:  “This is a lamp. It’s broken”
    Crafty.c ("BrokenLamp", {
        description : " ",
        beingUsed : false,
        init: function(){
            this.addComponent("I_brokenLamp");
            this.addComponent("PlayerText");
            this.addComponent("Description").setDescription("This is a lamp. It’s broken");
        }
    });


    // Gem - These sit in your inventory, you need to give three of them to the statue to get the black key (The thing with StatueKey)
    Crafty.c ("GemGreen",{
        description : " ",
        beingUsed : false,
        init: function(){
            this.addComponent("I_GemGreen");
            this.addComponent("PlayerText");
            this.addComponent("Description").setDescription("Gem-Green 1/3");
        }
    });

    Crafty.c ("GemBlue",{
        description : " ",
        beingUsed : false,
        init: function(){
            this.addComponent("I_GemBlue");
            this.addComponent("PlayerText");
            this.addComponent("Description").setDescription("Gem-Blue 1/3");
            }
    });

    Crafty.c ("GemRed",{
        description : " ",
        beingUsed : false,
        init: function(){
            this.addComponent("I_GemRed");
            this.addComponent("PlayerText");
            this.addComponent("Description").setDescription("Gem-Red 1/3");
        }
    });


    //
    Crafty.c("TextBox",{
        displayDescription : function(words) {
            var textBox = Crafty.e("2D, Canvas, Persist, Color, Text")
                .attr({h: 10, w: 25, x: 25, y: 25, z: 20, visible: false})
                .color("Black");

            var textTimer = 120;
            GLOBAL.p1Tbox = true
            textBox.bind("EnterFrame", function() {
                textBox.visible = true;
                textBox.x = player.x;
                textBox.y = player.y - 30;
                textTimer --;
                textBox.text(words);
                textBox.textColor('#FFFFFF');
                if(textTimer <= 0){
                    textBox.destroy();
                    GLOBAL.p1Tbox = false;
                }
            })
        }
    });


    // Food
    Crafty.c("Food", {       // engine
        HpRecovery : 30,     // variable (all)
        init: function() {
            this.addComponent('Description').setDescription("Food: A tasty sandwich");
        },

        use : function(currentPlayer,dir){
            if(currentPlayer.HP < 70){
                currentPlayer.HP += this.HpRecovery;
            }else{
                currentPlayer.HP = GLOBAL.MaxHP;
            }
            //put health recovery animation and other things...
        }
    });


    //
    Crafty.c("Description",{
        description: 'A description is needed',
        setDescription: function(words){
            this.description = words;
        }
    });


    // FlashLight-main
    Crafty.c("FlashLight", {
        lightedTiles : [],
        range : 200,
        angle : 0.7,//cosine
        direction : makeVector(0,1),
        isOn : false,
        isActivated : false,
        use: function(currentPlayer, dir) {
            if (!currentPlayer.isActivated) {
                currentPlayer.isActivated = true;
                Crafty.bind("EnterFrame", function(){
                    if (currentPlayer.isOn) {
                        currentPlayer.light();
                    }
                });
            }

            if (currentPlayer.isOn) {
                currentPlayer.isOn = false;
            } else {
                currentPlayer.isOn = true;
            }
        },
        light: function() {
            var shinePointX = this.x;
            var shinePointY = this.y;
            if (this.direction.x === 0) {
                if (this.direction.y === -1) {
                    shinePointY -= GLOBAL.tileW;
                }
                else if (this.direction.y === 1) {
                    shinePointY += GLOBAL.tileW;
                }
            }
            else if (this.direction.y === 0) {
                if (this.direction.x === -1) {
                    shinePointX -= GLOBAL.tileW;
                }
                else if (this.direction.x === 1) {
                    shinePointX += GLOBAL.tileW;
                }
            }
            var adjacentTiles = [];
            var tileLen = this.lightedTiles.length;
            console.log(tileLen);
            //eliminate those light cannot affect
            for (var i = tileLen; i--; ) {
                var currentTile = this.lightedTiles[i];
                var deltaX = currentTile.x - shinePointX;
                var deltaY = currentTile.y - shinePointY;
                //those light cannot affect
                if (deltaX <= this.range && deltaX >= -this.range && deltaY <= this.range && deltaY >= -this.range) {
                    adjacentTiles.push(currentTile);
                }
            }
            var level = Crafty("TiledLevel");
            var adjaLen = adjacentTiles.length;
            for (var i = adjaLen; i-- ;) {
                var currentTile = adjacentTiles[i];
                var vec = makeVector(currentTile.x - shinePointX, currentTile.y - shinePointY);
                //calculate the angle with light direction(in cos form).
                var cos = calcCosine(vec, this.direction);
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
                //light area within angle and not blocked
                if(cos >= this.angle && blocked === false){
                    //nearer tiles are brighter
                    var lightPower = (this.range - Math.sqrt(vec.x * vec.x + vec.y * vec.y)) / this.range;
                    if (currentTile.alpha < lightPower)
                        currentTile.alpha = lightPower;
                }
                else if (currentTile.alpha != currentTile.defaultAlpha)
                    currentTile.alpha = currentTile.defaultAlpha;
            }
        },
        setLightRange : function(range){
            this.range = range;
        },

        setLightAngle : function(angle){
            this.angle = angle;
        },

        setLightDir : function(direction){
            this.direction = direction;
        }
    });

    // FlashLight2
    Crafty.c("FlashLight2", {

        use : function(obj, facing) {
            obj.attr({
                range : 400,
                angle : .7});

        }
    });

    // FlashLight3
    Crafty.c("FlashLight3", {

        use : function(obj, facing) {
            obj.attr({
                range : 200,
                angle :-.9});
        }
    });


    //
    Crafty.c ("BoxDrop", {
        init: function(){
            this.addComponent('Color');
            this.attr({h: GLOBAL.tileW, w: GLOBAL.tileW});
            this.color('Purple');
        },
        use: function(obj, dir){
            var box = obj.getCurrentItem();
            obj.removeCurrentItem();
            box.addComponent("Collides");
            if(dir ==  GLOBAL.direction.up){
                box.attr( {x: obj.x, y: obj.y - GLOBAL.tileW, visible: true})
            }
            if(dir ==  GLOBAL.direction.down){
                box.attr( {x: obj.x, y: obj.y + GLOBAL.tileW, visible: true})
            }
            if(dir ==  GLOBAL.direction.left){
                box.attr( {x: obj.x - GLOBAL.tileW, y: obj.y, visible: true})
            }
            if(dir ==  GLOBAL.direction.right){
                box.attr( {x: obj.x + GLOBAL.tileW, y: obj.y, visible: true})
            }
        }
    });

    
})();