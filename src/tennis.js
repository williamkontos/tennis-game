	//canvas variables
		var canvas;
		var canvasContext;
		
		//ball variables
		var ballX = 50;
		var ballY = 50;
		var ballSpeedX = 10;
		var ballSpeedY = 10;

		//score keeping variables
		var player1Score = 0;
		var player2Score = 0;

		//win condition variable
		const winningScore = 4;

		//win screen variable
		var showingWinScreen = false;

		//paddle variables
		var paddle1Y = 250;
		var paddle2Y = 250;
		const paddleHeight = 100;
		const paddleWidth = 10;

		//mouse behavior on canvas
		function calculateMousePos(evt) {
			var rect = canvas.getBoundingClientRect();
			var root = document.documentElement;
			var mouseX = evt.clientX - rect.left - root.scrollLeft;
			var mouseY = evt.clientY - rect.top - root.scrollTop;
			return {
				x: mouseX,
				y: mouseY
			};
		}

		//click to continue helper
		function handleMouseClick(evt) {
			if(showingWinScreen) {
				player1Score = 0;
				player2Score = 0;
				showingWinScreen = false;
			}
		}

		window.onload = function() {
			canvas = document.getElementById('gameCanvas');
			canvasContext = canvas.getContext('2d');
			
			var framesPerSecond = 30;

			//draw and motion interval function calls
			setInterval(function() {
				moveEverything();
				drawEverything();
			}, 1000/framesPerSecond);

			//click to continue
			canvas.addEventListener('mousedown', handleMouseClick);

			//mouse interaction with paddle
			canvas.addEventListener('mousemove', 
				function(evt) {
					var mousePos = calculateMousePos(evt);
					paddle1Y = mousePos.y - (paddleHeight / 2);
			});
		}

		//ball reset to center
		function ballReset() {
			if (player1Score >= winningScore || player2Score >= winningScore) {
				showingWinScreen = true;
			}

			ballSpeedX = -ballSpeedX;
			ballX = canvas.width/2;
			ballY = canvas.height/2;
		}	

		//computer AI
		function computerMovement() {
			var paddle2YCenter = paddle2Y + (paddleHeight / 2);
			if(paddle2YCenter < ballY - 35) {
				paddle2Y += 11;
			} else if (paddle2YCenter > ballY + 35) {
				paddle2Y -= 11;
			}
		}

		//movement function
		function moveEverything() {
			if (showingWinScreen) {
				return;
			}
			

			computerMovement();

			ballX += ballSpeedX;
			ballY += ballSpeedY;
			
			if (ballX < 0) {
				
				if (ballY > paddle1Y && ballY < paddle1Y+paddleHeight) {
					ballSpeedX = -ballSpeedX;

					var deltaY = ballY - (paddle1Y + paddleHeight / 2);
					ballSpeedY = deltaY * 0.35;
				
				} else {
					player2Score++; //must be BEFORE ballReset()
					ballReset();
				}
			}

			if (ballX > canvas.width) {

				if(ballY > paddle2Y && ballY < paddle2Y+paddleHeight) {
					ballSpeedX = -ballSpeedX;

					var deltaY = ballY - (paddle2Y + paddleHeight / 2);
					ballSpeedY = deltaY * 0.35;

				} else {

					player1Score++; //must be BEFORE ballReset()
					ballReset();

				}
			}
			
			if (ballY > canvas.height) {
				ballSpeedY = -ballSpeedY;
			}
			if (ballY < 0) {
				ballSpeedY = -ballSpeedY;
			}

		}

		//net down center of screen.
		function drawNet () {
			for (var i = 0; i < canvas.height; i += 40) {
				colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
			}
		}

		//drawing function
		function drawEverything() {
			
		//next line creates purple canvas
		colorRect(0, 0, canvas.width, canvas.height, 'purple');


			if (showingWinScreen) {
				canvasContext.fillStyle = 'white';

				if (player1Score >= winningScore) {
				canvasContext.fillText('User won!', 400, 100);
				
				} else if (player2Score >= winningScore) {
				canvasContext.fillText('CPU won!', 400, 100);
			}			
				canvasContext.fillText('Click to continue', 395, 500);
				return;
			}
			
			//new drawing function call
			drawNet();

			//next line creates left user paddle
			colorRect(0, paddle1Y, paddleWidth, paddleHeight, 'white');
			
			//next line creates right user paddle
			colorRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight, 'white');

			//next line creates ball
			colorCircle(ballX, ballY, 10, 'white');

			canvasContext.fillText(player1Score, 100, 100);
			canvasContext.fillText(player2Score, canvas.width - 100, 100);

		}

		//helper function for ball
		function colorCircle(centerX, centerY, radius, drawColor) {
			canvasContext.fillStyle = drawColor;
			canvasContext.beginPath();
			canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
			canvasContext.fill();
		}

		//helper function for canvas
		function colorRect(leftX, topY, width, height, drawColor) {
			canvasContext.fillStyle = drawColor;
			canvasContext.fillRect(leftX, topY, width, height);
		}

