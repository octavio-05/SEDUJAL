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
        // Configurar variables de sesión
        $_SESSION['id_usuario'] = $id_usuario;
        $_SESSION['rol'] = $user['rol'];

        // Redirigir según el rol
        if ($user['rol'] == 'admin') {
            header("Location: adminplace/index.php");
        } elseif ($user['rol'] == 'alumno') {
            header("Location: userplace/index.php");
        }
        exit();
    } else {
        // Mensaje de error de autenticación
        echo "<script>alert('Usuario o contraseña incorrectos');</script>";
    }
} else {
    echo "<script>alert('Por favor, complete todos los campos');</script>";
}
?>
