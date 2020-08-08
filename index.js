var armies = [
    { name: 'bob', archers: 33, mages: 12, melee: 20, wins: 0 },
    { name: 'goats', archers: 33, mages: 22, melee: 20, wins: 0 },
];

function jsonClone(input) {
    return JSON.parse(JSON.stringify(input));
}

var fight = function(armyA, armyB) {
    armyA.total = armyA.archers + armyA.mages + armyA.melee;
    armyB.total = armyB.archers + armyB.mages + armyB.melee;
    var armyAPostFight = jsonClone(armyA);
    var armyBPostFight = jsonClone(armyB);
    var winner = "Cannot fight without an army";
    if (armyA.total > 0 && armyB.total > 0) {
        armyAPostFight.archers = Math.max(0, armyA.archers - armyB.mages);
        armyBPostFight.archers = Math.max(0, armyB.archers - armyA.mages);
        armyAPostFight.melee = Math.max(0, armyA.melee - armyBPostFight.archers);
        armyBPostFight.melee = Math.max(0, armyB.melee - armyAPostFight.archers);
        armyAPostFight.mages = Math.max(0, armyA.mages - armyBPostFight.melee);
        armyBPostFight.mages = Math.max(0, armyB.mages - armyAPostFight.melee);
        armyAPostFight.total = armyAPostFight.archers + armyAPostFight.mages + armyAPostFight.melee;
        armyBPostFight.total = armyBPostFight.archers + armyBPostFight.mages + armyBPostFight.melee;
        
        if (armyAPostFight.total > armyBPostFight.total) {
            winner = armyAPostFight.name;
            armyAPostFight.wins += 1;
        } else if(armyAPostFight.total < armyBPostFight.total) {
            winner = armyBPostFight.name;
            armyBPostFight.wins += 1;
        } else {
            winner = "Tie"
        }      
        
            armyA = armyAPostFight;
            armyB = armyBPostFight;
            winner = winner;
    }    
    return {
        armyA,
        armyB,
        winner
    }    
}
console.table(armies);
var handleHTTPRequest = function(request, response) {
    var result = "<h1>what up, ma goats</h1>";
    console.log(request.url);
    if (request.url === "/") {
        result = JSON.stringify(
            armies,
            null,
            "    "
        );
    }else if(request.url === "/login") {
        //create login box that queries armies[] and selects the user based on input.
    }else if (request.url === "/fight") {
        var fightResult = fight(armies[0], armies[1]);
        armies[0] = fightResult.armyA;
        armies[1] = fightResult.armyB;
        result = JSON.stringify(
            fightResult,
            null,
            "    "
        );
    } else {
        response.statusCode = 404;
    }
    response.end(result);
};
var http = require("http");
const { fstat } = require("fs");
var httpServer = http.createServer(handleHTTPRequest);
var port = 3000;
console.log("attempting to start an http server on port", port);
httpServer.listen(port);
