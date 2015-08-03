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

var Weapon = {};

////////////////////////////////////////////////////
//  A single bullet is fired in front of the ship //
////////////////////////////////////////////////////

Weapon.SingleBullet = function (game, source) {

    Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;

    for (var i = 0; i < 64; i++)
    {
        this.add(new Bullet(game, 'bullet'), true);
    }

    return this;

};

Weapon.SingleBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.SingleBullet.prototype.constructor = Weapon.SingleBullet;

Weapon.SingleBullet.prototype.fire = function (source) {

    var angle = 270;
    if(source.body.velocity.x>0) var angle=0;
    else if(source.body.velocity.x<0) angle = 180;

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, 0, 0, source);

    this.nextFire = this.game.time.time + this.fireRate;

};

var Bullet = function (game, key) {

    Phaser.Sprite.call(this, game, 0, 0, key);

    //this.anchor.set(0.5);

    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;

    this.tracking = false;
    this.scaleSpeed = 0;

};

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

Bullet.prototype.fire = function (x, y, angle, speed, gx, gy, source) {
    gx = gx || 0;
    gy = gy || 0;

    this.reset(x, y);
    this.scale.set(1);

    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

    this.angle = angle;

    this.body.gravity.set(gx, gy);

};

Bullet.prototype.update = function () {

    if (this.tracking)
    {
        this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
    }

    if (this.scaleSpeed > 0)
    {
        this.scale.x += this.scaleSpeed;
        this.scale.y += this.scaleSpeed;
    }

};



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
        this.load.spritesheet('bullet', 'img/bullet.png', 6, 6);
    },

    create: function () {

        this.player = this.add.sprite(32, this.world.height - 64, 'dude');

        //  We need to enable physics on the player
        this.physics.arcade.enable(this.player);

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.gravity.y = 900;
        this.player.body.collideWorldBounds = true;

        this.weapons.push(new Weapon.SingleBullet(this.game));
        this.currentWeapon = 0;

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
        this.player.body.velocity.x=0;

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
            this.player.body.velocity.y = -600;
        }
        if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        {
            this.weapons[this.currentWeapon].fire(this.player);
        }

    }

};

game.state.add('Game', PhaserGame, true);
