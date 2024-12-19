<?php
header('Content-Type: application/json');

// Conexión a la base de datos
include 'conexion.php';

try {
    $sql = "
        SELECT 
            d.id_docente, 
            d.nombre AS docente_nombre, 
            AVG(r.pregunta_1) AS pregunta_1,
            AVG(r.pregunta_2) AS pregunta_2,
            AVG(r.pregunta_3) AS pregunta_3,
            AVG(r.pregunta_4) AS pregunta_4,
            AVG(r.pregunta_5) AS pregunta_5,
            AVG(r.pregunta_6) AS pregunta_6,
            AVG(r.pregunta_7) AS pregunta_7,
            AVG(r.pregunta_8) AS pregunta_8,
            AVG(r.pregunta_9) AS pregunta_9,
            AVG(r.pregunta_10) AS pregunta_10,
            AVG(r.pregunta_11) AS pregunta_11,
            AVG(r.pregunta_12) AS pregunta_12,
            AVG(r.pregunta_13) AS pregunta_13,
            AVG(r.pregunta_14) AS pregunta_14,
            AVG(r.pregunta_15) AS pregunta_15,
            AVG(r.pregunta_16) AS pregunta_16,
            AVG(r.pregunta_17) AS pregunta_17,
            AVG(r.pregunta_18) AS pregunta_18,
            AVG(r.pregunta_19) AS pregunta_19,
            AVG(r.pregunta_20) AS pregunta_20,
            AVG(r.pregunta_21) AS pregunta_21,
            AVG(r.pregunta_22) AS pregunta_22
        FROM respuesta_evaluacion r
        INNER JOIN evaluacion e ON r.id_evaluacion = e.id_evaluacion
        INNER JOIN asignaturas a ON e.id_asignatura = a.id_asignatura
        INNER JOIN docentes d ON a.id_docente = d.id_docente
        GROUP BY d.id_docente, d.nombre
    ";

    $stmt = $conexion->prepare($sql);
    $stmt->execute();

    $resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($resultados);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
