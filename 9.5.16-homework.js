io.of('/game').sockets.on('connection', function (socket) {

    socket.on('login', function (token) {
        var player = new Player(token);
        player.login(function (player) {
            socket.set('player', player);
            socket.emit('logged in', player);
            socket.on('join game', function (level) {
                games.join(level, socket.get('player'), function (game) {
                    if (game) {
                        socket.join(game.id);
                        socket.set('game', game);
                        socket.emit('joined game', game.id);
                        socket.broadcast.to(game.id)
                                .emit('new player', socket.get('player'));
                        if (game.players.length > 1) {
                            var counter = 0;
                            var seconds = 30;
                            var remaining;
                            var interval = setInterval(function () {
                                remaining = seconds - Math.ceil(counter / 1000);
                                socket.broadcast.to(game.id)
                                        .emit('countdown', remaining);
                                if (counter >= 30000) {
                                    socket.emit('start game');
                                    clearInterval(interval);
                                }
                                counter += 1000;
                            }, 1000);
                        }
                    } else {
                        socket.emit('unable to join');
                    }
                });
            });

            socket.on('get question', function () {
                var game = socket.get('game');

                if (!socket.to(game.id).get('questions')) {
                    var questionSet = new QuestionSet(game.level);
                    socket.to(game.id).set('questions', questionSet.get());
                }
                if (!socket.get('questionID')) {
                    socket.set('questionID', 0);
                }
                var questionId = socket.get('questionID');
                var question = socket.to(game.id)
                .get('questions') ;
                        question = questions.prepare(socket.get('questions'));
                socket.emit('question', question);
            });
 
            socket.on('answer', function (answer) {
                var game = socket.get('game');
                var questions = socket.to(game.id).get('questions');
                var question = questions[socket.get('questionID')];
                if (question.answers[answer].correct === true) {
                    if (!socket.get('score')) {
                        socket.set('score', 0);
                    }
                    var score = Number(socket.get('score'))++;
                    socket.set('score', score);
                    var player = socket.get('player');
                    if (score < 20) {
                        socket.broadcast.to(game.id).emit('score', {
                            player: player,
                            score: score
                        });
                    } else {
                        socket.broadcast.to(game.id).emit('score', {
                            player: player,
                            score: score
                        });
                        socket.broadcast.to(game.id).emit('win', player);
                    }
                } else {
                    if (!socket.get('lives')) {
                        socket.set('lives', 3);
                    }
                    var lives = Number(socket.get('lives'))--;
                    socket.set('lives', lives);
                    socket.broadcast.to(game.id).emit('lives', {
                        player: player,
                        lives: lives
                    });
                }
            });
        });
    });

    socket.on('disconnect', function () {
    });

});