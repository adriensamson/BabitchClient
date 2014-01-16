'use strict';

babitchFrontendApp.controller("babitchLiveCtrl", function ($scope, fayeClient, $resource, CONFIG) {
    var Player = $resource(CONFIG.BABITCH_WS_URL + '/players/:playerId', {playerId:'@id'});


    $scope.refreshAvailableGames = function() {
        $scope.currentGamesIds = [];
        fayeClient.publish(CONFIG.BABITCH_LIVE_FAYE_CHANNEL, {type: 'requestCurrentGame'});
    };

    $scope.clearGame = function() {
        $scope.game = null;
        $scope.redAttacker = null;
        $scope.redDefender = null;
        $scope.blueAttacker = null;
        $scope.blueDefender = null;
    };


    $scope.$watch('currentGameId', function() {
        $scope.clearGame();
        $scope.refreshAvailableGames();
    });

    $scope.refreshAvailableGames();
    $scope.clearGame();

    fayeClient.subscribe(CONFIG.BABITCH_LIVE_FAYE_CHANNEL, function(data) {
        if (data.type == 'requestCurrentGame') {
            return;
        }

        if (!_.contains($scope.currentGamesIds, data.gameId)) {
            $scope.currentGamesIds.push(data.gameId);
        }

        if (data.type == 'end') {
            $scope.currentGamesIds = _.without($scope.currentGamesIds, data.gameId);
            $scope.clearGame();
            $scope.refreshAvailableGames();
        }      

        if (!$scope.currentGameId) {
            $scope.currentGameId = data.gameId;
        }

        if(data.gameId != $scope.currentGameId) {
            return;
        }

         $scope.game = data.game;

        data.game.player.forEach(function(position) {
            var player = Player.get({playerId: position.player_id}, function() {
                if (position.position == 'attack' && position.team == 'red') {
                    $scope.redAttacker = player;
                }
                if (position.position == 'defense' && position.team == 'red') {
                    $scope.redDefender = player;
                }
                if (position.position == 'attack' && position.team == 'blue') {
                    $scope.blueAttacker = player;
                }
                if (position.position == 'defense' && position.team == 'blue') {
                    $scope.blueDefender = player;
                }
            });
        });
    });
});
