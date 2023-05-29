kaboom({
    background: [134, 195, 247],
    width: 320,
    height: 240,
    scale: 2.5,
});

loadRoot("sprites/");
loadAseprite("mario", "Mario.png", "Mario.json");
loadAseprite("enemies", "enemies.png", "enemies.json");
loadSprite("ground", "ground.png");
loadSprite("questionBox", "questionBox.png");
loadSprite("emptyBox", "emptyBox.png");
loadSprite("brick", "brick.png");
loadSprite("tile", "tile.png");
loadSprite("coin", "coin.png");
loadSprite("bigMushy", "bigMushy.png");
loadSprite("pipeTop", "pipeTop.png");
loadSprite("pipeBottom", "pipeBottom.png");
loadSprite("shrubbery", "shrubbery.png");
loadSprite("hill", "hill.png");
loadSprite("cloud", "cloud.png");
loadSprite("castle", "castle.png");

loadRoot("sounds/");
loadSound("bgm", "aboveground_bgm.ogg");
loadSound("coin", "coin.wav");
loadSound("jumpSmall", "jump-small.wav");
loadSound("jumpSuper", "jump-super.wav");
loadSound("stomp", "stomp.wav");
loadSound("bump", "bump.wav");
loadSound("kick", "kick.wav");
loadSound("die", "mario-die.wav");
loadSound("complete", "stage_clear.wav");
loadSound("powerUp", "power_up.wav");
loadSound("itemAppear", "itemAppear.wav");
loadSound("breakBlock", "break_block.wav");

const LEVELS = [
    [
        "                                                                                                ",
        "                                                                                                ",
        "                                                                                                ",
        "                                                                                                ",
        "                                                                                                ",
        "                                                                                                ",
        "                                                                                                ",
        "      -?-b-                                                                                     ",
        "                                                    ?        ?                                  ",
        "                                                                                                ",
        "                                      _                 ?                                       ",
        "                                 _    |                                                         ",
        "                           _     |    |                _                                        ",
        "       E                   |     |    |   E   E        |                            H           ",
        "================     ===========================================================================",
        "================     ===========================================================================",
    ],
    [
        "                                                                                             ",
        "                                                                                             ",
        "                                                                                             ",
        "                                       ?                                                     ",
        "                                                                                             ",
        "                                   -?-                                                       ",
        "                                                                                             ",
        "      -?-b-                  -?-                                                             ",
        "                                                                                             ",
        "                                                                                             ",
        "                                                                                             ",
        "                                                                                             ",
        "       _                                            _                                        ",
        "       |                                            |          E    E            H           ",
        "================     ========================================================================",
        "================     ========================================================================",
    ],
    [
        "                                                                                             ",
        "                                                                                             ",
        "                                                                                             ",
        "                                                                                             ",
        "                                                                                             ",
        "                                                                                             ",
        "                                                                                             ",
        "      -?-b-                    O                                                             ",
        "                              OO                                                             ",
        "                             OOO                                                             ",
        "                            OOOO        _                                                    ",
        "                           OOOOO        |     _                                              ",
        "                          OOOOOO        |     |     _                                        ",
        "       E                 OOOOOOO        |     |     |          E    E            H           ",
        "================     ========================================================================",
        "================     ========================================================================",
    ],
    [
        "                                                                                                        ",
        "                                                                                                        ",
        "                                                                                                        ",
        "                                                                                                        ",
        "                                                                                                        ",
        "                                                                                                        ",
        "                                                                                                        ",
        "                                                                                                        ",
        "                                  ? ? ? ? ? b                                                           ",
        "        -?-?-b-                                            _                                            ",
        "                                                           |    _                                       ",
        "                                                           |    |    _                                  ",
        "                                                           |    |    |    _                             ",
        "           E                            E        E         |    |    |    |       E             H       ",
        "=====================     ==============================================================================",
        "=====================     ==============================================================================",
    ],
];

const levelConf = {
    // grid size
    width: 16,
    height: 16,
    pos: vec2(0, 0),
    // define each object as a list of components
    "=": () => [
        sprite("ground"),
        area(),
        solid(),
        origin("bot"),
        "ground"
    ],
    "-": () => [
        sprite("brick"),
        area(),
        solid(),
        origin("bot"),
        "brick"
    ],
    "O": () => [
        sprite("tile"),
        area(),
        solid(),
        origin("bot"),
        "tile"
    ],
    "H": () => [
        sprite("castle"),
        area({ width: 1, height: 240 }),
        origin("bot"),
        "castle"
    ],
    "?": () => [
        sprite("questionBox"),
        area(),
        solid(),
        origin("bot"),
        'questionBox',
        'coinBox'
    ],
    "b": () => [
        sprite("questionBox"),
        area(),
        solid(),
        origin("bot"),
        'questionBox',
        'mushyBox'
    ],
    "!": () => [
        sprite("emptyBox"),
        area(),
        solid(),
        bump(),
        origin("bot"),
        'emptyBox'
    ],
    "c": () => [
        sprite("coin"),
        area(),
        solid(),
        bump(64, 8),
        cleanup(),
        lifespan(0.4, { fade: 0.01 }),
        origin("bot"),
        "coin"
    ],
    "M": () => [
        sprite("bigMushy"),
        area(),
        solid(),
        patrol(10000),
        body(),
        cleanup(),
        origin("bot"),
        "bigMushy"
    ],
    "|": () => [
        sprite("pipeBottom"),
        area(),
        solid(),
        origin("bot"),
        "pipe"
    ],
    "_": () => [
        sprite("pipeTop"),
        area(),
        solid(),
        origin("bot"),
        "pipe"
    ],
    "E": () => [
        sprite("enemies", { anim: 'Walking' }),
        area({ width: 16, height: 16 }),
        solid(),
        body(),
        patrol(50),
        enemy(),
        origin("bot"),
        "badGuy"
    ],
    "p": () => [
        sprite("mario", { frame: 0 }),
        area({ width: 16, height: 16 }),
        body(),
        mario(),
        bump(150, 20, false),
        origin("bot"),
        "player"
    ]
};

scene("start", () => {

    add([
        text("Press enter to start", { size: 24 }),
        pos(vec2(160, 120)),
        origin("center"),
        color(255, 255, 255),
    ]);

    keyRelease("enter", () => {
        go("game");
    })
});

go("start");

scene("game", (levelNumber = 0) => {

    layers([
        "bg",
        "game",
        "ui",
    ], "game");


    const level = addLevel(LEVELS[levelNumber], levelConf);

    add([
        sprite("cloud"),
        pos(20, 50),
        layer("bg")
    ]);

    add([
        sprite("hill"),
        pos(32, 208),
        layer("bg"),
        origin("bot")
    ])

    add([
        sprite("shrubbery"),
        pos(200, 208),
        layer("bg"),
        origin("bot")
    ])

    add([
        text("Level " + (levelNumber + 1), { size: 24 }),
        pos(vec2(160, 120)),
        color(255, 255, 255),
        origin("center"),
        layer('ui'),
        lifespan(1, { fade: 0.5 })
    ]);

    const player = level.spawn("p", 1, 10)
    const SPEED = 120;

    keyDown("right", () => {
        if (player.isFrozen) return;
        player.flipX(false);
        player.move(SPEED, 0);
    });

    keyDown("left", () => {
        if (player.isFrozen) return;
        player.flipX(true);
        if (toScreen(player.pos).x > 20) {
            player.move(-SPEED, 0);
        }
    });

    keyPress("space", () => {
        if (player.isAlive && player.grounded()) {
            if(player.isBig || player.isFlaming){
                play("jumpSuper");
            }
            else{
                play("jumpSmall");
            }
            player.jump();
            canSquash = true;
        }
    });


    player.action(() => {
        // center camera to player
        var currCam = camPos();
        if (currCam.x < player.pos.x) {
            camPos(player.pos.x, currCam.y);
        }

        if (player.isAlive && player.grounded()) {
            canSquash = false;
        }

        // Check if Mario has fallen off the screen
        if (player.pos.y > height() - 16) {
            killed();
        }

    });

    let canSquash = false;

    player.collides("badGuy", (baddy) => {
        if (baddy.isAlive == false) return;
        if (player.isAlive == false) return;
        if (canSquash) {
            // Mario has jumped on the bad guy:
            baddy.squash();
        } else {
            // Mario has been hurt
            if (player.isFlaming) {
                player.big();
            }
            else if (player.isBig) {
                player.small();
            }
            else {
                // Mario is dead :(
                killed();
            }
        }
    });

    function killed() {
        // Mario is dead :(
        if (player.isAlive == false) return; // Don't run it if mario is already dead
        player.die();
        add([
            text("Game Over :(", { size: 24 }),
            pos(toWorld(vec2(160, 120))),
            color(255, 255, 255),
            origin("center"),
            layer('ui'),
            play("die"),
        ]);
        wait(3, () => {
            go("start");
        })
    }

    player.on("headbutt", (obj) => {
        if (obj.is("questionBox")) {
            if (obj.is("coinBox")) {
                let coin = level.spawn("c", obj.gridPos.sub(0, 1));
                coin.bump();
                play("coin");
            }
            else if (obj.is("mushyBox")) {
                level.spawn("M", obj.gridPos.sub(0, 1));
                play("itemAppear");
            }
            var pos = obj.gridPos;
            destroy(obj);
            var box = level.spawn("!", pos);
            box.bump();
        }
        else if (obj.is("brick")) {
            if (player.isBig || player.isFlaming) {
                destroy(obj);
                play("breakBlock");
            }
        }
    });
    
    player.collides("bigMushy", (mushy) => {
        destroy(mushy);
        if(player.isBig){
            player.flaming();
        }
        else{
            player.big();
        }
        play("powerUp");
    });

    player.collides("castle", (castle, side) => {
        player.freeze();
        console.log(player.score);
        add([
            text("Well Done!", { size: 24 }),
            pos(toWorld(vec2(160, 120))),
            color(255, 255, 255),
            origin("center"),
            layer('ui'),
            play("complete"),
        ]);
        wait(6, () => {
            let nextLevel = levelNumber + 1;
            if (nextLevel >= LEVELS.length) {
                go("start");
            } else {
                go("game", nextLevel);
            }
        })
    });
});

function patrol(distance = 100, speed = 50, dir = 1) {
    return {
        id: "patrol",
        require: ["pos", "area",],
        startingPos: vec2(0, 0),
        add() {
            this.startingPos = this.pos;
            this.on("collide", (obj, side) => {
                if (side === "left" || side === "right") {
                    dir = -dir;
                }
            });
        },
        update() {
            if (Math.abs(this.pos.x - this.startingPos.x) >= distance) {
                dir = -dir;
            }
            this.move(speed * dir, 0);
        },
    };
}

function enemy() {
    return {
        id: "enemy",
        require: ["pos", "area", "sprite", "patrol"],
        isAlive: true,
        update() {

        },
        squash() {
            play("kick");
            this.isAlive = false;
            this.unuse("patrol");
            this.stop();
            this.frame = 2;
            this.area.width = 16;
            this.area.height = 8;
            this.use(lifespan(0.5, { fade: 0.1 }));
        }
    }
}

function bump(offset = 8, speed = 2, stopAtOrigin = true) {
    return {
        id: "bump",
        require: ["pos"],
        bumpOffset: offset,
        speed: speed,
        bumped: false,
        origPos: 0,
        direction: -1,
        update() {
            if (this.bumped) {
                this.pos.y = this.pos.y + this.direction * this.speed;
                if (this.pos.y < this.origPos - this.bumpOffset) {
                    this.direction = 1;
                }
                if (stopAtOrigin && this.pos.y >= this.origPos) {
                    this.bumped = false;
                    this.pos.y = this.origPos;
                    this.direction = -1;
                }
            }
        },
        bump() {
            this.bumped = true;
            this.origPos = this.pos.y;
        }
    };
}

function mario() {
    return {
        id: "mario",
        require: ["body", "area", "sprite", "bump"],
        smallAnimation: "Running",
        bigAnimation: "RunningBig",
        flamingAnimation: "Loop",
        smallStopFrame: 0,
        bigStopFrame: 8,
        flamingStopFrame: 17,
        smallJumpFrame: 5,
        bigJumpFrame: 13,
        flamingJumpFrame: 22,
        score: 0,
        isBig: false,
        isFlaming: false,
        isFrozen: false,
        isAlive: true,
        update() {
            if (this.isFrozen) {
                this.standing();
                return;
            }

            if (!this.grounded()) {
                this.jumping();
            }
            else {
                if (keyIsDown("left") || keyIsDown("right")) {
                    this.running();
                } else {
                    this.standing();
                }
            }
        },
        flaming() {
            this.isFlaming = true;
            this.isBig = false;
            this.area.width = 24;
            this.area.height = 32;
        },
        big() {
            this.isFlaming = false;
            this.isBig = true;
            this.area.width = 24;
            this.area.height = 32;
        },
        small() {
            this.isFlaming = false;
            this.isBig = false;
            this.area.width = 16;
            this.area.height = 16;
        },
        standing() {
            this.stop();
            if (this.isFlaming){
                this.frame = this.flamingStopFrame;
            }
            else if (this.isBig){
                this.frame = this.bigStopFrame;
            }
            else {
                this.frame = this.smallStopFrame;
            }
        },
        jumping() {
            this.stop();
            if (this.isFlaming) {
                this.frame = this.flamingJumpFrame;
            }
            else if (this.isBig) {
                this.frame = this.bigJumpFrame;
            }
            else {
                this.frame = this.smallJumpFrame;
            }
        },
        running() {
            // const animation = this.isBig ? this.bigAnimation : this.smallAnimation;
            var animation;
            if (this.isFlaming) {
                animation = this.flamingAnimation;
            }
            else if (this.isBig) {
                animation = this.bigAnimation;
            }
            else {
                animation = this.smallAnimation;
            }
            if (this.curAnim() !== animation) {
                this.play(animation);
            }
        },
        freeze() {
            this.isFrozen = true;
        },
        die() {
            this.unuse("body");
            this.bump();
            this.isAlive = false;
            this.freeze();
            this.use(lifespan(1, { fade: 1 }));
        }
    }
}