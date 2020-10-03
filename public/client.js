var renderUserArmy = function() {
    var logDiv = document.getElementById('login-form');
    logDiv.style.display = "none";
    var userArmy = localStorage.getItem(yourArmy);
    var userArmyStrings = armies.map(function(army) {
        return `<div>
            <h4>${userArmy}</h4>
            </div>
        `
    });
    document.getElementById('armies').innerHTML = userArmyStrings.join('\n');
}

var renderArmies = function(armies) {
    var armyStrings = armies.map(function(army) {
        return `<div>
            <h4>${army.name}</h4>
            <p>This army has ${army.wins} wins</p>
            <ul>
                <li>archers:${army.archers}</li>
                <li>mages:${army.mages}</li>
                <li>melee:${army.melee}</li>
            </ul>
        </div>`
    });
    document.getElementById('armies').innerHTML = armyStrings.join('\n');
}

fetch('/armies')
    .then(function(response) {
        response.json()
            .then(renderArmies);
    })

var handleLoginSubmit = function(submitEvent) {
    var formJSON = {};
    Object.values(submitEvent.target).forEach((field) => {
        if(field.name) {
            var value = field.value;
            if(field.type === 'checkbox') {
                value = field.checked;
            }
            formJSON[field.name] = value;
        }
    })
    console.log('handleLoginSubmit:', formJSON);
    submitEvent.preventDefault();
    
    // var yourArmy = document.getElementById('userName').value;
    // fetch('/main').then(function(response) {
    //     response.json()
    //         .then(renderUserArmy);
    // })
}

var form = document.getElementById('login-form');
form.addEventListener('submit', handleLoginSubmit);
