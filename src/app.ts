
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

app.get('/', (req: any, res: any) => { // Ruta raíz del servidor
    res.send(`Servidor funcionando en http://localhost:${port}`)
})

app.post('/login', login); // Ruta para manejar el login, se llama a la función login cuando se recibe una solicitud POST en /login 

app.listen(port, () => { // Iniciar el servidor en el puerto especificado, en este caso 3000
    console.log(`Servidor escuchando en http://localhost:${port}`); 
})

// Pendiente registrar usuario 
