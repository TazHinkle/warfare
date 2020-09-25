const http = require("http");
const fs = require("fs");
const port = 3000;
// const express = require('express');
// const app = express();
// app.get('/', (request, response, next) => {
// res.send('<h1>Hello</h1>);    
//})
// app.listen(port);
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var xhr = new XMLHttpRequest();

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
    if (request.url === "/main") {
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
    } else if(request.url === "/login" || "/") {
        //Have a login where a userName is entered and then selected from armies[]
        result = fs.readFileSync('./login.html');
        var userName = xhr.open('GET', '/server', true);
    } else {
        response.statusCode = 404;
    }
    response.end(result);
};

var httpServer = http.createServer(handleHTTPRequest);
console.log("attempting to start an http server on port", port);
httpServer.listen(port);
