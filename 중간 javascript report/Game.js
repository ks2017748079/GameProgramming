
var myGamePiece;
var myObstacles = [];
var myObstacles2 = [];
var myObstacles3 = [];
var myScore;
var mySound;
var myMusic;




//startGame()은 myGameArea객체의 start()메소드를 호출 
function startGame() {
    myGamePiece = new component(40, 45, "pichu.png", 10, 120,"image");
    myScore = new component("30px", "Consolas", "black", 10, 40, "text");
    mySound = new sound("thump1.wav");  
    myMusic = new sound("bb2.wav");
    myMusic.play(); 

    myGameArea.start();
}

//start()메소드는 <canvas>요소를 작성하여 첫 번째 하위 노드로 삽입 
var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1200;
        this.canvas.height = 650;
        document.getElementById("canvascontainer").appendChild(this.canvas);
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        

        //키가 눌려졌는지 확인하는 메소드 생성
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })


        },

    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);


    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
     if (type == "image") {
        this.image = new Image();
        this.image.src = color;
  }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }if (type == "image") {
            ctx.drawImage(this.image,
            this.x,
            this.y,
            this.width, this.height);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.speedX;
        this.y += this.speedY;        
    }
    //충돌 
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}






function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    //myObstacles2와 캐릭터 충돌시 피카츄로 변신  
    for(i = 0; i<myObstacles2.length; i+=1){
        if(myGamePiece.crashWith(myObstacles2[i])){
            myGamePiece = new component(40, 45, "pikachu.png", 10, 120,"image");
            myObstacles2=0;
           
           //장애물 충돌 시 충돌한 종류의 막대는 사라지지만 막대와 점수도 함께 사라진다.....

        
        }
        /*myScore.text="SCORE: " + myGameArea.frameNo;
        myScore.update();

        myGamePiece.newPos();    
        myGamePiece.update();*/
    }
    //myObstacles3와 캐릭터 충돌시 라이츄로 변신  
    for(i = 0; i<myObstacles3.length; i+=1){
        if(myGamePiece.crashWith(myObstacles3[i])){
            myGamePiece = new component(40, 45, "raichu.png", 10, 120,"image");
            myObstacles3=0;
        }
    }


    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            mySound.play();   
            myMusic.stop();
            //bar충돌시 GAME OVER 창 띄우기 
            alert("GAME OVER");
            //GAME OVER 창에서 확인 클릭시 최종 점수 나타내기 
            alert(myScore.text);
            myGameArea.stop();
           

            return;
        } 
    }

    //키보드로 캐릭터 조종 
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;    
    if (myGameArea.key && myGameArea.key == 37) {myGamePiece.speedX = -1; }
    if (myGameArea.key && myGameArea.key == 39) {myGamePiece.speedX = 1; }
    if (myGameArea.key && myGameArea.key == 38) {myGamePiece.speedY = -1; }
    if (myGameArea.key && myGameArea.key == 40) {myGamePiece.speedY = 1; }



    myGameArea.clear();
    myGameArea.frameNo += 1;
    //장애물 막대 생성 
    //프레임 수를 계산 하여 200번째 프레임마다 장애물을 생성 
    if (myGameArea.frameNo == 1 || everyinterval(200)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        //폭 , 높이 ,색상, 오른쪽 ,아래
        myObstacles.push(new component(10, height, "#F5F6CE", x, 0));
        myObstacles.push(new component(10, x - height - gap, "#F5F6CE", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i +=1) {
        myObstacles[i].speedX = -1;
        myObstacles[i].newPos();
        myObstacles[i].update();
    }


    //피카츄로 변화는 검정 막대 
     if (myGameArea.frameNo == 100 || everyinterval(1100)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        myObstacles2.push(new component(10, height, "#F7BE81", x, 0));
        //myObstacles2.push(new component(10, x - height - gap, "black", x, height + gap));
    }
    for (i = 0; i < myObstacles2.length; i +=1) {
        myObstacles2[i].speedX = -1;
        myObstacles2[i].newPos();
        myObstacles2[i].update();
    }

    //라이츄로 변신하는 파랑색 막대 생성 
    if (myGameArea.frameNo == 1750 || everyinterval(2180)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
        //myObstacles3.push(new component(10, height, "blue", x, 0));
        myObstacles3.push(new component(10, x - height - gap, "#FA5858", x, height + gap));
    }
    for (i = 0; i < myObstacles3.length; i +=1) {
        myObstacles3[i].speedX = -1;
        myObstacles3[i].newPos();
        myObstacles3[i].update();
    }

    //score 
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();

    myGamePiece.newPos();    
    myGamePiece.update();
}

//게임 재시작 
function restartgame(x) {
    myGameArea.stop();
    myGameArea.clear();
 //   myGameArea = {};
    myGamePiece = {};
    myObstacles = [];
    myObstacles2 = [];
    myObstacles3 = [];
    myscore = {};
    //mySound = {};
    myMusic.stop();
    document.getElementById("canvascontainer").innerHTML = "";
    startGame();
}

//충돌 효과음, 배경음악 
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }    
}



//화면에 방향키 생성 
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

/*function moveup() {
    myGamePiece.speedY = -1; 
}

function movedown() {
    myGamePiece.speedY = 1; 
}

function moveleft() {
    myGamePiece.speedX = -1; 
}

function moveright() {
    myGamePiece.speedX = 1; 
}*/

function clearmove() {
    myGamePiece.speedX = 0; 
    myGamePiece.speedY = 0; 
}

