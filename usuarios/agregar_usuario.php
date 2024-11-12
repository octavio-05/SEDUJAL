<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si todos los datos necesarios han sido enviados
if (isset($_POST['id_usuario']) && isset($_POST['rol']) && isset($_POST['password'])) {
    // Obtener los datos enviados
    $id_usuario = $_POST['id_usuario'];
    $rol = $_POST['rol']; // El valor debe ser 'alumno' o 'admin'
    $password = $_POST['password']; // password no encriptada

    // Validar que el rol esté entre los valores permitidos en el ENUM
    if ($rol != 'alumno' && $rol != 'admin') {
        echo json_encode(["status" => "error", "message" => "Rol no válido"]);
        exit();
    }

    // Preparar y ejecutar la consulta de inserción
    $sql = "INSERT INTO usuarios (id_usuario, rol, password) VALUES (:id_usuario, :rol, :password)";
    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':id_usuario', $id_usuario);
    $stmt->bindParam(':rol', $rol); // El valor de rol puede ser 'alumno' o 'admin'
    $stmt->bindParam(':password', $password);

    // Ejecutar la consulta y verificar si fue exitosa
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Usuario agregado exitosamente"]);
    } else {
        error_log("Error al ejecutar la consulta de inserción: " . implode(":", $stmt->errorInfo()));
        echo json_encode(["status" => "error", "message" => "Error al agregar el usuario"]);
    }
} else {
    error_log("Datos incompletos: " . json_encode($_POST));
    echo json_encode(["status" => "error", "message" => "Datos incompletos"]);
}
?>
