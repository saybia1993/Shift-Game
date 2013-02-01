// global.js
// Contains definitions of all global
// variables and functions.
(function(window) {
    var GLOBAL = window.GLOBAL = {};
    GLOBAL.KeyBoardType = "QWERTY";
    GLOBAL.lightCtx;
    GLOBAL.viewport = {
        w : 1000,
        h : 650
    };
    GLOBAL.tileW = 25;
    GLOBAL.dimWidthInTiles = GLOBAL.viewport.w / GLOBAL.tileW / 2;
    GLOBAL.dimHeightInTiles = GLOBAL.viewport.h / GLOBAL.tileW;
    GLOBAL.direction = {
        left : 0,
        up : 1,
        right : 2,
        down : 3
    };
    GLOBAL.MaxHP = 100;
    //to prevent the collision between players and walls.
    GLOBAL.delta = 1;
    GLOBAL.commonKeys = {
        SwitchDimensions: "SPACE"
    };
    GLOBAL.p1Keys = {
        Up: Crafty.keys.W,
        Down: Crafty.keys.S,
        Left: Crafty.keys.A,
        Right: Crafty.keys.D,
        Interact: Crafty.keys.F,
        Inventory: Crafty.keys.Q,
        DropItem: Crafty.keys.R,
        UseItem: Crafty.keys.E
    };
    GLOBAL.p2Keys = {
        Up: Crafty.keys.UP_ARROW,
        Down: Crafty.keys.DOWN_ARROW,
        Left: Crafty.keys.LEFT_ARROW,
        Right: Crafty.keys.RIGHT_ARROW,
        Interact: Crafty.keys.U,
        Inventory: Crafty.keys.I,
        DropItem: Crafty.keys.J,
        UseItem: Crafty.keys.M
    };
    GLOBAL.p1Interacting = false;
    GLOBAL.firstLevel = true;
    GLOBAL.currentLevel = level.spawnRoom;
    GLOBAL.p1EntrancePosition = [GLOBAL.viewport.w / 4, GLOBAL.viewport.h / 2];
    GLOBAL.p2EntrancePosition = [GLOBAL.viewport.w / 4 * 3, GLOBAL.viewport.h / 2];
    GLOBAL.moveDistBeforeLightRefresh = GLOBAL.tileW;
    GLOBAL.evilOnLeft = false;
    GLOBAL.chestShouldOpen = true;
    GLOBAL.p1Inventory = null;

})(window);

//get the coordinates of an object in the tile system
function getTileCoord(obj){
    var tileSize = GLOBAL.tileW;
    var delta = 0;
    if(obj.w === GLOBAL.tileW - 2 * GLOBAL.delta){
        delta = GLOBAL.delta;
    }
    var x = obj.x + (tileSize - delta) / 2;
    var y = obj.y + (tileSize - delta) / 2;
    var tileX = Math.floor(x / tileSize);
    var tileY = Math.floor(y / tileSize);
    if(!objInLeftSide(obj)){
        tileX -= 20;
    }
    return makeVector(tileX,tileY);
}

function objInLeftSide(obj){
    return obj.x < GLOBAL.viewport.w / 2;
}

function objSwitchDimension(obj){
    if(objInLeftSide(obj)) {
        obj.x += GLOBAL.viewport.w / 2;
    }
    else {
        obj.x -= GLOBAL.viewport.w / 2;
    }
}

function makeVector(x,y){
    return {
        x : x,
        y : y
    }
}

function calcCosine(vec1, vec2){
    var norm1 = Math.sqrt(vec1.x * vec1.x + vec1.y * vec1.y);
    var norm2 = Math.sqrt(vec2.x * vec2.x + vec2.y * vec2.y);
    var dot = vec1.x * vec2.x + vec1.y * vec2.y;
    return  ( dot / ( norm1 * norm2 ) );
}

//determine if line section intersects with boundingbox
function intersect(x1, y1, x2, y2, obj){
    var objH = GLOBAL.tileW;
    var objW = GLOBAL.tileW;
    if( (x1 > obj.x + objW && x2 > obj.x + objW) || (x1 < obj.x && x2 < obj.x) || (y1 > obj.y + objH && y2 > obj.y + objH) || (y1 < obj.y && y2 < obj.y) ) {
        return false;
    }else{
        if(x2 !== x1){
            var k = ( y2 - y1 ) / ( x2 - x1 );
            var yLeft = k * ( obj.x - x1 ) + y1;
            var yRight = k * ( obj.x - x1 + objW ) + y1;

            var k1 = ( x2 - x1 ) / ( y2 - y1 );
            var xUp = k1 * ( obj.y - y1 ) + x1;
            var xDown = k1 * ( obj.y - y1 + objH ) + x1;

            return ( yLeft >= obj.y && yLeft <= obj.y + objH ) || ( yRight >= obj.y && yRight <= obj.y + objH ) || ( xUp >= obj.x && xUp <= obj.x + objW ) || ( xDown >= obj.x && xDown <= obj.x + objW );
        }else{
            return true;
        }


        //cross
        //return ( yLeft - obj.y ) * ( yRight - obj.y) < 0;

    }
}