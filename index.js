// * Step 1 : Initial canvas setup
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = 1430;
canvas.height = 800;
context.fillRect(0, 0, canvas.width, canvas.height);



// * Step 2 : Create a player and enemy and background
const gravity = 0.7;
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background.png',
    scale: 1
})


const player = new Fighter(
    {
        position: {
            x: 0,
            y: 0
        },
        velocity: {
            x: 0,
            y: 0
        },
        offset: {
            x: 0,
            y: 0
        },
        color: "red",
        imageSrc: './assets/Player/Idle.png',
        framesMax: 8,
        scale: 4.5,
        offset:
        {
            x: 100,
            y: 310
        },
        sprites: {
            idle: {
                imageSrc: './assets/Player/Idle.png',
                framesMax: 8,
            },
            run: {
                imageSrc: './assets/Player/Run.png',
                framesMax: 8,
            },
            jump: {
                imageSrc: './assets/Player/Jump.png',
                framesMax: 2,
            },
            fall: {
                imageSrc: './assets/Player/Fall.png',
                framesMax: 2,
            },
            attack1: {
                imageSrc: './assets/Player/Attack3.png',
                framesMax: 4,
            },
            takeHit: {
                imageSrc: './assets/Player/Take-Hit.png',
                framesMax: 4,
            },
            death: {
                imageSrc: './assets/Player/Death.png',
                framesMax: 6,
            }
        },
        attackBox: {
            offset: {
                x: 0,
                y: 0
            },
            width: 100,
            height: 50
        }
    }
)

const enemy = new Fighter(
    {
        position: {
            x: 650,
            y: 100
        },
        velocity: {
            x: 0,
            y: 0
        },
        offset: {
            x: 0,
            y: 0
        },
        color: 'blue',
        imageSrc: './assets/Enemy/Idle.png',
        framesMax: 8,
        scale: 4,
        offset:
        {
            x: -40,
            y: 505
        },
        sprites: {
            idle: {
                imageSrc: './assets/Enemy/Idle.png',
                framesMax: 8,
            },
            run: {
                imageSrc: './assets/Enemy/Run.png',
                framesMax: 8,
            },
            jump: {
                imageSrc: './assets/Enemy/Jump.png',
                framesMax: 2,
            },
            fall: {
                imageSrc: './assets/Enemy/Fall.png',
                framesMax: 2,
            },
            attack1: {
                imageSrc: './assets/Enemy/Attack1.png',
                framesMax: 8,
            },
            takeHit: {
                imageSrc: './assets/Enemy/Take-hit.png',
                framesMax: 3,
            },
            death: {
                imageSrc: './assets/Enemy/Death.png',
                framesMax: 7,
            }
        },
        attackBox: {
            offset: {
                x: 0,
                y: 0
            },
            width: 200,
            height: 50
        }
    }
)



// * Step 3 : Create movements animation for player and enemy
const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    },
    l: {
        pressed: false
    },
    j: {
        pressed: false
    }
}

let animateID
function animate() {
    animateID = window.requestAnimationFrame(animate);
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    context.fillStyle = 'rgba(255,255,255,0.06)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.move();
    enemy.move();
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Playe movements
    // Left move
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    }
    // Right move
    else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    }
    // Nothing
    else {
        player.switchSprite('idle');
    }
    // Jumpin
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    }
    // Falling
    else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }


    // Enemy movements
    if (keys.l.pressed && enemy.lastKey === 'l') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    }
    else if (keys.j.pressed && enemy.lastKey === 'j') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    }
    else {
        enemy.switchSprite('idle');
    }
    // Jumpin
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    }
    // Falling
    else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    // Detect collision between player sord and enemy body
    if (
        collisionDetyection({
            rectangle1: player,
            rectangle2: enemy
        })
        &&
        player.isAttacking
        &&
        player.frameCurrent === 2
    ) {
        enemy.takeHit();
        player.isAttacking = false;
        document.getElementById('enemyHealth').style.width = enemy.health + '%';
    }

    // if player misses
    if (player.isAttacking && player.frameCurrent === 2) {
        player.isAttacking = false;
    }
    // Detect collision between player body and enemy sword
    if (
        collisionDetyection({
            rectangle1: enemy,
            rectangle2: player
        })
        &&
        enemy.isAttacking
        &&
        enemy.frameCurrent === 4
    ) {
        player.takeHit();
        enemy.isAttacking = false;
        document.getElementById('playerHealth').style.width = player.health + '%';
    }
    // if enemy misses
    if (enemy.isAttacking && enemy.frameCurrent === 4) {
        enemy.isAttacking = false;
    }

    // End game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerID });
    }
}
animate();



// * Step 4 : Creating key press event listeners
window.addEventListener('keydown', ({ key }) => {
    if (!player.dead) {
        switch (key) {
            // Player keys
            case 'd':
                var audio = new Audio("./assets/sounds/run.wav");
                audio.play();
                keys.d.pressed = true;
                player.lastKey = 'd';
                break;
            case 'a':
                var audio = new Audio("./assets/sounds/run.wav");
                audio.play();
                keys.a.pressed = true;
                player.lastKey = 'a';
                break;
            case 'w':
                var audio = new Audio("./assets/sounds/jump.wav");
                audio.play();
                player.velocity.y = -20;
                break;
            case 's':
                var audio = new Audio("./assets/sounds/sword-hit.wav");
                audio.play();
                player.attack();
                break;
        }
    }
    if (!enemy.dead) {
        switch (key) {
            // Enemy keys
            case 'l':
                var audio = new Audio("./assets/sounds/run.wav");
                audio.play();
                keys.l.pressed = true;
                enemy.lastKey = 'l';
                break;
            case 'j':
                var audio = new Audio("./assets/sounds/run.wav");
                audio.play();
                keys.j.pressed = true;
                enemy.lastKey = 'j';
                break;
            case 'i':
                var audio = new Audio("./assets/sounds/fly.mp3");
                audio.play();
                enemy.velocity.y = -20;
                break;
            case 'k':
                var audio = new Audio("./assets/sounds/wand-hit.mp3");
                audio.play();
                setTimeout(() => {
                    enemy.attack();
                }, 350);
                break;
        }
    }
})
window.addEventListener('keyup', ({ key }) => {
    switch (key) {
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;
    }
    // Enemy keys
    switch (key) {
        case 'l':
            keys.l.pressed = false;
            break;
        case 'j':
            keys.j.pressed = false;
            break;
    }
})

decreaseTimer(animateID);