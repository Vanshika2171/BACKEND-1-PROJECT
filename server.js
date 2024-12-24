const http = require("http");
const fs = require("fs");
const qs = require("querystring");

const server = http.createServer((req, res) => {
    let { method } = req;

    if (method == "GET") {
        // Handling GET requests
        if (req.url === "/") {
            fs.readFile("pets.json", "utf8", (err, data) => {
                if (err) {
                    console.error("Error reading file:", err);  // Log error to console
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(data);
                }
            });
        } else if (req.url === "/allPets") {
            fs.readFile("allPets.html", "utf8", (err, data) => {
                if (err) {
                    console.error("Error reading allPets.html:", err);  // Log error to console
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(data);
                }
            });
        } else if (req.url === "/register") {
            fs.readFile("registerPet.html", "utf8", (err, data) => {
                if (err) {
                    console.error("Error reading registerPet.html:", err);  // Log error to console
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(data);
                }
            });
        } else {
            res.writeHead(404);
            res.end("Not Found");
        }
    }

    // Handling POST requests
    else if (method == "POST" && req.url === "/register") {
        let body = "";
        req.on("data", (chunk) => {
            body += chunk.toString();
        });
        req.on("end", () => {
            let readdata;
            try {
                readdata = fs.readFileSync("pets.json", "utf-8");
            } catch (err) {
                console.error("Error reading pets.json:", err);  // Log error to console
                res.writeHead(500);
                res.end("Server Error");
                return;
            }

            let pets = [];
            if (readdata) {
                try {
                    pets = JSON.parse(readdata);  // Parse the existing pets data
                } catch (err) {
                    console.error("Error parsing JSON:", err);  // Log error to console
                    res.writeHead(500);
                    res.end("Error parsing data");
                    return;
                }
            }

            let convertedbody = qs.decode(body);
            pets.push(convertedbody);

            fs.writeFile("pets.json", JSON.stringify(pets), (err) => {
                if (err) {
                    console.error("Error writing to pets.json:", err);  // Log error to console
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end("Pet registered successfully!");
                }
            });
        });
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

server.listen(3000, () => {
    console.log("Server listening on port 3000");
});
