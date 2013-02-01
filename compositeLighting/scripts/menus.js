// menus.js
// Contains the component
// definitions of all menu items.

(function() {

    // Components
    Crafty.c("startButton", {
        init: function(){
            this.addComponent("2D, DOM, MI_start, Mouse")
                .css("cursor","pointer")
                .bind("MouseOver", function() {
                    //this.h = this.h + 100;
                })
                .bind("Click", function() {
                    this.activate();
                });
        },
        activate: function(){
            Crafty.scene("gameScreen")
        }
    });

    Crafty.c("optionButton", {
        init: function(){
            this.addComponent("2D, DOM, MI_option, Mouse")
                .css("cursor","pointer")
                .bind("Click", function() {
                    this.activate();
                });
        },
        activate: function(){
            Crafty.scene("optionScreen")
        }
    });

    Crafty.c("creditsButton", {
        init: function(){
            this.addComponent("2D, DOM, MI_credits, Mouse")
                .css("cursor","pointer")
                .bind("Click", function() {
                    this.activate();
                });
        },
        activate: function(){
            Crafty.scene("creditScreen")
        }
    });

    Crafty.c("backButton",{
        init: function(){
            this.addComponent("2D, DOM, Image, Mouse").image("images/backButton.png");
            this.css("cursor","pointer");
            this.bind("MouseOver", function() {
                this.css("background-position", "0 0");
            });
            this.bind("MouseOut", function() {
                this.css("background-position", "-240px 0");
            });
            this.bind("Click", function() {
                this.activate();
            });
        },
        activate: function(){
            Crafty.scene("startScreen");
        }
    });

    Crafty.c("OptionsMenuItem", {
        init : function() {
            this.addComponent("2D, DOM, Text");
            this.attr({
                x : GLOBAL.viewport.w/2 - 120,
                w : 250,
                y : 250
            });
            this.text("Options will be implemented soon");
            this.css("font-family", "'Bangers', cursive");
            this.css("text-align", "center");
        }
    });

    // Scenes
    Crafty.scene("startScreen", function() {
        Crafty.background("black");
//        Audio.playMusic("start");

        var buttonsArray = [];

        var title = Crafty.e("2D, DOM, MI_title");
        title.attr({
                x: GLOBAL.viewport.w / 2 - title.w / 2, //250,
                y: GLOBAL.viewport.h / 4 - title.h / 2 //75
            });
        var frame = Crafty.e("2D, DOM, MI_frame");
        frame.attr({
                x: GLOBAL.viewport.w / 2 - frame.w / 2, //390,
                y: GLOBAL.viewport.h / 3 * 2 - frame.h / 2 //298
            });
        buttonsArray[0] = Crafty.e("startButton");
        buttonsArray[0].attr({
                x: frame.x + frame.w / 2 - buttonsArray[0].w / 2,
                y: frame.y + frame.h / 4 - buttonsArray[0].h / 2 - 5
            });
        buttonsArray[1] = Crafty.e("optionButton");
        buttonsArray[1].attr({
                x: frame.x + frame.w / 2 - buttonsArray[1].w / 2,
                y: frame.y + frame.h / 2 - buttonsArray[1].h / 2
            });
        buttonsArray[2] = Crafty.e("creditsButton");
        buttonsArray[2].attr({
                x: frame.x + frame.w / 2 - buttonsArray[2].w / 2,
                y: frame.y + frame.h / 4 * 3 - buttonsArray[2].h / 2
            });

        var currentButton = 0;
        // Create keyboard menu navigation
        Crafty.e("2D, DOM").bind("KeyDown", function(e) {
            if (e.keyCode === Crafty.keys.UP_ARROW) {
                if (currentButton > 0) {
                    currentButton--;
                }
                else {
                    currentButton = buttonsArray.length - 1;
                }
            }
            else if (e.keyCode === Crafty.keys.DOWN_ARROW) {
                if (currentButton < buttonsArray.length - 1) {
                    currentButton++;
                }
                else {
                    currentButton = 0;
                }
            }
            else if (e.keyCode === Crafty.keys.ENTER) {
                buttonsArray[currentButton].activate();
            }
        })
    });

    Crafty.scene("creditScreen", function(){
        Crafty.e("2D, DOM, Image").image("images/credits.png")
            .attr({
                x : 250
            });
        var backButton = Crafty.e("backButton")
            .attr({
                y: 610
            });

        Crafty.e("2D, DOM").bind("KeyDown", function(e) {
            if (e.keyCode === Crafty.keys.ESC) {
                backButton.activate();
            }
        });
    });

    Crafty.scene("optionScreen", function(){
        Crafty.background("black");
        Crafty.e("OptionsMenuItem");
        var backButton = Crafty.e("backButton")
            .attr({
                y: 610
            });

        Crafty.e("2D, DOM").bind("KeyDown", function(e) {
            if (e.keyCode === Crafty.keys.ESC) {
                backButton.activate();
            }
        });
    });

    Crafty.scene("gameOverScreen", function(){
        Crafty.e("2D, DOM, Image").image("images/gameover.png")
            .attr({
                x : 250
            });

        Crafty.e("2D, DOM").bind("KeyDown", function(e) {
            if (e.keyCode === Crafty.keys.ESC) {
                Crafty.scene("startScreen");
            }
        });
    });
    Crafty.scene("endingScreen", function(){
        Crafty.e("2D, DOM, Image").image("images/ending.png")
            .attr({
                x : 0
            });

        Crafty.e("2D, DOM").bind("KeyDown", function(e) {
            if (e.keyCode === Crafty.keys.ESC) {
                Crafty.scene("startScreen");
            }
        });
    });

})();