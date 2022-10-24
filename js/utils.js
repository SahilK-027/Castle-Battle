function collisionDetyection({ rectangle1, rectangle2 }) {
    return (
        // Left to right collision
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x
        &&
        // Right passes ahed
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        &&
        // Top exceed 
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}
function determineWinner({ player, enemy, timerID}) {
    clearTimeout(timerID);
    document.getElementById('displayText').style.display = 'flex';
    if (player.health === enemy.health) {
        document.getElementById('displayText').innerHTML = 'TIME-UP: TIE';
        cancelAnimationFrame(animateID);
    }
    else if (player.health > enemy.health) {
        document.getElementById('displayText').innerHTML = 'WINNER: WARRIOR';
    }
    else if (player.health < enemy.health) {
        document.getElementById('displayText').innerHTML = 'WINNER: WIZARD';
    } 
    
}
let timer = 100
let timerID
function decreaseTimer(animateID) {
    if (timer > 0) {
        timerID = setTimeout(decreaseTimer, 1000);
        timer--;
        document.getElementById('timer').innerHTML = timer
    }

    if (timer === 0) {
        determineWinner({ player, enemy,timerID,animateID });
    }
}