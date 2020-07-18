var armies = [
    { name: 'bob', archers: 33, mages: 12, melee: 20 },
    { name: 'goats', archers: 33, mages: 22, melee: 20 },
];
var fight = function(armyA, armyB) {
    var armyAPostFight = { name: armyA.name };
    var armyBPostFight = { name: armyB.name };
    armyAPostFight.archers = Math.max(0, armyA.archers - armyB.mages);
    armyBPostFight.archers = Math.max(0, armyB.archers - armyA.mages);
    armyAPostFight.melee = Math.max(0, armyA.melee - armyBPostFight.archers);
    armyBPostFight.melee = Math.max(0, armyB.melee - armyAPostFight.archers);
    armyAPostFight.mages = Math.max(0, armyA.mages - armyBPostFight.melee);
    armyBPostFight.mages = Math.max(0, armyB.mages - armyAPostFight.melee);
    armyAPostFight.total = armyAPostFight.archers + armyAPostFight.mages + armyAPostFight.melee;
    armyBPostFight.total = armyBPostFight.archers + armyBPostFight.mages + armyBPostFight.melee;
    
    return {
        armyA: armyAPostFight,
        armyB: armyBPostFight,
        winner: armyAPostFight.total > armyBPostFight.total
            ? armyAPostFight.name
            : armyAPostFight.total < armyBPostFight.total
                ? armyBPostFight.name
                : "Tie"
    };
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
    } else if (request.url === "/fight") {
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
var httpServer = http.createServer(handleHTTPRequest);
var port = 3000;
console.log("attempting to start an http server on port", port);
httpServer.listen(port);
