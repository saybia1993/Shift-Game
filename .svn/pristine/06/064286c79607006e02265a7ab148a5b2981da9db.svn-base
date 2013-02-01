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
                if(objInLeftSide(this)){
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
        }

    });

    Crafty.c("Blobby", {
        // old_pos : [0,0] ,
        target: null,
        nextStep : null,
        nextStepIdx : 0,
        velocity : makeVector(0,0),
        blobbySpeed : 1.6,
        damage : 50,
        states : {Wandering : 0, Seeking : 1, Shocking : 2},
        curState : null,
        init : function() {

            var blobby = this;

            blobby.curState = blobby.states.Wandering;

            blobby.addComponent("HasTarget");
            blobby.addComponent('Collision');


            this.bind("EnterFrame", function(){
                //this.old_pos = [this.x, this.y];
                if(this.curState === this.states.Wandering){
                    if(this.targetDetected()){
                        //alert("Got you!");
                        //change state
                        this.curState = this.states.Seeking;
                        //reset target path information
                        this.target.resetPath();
                        this.nextStepIdx = 1;
                        this.nextStep = this.target.path[this.nextStepIdx];
                        this.setVtoNextStep();
                        //this.velocity
                    }
                } else if(this.curState === this.states.Seeking){


                    //continuous coordinates
                    var x = this.x;
                    var y = this.y;

                    var nextStepX = this.nextStep.x * GLOBAL.tileW;
                    var nextStepY = this.nextStep.y * GLOBAL.tileW;
                    if(!objInLeftSide(this.target)){
                        nextStepX += GLOBAL.viewport.w / 2;
                    }

                    var blobbyCoord = getTileCoord(this);
                    var targetTile = getTileCoord(this.target);

                    if(blobbyCoord.x != targetTile.x || blobbyCoord.y != targetTile.y){

                        if(this.velocity.y === 0){
                            //if next frame monster pass the middle point of nextStep tile
                            if((x - GLOBAL.delta - nextStepX) * (x + this.velocity.x - GLOBAL.delta - nextStepX) <= 0){
                                //move monster directly to the middle point of nextStep tile
                                this.x = nextStepX + GLOBAL.delta;
                                this.y += this.velocity.y;
                                //Reset nextStep and velocity(turn around).
                                this.nextStepIdx ++;
                                this.nextStep = this.target.path[this.nextStepIdx];
                                this.setVtoNextStep();
                            }else{
                                this.x += this.velocity.x;
                                this.y += this.velocity.y;
                            }
                        } else if(this.velocity.x === 0){
                            if((y - GLOBAL.delta - nextStepY) * (y + this.velocity.y - GLOBAL.delta - nextStepY) <= 0){
                                this.x += this.velocity.x;
                                this.y = nextStepY + GLOBAL.delta;
                                this.nextStepIdx ++;
                                this.nextStep = this.target.path[this.nextStepIdx];
                                this.setVtoNextStep();
                            }else{
                                this.x += this.velocity.x;
                                this.y += this.velocity.y;
                            }
                        }

                    }else{
                        this.target.HP -= this.damage;
                    }

                    //If attacked by weapons, monster is shocking
                    if(this.target.getCurrentItem().beingUsed === true && this.target.nextToAndFace(this)){
                        this.curState = this.states.Shocking;
                        //when monster is shocking, it steps back 3 tiles
                        this.nextStep.x = getTileCoord(this).x - (this.velocity.x / this.blobbySpeed) * 3;
                        this.nextStep.y = getTileCoord(this).y - (this.velocity.y / this.blobbySpeed) * 3;
                        this.setVtoNextStep();
                        //speed of steping back should be faster
                        this.velocity.x *= 2;
                        this.velocity.y *= 2;
                        console.log(this.nextStep.x);
                        console.log(this.nextStep.y);
                        console.log(this.velocity.x);
                        console.log(this.velocity.y);
                        console.log(this.target.path);
                    }

                } else if(this.curState === this.states.Shocking){

                    var nextStepX = this.nextStep.x * GLOBAL.tileW;
                    var nextStepY = this.nextStep.y * GLOBAL.tileW;
                    if(!objInLeftSide(this.target)){
                        nextStepX += GLOBAL.viewport.w / 2;
                    }

                    if(this.velocity.y === 0){
                        //if next frame monster pass the middle point of nextStep tile
                        if((this.x - GLOBAL.delta - nextStepX) * (this.x + this.velocity.x - GLOBAL.delta - nextStepX) <= 0){
                            //move monster directly to the middle point of nextStep tile
                            this.x = nextStepX + GLOBAL.delta;
                            this.y += this.velocity.y;
                            this.startToWander();
                        }else{
                            this.x += this.velocity.x;
                            this.y += this.velocity.y;
                        }
                    }

                    if(this.velocity.x === 0){
                        if((this.y - GLOBAL.delta - nextStepY) * (this.y + this.velocity.y - GLOBAL.delta - nextStepY) <= 0){
                            this.x += this.velocity.x;
                            this.y = nextStepY + GLOBAL.delta;
                            this.startToWander();
                        }else{
                            this.x += this.velocity.x;
                            this.y += this.velocity.y;
                        }
                    }

                }
            })



        },


        startToWander : function(){
            this.curState = this.states.Wandering;
            this.target.resetPath();
        },

        //Set velocity according to the next step
        setVtoNextStep : function(){
            var coord = getTileCoord(this);
           // console.log(this.target.path);
            //console.log(this.nextStep);
            if(coord.y < this.nextStep.y){
                this.velocity.y = this.blobbySpeed;
                this.velocity.x = 0;
            }else if(coord.y > this.nextStep.y){
                this.velocity.y = - this.blobbySpeed;
                this.velocity.x = 0;
            }

            if(coord.x < this.nextStep.x){
                this.velocity.x = this.blobbySpeed;
                this.velocity.y = 0;
            }else if(coord.x > this.nextStep.x){
                this.velocity.x = - this.blobbySpeed;
                this.velocity.y = 0;
            }
        },

        targetDetected : function(){
            var level = Crafty("TiledLevel");
            var blobbyCoord = getTileCoord(this);
            var targetCoord = getTileCoord(this.target);
            var matrix = level.getRelevantMatrix(this.target);

            //Blobby and player are in a line.
            if(blobbyCoord.x === targetCoord.x){
                //Check tiles between Blobby and player in different ways
                if(blobbyCoord.y < targetCoord.y){
                    for(var j = blobbyCoord.y; j < targetCoord.y; j++){
                        //If blocked, not detected.
                        if(matrix[blobbyCoord.x][j] === level.tileType.blockable || matrix[blobbyCoord.x][j] === level.tileType.nolight){
                            return false;
                        }
                    }
                    //All tiles are clear, then detected.
                    return true;
                }else{
                    for(var j = targetCoord.y; j < blobbyCoord.y; j++){
                        if(matrix[blobbyCoord.x][j] === level.tileType.blockable || matrix[blobbyCoord.x][j] === level.tileType.nolight){
                            return false;
                        }
                    }
                    return true;
                }
            }else if(blobbyCoord.y === targetCoord.y){
                if(blobbyCoord.x < targetCoord.x){
                    for(var i = blobbyCoord.x; i < targetCoord.x; i++){
                        //If blocked
                        if(matrix[i][blobbyCoord.y] === level.tileType.blockable || matrix[blobbyCoord.x][j] === level.tileType.nolight){
                            return false;
                        }
                    }
                    return true;
                }else{
                    for(var i = targetCoord.y; i < blobbyCoord.y; i++){
                        if(matrix[i][blobbyCoord.y] === level.tileType.blockable || matrix[blobbyCoord.x][j] === level.tileType.nolight){
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
            this.addComponent("Lamp");
            this.addComponent("HasTarget");

            this.bind("EnterFrame", function(){
                //If lamp has been turned on
                if (this.isOn){
                    //If Player is next to the lamp
                    if(player.nextTo(this)){
                        this.timer ++;
                        if(this.timer > this.damage){
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