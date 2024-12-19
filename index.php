<?php
 session_start();
include "conexion.php"; // Conectar a la base de datos

// Manejo de autenticación
$error = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['id_usuario']) && isset($_POST['password'])) {
        $id_usuario = trim($_POST['id_usuario']);
        $password = trim($_POST['password']);

        // Verificar si los campos no están vacíos
        if (!empty($id_usuario) && !empty($password)) {
            try {
                // Preparar la consulta para buscar el usuario y verificar su rol
                $sql = "SELECT rol FROM usuarios WHERE id_usuario = :id_usuario AND password = :password";
                $stmt = $conexion->prepare($sql);
                $stmt->bindParam(':id_usuario', $id_usuario);
                $stmt->bindParam(':password', $password);
                $stmt->execute();

                $user = $stmt->fetch(PDO::FETCH_ASSOC);

                if ($user) {
                    // Configurar variables de sesión
                    $_SESSION['id_usuario'] = $id_usuario;
                    $_SESSION['rol'] = $user['rol'];

                    // Redirigir según el rol
                    if ($user['rol'] == 'admin') {
                        header("Location: adminplace/index.php");
                        exit();
                    } elseif ($user['rol'] == 'alumno') {
                        header("Location: userplace/index.php");
                        exit();
                    }
                } else {
                    $error = "Usuario o contraseña incorrectos.";
                }
            } catch (PDOException $e) {
                $error = "Error al procesar la solicitud: " . $e->getMessage();
            }
        } else {
            $error = "Por favor, complete todos los campos.";
        }
    }
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>SEDUJAL</title>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no">
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
    <link rel="icon" type="image/png" href="images/faviicon.png">
</head>
<body>
<div class="container-fluid login-info-fluid">
    <div class="container" style="font-size: 1em">
        <div class="row">
            <div class="col-md-4 offset-md-4">
                <div class="login-intern-box" style="opacity: 1;">
                    <p style="text-align: center">
                        <img class="login-logo" src="images/logo-vertical.jpg"/>
                    </p>

                    <form role="form" name="frm" id="frm" method="POST" action="">
                        <div class="form-group">
                            <label for="id_usuario">Usuario</label>
                            <input type="text" class="form-control" id="id_usuario" name="id_usuario" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Contraseña</label>
                            <input type="password" class="form-control" id="password" name="password" required>
                        </div>
                        <div class="form-group" style="text-align: center">
                            <button id="btn_login" class="btn btn-primary btn-sm" style="text-decoration: none; background-color: #7FC41C; border-color: #7FC41C" type="submit">Iniciar sesión</button>
                        </div>
                    </form>
                    <div id="msgArea" style="color: red; text-align: center;">
                        <?php if ($error): ?>
                            <p><?php echo htmlspecialchars($error); ?></p>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="js/jquery-3.3.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
<script src="js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T" crossorigin="anonymous"></script>
</body>
</html>
