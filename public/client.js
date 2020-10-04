var yourArmy = JSON.parse(localStorage.getItem('yourArmy') || 'null');
var recruitButtonParent = document.getElementById('recruit');
recruitButtonParent.addEventListener('click', (event) => {
    var unitType = event.target.dataset.type;
    console.log('unitType is', unitType);
    if(unitType) {
        recruit(unitType);
    }
});

var login = function(formData) {
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
    }).then((response) => {
        response.json()
            .then((army) => {
                yourArmy = army;
                localStorage.setItem('yourArmy', JSON.stringify(yourArmy));
                renderUserArmy();
            });
    })
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
                .then((army) => {
                    yourArmy = army;
                    localStorage.setItem('yourArmy', JSON.stringify(yourArmy));
                    renderUserArmy();
                });
        }
    })
}

var renderUserArmy = function() {
    var logDiv = document.getElementById('login-form');
    logDiv.style.display = "none";
    var userArmyString = renderSingleArmy(yourArmy);
    document.getElementById('your-army').innerHTML = userArmyString;
}

var renderSingleArmy = function(army) {
    return `<div>
        <h4>${army.name}</h4>
        <p>This army has ${army.wins} wins</p>
        <ul>
            <li>archers:${army.archers}</li>
            <li>mages:${army.mages}</li>
            <li>melee:${army.melee}</li>
        </ul>
    </div>`;
}

var renderArmies = function(armies) {
    var armyStrings = armies.map(renderSingleArmy);
    document.getElementById('armies').innerHTML = armyStrings.join('\n');
}

fetch('/armies')
    .then(function(response) {
        response.json()
            .then(renderArmies);
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
