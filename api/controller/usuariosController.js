const pool = require('./db');
exports.getAllUsuarios = (req, res) => {
    pool.query('SELECT usuarios.id, usuarios.Nombre_usuario, usuarios.Contraseña, usuarios.Rol, usuarios.id_socio, socios.Nombre AS Nombre_socio, socios.CI AS CI_socio, socios.Celular AS Celular_socio, socios.Direccion AS Direccion_socio, socios.Licencia AS Licencia_socio, socios.Placa AS Placa_socio, socios.id_grupo AS id_grupo_socio, choferes.Nombre_completo AS Nombre_chofer, choferes.CI AS CI_chofer, choferes.Celular AS Celular_chofer, choferes.Licencia AS Licencia_chofer, choferes.Placa AS Placa_chofer FROM usuarios LEFT JOIN socios ON usuarios.id_socio = socios.id LEFT JOIN choferes ON usuarios.id_chofer = choferes.id', (error, results) => {
      if (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios' });
      } else {
        res.json(results);
      }
    });
  };
  
exports.getUsuarioById = (req, res) => {
  const { id } = req.params;
  pool.query('SELECT * FROM usuarios WHERE id = ?', id, (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al obtener el usuario' });
    } else if (results.length === 0) {
      res.status(404).json({ error: 'Usuario no encontrado' });
    } else {
      res.json(results[0]);
    }
  });
};

exports.createUsuario = (req, res) => {
  const { Nombre_usuario, Contraseña, Rol, id_socio, id_chofer } = req.body;
  pool.query('INSERT INTO usuarios (Nombre_usuario, Contraseña, Rol, id_socio, id_chofer) VALUES (?, ?, ?, ?, ?)', [Nombre_usuario, Contraseña, Rol, id_socio, id_chofer], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Error al crear el usuario' });
    } else {
      res.status(201).json({ message: 'Usuario creado exitosamente', id: results.insertId });
    }
  });
};

exports.updateUsuario = (req, res) => {
  const { Nombre_usuario, Contraseña, Rol, id_socio, id_chofer } = req.body;
  const { id } = req.params;
  pool.query('UPDATE usuarios SET Nombre_usuario = ?, Contraseña = ?, Rol = ?, id_socio = ?, id_chofer = ? WHERE id = ?', [Nombre_usuario, Contraseña, Rol, id_socio, id_chofer, id], (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    } else {
      res.json({ message: 'Usuario actualizado exitosamente' });
    }
  });
};

exports.deleteUsuario = (req, res) => {
  const { id } = req.params;
  pool.query('DELETE FROM usuarios WHERE id = ?', id, (error) => {
    if (error) {
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    } else {
      res.json({ message: 'Usuario eliminado exitosamente' });
    }
  });
};
exports.login = (req, res) => {
  const { Nombre_usuario, Contra } = req.params;

  // Consulta para obtener los datos del usuario con su nombre de usuario y contraseña
  const queryUsuarios = `
    SELECT 
      u.id,
      u.Nombre_usuario,
      u.Contraseña,
      u.Rol,
      IFNULL(s.Nombre, c.Nombre_completo) AS Nombre,
      IFNULL(s.CI, c.CI) AS CI,
      IFNULL(s.Licencia, c.Licencia) AS Licencia,
      IF(u.id_socio IS NOT NULL, 'Socio', IF(u.id_chofer IS NOT NULL, 'Chofer', 'Cliente')) AS Tipo,
      IFNULL(s.Placa, c.Placa) AS Placa,
      IFNULL(s.id, c.id) AS id_socio_chofer
    FROM usuarios u
    LEFT JOIN socios s ON u.id_socio = s.id
    LEFT JOIN choferes c ON u.id_chofer = c.id
    WHERE u.Nombre_usuario = ? AND u.Contraseña = ?;
  `;

  // Consulta para obtener los datos del cliente con su nombre de usuario y contraseña
  const queryClientes = `
    SELECT 
      id AS id,
      nombre_usuario,
      contra,
      CONCAT(nombre, ' ', apellido) AS Nombre,
      '' AS CI,
      '' AS Licencia,
      'CLIENTE' AS Rol,
      'CLIENTE' AS Tipo
    FROM clientes
    WHERE nombre_usuario = ? AND contra = ?;
  `;

  // Ejecutar la consulta en la tabla de usuarios
  pool.query(queryUsuarios, [Nombre_usuario, Contra], (errorUsuarios, resultsUsuarios) => {
    if (errorUsuarios) {
      console.error('Error :', errorUsuarios); 
      res.status(500).json({ error: 'Error al obtener los datos del usuario' });
    } else if (resultsUsuarios.length > 0) {
      // Si se encontró el usuario en la tabla de usuarios, responder con los datos
      res.json(resultsUsuarios[0]);
    } else {
      // Si no se encontró el usuario en la tabla de usuarios, ejecutar la consulta en la tabla de clientes
      pool.query(queryClientes, [Nombre_usuario, Contra], (errorClientes, resultsClientes) => {
        if (errorClientes) {
          //console.error('Error :', errorClientes); 
          res.status(500).json({ error: 'Error al obtener los datos del cliente' });
        } else if (resultsClientes.length > 0) {
          // Si se encontró el cliente en la tabla de clientes, responder con los datos
          res.json(resultsClientes[0]);
        } else {
          // Si no se encontró el usuario en ninguna tabla, responder con un error
          res.status(404).json({ error: 'Usuario no encontrado' });
        }
      });
    }
  });
};