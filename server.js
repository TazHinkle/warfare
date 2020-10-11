const express = require('express');
const cookieParser = require('cookie-parser');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const app = express();
const port = 3000;
const adapter = new FileSync(
    'db.json',
    {
        defaultValue: {
            armies: []
        }
    }
);
const db = low(adapter);

app.use(express.json());
app.use(cookieParser());

var findOrMakeArmyByUserName = function(userName) {

    var userArmy = db.get('armies').find({name: userName}).value();

    if(!userArmy) {
        userArmy = { 
            name: userName, 
            archers: 0, 
            mages: 0, 
            melee: 0, 
            wins: 0 
        };
        db.get('armies').push(userArmy).write();
    }
    return userArmy;
}

app.post('/login', (request, response) => {
    console.log('Someone visited /login', request.body);
    console.log('Here be the cookies', request.cookies);
    var userName = request.body.userName;
    var userArmy = findOrMakeArmyByUserName(userName);
    response.append('Set-Cookie', `userName=${userName}; Path=/; HttpOnly`);
    response.json(userArmy);
})

app.use((request, response, next) => {
    var userName = request.cookies.userName;
    if (userName) {
        request.userArmy = findOrMakeArmyByUserName(userName);
    }
    next();
})

var validUnitTypes = ['mages', 'archers', 'melee'];
app.post('/recruit', (request, response) => {
    // { 
    //     unitType: mage, archer, melee
    // }
    var userArmy = request.userArmy;
    var unitType = request.body.unitType;
    if (!validUnitTypes.includes(unitType)) {
        response.status(400);
        response.json({error: 'Unit type is invalid'});
    } else if(!userArmy) {
        response.status(403);
        response.json({error: 'you must be logged in'});
    } else {
        if (unitType) {
            db.get('armies')
                .find({ name: userArmy.name })
                .assign({ [unitType]: (userArmy[unitType] || 0) + 1 })
                .write();
        }
        response.json(userArmy);
    }
})

app.get('/armies', (request, response) => {
    response.json(db.get('armies').value());
});

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
        } else if (armyAPostFight.total < armyBPostFight.total) {
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


app.post('/fight', (request, response) => {
    var userArmy = request.userArmy;
    var enemyName = request.body.fightTarget;
    var enemyArmy = findOrMakeArmyByUserName(enemyName);
    var fightResult = fight(userArmy, enemyArmy);
    db.get('armies')
        .find({ name: userArmy.name })
        .assign(fightResult.armyA)
        .write();
    db.get('armies')
        .find({ name: enemyArmy.name })
        .assign(fightResult.armyB)
        .write();
    response.json(fightResult);
});


app.use(express.static('public'));

app.listen(port);
