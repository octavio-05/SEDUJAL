<?php
include "../conexion.php"; // Conectar a la base de datos

// Verificar si se ha enviado el id_docente
if (isset($_GET['id_docente'])) {
    $id_docente = $_GET['id_docente'];

    // Preparar y ejecutar la consulta para obtener los datos del docente
    $sql = "SELECT * FROM docentes WHERE id_docente = :id_docente";
    $stmt = $conexion->prepare($sql);
    $stmt->bindParam(':id_docente', $id_docente);
    $stmt->execute();

    // Obtener el resultado y enviarlo como JSON
    $docente = $stmt->fetch(PDO::FETCH_ASSOC); 
    if ($docente) {
        echo json_encode($docente);
    } else {
        echo json_encode(["status" => "error", "message" => "Docente no encontrado"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "id_docente no especificado"]);
}
?>
