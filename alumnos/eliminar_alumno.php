<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si se ha enviado el num_control del alumno
if (isset($_POST['num_control'])) {
    $num_control = $_POST['num_control'];

    try {
        // Preparar y ejecutar la consulta de eliminación
        $sql = "DELETE FROM alumnos WHERE num_control = :num_control";
        $stmt = $conexion->prepare($sql);
        $stmt->bindParam(':num_control', $num_control, PDO::PARAM_STR);

        if ($stmt->execute()) {
            echo json_encode(["status" => "success", "message" => "Alumno eliminado exitosamente"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Error al eliminar el alumno"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["status" => "error", "message" => "Error de conexión: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "num_control no especificado"]);
}
?>
