let visual_board = document.getElementById('board');

const row = 10;
const col = 10;
const obsCount = 20;
const numOfPlayer = 2;

let weaponList = ["knife", "axe", "gun", "bazooka"];

let knife = {
        weaponId: "knife",
        damage: 20,
        taken: false,
        url: '/asset/knife.png'
};
let axe =  {
        weaponId: "axe",
        damage: 30,
        taken: false,
        url: '/asset/axe.png'
};
let gun = {
        weaponId:"gun",
        damage: 40,
        taken: false,
        url: '/asset/gun.png'
};
let bazooka = {   
    weaponId:"bazooka",
    damage: 50,
    taken: false,
    url: '/asset/bazooka.png'
};

let noWeapon = {
    weaponId: 'free',
    damage: 5,
    url: ''
};

let player1 = {
    id: 'player1',
    health: 100,
    weapon: noWeapon,
    defend: false,
    position: [0, 0],
    score: 0
};

let player2 = {
    id:'player2',
    health: 100,
    weapon: noWeapon,
    defend: false,
    position: [0, 1],
    score: 0
};

let playerInTurn = player1;
let playerNotTurn = player2;
let playerInTurnMovesCount = 0;

//for creating new random number
function randomNum(){
    return Math.floor(Math.random() * 10)
}

//for creating empty 2d array
let board_map = [...Array(10)].map(e => Array(10));

//fill all the board with free/grass blocks
function fillBoardMap(){
    for(let i = 0; i<row; i++){
        for(let j = 0; j<col; j++){
            board_map[i][j] = "free";
        }    
    }
}

//generate rocks/obstacle randomly
function generateObstacle(){
    for(let i=0; i<obsCount; i++){
        let randomNum1 = randomNum();
        let randomNum2 = randomNum();
        if(board_map[randomNum1][randomNum2] == "free"){
            board_map[randomNum1][randomNum2] = "obstacle";
        } else {
          randomNum1 = randomNum();
          randomNum2 = randomNum();
          i--;
        }
    }    
}

//generate weapons randomly
function generateWeapons(){
    let randomNum1 = randomNum();
    let randomNum2 = randomNum();
    for(let i=0; i<weaponList.length; i++){
        if(board_map[randomNum1][randomNum2] == "free"){
            board_map[randomNum1][randomNum2] = `${weaponList[i]}`;
        } else {
            randomNum1 = randomNum();
            randomNum2 = randomNum();
            i--;
        }
    }
}

//generate player positions in the board
function generatePlayers(){
    let randomNum1 = randomNum();
    let randomNum2 = randomNum();
    for(let i=0; i<numOfPlayer; i++){
        if(board_map[randomNum1][randomNum2] == "free" && i == 0){
            board_map[randomNum1][randomNum2] = `player1`;
            player1.position = [randomNum1, randomNum2];
        } else if(board_map[randomNum1][randomNum2] == "free" && i == 1){
            board_map[randomNum1][randomNum2] = `player2`;
            player2.position = [randomNum1, randomNum2];
        } else {
            randomNum1 = randomNum();
            randomNum2 = randomNum();
            i--;
        }
    }
}

//restart all the game
function restart(){
    clearBoard();
    board_map = new Array(10).fill("free").map(() => new Array(10).fill("free"));
    generateObstacle();
    generateWeapons();
    generatePlayers();
    player1.health = 100;
    player2.health = 100;
    player1.weapon = noWeapon;
    player2.weapon = noWeapon;
    player1.defend = false;
    player2.defend = false;
    playerScoreBoard();
    draw();
    return 0;
}

//add each 2d array elements with the input css class
function addBox (className){
    let box = document.createElement('div');
    box.innerHTML = '&nbsp;';
    box.setAttribute('class',className);
    visual_board.append(box);
}

//clear all the board contents
function clearBoard (){
   visual_board.innerHTML = ''; 
}

//draw all the board elements
function draw(){
    for(i = 0; i<row; i++){
        for(j = 0; j<col; j++){
            addBox(board_map[i][j]);
        }
    }
}

//========================================================================================================
//update position based on the 2d array change
function updatePosition(){
    clearBoard();
    draw();
}

//when players meet, the engage in combat
function combatEngage(){
    let engageText = document.querySelector('.combat-engage');
    engageText.innerHTML = "Combat Engaged!!!"
    console.log("========== BATTLE MODE ENGAGE =============");
    

    let p1attackButton = document.querySelector('.p1-attack-button');
    let p1defendButton = document.querySelector('.p1-defend-button');
    
    let p2attackButton = document.querySelector('.p2-attack-button');
    let p2defendButton = document.querySelector('.p2-defend-button');

    function endBattle(){
        console.log("battle ended");
        p1attackButton.removeEventListener("click", attackPlayer);
        p1defendButton.removeEventListener("click", defendPlayer);
        
        p2attackButton.removeEventListener("click", attackPlayer);
        p2defendButton.removeEventListener("click", defendPlayer);
        playerInTurn.score++;
        let info = confirm(playerInTurn.id + " Has Won The Game!! \n\nClick OK to continue The Game \nor Cancel to reset The Game Score");
        if(info == true) {
            playerScoreBoard();    
            restart();    
        } else {
            player1.score = 0;
            player2.score = 0;
            playerScoreBoard();    
            restart();    
        }

        playerInTurnMovesCount = 0;
        playerScoreBoard();    
        restart();
    }

    function attackPlayer (){
        playerInTurn.defend = false; 
        
        if(playerInTurn.id == "player1"){
            p1defendButton.classList.remove('button-glow');
        } else {
            p2defendButton.classList.remove('button-glow');
        }

        if(playerNotTurn.defend == false){
            playerNotTurn.health = playerNotTurn.health - playerInTurn.weapon.damage;
        } else {
            playerNotTurn.health = playerNotTurn.health - playerInTurn.weapon.damage*0.5;
        }
        playerInTurnMovesCount = 3;
        
        if(playerNotTurn.health <= 0){
            endBattle();
            return 0;
        }
        checkMoves();
        
        playerScoreBoard();
    }
    
    function defendPlayer (){
        playerInTurn.defend = true;
        playerInTurnMovesCount = 3;
        if(playerInTurn.id == "player1"){
            p1defendButton.classList.add('button-glow');
        } else {
            p2defendButton.classList.add('button-glow');
        }
        checkMoves();
    }
    

    p1attackButton.addEventListener("click", attackPlayer);
    p1defendButton.addEventListener("click", defendPlayer);

    p2attackButton.addEventListener("click", attackPlayer);
    p2defendButton.addEventListener("click", defendPlayer);

}

//pickup weapon
function pickUpWeapon(newX, newY, whichWeapon){
    whichWeapon.taken = true;
    playerInTurn.weapon.taken = false;
    board_map[playerInTurn.position[0] ][playerInTurn.position[1] ] = playerInTurn.weapon.weaponId;
    board_map[newX][newY] = playerInTurn.id;
    playerInTurn.weapon = whichWeapon;
    playerInTurn.position = [newX, newY];
    playerInTurnMovesCount++;
    updatePosition();
    playerScoreBoard();
    checkMoves();
}

//move player from the inputed number
function move(newX, newY){

    //check if x or y is in the boundaries
    if((newX >= 0 && newX <= 9) && (newY >= 0 && newY <= 9)){
        //if it is x or y is free? => move to new x or y position, playerInTurnMovesCount++, checkmoves()
        if(board_map[newX][newY] == "free"){
            board_map[newX][newY] = playerInTurn.id;
            board_map[playerInTurn.position[0] ][playerInTurn.position[1] ] = "free";
            playerInTurn.position = [newX, newY];
            playerInTurnMovesCount++;
            console.log(playerInTurn.position);
            updatePosition();
            playerScoreBoard();
            
            if( playerInTurn.position[0] != 9 && board_map[playerInTurn.position[0]+1][playerInTurn.position[1] ] == playerNotTurn.id){
                combatEngage();
            } else if ( playerInTurn.position[0] != 0 && board_map[playerInTurn.position[0]-1][playerInTurn.position[1] ] == playerNotTurn.id){
                combatEngage();
            } else if (playerInTurn.position[1] != 9 && board_map[playerInTurn.position[0]][playerInTurn.position[1]+1] == playerNotTurn.id){
                combatEngage();
            } else if (playerInTurn.position[1] != 0 && board_map[playerInTurn.position[0]-1][playerInTurn.position[1]-1] == playerNotTurn.id){
                combatEngage();
            }

            checkMoves(); //checking player move
            
        } else if(board_map[newX][newY] == "knife"){
        //if newX and newY has a weapon => pick up the new weapon update players weapon, drop players old weapon   
            pickUpWeapon(newX, newY, knife);
        }
        else if(board_map[newX][newY] == "axe"){
            pickUpWeapon(newX, newY, axe);
        }
        else if(board_map[newX][newY] == "gun"){
            pickUpWeapon(newX, newY, gun);
        }
        else if(board_map[newX][newY] == "bazooka"){
            pickUpWeapon(newX, newY, bazooka);
        }
    }
}

//handle array keyboard moves
function handleMove (event){
   event.preventDefault();

   switch (event.key){
       case 'ArrowUp':
           move(playerInTurn.position[0]-1, playerInTurn.position[1]);
           console.log(event.key);
           break;
        case 'ArrowDown':
            move(playerInTurn.position[0]+1, playerInTurn.position[1]);
            console.log(event.key);
            break;
        case 'ArrowLeft':
            move(playerInTurn.position[0], playerInTurn.position[1]-1);
            console.log(event.key);
            break;
        case 'ArrowRight':
            move(playerInTurn.position[0], playerInTurn.position[1]+1);
            console.log(event.key);
            break;
   }
}

//check 
function checkMoves(){
    if(playerInTurnMovesCount >= 3){
        let p1_dashboard = document.querySelector('.p1-dashboard');
        let p2_dashboard = document.querySelector('.p2-dashboard');

        let p1attackButton = document.querySelector('.p1-attack-button');
        let p1defendButton = document.querySelector('.p1-defend-button');
    
        let p2attackButton = document.querySelector('.p2-attack-button');
        let p2defendButton = document.querySelector('.p2-defend-button');

        playerInTurnMovesCount = 0;
        console.log("count :" + playerInTurnMovesCount);
        if(playerInTurn.id == 'player1'){
            p2defendButton.classList.remove('button-glow');

            p1_dashboard.style.backgroundColor = "#232C33";
            p2_dashboard.style.backgroundColor = "#548C2F";
            playerInTurn = player2;
            playerNotTurn = player1;
            p2attackButton.disabled = false;
            p2defendButton.disabled = false;
            p2attackButton.style.backgroundColor = "#fa1616";
            p2defendButton.style.backgroundColor = "blue";
            
            p1attackButton.disabled = true;
            p1defendButton.disabled = true; 
            p1attackButton.style.backgroundColor = "gray";
            p1defendButton.style.backgroundColor = "gray";   
        } else {
            p1defendButton.classList.remove('button-glow');

            p2_dashboard.style.backgroundColor = "#232C33";
            p1_dashboard.style.backgroundColor = "#548C2F";
            playerInTurn = player1;
            playerNotTurn = player2;
            p1attackButton.disabled = false;
            p1defendButton.disabled = false;
            p1attackButton.style.backgroundColor = "#fa1616";
            p1defendButton.style.backgroundColor = "blue";
            
            p2attackButton.disabled = true;
            p2defendButton.disabled = true;
            p2attackButton.style.backgroundColor = "gray";
            p2defendButton.style.backgroundColor = "gray";
        }
    }

    console.log(playerInTurn.id);
}

//draw player scoreboard
function playerScoreBoard(){
    let player1Hp = document.querySelector('.p1-hp');
    let player2Hp = document.querySelector('.p2-hp');
    let p1equipedWeapon = document.querySelector('.p1-equiped-weapon');
    let p2equipedWeapon = document.querySelector('.p2-equiped-weapon');
    let player1Score = document.querySelector('#p1-number');
    let player2Score = document.querySelector('#p2-number');

    player1Hp.innerHTML = player1.health;
    player2Hp.innerHTML = player2.health;

    player1Score.innerHTML = player1.score;
    player2Score.innerHTML = player2.score;

    player1Hp.setAttribute('style', "width:" + player1.health + "%" + ";");
    player2Hp.setAttribute('style', "width:" + player2.health + "%" + ";");
    p1equipedWeapon.setAttribute('style', "background-image: url(" + player1.weapon.url + ");");
    p2equipedWeapon.setAttribute('style', "background-image: url(" + player2.weapon.url + ");");

}

//function to start the game
function start(){
    board_map = [...Array(10)].map(e => Array(10));
    fillBoardMap();
    generateObstacle();
    generateWeapons();
    generatePlayers();
    draw();
}

start();
playerScoreBoard();
document.addEventListener("keydown", handleMove);


