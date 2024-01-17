const express = require('express');
const { Pool, Query } = require('pg');
app = express()
port = 3000
app.set('view engine', 'jade')
app.use(express.json());
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


const pool = new Pool({
    connectionString: 'postgres://postgres:pw@localhost:5432/postgres'
    // {
    //     database: 'postgres',
    //     user: 'postgres',
    //     password: 'pw',
    //     port: 5432
    // }
})

// Initialise DB
pool.query('CREATE TABLE IF NOT EXISTS system_registry_t ( id SERIAL, system_id VARCHAR(10), system_name VARCHAR(255), logical_system_id VARCHAR(10), active BOOLEAN, PRIMARY KEY(id, system_id) )')

app.get('/', async (req,res) => {
    console.log("Checking DB connectivity")
    const result = await pool.query('SELECT 1 as one')
    console.log("DB Connection successful")
    res.send("Please head to homepage")
})


app.get('/home', async (req, res) => {

    //     "ID": "56c23c79-f57f-4bc5-b48a-aa57bba6797f",
    //     "createdAt": "2023-12-23T12:58:07.886Z",
    //     "createdBy": "anonymous",
    //     "modifiedAt": "2023-12-23T12:58:07.886Z",
    //     "modifiedBy": "anonymous",
    //     "ConnectedSystemID": "NORTHAM",
    //     "ConnectedSystemName": "North America System",
    //     "LogicalSystemID": null,
    //     "IsActive": true
    // }
    var data = []
    const dataFromDb = await pool.query( 'SELECT * FROM system_registry_t' )
    console.log(dataFromDb.rows)
    for(let i=0; i < dataFromDb.rows.length; i++){
        let row = dataFromDb.rows[i]
        let systemDetails = {}
        systemDetails.ConnectedSystemID = row.system_id
        systemDetails.ConnectedSystemName = row.system_name
        systemDetails.LogicalSystemID = row.logical_system_id
        systemDetails.IsActive = row.active
        data.push(systemDetails)
    }
    res.render('home', { result : data })
})

app.get('/system', (req,res) => {
    res.render('add_system')
})

app.post('/system', async (req,res) => {
    console.log("Received data from client/UI")
    console.log(req.body);
    const inputFromClient = req.body
    if(inputFromClient){
        var values = [ req.body['connected-sytem-id'], req.body['connected-system-name'], req.body['logical-system-id']? req.body['logical-system-id']:null, req.body.availability === 'on'?1:0]
        var result = await pool.query("INSERT INTO system_registry_t( system_id, system_name, logical_system_id, active) VALUES ( $1, $2, $3, $4 ) RETURNING *;", values )
        console.log(result.rows)
        if(result.rows.length){
            console.log("System added")
            res.send('System added')
        }
    }else{
        res.send('Invalid Input')

    }
})

const server = app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


const shutdown = () => {
    console.log("Graceful shutdown commenced")
    pool.end()
    server.close(() => console.log("Server closed"))
}
// Graceful shutdown              
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)