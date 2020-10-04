var yourArmy;
var renderUserArmy = function() {
    var logDiv = document.getElementById('login-form');
    logDiv.style.display = "none";
    var userArmyString = renderSingleArmy(yourArmy);
    document.getElementById('armies').innerHTML = userArmyString;
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
                renderUserArmy();
            });
    })
}

var form = document.getElementById('login-form');
form.addEventListener('submit', handleLoginSubmit);
