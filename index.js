var people = [
    { name: 'bob', age: 33, death: 'tragic' },
    { name: 'babs', age: 67, death: "you wouldn't believe it" },
    { name: 'ignatious', age: 152, death: 'glorious' }
];
console.table(people);
var handleHTTPRequest = function(request, response) {
    var result = "<h1>what up, ma goats</h1>";
    console.log(request.url);
    if (request.url === "/people") {
        result = JSON.stringify(
            people,
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
