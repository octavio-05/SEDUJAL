<?php
session_start();
include "conexion.php"; // Conectar a la base de datos

// Verificar si se han enviado el usuario y la contraseña
if (isset($_POST['id_usuario']) && isset($_POST['password'])) {
    $id_usuario = $_POST['id_usuario'];
    $password = $_POST['password'];

    // Preparar la consulta para buscar el usuario y verificar su rol
    $sql = "SELECT rol FROM usuarios WHERE id_usuario = :id_usuario AND password = :password";
    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':id_usuario', $id_usuario);
    $stmt->bindParam(':password', $password);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        $_SESSION['id_usuario'] = $id_usuario;
        $_SESSION['rol'] = $user['rol'];

        if ($user['rol'] == 'admin') {
            // Redirigir a la vista de administración
            header("Location: adminplace/index.php");
        } elseif ($user['rol'] == 'alumno') {
            // Redirigir a la vista de respuestas de formularios
            header("Location: userplace/index.php");
        }
        exit();
    } else {
        // Enviar mensaje de error de autenticación
        echo "Usuario o contraseña incorrectos";
    }
} else {
    echo "Por favor, complete todos los campos";
}
?>
