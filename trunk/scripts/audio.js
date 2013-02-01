//Audio.js
//Contains initialization of audio files
//and functions to play audio.

var Audio = (function sound(){

    Crafty.audio.add("start","music/chase.ogg");
    Crafty.audio.add("ambience1","music/ambience1.ogg");
    Crafty.audio.add("ambience2","music/ambience2.ogg");
    Crafty.audio.add("ambience3","music/ambience3.ogg");
    Crafty.audio.add("bigHit","music/bigHit.ogg");
    Crafty.audio.add("chase","music/chase.ogg");
    Crafty.audio.add("chimes","music/chimes.ogg");
    Crafty.audio.add("crazyPiano","music/crazyPiano.ogg");
    Crafty.audio.add("demonBass","music/demonBass.ogg");
    Crafty.audio.add("demonVoice","music/demonVoice.ogg");
    Crafty.audio.add("eerieSynth","music/eerieSynth.ogg");
    Crafty.audio.add("goblinSound","music/globinSound.ogg");
    Crafty.audio.add("pianoEnd","music/pianoEnd.ogg");
    Crafty.audio.add("piano","music/piano.ogg");
    Crafty.audio.add("swoosh","music/swoosh.ogg");

    Crafty.audio.add("blobbyTracking","soundEffects/blobbyTracking.ogg");
    Crafty.audio.add("damage","soundEffects/playerDamaged.ogg");
    Crafty.audio.add("menuSelect","soundEffects/menuSelect.ogg");
    Crafty.audio.add("inventory","soundEffects/inventoryCycle.ogg");
    Crafty.audio.add("shift","soundEffects/shift.ogg");
    Crafty.audio.add("evilLampAttack","soundEffects/lampEnemyAttack.ogg");
    Crafty.audio.add("shortAttack","soundEffects/shortAttack.ogg");
    Crafty.audio.add("longAttack","soundEffects/longAttack.ogg");
    Crafty.audio.add("death","soundEffects/playerDeath.ogg");
    Crafty.audio.add("walk","soundEffects/playerWalking.ogg");
    Crafty.audio.add("eatingFood", "soundEffects/eatingFood.ogg");
    Crafty.audio.add("menuCycle", "soundEffects/menuCycle.ogg");
    Crafty.audio.add("fire", "soundEffects/fire.ogg");
    Crafty.audio.add("doorClosing", "soundEffects/doorClosing.ogg");
    Crafty.audio.add("doorOpening", "soundEffects/doorOpening.ogg");
    Crafty.audio.add("flashlightOnOff", "soundEffects/flashlightOnOff.ogg");
    Crafty.audio.add("itemDrop", "soundEffects/itemDrop.ogg");
    Crafty.audio.add("itemPickup", "soundEffects/itemPickup.ogg");
    Crafty.audio.add("doorUnlocking", "soundEffects/doorOpening.ogg");
    Crafty.audio.add("doorLocking", "soundEffects/pressureDoorLocking.ogg");
    Crafty.audio.add("error", "soundEffects/error.ogg");

    // TODO: Add these sfx
    Crafty.audio.add("safeOpening", "soundEffects/safeOpening.ogg");
    Crafty.audio.add("leverOff", "soundEffects/leverOff.ogg");
    Crafty.audio.add("leverOn", "soundEffects/leverOn.ogg");
    // DOOR LOCKED

    return {
        //Sound: play one time
        playSound : function (name){
            Crafty.audio.play(name, 1);
        }
        ,//Music: last forever
        playMusic : function(name){
            Crafty.audio.play(name, -1);
        }
        ,
        stop : function(name){
            Crafty.audio.stop(name);
        }
    };
})();


