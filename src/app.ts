
const express = require('express');

const app = express();

const port = 3000;

console.log('Hola mundo- Express');

app.listen(port, () =>{
    console.log(`Servidor funcionando en http://localhost${port}`)
})
