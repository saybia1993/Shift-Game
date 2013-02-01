
(function (){

    Crafty.c("Animated", {
        animation : {
            player1Left : makeAnimation("player_Left", 0,1,2),
            player1Right : makeAnimation("player_Right", 2,3,2),
            player1Up : makeAnimation("player_Up", 0,3,1),
            player1Down : makeAnimation("player_Down", 0,3,0),
            player2Left : makeAnimation("player2_Left", 0,1,26),
            player2Right : makeAnimation("player2_Right", 2,3,26),
            player2Up : makeAnimation("player2_Up", 0,3,25),
            player2Down : makeAnimation("player2_Down", 0,3,24),
            monsterLeft : makeAnimation("monster_left", 9,12,15),
            monsterRight : makeAnimation("monster_right", 5,8,15),
            monsterUp : makeAnimation("monster_up", 0,4,23),
            monsterDown : makeAnimation("monster_down", 0,4,15),
            evilLamp : makeAnimation("evil_lamp", 8,13,11)
        },

        actionAnimation : {
            playerTile : {
                broom : {
                    left : makeActionAnimation("bpl", [[4,1],[6,1],[8,1],[1,2]]),
                    right : makeActionAnimation("bpr", [[9,3],[10,3],[12,3],[2,2]]),
                    up : makeActionAnimation("bpu", [[1,22],[0,1],[3,22],[0,1]]),
                    down : makeActionAnimation("bpd", [[1,19],[1,0],[2,19],[1,0]])
                },
                fryingPan : {
                    left : makeActionAnimation("fpl", [[5,17],[7,17],[9,17],[1,2]]),
                    right : makeActionAnimation("fpr", [[0,17],[1,17],[3,17],[2,2]]),
                    up : makeActionAnimation("fpu", [[7,22],[0,1],[9,22],[0,1]]),
                    down : makeActionAnimation("fpd", [[7,19],[1,0],[8,19],[1,0]])
                },
                plunger : {
                    left : makeActionAnimation("ppl", [[9,1],[11,1],[13,1],[1,2]]),
                    right : makeActionAnimation("ppr", [[4,3],[5,3],[7,3],[2,2]]),
                    up : makeActionAnimation("ppu", [[4,22],[0,1],[6,22],[0,1]]),
                    down : makeActionAnimation("ppd", [[4,19],[1,0],[5,19],[1,0]])
                }
            },
            leftTile : {
                broom : {
                    left : makeActionAnimation("bll", [[6,6],[5,1],[7,1],[6,6]]),
                    right : makeActionAnimation("blr", [[6,6],[6,6],[6,6],[6,6]]),
                    up : makeActionAnimation("blu", [[6,6],[6,6],[6,6],[6,6]]),
                    down : makeActionAnimation("bld", [[6,6],[6,6],[6,6],[6,6]])
                },
                fryingPan : {
                    left : makeActionAnimation("fll", [[6,6],[6,17],[8,17],[6,6]]),
                    right : makeActionAnimation("flr", [[6,6],[6,6],[6,6],[6,6]]),
                    up : makeActionAnimation("flu", [[6,6],[6,6],[6,6],[6,6]]),
                    down : makeActionAnimation("fld", [[6,19],[6,6],[6,6],[6,6]])
                },
                plunger : {
                    left : makeActionAnimation("pll", [[6,6],[10,1],[12,1],[6,6]]),
                    right : makeActionAnimation("plr", [[6,6],[6,6],[6,6],[6,6]]),
                    up : makeActionAnimation("plu", [[6,6],[6,6],[6,6],[6,6]]),
                    down : makeActionAnimation("pld", [[3,19],[6,6],[6,6],[6,6]])
                }
            },
            rightTile : {
                broom : {
                    left : makeActionAnimation("brl", [[6,6],[6,6],[6,6],[6,6]]),
                    right : makeActionAnimation("brr", [[6,6],[11,3],[13,3],[6,6]]),
                    up : makeActionAnimation("bru", [[6,6],[6,6],[6,6],[6,6]]),
                    down : makeActionAnimation("brd", [[6,6],[6,6],[6,6],[6,6]])
                },
                fryingPan : {
                    left : makeActionAnimation("frl", [[6,6],[6,6],[6,6],[6,6]]),
                    right : makeActionAnimation("frr", [[6,6],[2,17],[4,17],[6,6]]),
                    up : makeActionAnimation("fru", [[8,22],[6,6],[6,6],[6,6]]),
                    down : makeActionAnimation("frd", [[6,6],[6,6],[6,6],[6,6]])
                },
                plunger : {
                    left : makeActionAnimation("prl", [[6,6],[6,6],[6,6],[6,6]]),
                    right : makeActionAnimation("prr", [[6,6],[6,3],[8,3],[6,6]]),
                    up : makeActionAnimation("pru", [[5,22],[6,6],[6,6],[6,6]]),
                    down : makeActionAnimation("prd", [[6,6],[6,6],[6,6],[6,6]])
                }
            },
            upTile : {
                broom : {
                    left : makeActionAnimation("bul", [[4,0],[6,0],[6,6],[6,6]]),
                    right : makeActionAnimation("bur", [[9,2],[10,2],[6,6],[6,6]]),
                    up : makeActionAnimation("buu", [[1,21],[6,6],[6,6],[6,6]]),
                    down : makeActionAnimation("bud", [[1,18],[6,6],[6,6],[6,6]])
                },
                fryingPan : {
                    left : makeActionAnimation("ful", [[5,16],[6,6],[6,6],[6,6]]),
                    right : makeActionAnimation("fur", [[0,16],[6,6],[6,6],[6,6]]),
                    up : makeActionAnimation("fuu", [[6,6],[6,6],[6,6],[6,6]]),
                    down : makeActionAnimation("fud", [[6,6],[6,6],[6,6],[6,6]])
                },
                plunger : {
                    left : makeActionAnimation("pul", [[9,0],[6,6],[6,6],[6,6]]),
                    right : makeActionAnimation("pur", [[4,2],[6,6],[6,6],[6,6]]),
                    up : makeActionAnimation("puu", [[6,6],[6,6],[6,6],[6,6]]),
                    down : makeActionAnimation("pud", [[6,6],[6,6],[6,6],[6,6]])
                }
            },
            downTile : {
                broom : {
                    left : makeActionAnimation("bdl", [[6,6],[6,6],[6,6],[6,6]]),
                    right : makeActionAnimation("bdr", [[6,6],[6,6],[6,6],[6,6]]),
                    up : makeActionAnimation("bdu", [[6,6],[6,6],[6,6],[6,6]]),
                    down : makeActionAnimation("bdd", [[6,6],[6,6],[2,20],[6,6]])
                },
                fryingPan : {
                    left : makeActionAnimation("fdl", [[6,6],[6,6],[6,6],[6,6]]),
                    right : makeActionAnimation("fdr", [[6,6],[6,6],[6,6],[6,6]]),
                    up : makeActionAnimation("fdu", [[6,6],[6,6],[6,6],[6,6]]),
                    down : makeActionAnimation("fdd", [[6,6],[6,6],[8,20],[6,6]])
                },
                plunger : {
                    left : makeActionAnimation("pdl", [[6,6],[6,6],[6,6],[6,6]]),
                    right : makeActionAnimation("pdr", [[6,6],[6,6],[6,6],[6,6]]),
                    up : makeActionAnimation("pdu", [[6,6],[6,6],[6,6],[6,6]]),
                    down : makeActionAnimation("pdd", [[6,6],[6,6],[5,20],[6,6]])
                }
            }
        },

        init : function(){
            this.addComponent("SpriteAnimation");
        },

        setActionAnimation : function(anim){
            this.animate(anim.name, anim.frames);
        },


        setAnimation : function(anim){
            this.animate(anim.name, anim.xFrom, anim.y, anim.xTo);
        },

        playAnimation : function(anim){
            if (!this.isPlaying(anim.name))
                this.stop().animate(anim.name, 10);
        },

        playLoopAnimation : function(anim){
            if (!this.isPlaying(anim.name))
                this.stop().animate(anim.name, 10,-1);
        },

        stopAnimation : function(){
            this.stop();
        }
    });

    function makeActionAnimation(name, frames){
        return {
            name : name,
            frames : frames
        };
    }

    function makeAnimation(name, xFrom, xTo, y){
        return {
            name : name,
            xFrom : xFrom,
            xTo : xTo,
            y : y
        };
    }
})();