var boardSize = 500,
	leftMargin = (window.innerWidth - boardSize) / 2,
	topMargin = (window.innerHeight - boardSize) / 2,
	pieces = [],
	ctx = canvas.getContext('2d'),
	zug = 1; // 1 = White, -1 = Black

canvas.style.left = "50px";
canvas.style.top = "50px";

window.onload = function() {
	init();
};

function init() {
	board.style.left = leftMargin + "px";
	board.style.top = topMargin + "px";
	drawGrid();

	// Draw pieces
	for(var i = 0; i <= 7; i++) {
		for(var j = 0; j <= 7; j++) {
			pieces[i] = new Array();
		}
	}

	for(var y = 0; y <= 7; y++) {
		for(var x = 0; x <= 7; x++) {
			if(((y == 0 || y == 2) && x % 2 == 1) || (y == 1 && x % 2 == 0)) {
				pieces[y][x] = new Piece(x * 50, y * 50, -1, 1);
			}
			else if(((y == 5 || y == 7) && x % 2 == 0) || (y == 6 && x % 2 == 1)) {
				pieces[y][x] = new Piece(x * 50, y * 50, 1, 0);
			}
		}
	}

	for(var y = 0; y <= 7; y++) {
		for(var x = 0; x <= 7; x++) {
			var piece = pieces[y][x];

			if(piece != null) {
				piece.draw();
			}
		}
	}
}

function drawGrid() {
	var color = -1;
	ctx.fillRect(0, 0, boardSize, boardSize);

	for(var y = 0; y <= 7; y++) {
		for(var x = 0; x <= 7; x++) {
			ctx.fillStyle = (color == 1) ? '#964514' : '#deb887';
			ctx.fillRect(x * 50, y * 50, 50, 50);
			color *= -1;
		}
		color *= -1;
	}
}

// Piece
function Piece(x, y, colorCode, picPos) {
	this.selected = false,
	this.colorCode = colorCode,
	this.x = x,
	this.y = y,
	this.size = 40,

    this.draw = function() {
		ctx.fillStyle = (colorCode == -1) ? 'black' : '#e5c49a';
		ctx.beginPath();
		ctx.arc(this.x + 5 + this.size / 2, this.y + 5 + this.size / 2, this.size / 2, 0, 2 * Math.PI);
		ctx.fill();
    };
}

document.onmousedown = function(event) {
    drawGrid();

    this.currentX = Math.floor((event.pageX - (leftMargin + 50)) / 50);
    this.currentY = Math.floor((event.pageY - (topMargin + 50)) / 50);

    if(pieces[this.currentY][this.currentX] != null && pieces[this.currentY][this.currentX].colorCode == zug) {
		// Highlight selected piece
		ctx.fillStyle = 'lightblue';
		ctx.fillRect(this.currentX * 50, this.currentY * 50, 50, 50);
		pieces[this.currentY][this.currentX].selected = true;
		this.lastX = this.currentX; // Save last position
		this.lastY = this.currentY;
    }
    else if(this.lastX != null && this.lastY != null) {
		// If there is a selected piece
		if (((pieces[this.lastY][this.lastX].colorCode == -1 && this.currentY > this.lastY) || // No going back
			(pieces[this.lastY][this.lastX].colorCode == 1 && this.currentY < this.lastY)) &&
			pieces[this.currentY][this.currentX] == null && // Cannot jump on top of another stone
			((Math.abs(this.currentX - this.lastX) == 2 && Math.abs(this.currentY - this.lastY) == 2 && // If walked two steps (so jumped)
			pieces[this.lastY + (this.currentY - this.lastY) / 2][this.lastX + (this.currentX - this.lastX) / 2] &&
			pieces[this.lastY + (this.currentY - this.lastY) / 2][this.lastX + (this.currentX - this.lastX) / 2].colorCode !=
			pieces[this.lastY][this.lastX].colorCode) ||
			(Math.abs(this.lastX - this.currentX) == 1 && Math.abs(this.lastY - this.currentY) == 1))) // If walked one step
		{
			pieces[this.currentY][this.currentX] = new Piece(this.currentX * 50, this.currentY * 50, pieces[this.lastY][this.lastX].colorCode, pieces[this.lastY][this.lastX].picPos); // Create new piece

			if(Math.abs(this.currentY - this.lastY) > 1) {
				// Remove piece that has been jumped over
				pieces[this.lastY + Math.floor((this.currentY - this.lastY) / 2)][this.lastX + Math.floor((this.currentX - this.lastX) / 2)] = null;

			}
			pieces[this.lastY][this.lastX] = null; // Remove piece from old position
			this.lastX = this.lastY = null;

			zug *= -1;
		}
    }

    // Draw pieces
	for(var y = 0; y <= 7; y++) {
		for(var x = 0; x <= 7; x++) {
			var piece = pieces[y][x];

			if(piece != null) {
				piece.draw();
			}
		}
	}
}
