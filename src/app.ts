
const express = require('express'); // Instalar Express para crear el servidor web

const app = express(); // Crear una instancia de la aplicación Express

const port = 3000; // Puerto en el que se ejecutará el servidor


// Get the client
const mysql = require('mysql2/promise');

// Create the connection to database

const connection = mysql.createPool({ // Crear un pool de conexiones para manejar múltiples conexiones a la base de datos al mismo tiempo
  host: 'localhost',
  user: 'root',
  database: 'compra_venta_propiedades',
    password: 'Dracov3@2025',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = connection; // Exportar la conexión para usarla en otros archivos

app.use(express.json());

console.log('Hola mundo- Express');

const login = async (req: any, res: any) => { // Función asincrónica para manejar el login
    try {
        const {nombre, contraseña} = req.body;

    const [rows, fields] = await connection.execute('SELECT * FROM Usuario  WHERE nombre = ? AND contraseña = ?', [nombre, contraseña]);
    console.log(nombre, contraseña);
    if(rows.length > 0) {
        res.json({message: 'Login exitoso', user: rows[0]});
    } else {
        res.status(401).json({messaje: 'Usuario o contraseña incorrectos'});
    }
    } catch (error) {
        console.error('Error en la consulta a la base de datos:', error);
        res.status(500).json({messaje: 'Error interno del servidor'});
    }
    
};


const register = async (req: any, res: any) => { // Función asincrónica para manejar el registro de usuarios
    try {

        const {nombre, contraseña, cedula, email} = req.body;
        const [result]: any = await connection.execute('INSERT INTO Usuario (nombre, contraseña, cedula, email) VALUES (?, ?, ?, ?)', [nombre, contraseña, cedula, email]);

        if(result && result.affectedRows > 0) {
            res.status(201).json({message: 'Registro exitoso', user: {nombre, cedula, email}});  
        } else {
            res.status(400).json({message: 'Error al registrar el usuario'});
        }
    } catch (error) {
        console.error('Error en la consulta en la base de datos:', error);
        res.status(500).json({message: 'Error interno del servidor'});
    }
}


app.get('/', (req: any, res: any) => { // Ruta raíz del servidor
    res.send(`Servidor funcionando en http://localhost:${port}`)
})

app.post('/login', login); // Ruta para manejar el login, se llama a la función login cuando se recibe una solicitud POST en /login 

app.post('/register', register); // Ruta para manejar el registro de usuarios, se llama a la función register cuando se recibe una solicitud POST en /register


app.listen(port, () => { // Iniciar el servidor en el puerto especificado, en este caso 3000
    console.log(`Servidor escuchando en http://localhost:${port}`); 
})
