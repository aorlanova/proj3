document.addEventListener("DOMContentLoaded", function() {
    var puzzleContainer = document.getElementById('puzzlearea');
    var allPuzzleTiles = [];
    var emptySpaceLocation = { x: 3, y: 3 };
    var isShuffling = false;
    var x = document.getElementById("myAudio"); 
    var playButton = document.getElementById("play");
    var pauseButton = document.getElementById("pause");
    var y = document.getElementById("intenseAud");
    var moveCount = 0;
    var cancel;

    playButton.addEventListener('click', function() {
        x.play();
    });

    pauseButton.addEventListener('click', function() {
        x.pause();
        y.pause();
    });


    // Creating and placing each puzzle tile
    for (var tileNumber = 0; tileNumber < 15; tileNumber++) {
        var singleTile = document.createElement('div');
        singleTile.className = 'tile';
        singleTile.innerHTML = tileNumber + 1;
        var horizontalPosition = (tileNumber % 4) * 100;
        var verticalPosition = Math.floor(tileNumber / 4) * 100;
        singleTile.style.left = horizontalPosition + 'px';
        singleTile.style.top = verticalPosition + 'px';
        singleTile.style.backgroundPosition = '-' + horizontalPosition + 'px -' + verticalPosition + 'px';

        singleTile.addEventListener('click', function() {
            moveSelectedTile(this);
            highlightMovableTiles();
        });
        puzzleContainer.appendChild(singleTile);
        allPuzzleTiles.push(singleTile);
    }

    var shuffleTilesButton = document.getElementById('shufflebutton');
    shuffleTilesButton.addEventListener('click', function() {
        shufflePuzzleTiles();
        highlightMovableTiles();
    });

    var startGame = document.getElementById('startGame');
    startGame.addEventListener('click', function() {
        alert("New game! Gooooood luck!");
        secCollector(false);
    });

    var solvePuzzleButton = document.getElementById('solvebutton');
    solvePuzzleButton.addEventListener('click', function() {
        resetPuzzleToInitialState();
    });

    function moveSelectedTile(tileToMove) {
        var tileXPos = parseInt(tileToMove.style.left) / 100;
        var tileYPos = parseInt(tileToMove.style.top) / 100;

        if (canTileBeMoved(tileXPos, tileYPos)) {
            tileToMove.style.left = emptySpaceLocation.x * 100 + 'px';
            tileToMove.style.top = emptySpaceLocation.y * 100 + 'px';
            emptySpaceLocation.x = tileXPos;
            emptySpaceLocation.y = tileYPos;

            if (!isShuffling && isPuzzleSolved()) {
                displaySolvedNotification();
                saveScore();
            } else {
                countCollector();
            }
        }
    }


    function canTileBeMoved(tileX, tileY) {
        var adjacentToEmptyX = tileX === emptySpaceLocation.x && Math.abs(tileY - emptySpaceLocation.y) === 1;
        var adjacentToEmptyY = tileY === emptySpaceLocation.y && Math.abs(tileX - emptySpaceLocation.x) === 1;
        return adjacentToEmptyX || adjacentToEmptyY;
    }

    function shufflePuzzleTiles() {
        isShuffling = true;

        for (var i = 0; i < 300; i++) {
            var movableTiles = findMovableTiles();
            var randomTileIndex = Math.floor(Math.random() * movableTiles.length);
            var tileToShuffle = movableTiles[randomTileIndex];
            moveSelectedTile(tileToShuffle.element);
        }

        isShuffling = false;
    }


    // Function to find tiles that can be moved
    function findMovableTiles() {
        var movableTiles = [];
        for (var i = 0; i < allPuzzleTiles.length; i++) {
            var currentTile = allPuzzleTiles[i];
            var tileXPos = parseInt(currentTile.style.left) / 100;
            var tileYPos = parseInt(currentTile.style.top) / 100;
            if (canTileBeMoved(tileXPos, tileYPos)) {
                movableTiles.push({ element: currentTile});
            }

        }
        return movableTiles;
    }  

    // Function to add the movablepiece class to the tile that can be moved
    function highlightMovableTiles() {
        var movableTiles = findMovableTiles();
        allPuzzleTiles.forEach(tile => {
            tile.removeEventListener('mouseenter', handleMouseOver);
            tile.removeEventListener('mouseleave', handleMouseLeave);
            tile.classList.remove('movablepiece');
        });
    
        movableTiles.forEach(tileObject => {
            var tile = tileObject.element;
            tile.addEventListener('mouseenter', handleMouseOver);
            tile.addEventListener('mouseleave', handleMouseLeave);
        });
    
        function handleMouseOver() {
            if (canTileBeMoved(parseInt(this.style.left) / 100, parseInt(this.style.top) / 100)) {
                this.classList.add('movablepiece');
            }
        }
    
        function handleMouseLeave() {
            this.classList.remove('movablepiece');
        }
    }

    function resetPuzzleToInitialState() {
        for (var i = 0; i < 15; i++) {
            var currentTile = allPuzzleTiles[i];
            var resetXPosition = (i % 4) * 100;
            var resetYPosition = Math.floor(i / 4) * 100;
            currentTile.style.left = resetXPosition + 'px';
            currentTile.style.top = resetYPosition + 'px';
        }
        emptySpaceLocation.x = 3;
        emptySpaceLocation.y = 3;

        highlightMovableTiles();
    }

    function isPuzzleSolved() {
        for (var i = 0; i < allPuzzleTiles.length; i++) {
            var correctXPosition = (i % 4) * 100;
            var correctYPosition = Math.floor(i / 4) * 100;
            var currentTile = allPuzzleTiles[i];

            if (parseInt(currentTile.style.left) !== correctXPosition ||
                parseInt(currentTile.style.top) !== correctYPosition) {
                return false;
            }
        }
        return true;
    }

    function displaySolvedNotification() {
        x.pause();
        y.pause();
		
		var endOfGameNotification = document.getElementById('endofgamenotification');

		var trophyImage = document.createElement('img');
		trophyImage.src = 'trophy.jpg'; 

		var message = document.createElement('p');
		message.textContent = "Congratulations! You've solved the puzzle!";

		endOfGameNotification.innerHTML = '';

		endOfGameNotification.appendChild(trophyImage);
		endOfGameNotification.appendChild(message);
		
		setTimeout(function() {
        endOfGameNotification.innerHTML = '';
		}, 3000);
    }


    //antonina changes (sorry, this is me battling merge conflicts)
    function saveScore() {
        //reset counter function and clear status
        secCollector(true);
        //get current score status 
        var scoreSec = parseInt(document.getElementById("time-elapsed").innerHTML, 10);
        var moves = parseInt(document.getElementById("clicks-elapsed").innerHTML, 10);

        //clear current score
        document.getElementById("time-elapsed").innerHTML = "";
        document.getElementById("clicks-elapsed").innerHTML = ""; 

        //fill in user's past scores to put in saved scores for display and sorting based on highest score
        var t1 = document.getElementById("time1").innerHTML != "" || null ? parseInt(document.getElementById("time1").innerHTML, 10) : null;
        var m1 = document.getElementById("moves1").innerHTML != "" || null ? parseInt(document.getElementById("moves1").innerHTML, 10) : null;
        var t2 = document.getElementById("time2").innerHTML != "" || null ? parseInt(document.getElementById("time2").innerHTML, 10) : null;
        var m2 = document.getElementById("moves2").innerHTML != "" || null ? parseInt(document.getElementById("moves2").innerHTML, 10) : null;
        var t3 =  document.getElementById("time3").innerHTML != "" || null ? parseInt(document.getElementById("time3").innerHTML, 10) : null;
        var m3 = document.getElementById("moves3").innerHTML != "" || null ? parseInt(document.getElementById("moves3").innerHTML, 10) : null;
        var t4 = document.getElementById("time4").innerHTML != "" || null ? parseInt(document.getElementById("time4").innerHTML, 10) : null;
        var m4 = document.getElementById("moves4").innerHTML != "" || null ? parseInt(document.getElementById("moves4").innerHTML, 10) : null;
        var allSavedScores = [[t1,m1],[t2,m2],[t3,m3],[t4,m4]];

        // check if there is a non filled out 
        for(b=0; b<4;b++) {
            if(allSavedScores[b][0] == null) {
                allSavedScores[b][0] = scoreSec;
                allSavedScores[b][1] = moves;
                break;
            } else if (b == 3) {
                allSavedScores[b][0] = scoreSec;
                allSavedScores[b][1] = moves;
                break;
            }
        }
        allSavedScores.sort(function(a,b) {
            return a[0]-b[0]
        });
        console.log(allSavedScores[3][0] + " " + allSavedScores[3][1]);
            document.getElementById("time1").innerHTML = allSavedScores[0][0] != null? allSavedScores[0][0] : "";
            document.getElementById("time2").innerHTML = allSavedScores[1][0] != null? allSavedScores[1][0] : "";
            document.getElementById("time3").innerHTML = allSavedScores[2][0] != null? allSavedScores[2][0] : "";
            document.getElementById("time4").innerHTML = allSavedScores[3][0] != null? allSavedScores[3][0] : "";
            document.getElementById("moves1").innerHTML = allSavedScores[0][1] != null? allSavedScores[0][1] : "";
            document.getElementById("moves2").innerHTML = allSavedScores[1][1] != null? allSavedScores[1][1] : "";
            document.getElementById("moves3").innerHTML = allSavedScores[2][1] != null? allSavedScores[2][1] : "";
            document.getElementById("moves4").innerHTML = allSavedScores[3][1] != null? allSavedScores[3][1] : "";
    }


    function secCollector(cancelme) {
        if(cancelme == true) {
            clearInterval(cancel); 
            seconds = 0;
            moveCount = 0;
            cancel = setInterval(incrementSeconds, 20903983209830*5);
            return;
        } else if (cancelme == false) {
            seconds = 0;
            var secondsCount = document.getElementById("time-elapsed"); 

            function incrementSeconds() {
                seconds += 1;
                secondsCount.innerHTML = seconds;
                if (seconds == 15) {
                    if(!x.paused) {
                        x.pause();
                        y.play();
                    }

                }
            }

            cancel = setInterval(incrementSeconds, 1000);
    }
    }
    function countCollector() {
        moveCount++;
        document.getElementById("clicks-elapsed").innerHTML = (moveCount - 300); 
    }
});
