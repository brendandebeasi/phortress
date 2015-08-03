var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'gameContainer');

var PhaserGame = function () {

    this.player = null;
    this.cursors = null;
    this.speed = 600;

    this.platforms = null;
    this.turrets = null;
    this.weapons = [];
    this.currentWeapon = 0;
    this.weaponName = null;

};
var Ground = function (game) {

    Phaser.Group.call(this, game, game.world, 'Ground', false, true, Phaser.Physics.ARCADE);

    var xScale = Math.round(game.canvas.width / 32);
    var yScale = Math.round(game.canvas.height / 32);

    var totalLedges = 200;

    //create floor
    for(i=0;i<xScale;i++) {
        var newPlatform = this.add(new Platform(game, 'platform', i*32, this.game.canvas.height-32), true);
        newPlatform.enableBody = true;
        newPlatform.body.immovable = true;
    }

    //create random ledges
    for(i=0;i<totalLedges;i++) {

        var randX = Math.floor(Math.random() * xScale) + 1;
        var randY = Math.floor(Math.random() * yScale) + 1;

        var newPlatform = this.add(new Platform(game, 'platform', randX*32, randY*32), true);
        newPlatform.enableBody = true;
        newPlatform.body.immovable = true;
    }

    return this;

};

Ground.prototype = Object.create(Phaser.Group.prototype);
Ground.prototype.constructor = Ground;

var Platform = function (game, key,x,y) {

    Phaser.Sprite.call(this, game, x, y, key);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = true;
    //this.enableBody = true;
    //debugger;
    //this.body.immovable = true;
    this.tracking = false;
    this.scaleSpeed = 0;

};

Platform.prototype = Object.create(Phaser.Sprite.prototype);
Platform.prototype.constructor = Platform;

//Bullet.prototype.fire = function (x, y, angle, speed, gx, gy) {
//
//    gx = gx || 0;
//    gy = gy || 0;
//
//    this.reset(x, y);
//    this.scale.set(1);
//
//    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);
//
//    this.angle = angle;
//
//    this.body.gravity.set(gx, gy);
//
//};



PhaserGame.prototype = {

    init: function () {
        this.game.scale.maxWidth = Math.round(this.game.canvas.width / this.game.device.pixelRatio);
        this.game.scale.maxHeight = Math.round(this.game.canvas.height / this.game.device.pixelRatio);
        this.game.scale.minWidth = Math.round(this.game.canvas.width / this.game.device.pixelRatio);
        this.game.scale.minHeight = Math.round(this.game.canvas.height / this.game.device.pixelRatio);
        this.game.scale.refresh();


        this.game.renderer.renderSession.roundPixels = true;

        this.physics.startSystem(Phaser.Physics.ARCADE);

    },

    preload: function () {
        this.load.image('brick', 'img/ground.png');
        this.load.image('platform', 'img/ground.png');
        this.load.image('star', 'img/star.png');
        this.load.image('turret', 'img/turret.png');
        this.load.spritesheet('dude', 'img/player.png', 32, 32);
    },

    create: function () {

        this.player = this.add.sprite(32, this.world.height - 150, 'dude');

        //  We need to enable physics on the player
        this.physics.arcade.enable(this.player);

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.gravity.y = 400;
        this.player.body.collideWorldBounds = true;

        //create ground
        this.platforms = new Ground(this.game);

        //enable controls
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    },

    nextWeapon: function () {


    },

    update: function () {
        this.physics.arcade.collide(this.player, this.platforms);

        //this.player.body.velocity.set(0);
        this.player.body.velocity.x = 0;
        if (this.cursors.left.isDown)
        {
            this.player.body.velocity.x = -300;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.velocity.x = 300;
        }

        if (this.cursors.up.isDown && this.player.body.touching.down)
        {
            this.player.body.velocity.y = -500;
        }
        //if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        //{
        //    this.weapons[this.currentWeapon].fire(this.player);
        //}

    }

};

game.state.add('Game', PhaserGame, true);
//
//
//
//
//
//var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'gameContainer',  {preload: preload, create: create, update: update });
//
//function preload() {
//
//    game.load.image('brick', 'img/ground.png');
//    game.load.image('ground', 'img/ground.png');
//    game.load.image('star', 'img/star.png');
//    game.load.image('turret', 'img/turret.png');
//    game.load.spritesheet('dude', 'img/player.png', 32, 32);
//
//}
//
//var player;
//var platforms;
//var turrets;
//var cursors;
//
//var stars;
//var score = 0;
//var scoreText;
//
//function create() {
//    //game.canvas.getContext('2d').scale(this.game.device.pixelRatio,this.game.device.pixelRatio);
//    game.scale.maxWidth = Math.round(this.game.canvas.width / this.game.device.pixelRatio);
//    game.scale.maxHeight = Math.round(this.game.canvas.height / this.game.device.pixelRatio);
//    game.scale.minWidth = Math.round(this.game.canvas.width / this.game.device.pixelRatio);
//    game.scale.minHeight = Math.round(this.game.canvas.height / this.game.device.pixelRatio);
//    game.scale.refresh();
//
//    //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
//
//
//    //  We're going to be using physics, so enable the Arcade Physics system
//    game.physics.startSystem(Phaser.Physics.ARCADE);
//
//    game.stage.backgroundColor = '#f0f0f0';
//
//    //  The platforms group contains the ground and the 2 ledges we can jump on
//    platforms = game.add.group();
//
//    //  We will enable physics for any object that is created in this group
//    platforms.enableBody = true;
//
//    // Here we create the ground.
//    var xScale = Math.round(game.canvas.width / 32);
//    var yScale = Math.round(game.canvas.height / 32);
//
//    for(i=0;i<xScale;i++) {
//        var ground = platforms.create(i*32, this.game.canvas.height-32, 'ground');
//        ground.body.immovable = true;
//    }
//
//
//    var totalTurrets = 26;
//    turrets = game.add.group();
//    turrets.enableBody = true;
//
//    //create ledges
//    var totalLedges = 260;
//    var turrentCounter = 0;//keeps track of turrets to be created every X steps
//    for(i=0;i<totalLedges;i++) {
//
//        var randX = Math.floor(Math.random() * xScale) + 1;
//        var randY = Math.floor(Math.random() * yScale) + 1;
//
//        var ledge = platforms.create(randX * 32, randY * 32, 'ground');
//        ledge.body.immovable = true;
//
//        turrentCounter++;
//
//        if(turrentCounter > totalLedges/totalTurrets) {
//            turrentCounter = 0;
//            var turret = turrets.create(randX * 32, ((randY-1) * 32), 'turret');
//            turret.body.immovable = true;
//        }
//    }
//
//
//
//
//
//    // The player and its settings
//    player = game.add.sprite(32, game.world.height - 150, 'dude');
//
//    //  We need to enable physics on the player
//    game.physics.arcade.enable(player);
//
//    //  Player physics properties. Give the little guy a slight bounce.
//    player.body.gravity.y = 600;
//    player.body.collideWorldBounds = true;
//
//    //  Our two animations, walking left and right.
//    //player.animations.add('left', [0, 1, 2, 3], 10, true);
//    //player.animations.add('right', [5, 6, 7, 8], 10, true);
//
//    //  Finally some stars to collect
//    stars = game.add.group();
//
//    //  We will enable physics for any star that is created in this group
//    stars.enableBody = true;
//
//    //  Here we'll create 12 of them evenly spaced apart
//    for (var i = 0; i < 12; i++)
//    {
//        //  Create a star inside of the 'stars' group
//        var star = stars.create(i * 70, 0, 'star');
//
//        //  Let gravity do its thing
//        star.body.gravity.y = 300;
//
//        //  This just gives each star a slightly random bounce value
//        star.body.bounce.y = 0.7 + Math.random() * 0.2;
//    }
//
//    //  The score
//    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
//
//    //  Our controls.
//    cursors = game.input.keyboard.createCursorKeys();
//
//}
//
//function update() {
//
//    //  Collide the player and the stars with the platforms
//    game.physics.arcade.collide(player, platforms);
//    game.physics.arcade.collide(stars, platforms);
//
//    //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
//    game.physics.arcade.overlap(player, stars, collectStar, null, this);
//
//    //  Reset the players velocity (movement)
//    player.body.velocity.x = 0;
//
//    if (cursors.left.isDown)
//    {
//        //  Move to the left
//        player.body.velocity.x = -150;
//
//        //player.animations.play('left');
//    }
//    else if (cursors.right.isDown)
//    {
//        //  Move to the right
//        player.body.velocity.x = 150;
//
//        //player.animations.play('right');
//    }
//    else
//    {
//          //Stand still
//        //player.animations.stop();
//
//        player.frame = 4;
//    }
//
//    //  Allow the player to jump if they are touching the ground.
//    if (cursors.up.isDown && player.body.touching.down)
//    {
//        player.body.velocity.y = -500;
//    }
//
//}
//
//function collectStar (player, star) {
//
//    // Removes the star from the screen
//    star.kill();
//
//    //  Add and update the score
//    score += 10;
//    scoreText.text = 'Score: ' + score;
//
//}