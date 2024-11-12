<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si se ha enviado el id_usuario del usuario
if (isset($_GET['id_usuario'])) {
    $id_usuario = $_GET['id_usuario'];

    // Preparar y ejecutar la consulta para obtener los datos del usuario
    $sql = "SELECT * FROM usuarios WHERE id_usuario = :id_usuario";
    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':id_usuario', $id_usuario);
    $stmt->execute();

    // Obtener el resultado y enviarlo como JSON
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($usuario) {
        echo json_encode($usuario);
    } else {
        echo json_encode(["status" => "error", "message" => "Usuario no encontrado"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "id_usuario no especificado"]);
}
?>
