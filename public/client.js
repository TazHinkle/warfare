var yourArmy = JSON.parse(localStorage.getItem('yourArmy') || 'null');
var recruitButtonParent = document.getElementById('recruit');
recruitButtonParent.addEventListener('click', (event) => {
    var unitType = event.target.dataset.type;
    console.log('unitType is', unitType);
    if(unitType) {
        recruit(unitType);
    }
});

var fightButtonParent = document.getElementById('armies');
var display = document.getElementById('armies');
fightButtonParent.addEventListener('click', (event) => {
    var fightTarget = event.target.dataset.target;
    if(fightTarget) {
        fight(fightTarget);
    }
})

var handleLoginSubmit = function(submitEvent) {
    var formData = {};
    Object.values(submitEvent.target).forEach((field) => {
        if(field.name) {
            var value = field.value;
            if(field.type === 'checkbox') {
                value = field.checked;
            }
            formData[field.name] = value;
        }
    })
    console.log('handleLoginSubmit:', formData);
    submitEvent.preventDefault();
    login(formData);
}

var form = document.getElementById('login-form');
form.addEventListener('submit', handleLoginSubmit);

var updateArmies = function() {
    fetch('/armies')
        .then((response) => {
            return response.json();
        })
        .then(renderArmies);
}

var fight = function(fightTarget) {
    fetch('/fight', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({fightTarget: fightTarget})
    })
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        setYourArmy(data.armyA);
        display.innerHTML = renderFightResults(data);
    })
}

var setYourArmy = function(army) {
    yourArmy = army;
    localStorage.setItem('yourArmy', JSON.stringify(yourArmy));
    renderUserArmy();
}

var login = function(formData) {
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    })
        .then((response) => {
            return response.json();
        })
        .then(setYourArmy);
}

if(yourArmy) {
    login({
        userName: yourArmy.name
    });
}

var recruit = function(unitType) {
    fetch('/recruit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            unitType: unitType
        }),
    }).then((response) => {
        console.log("recruit response", response);
        if (response.ok) {
            response.json()
                .then(setYourArmy);
        }
    })
}

var renderUserArmy = function() {
    var logDiv = document.getElementById('login-form');
    logDiv.style.display = "none";
    var userArmyString = renderArmy(yourArmy);
    document.getElementById('your-army').innerHTML = userArmyString;
}

var renderFightResults = function(fightData) {
    return`
        <div class="fight-results">
            <h3>Winner: ${fightData.winner}</h3>
            <p>This is the new state of the armies</p>
            ${renderArmy(fightData.armyA)}
            ${renderArmy(fightData.armyB)}
            <div>
                <a href="/">Back</a>
            </div>
        </div>
    `
}

var renderArmy = function(army) {
    var isLoggedIn = !!yourArmy;
    var isNotYourArmy = (yourArmy && yourArmy.name) !== army.name;
    var fightButton = isLoggedIn && isNotYourArmy
        ? `<button class="fight-button" data-target=${army.name}>Fight</button>`
        : '';
    return `<div>
        <h4>${army.name}</h4>
        <p>This army has ${army.wins} wins</p>
        <ul>
            <li>archers:${army.archers}</li>
            <li>mages:${army.mages}</li>
            <li>melee:${army.melee}</li>
        </ul>
        ${fightButton}
    </div>`;
}

var renderArmies = function(armies) {
    var armyStrings = armies.map(renderArmy);
    document.getElementById('armies').innerHTML = armyStrings.join('\n');
}

updateArmies();
