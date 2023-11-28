document.addEventListener("DOMContentLoaded", function() {
    var puzzleContainer = document.getElementById('puzzlearea');
    var allPuzzleTiles = [];
    var emptySpaceLocation = { x: 3, y: 3 };
    var isShuffling = false;
    var x = document.getElementById("myAudio"); 
    var playButton = document.getElementById("play");
    var pauseButton = document.getElementById("pause");

    playButton.addEventListener('click', function() {
        x.play();
    });

    pauseButton.addEventListener('click', function() {
        x.pause();
    });

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
        });

        puzzleContainer.appendChild(singleTile);
        allPuzzleTiles.push(singleTile);
    }

    var shuffleTilesButton = document.getElementById('shufflebutton');
    shuffleTilesButton.addEventListener('click', function() {
        shufflePuzzleTiles();
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

    function findMovableTiles() {
        var movableTiles = [];
        for (var i = 0; i < allPuzzleTiles.length; i++) {
            var currentTile = allPuzzleTiles[i];
            var tileXPos = parseInt(currentTile.style.left) / 100;
            var tileYPos = parseInt(currentTile.style.top) / 100;
            if (canTileBeMoved(tileXPos, tileYPos)) {
                movableTiles.push({ element: currentTile });
            }
        }
        return movableTiles;
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
        alert("Congratulations! You've solved the puzzle!");
    }
});
