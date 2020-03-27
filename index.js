const express = require('express')
const app = express()
const port = 3000
const { Client } = require('pg')

const config = {
    host: 'streamer.cnxjjlkwbohr.ap-south-1.rds.amazonaws.com',
    user: 'jaydev',
    password: '12345678',
    database: 'postgres',
    port: 5432,
    ssl: true
};
let count = 0;
const client = new Client(config)
client.connect()
// client.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   client.end()
// })
const insert = () => {
  return client.query('INSERT INTO books(id) VALUES(default) RETURNING *').then((data) => {
    console.log(data);
    return insert();
  }).catch((err) => {
    console.log(err);
  })
};

insert();

app.get('/', (req, res) => {
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
