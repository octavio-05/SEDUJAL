<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si se han enviado todos los datos necesarios
if (isset($_POST['id_usuario']) && isset($_POST['rol']) && isset($_POST['password'])) {
    // Obtener los datos enviados
    $id_usuario = $_POST['id_usuario'];
    $rol = $_POST['rol'];
    $password = $_POST['password'];

    // Preparar y ejecutar la consulta de actualización
    $sql = "UPDATE usuarios SET rol = :rol, password = :password WHERE id_usuario = :id_usuario";
    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':rol', $rol);
    $stmt->bindParam(':password', $password);  // No encriptamos la password
    $stmt->bindParam(':id_usuario', $id_usuario);

    // Ejecutar la consulta y verificar si fue exitosa
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Usuario actualizado exitosamente"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Error al actualizar el usuario"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
?>
