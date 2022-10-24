class Sprite {
    constructor({ position, imageSrc, scale = 1, framesMax = 1, offset = { x: 0, y: 0 } }) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.frameCurrent = 0;
        this.frameElapsed = 0;
        this.framesHold = 5;
        this.offset = offset;
    }

    draw() {
        context.drawImage(
            this.image,
            // CROP IMAGES FOR ANIMATION 
            this.frameCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,

            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );
    }
    animateFrames() {
        this.frameElapsed++;
        if (this.frameElapsed % this.framesHold === 0) {
            if (this.frameCurrent < this.framesMax - 1) {
                this.frameCurrent++;
            }
            else {
                this.frameCurrent = 0;
            }
        }
    }
    update() {
        this.draw();
        this.animateFrames();
    }
}


class Fighter extends Sprite {
    constructor({ position,
        velocity,
        color,
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined }
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        });
        this.velocity = velocity;
        this.height = 150;
        this.lastKey;
        this.width = 50;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        };
        this.color = color;
        this.isAttacking;
        this.health = 100;
        this.frameCurrent = 0;
        this.frameElapsed = 0;
        this.framesHold = 5;
        this.sprites = sprites;
        this.dead = false;
        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image;
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    move() {
        this.draw();
        if(!this.dead){
            this.animateFrames();
        }
        
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;


        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;


        // this.position.y = top of each rectangle gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0;
            this.position.y = 554.3999999999999;
        }
        else {
            this.velocity.y += gravity;
        }
    }
    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true;
    }
    takeHit() {
        if(this === player){
            var audio = new Audio("./assets/sounds/attacked.mp3");
            audio.play();
        }
        else if(this === enemy){
            var audio = new Audio("./assets/sounds/wizard-attacked.wav");
            audio.play();
        }
        
        this.health -= 4;
        if(this.health <= 0){
            if(this === player){
                var audio = new Audio("./assets/sounds/dying.mp3");
                audio.play();
            }
            else if(this === enemy){
                var audio = new Audio("./assets/sounds/wizard-dying.mp3");
                audio.play();
            }
            this.switchSprite('death');
        }
        else{
            this.switchSprite('takeHit');
        }
    }

    switchSprite(sprite) {
        // Overriding all the moves when attacking
        if (this.image === this.sprites.death.image
            &&
            this.frameCurrent < this.sprites.death.framesMax - 1) {
            this.dead = true;
            return;
        }

        // Overriding all the moves when attacking
        if (this.image === this.sprites.attack1.image &&
            this.frameCurrent < this.sprites.attack1.framesMax - 1) {
            return;
        }

        // Overriding all the moves when taking hit
        if (this.image === this.sprites.takeHit.image &&
            this.frameCurrent < this.sprites.takeHit.framesMax - 1) {
            return;
        }

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax;
                    this.frameCurrent = 0;
                }
                break;
        }
    }
}