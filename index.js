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
const QueryStream = require('pg-query-stream')
const JSONStream = require('JSONStream')
const request = require('request');

//pipe 1,000,000 rows to stdout without blowing up your memory usage
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

// insert();

app.get('/:limit', (req, res) => {
  const queryString = 'SELECT * FROM books' + (req.params.limit ? (' limit ' + req.params.limit) : '');
  console.log(queryString);
  const query = new QueryStream(queryString);
  const stream = client.query(query);
  let array = '';
  // release the client when the stream is finished
  stream.on('end', () => {
    console.log('ended', array);
  })
  stream.on('data', (data) => {
    console.log('data', data);
    array += JSON.stringify(data);

  })
  stream.pipe(JSONStream.stringify()).pipe(res);
})


app.get('/getdata/:limit', (req, res) => {

  const stream = request('http://localhost:3000/' + req.params.limit);

  stream.on('end', () => {
    console.log('ended');
  })
  stream.on('data', (data) => {
    console.log('data', data.toString());
    // array += JSON.stringify(data);
  })
  stream.pipe(res);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
