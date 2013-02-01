// monsters.js
// Contains components for enemy
// entities including tracking
// algorithms.

(function() {

    Crafty.c("HasTarget", {
        target : null,
        init : function() {
        },
        resetTarget : function(){
            var source = this;
            Crafty("Player").each(function(){
                if (objInLeftSide(this)){
                    if (objInLeftSide(source)){
                        source.target = this;
                    }
                }
                else{
                    console.log(source.x);
                    if (!objInLeftSide(source)){
                        source.target = this;
                    }
                }
            });
//todo: temporary code, need to refactor later.
            //add one more path array to player;
            this.pathIdx = source.target.addPath();
        }
    });

    Crafty.c("Blobby", {
        // old_pos : [0,0] ,
        target : null,
        nextStep : null,
        nextStepIdx : 0,
        blobbySpeed : 1.6,
        damage : 25,
        states : {Wandering : 0, Seeking : 1, Shocking : 2, Eating : 3},
        curState : null,
        timer : 0,
        pathIdx : 0,
        init : function() {
            this.curState = this.states.Wandering;
            this.addComponent("I_blobbyDown, Movable,  Animated, HasTarget, Collision");

            this.setAnimation(this.animation.monsterLeft);
            this.setAnimation(this.animation.monsterRight);
            this.setAnimation(this.animation.monsterUp);
            this.setAnimation(this.animation.monsterDown);
            //this.stop();


            this.bind("EnterFrame", function(){
                //this.old_pos = [this.x, this.y];
                if (this.curState === this.states.Wandering){
                    if (this.targetDetected()){

                        //change state
                        this.curState = this.states.Seeking;

                        Audio.playMusic("blobbyTracking");

                        //reset target path information
                        this.target.resetPath(this.pathIdx);
                        this.nextStepIdx = 1;
                        this.setNextStep();
                        this.setVtoNextStep();
                        //this.velocity
                    }
                } else if (this.curState === this.states.Seeking){
                    this.animateByDir();
                    //continuous coordinates
                    var x = this.x;
                    var y = this.y;

                    var nextStepX = this.nextStep.x * GLOBAL.tileW;
                    var nextStepY = this.nextStep.y * GLOBAL.tileW;
                    if (!objInLeftSide(this.target)){
                        nextStepX += GLOBAL.viewport.w / 2;
                    }

                    var blobbyCoord = getTileCoord(this);
                    var targetTile = getTileCoord(this.target);

                    if (blobbyCoord.x != targetTile.x || blobbyCoord.y != targetTile.y){
                        //intercept player
                        if (this.target.nextTo(this)
                            && (this.nextStepIdx < this.getPath().length - 1)
                            && !(this.getPath()[this.nextStepIdx+1].x === targetTile.x && this.getPath()[this.nextStepIdx+1].y === targetTile.y)){
                            this.target.resetPath(this.pathIdx);
                            this.getPath().push(targetTile);
                            this.nextStepIdx = 1;
                            this.getPath()[this.nextStepIdx] = this.nextStep;

                        } else if(this.almostWithinTile(this.nextStep)){ //monster almost move into tile
                            this.alignToTile(this.nextStep);
                            //update nextStep and velocity(turn around).
                            if(this.nextStepIdx < this.getPath().length - 1){
                                this.nextStepIdx ++;
                            }
                            this.setNextStep();
                            this.setVtoNextStep();

                        } else{
                            this.updatePosition();
                        }

//                            else if (this.velocity.y === 0){
//                            //if next frame monster pass the middle point of nextStep tile
//                            if ((x - GLOBAL.delta - nextStepX) * (x + this.velocity.x - GLOBAL.delta - nextStepX) <= 0){
//                                //move monster directly to the middle point of nextStep tile
//                                this.x = nextStepX + GLOBAL.delta;
//                                this.y += this.velocity.y;
//                                //update nextStep and velocity(turn around).
//                                this.nextStepIdx ++;
//                                this.setNextStep();
//                                this.setVtoNextStep();
//                            }else{
//                                this.updatePosition();
//                            }
//                        } else if (this.velocity.x === 0){
//                            if ((y - GLOBAL.delta - nextStepY) * (y + this.velocity.y - GLOBAL.delta - nextStepY) <= 0){
//                                this.x += this.velocity.x;
//                                this.y = nextStepY + GLOBAL.delta;
//                                this.nextStepIdx ++;
//                                this.setNextStep();
//                                this.setVtoNextStep();
//                            }else{
//                                this.updatePosition();
//                            }
//                        }

                    }else{
                        // Take damage
                        this.target.takeDamage(this.damage);

                        this.scaleSpeed(0.25);

                        this.curState = this.states.Eating;
                    }

                    //If attacked by weapons, monster is shocking
                    if (this.target.getCurrentItem().beingUsed === true && this.target.nextToAndFace(this)){

                        Audio.stop("blobbyTracking");
                        Audio.playSound("damage");

                        var monsterCoord = getTileCoord(this);
                        var increment = 0;
                        var cnt = 3;
                        var curLevel = Crafty("TiledLevel");
                        var matrix = curLevel.getRelevantMatrix(this);
                        //initialization to current coordinate
                        this.nextStep.x = monsterCoord.x;
                        this.nextStep.y = monsterCoord.y;
                        if(this.velocity.x === 0 ){
                            increment = this.velocity.y / this.blobbySpeed;
                            for(var i = monsterCoord.y; cnt >= 0; i -= increment, cnt--){
                                //when there is no wall behind
                                if(matrix[monsterCoord.x][i] !== curLevel.tileType.blockable && matrix[monsterCoord.x][i] !== curLevel.tileType.nolight){
                                    //when monster is shocking, it steps back 3 tiles
                                    this.nextStep.x = monsterCoord.x;
                                    this.nextStep.y = i;
                                }else{
                                    break;
                                }
                            }
                        } else if(this.velocity.y === 0){
                            increment = this.velocity.x / this.blobbySpeed;
                            for(var i = monsterCoord.x; cnt >= 0; i -= increment, cnt--){
                                if(matrix[i][monsterCoord.y] !== curLevel.tileType.blockable && matrix[i][monsterCoord.y] !== curLevel.tileType.nolight){
                                    //when monster is shocking, it steps back 3 tiles
                                    this.nextStep.x = i;
                                    this.nextStep.y = monsterCoord.y;
                                }else{
                                    break;
                                }
                            }
                        }


                        this.setVtoNextStep();
                        //speed of steping back should be faster
                        this.scaleSpeed(2);
                        // if the monster is pushed to the wall and has no speed, let it wander
                        if(this.velocity.x === 0 && this.velocity.y === 0){
                            this.curState = this.states.Wandering;
                        } else{//otherwise, let it dash back
                            this.curState = this.states.Shocking;
                        }

                        this.target.getCurrentItem().beingUsed = false;

                    }

                } else if (this.curState === this.states.Shocking){

                    if(this.almostWithinTile(this.nextStep)){ //monster almost move into tile
                        this.alignToTile(this.nextStep);
                        this.startToWander();
                    } else{
                        this.updatePosition();
                    }

//                    if (this.velocity.y === 0){
//                        //if next frame monster pass the middle point of nextStep tile
//                        if ((this.x - GLOBAL.delta - nextStepX) * (this.x + this.velocity.x - GLOBAL.delta - nextStepX) <= 0){
//                            //move monster directly to the middle point of nextStep tile
//                            this.x = nextStepX + GLOBAL.delta;
//                            this.y += this.velocity.y;
//                            this.startToWander();
//                        }else{
//                            this.updatePosition();
//                        }
//                    }
//
//                    if (this.velocity.x === 0){
//                        if ((this.y - GLOBAL.delta - nextStepY) * (this.y + this.velocity.y - GLOBAL.delta - nextStepY) <= 0){
//                            this.x += this.velocity.x;
//                            this.y = nextStepY + GLOBAL.delta;
//                            this.startToWander();
//                        }else{
//                            this.updatePosition();
//                        }
//                    }

                } else if (this.curState === this.states.Eating){ //blobby catches the player

                    this.animateByDir();

                    this.updatePosition();

                    this.timer ++;
                    if(this.timer > 30){
                        this.timer = 0;
                        this.startToWander();
                    }
                }
            })



        },

        getPath : function(){
            return this.target.path[this.pathIdx];
        },
        //play moving animation according to direction
        animateByDir : function(){
            //blobby face left
            if(this.direction === GLOBAL.direction.left){
                this.playAnimation(this.animation.monsterLeft);
            }
            //blobby face right
            if(this.direction === GLOBAL.direction.right){
                this.playAnimation(this.animation.monsterRight);
            }
            //blobby face up
            if(this.direction === GLOBAL.direction.up){
                this.playAnimation(this.animation.monsterUp);
            }
            //blobby face down
            if(this.direction === GLOBAL.direction.down){
                this.playAnimation(this.animation.monsterDown);
            }
        },

        startToWander : function(){
            this.curState = this.states.Wandering;
            Audio.stop("blobbyTracking");
            this.target.resetPath(this.pathIdx);
        },

        //check if object will pass the middle point of a certain tile
        almostWithinTile : function(tileCoord) {
            var tileX = tileCoord.x * GLOBAL.tileW;
            var tileY = tileCoord.y * GLOBAL.tileW;
            if (!objInLeftSide(this.target)){
                tileX += GLOBAL.viewport.w / 2;
            }

            if (this.velocity.y === 0){
                //if next frame object pass the middle point of tile
                if ((this.x - GLOBAL.delta - tileX) * (this.x + this.velocity.x - GLOBAL.delta - tileX) <= 0){
                    return true;
                }
            } else if (this.velocity.x === 0){
                if ((this.y - GLOBAL.delta - tileY) * (this.y + this.velocity.y - GLOBAL.delta - tileY) <= 0){
                    return true;
                }
            }
            return false;
        },


        alignToTile : function(tileCoord){
            var tileX = tileCoord.x * GLOBAL.tileW;
            var tileY = tileCoord.y * GLOBAL.tileW;
            if (!objInLeftSide(this.target)){
                tileX += GLOBAL.viewport.w / 2;
            }
            if (this.velocity.y === 0){
                //move object directly to the middle point of tile
                this.x = tileX + GLOBAL.delta;
                this.y += this.velocity.y;

            } else if (this.velocity.x === 0){
                this.x += this.velocity.x;
                this.y = tileY + GLOBAL.delta;
            }

        },

        setNextStep : function() {
            this.nextStep = this.getPath()[this.nextStepIdx];
        },

        //Set velocity according to the next step
        setVtoNextStep : function(){

            var coord = getTileCoord(this);

            if (coord.y < this.nextStep.y){
                this.velocity.y = this.blobbySpeed;
                this.velocity.x = 0;
                this.direction = GLOBAL.direction.down;
            }else if (coord.y > this.nextStep.y){
                this.velocity.y = - this.blobbySpeed;
                this.velocity.x = 0;
                this.direction = GLOBAL.direction.up;
            }

            if (coord.x < this.nextStep.x){
                this.velocity.x = this.blobbySpeed;
                this.velocity.y = 0;
                this.direction = GLOBAL.direction.right;
            }else if (coord.x > this.nextStep.x){
                this.velocity.x = - this.blobbySpeed;
                this.velocity.y = 0;
                this.direction = GLOBAL.direction.left;
            }

            if(coord.x === this.nextStep.x && coord.y === this.nextStep.y){
                this.velocity.x = 0;
                this.velocity.y = 0;
                this.curState = this.states.Wandering;
            }
        },

        targetDetected : function(){
            var level = Crafty("TiledLevel");
            var blobbyCoord = getTileCoord(this);
            var targetCoord = getTileCoord(this.target);
            var matrix = level.getRelevantMatrix(this.target);

            var c = (blobbyCoord.y - targetCoord.y) * (blobbyCoord.x - targetCoord.x);
            if(c >= -1 && c <= 1) {
                return true;
            }

            //Blobby and player are in a line.
            if (blobbyCoord.x === targetCoord.x){
                //Check tiles between Blobby and player in different ways
                if (blobbyCoord.y < targetCoord.y){
                    for(var j = blobbyCoord.y; j < targetCoord.y; j++){
                        //If blocked, not detected.
                        if (matrix[blobbyCoord.x][j] === level.tileType.blockable || matrix[blobbyCoord.x][j] === level.tileType.nolight){
                            return false;
                        }
                    }
                    //All tiles are clear, then detected.
                    return true;
                }else{
                    for(var j = targetCoord.y; j < blobbyCoord.y; j++){
                        if (matrix[blobbyCoord.x][j] === level.tileType.blockable || matrix[blobbyCoord.x][j] === level.tileType.nolight){
                            return false;
                        }
                    }
                    return true;
                }
            }else if (blobbyCoord.y === targetCoord.y){
                if (blobbyCoord.x < targetCoord.x){
                    for(var i = blobbyCoord.x; i < targetCoord.x; i++){
                        //If blocked
                        if (matrix[i][blobbyCoord.y] === level.tileType.blockable || matrix[i][blobbyCoord.y] === level.tileType.nolight){
                            return false;
                        }
                    }
                    return true;
                }else{
                    for(var i = targetCoord.x; i < blobbyCoord.x; i++){
                        if (matrix[i][blobbyCoord.y] === level.tileType.blockable || matrix[i][blobbyCoord.y] === level.tileType.nolight){
                            return false;
                        }
                    }
                    return true;
                }
            }else{
                return false;
            }

        }

//        chooseTarget : function(p1,p2){
//            if (objInLeftSide(this)) {
//                if (objInLeftSide(p1))
//                    this.seek(p1);
//                else if (objInLeftSide(p2))
//                    this.seek(p2);
//            }
//            else {
//                if (!objInLeftSide(p1))
//                    this.seek(p1);
//                else if (!objInLeftSide(p2))
//                    this.seek(p2);
//            }
//
//        },
//
//        seek: function(target) {
//            this.target = target;
//        }

    });


    Crafty.c("EvilLamp", {
        timer : 0,
        damage : 100,
        init:function(){
            this.attr({x: this.x - GLOBAL.tileW,y: this.x - GLOBAL.tileW});
            this.addComponent("Lamp");
            this.addComponent("HasTarget");
            this.addComponent("Animated");
            this.setAnimation(this.animation.evilLamp);

            this.bind("EnterFrame", function(){
                //If lamp has been turned on
                if (this.isOn){
                    //If Player is next to the lamp
                    if (this.target.nextTo(this)){
                        //this.playAnimation(this.animation.evilLamp);
                        this.timer ++;
                        if (this.timer > this.damage){
                            //player die
                            this.target.HP = 0;
                        }
                    }
                    else{
                        //reset timer
                        this.timer = 0;
                    }


                }

            })
        }


    });

}) ();