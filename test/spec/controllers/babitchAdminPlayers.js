/* global Fixtures */
'use strict';

describe('Controller: BabitchAdminPlayersCtrl', function() {

    // load the controller's module
    beforeEach(module('babitchFrontendApp'));

    var theBabitchAdminPlayersCtrl,
        scope,
        httpMock,
        config,
        windowMock;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope, $httpBackend, CONFIG) {
        scope = $rootScope.$new();
        httpMock = $httpBackend;
        config = CONFIG;

        httpMock.whenGET(config.BABITCH_WS_URL + '/players').respond(Fixtures.players);

        windowMock = { confirm: function() { return true; } };

        theBabitchAdminPlayersCtrl = $controller('babitchAdminPlayersCtrl', {
            $scope: scope,
            $window: windowMock
        });

        //Flush the .query
        httpMock.flush();

    }));

    afterEach(function() {
        httpMock.verifyNoOutstandingExpectation();
        httpMock.verifyNoOutstandingRequest();
    });

    it('should load all players', function() {
        expect(scope.players.length).toBe(21);
    });

    it('should delete players', function() {
        scope.deletePlayer(scope.players[0]);
        //Just testing that a delete request is made
        httpMock.expectDELETE(config.BABITCH_WS_URL + '/players/1').respond(200, '');
        httpMock.flush();
    });
});
