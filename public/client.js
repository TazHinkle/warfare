var getName = function() {
    var yourArmy = document.getElementById("textbox").value;
    localStorage.setItem('yourArmy', `${yourArmy}`);
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
