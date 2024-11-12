<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si se ha enviado el id_usuario del usuario
if (isset($_POST['id_usuario'])) {
    $id_usuario = $_POST['id_usuario'];

    try {
        // Preparar y ejecutar la consulta de eliminación
        $sql = "DELETE FROM usuarios WHERE id_usuario = :id_usuario";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':id_usuario', $id_usuario, PDO::PARAM_STR);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Usuario eliminado exitosamente"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al eliminar el usuario"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error de conexión: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "id_usuario no especificado"]);
}
?>
