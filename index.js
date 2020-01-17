const net = require('net');
const server = net.createServer();
const fs = require('fs');

const allClients = {};
const PORT = process.env.PORT || 9000;

const handleConnection = (conn) => { 
    const currentClient = `${conn.remoteAddress}: ${conn.remotePort}`
    allClients[currentClient] = conn;
    console.log(Object.keys(allClients));
    console.log("Client has connected from ", currentClient);

    conn.setEncoding("utf8");
    
    conn.on('close', () =>{
        
        console.log(currentClient, "closed the conenction");
        for(let client in allClients) {
            if(currentClient !== client) {
                allClients[client].write(`${currentClient} closed the connection`);
            } else {
                delete allClients[currentClient];
            }
        }
        console.log(Object.keys(allClients));
    });


    conn.on('error', () => {
        console.log("Error from client: ", currentClient);
    });

    conn.on('data', (data) => {

        console.log(currentClient, "said " , data);
        fs.readFile('./message.txt', 'utf8', function(err,data){
            if(err) conn.write(err)
            conn.write(data);
        });
        for(let client in allClients) {
            if(client != currentClient){
                allClients[client].write(`${currentClient} said: ${data}`);
            }
        }
        // allClients.forEach(element => {
        //     if(Object.keys(allClients) != currentClient) {
        //         console.log(element);
        //         element.write(data);
        //     }
        // });
    })
}

server.on("connection", handleConnection);
// server.on("close", handleClose);
// server.on('error', handleError);

server.listen(9000, ()=> {
    console.log(`Server is listening ${JSON.stringify(server.address())}`);
    
})

// function handleConnection(conn) { 
//     console.log(conn);
// }