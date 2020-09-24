var ball = document.getElementById('ball');
var rod1 = document.getElementById('rod1');
var rod2 = document.getElementById('rod2');

let gameOn = true, 
    movement,
    rodName,
    score,
    maxScore,
    ballSpeedX = 2,
    ballSpeedY = 2;

let windowWidth = window.innerWidth,
    windowHeight = window.innerHeight;

const storeName = "PPName";
const storeScore = "PPMaxScore";
const rod1Name = "Player_1";
const rod2Name = "Player_2";

function resetBoard(rodName){
    rod1.style.left = (windowWidth - rod1.offsetWidth)/2 + "px";
    rod2.style.left = (windowWidth - rod2.offsetWidth)/2 + "px";
    ball.style.left = (windowWidth - ball.offsetWidth)/2 + "px";
    // Lossing player gets the ball
    if (rodName === rod1Name){
        ball.style.top = rod2.offsetTop - ball.offsetHeight +"px";
        ballSpeedY = -2;
    } else if ( rodName === rod2Name){
        ball.style.top = rod1.offsetTop + rod1.offsetHeight +"px";
        ballSpeedY = 2;
    }
    score = 0;
    gameOn = true;
}


(function(){
    rodName = localStorage.getItem(storeName);
    maxScore = localStorage.getItem(storeScore);

    if ( rodName === "null" || maxScore === "null"){
        alert("This is the first time you are playing this game. LET'S START");
        maxScore = 0;
        rodName = rod1Name
    } else {
        alert(rodName + " has maximum score of " + maxScore * 100);
    }
    resetBoard(rodName);
})();


function storeWin(rodName, score){
    if ( score > maxScore){
        maxScore = score;
        localStorage.setItem(maxScore, maxScore);
        localStorage.setItem(storeName, rodName);
    }
    clearInterval(movement);
    resetBoard(rodName);
    alert(rodName + " wins with a score of " + (score * 100) + ". Max score is: " + (maxScore * 100));
}

window.addEventListener('keydown', function(event){
    let rodSpeed = 20;
    let rodRect = rod1.getBoundingClientRect();

    if ((event.code === "KeyD" || event.code === 'ArrowRight') && ((rodRect.x + rodRect.width) < window.innerWidth)){
        rod1.style.left = rodRect.x + rodSpeed +"px";
        rod2.style.left = rod1.style.left;
    }else if((event.code === "KeyA" || event.code === 'ArrowLeft') && (rodRect.x > 0)){
        rod1.style.left = rodRect.x - rodSpeed +"px";
        rod2.style.left = rod1.style.left;
    }

    if (event.code === "Enter") {
        if (gameOn){
            gameOn = false;
            let ballRect = ball.getBoundingClientRect();
            let ballX = ballRect.x;
            let ballY = ballRect.y;
            let ballDia = ballRect.width;

            let rod1Height = rod1.offsetHeight;
            let rod2Height = rod2.offsetHeight;
            let rod1Width = rod1.offsetWidth;
            let rod2Width = rod2.offsetWidth;

            movement = setInterval(function(){
                // move ball
                ballX += ballSpeedX;
                ballY += ballSpeedY;

                rod1X = rod1.getBoundingClientRect().x;
                rod2X = rod2.getBoundingClientRect().x;

                ball.style.left = ballX + 'px';
                ball.style.top = ballY + 'px';

                if((ballX + ballDia) > window.innerWidth || ballX < 0 ){
                    ballSpeedX = -ballSpeedX; // reverses the direction
                }

                // It specifies the center of the ball on the viewport
                let ballPosition = ballX + ballDia/2;

                // check for rod 1
                if (ballY <= rod1Height){
                    ballSpeedY = -ballSpeedY // Reverses the direction
                    score++;
                    // checking if the game ends
                    if ((ballPosition < rod1X) || (ballPosition > (rod1X+rod1Width))){
                        storeWin(rod2Name, score);
                    }
                }
                // check for rod2
                else if((ballY + ballDia) >= ( windowHeight - rod2Height)){
                    ballSpeedY = -ballSpeedY // Reverses the direction
                    score++;
                    // checking if the game ends
                    if ((ballPosition < rod2X) || (ballPosition > (rod2X+rod2Width))){
                        storeWin(rod1Name, score);
                    }
                }

            }, 10)

        }
    }

})