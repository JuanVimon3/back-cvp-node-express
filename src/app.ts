
const express = require('express'); // Instalar Express para crear el servidor web

const app = express(); // Crear una instancia de la aplicación Express

const port = 3000; // Puerto en el que se ejecutará el servidor

const bcrypt = require('bcrypt'); // Instalar bcrypt para manejar el hashing de contraseñas, es recomendable para mejorar la seguridad de las contraseñas almacenadas en la base de datos

const saltRounds = 10; // Número de rondas de sal para el hashing de contraseñas, esto determina la complejidad del hash generado, un valor más alto significa un hash más seguro pero también más lento de generar


// Get the client
const mysql = require('mysql2/promise'); // Instalar mysql2 para manejar la conexión a la base de datos MySQL, se utiliza la versión "promise" para poder usar async/await en las consultas a la base de datos y mejorar la legibilidad del código al manejar operaciones asíncronas de manera más sencilla.

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

app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes entrantes como JSON, esto permite que el servidor pueda entender y procesar los datos enviados en formato JSON en las solicitudes POST, PUT, etc.

console.log('Hola mundo- Express');

const login = async (req: any, res: any) => { // Función asincrónica para manejar el login
    try {
        const {nombre, contraseña} = req.body;

    const [rows] : any = await connection.execute('SELECT * FROM Usuario  WHERE nombre = ? ', [nombre]);
    

    if(rows.length > 0) {

        const user = rows[0]; // Obtener el primer usuario encontrado en la base de datos, se asume que el nombre de usuario es único, por lo que solo debería haber un resultado

        const passwordMatch = await bcrypt.compare(contraseña, user.contraseña); // Comparar la contraseña proporcionada con el hash almacenado en la base de datos utilizando bcrypt.compare, esto devuelve true si las contraseñas coinciden y false si no coinciden

        if (passwordMatch) {
                // Si coincide, enviamos respuesta y salimos de la función con 'return'
                return res.status(200).json({
                    message: 'Login exitoso',
                    user: { nombre: user.nombre, cedula: user.cedula, email: user.email }
                });
                }
            }
        res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    } catch (error) {
        console.error('Error en la consulta a la base de datos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }       
    
};


const register = async (req: any, res: any) => { // Función asincrónica para manejar el registro de usuarios
    try {

        const {nombre, contraseña, cedula, email} = req.body;

        const hashedPassword = await bcrypt.hash(contraseña, saltRounds); // Generar un hash de la contraseña proporcionada utilizando bcrypt.hash, esto toma la contraseña y el número de rondas de "sal" para generar un hash o cifrado seguro que se puede almacenar en la base de datos en lugar de la contraseña en texto plano

        const [result]: any = await connection.execute('INSERT INTO Usuario (nombre, contraseña, cedula, email) VALUES (?, ?, ?, ?)', [nombre, hashedPassword, cedula, email]);

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

//Endpoints del servidor con los métodos HTTP correspondientes para manejar las solicitudes entrantes.
app.get('/', (req: any, res: any) => { // Ruta raíz del servidor
    res.send(`Servidor funcionando en http://localhost:${port}`)
})

app.post('/login', login); // Ruta para manejar el login, se llama a la función login cuando se recibe una solicitud POST en /login 

app.post('/register', register); // Ruta para manejar el registro de usuarios, se llama a la función register cuando se recibe una solicitud POST en /register



app.listen(port, () => { // Iniciar el servidor en el puerto especificado, en este caso 3000
    console.log(`Servidor escuchando en http://localhost:${port}`); 
})
