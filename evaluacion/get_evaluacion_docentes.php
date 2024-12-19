<?php
header('Content-Type: application/json');

// Conexión a la base de datos
include '../conexion.php';

try {
    $sql = "
        SELECT 
            e.id_evaluacion, 
            a.nombre AS asignatura_nombre, 
            d.nombre AS docente_nombre,
            AVG(r.pregunta_1) AS p1,
            AVG(r.pregunta_2) AS p2,
            AVG(r.pregunta_3) AS p3,
            AVG(r.pregunta_4) AS p4,
            AVG(r.pregunta_5) AS p5,
            AVG(r.pregunta_6) AS p6,
            AVG(r.pregunta_7) AS p7,
            AVG(r.pregunta_8) AS p8,
            AVG(r.pregunta_9) AS p9,
            AVG(r.pregunta_10) AS p10,
            AVG(r.pregunta_11) AS p11,
            AVG(r.pregunta_12) AS p12,
            AVG(r.pregunta_13) AS p13,
            AVG(r.pregunta_14) AS p14,
            AVG(r.pregunta_15) AS p15,
            AVG(r.pregunta_16) AS p16,
            AVG(r.pregunta_17) AS p17,
            AVG(r.pregunta_18) AS p18,
            AVG(r.pregunta_19) AS p19,
            AVG(r.pregunta_20) AS p20,
            AVG(r.pregunta_21) AS p21,
            AVG(r.pregunta_22) AS p22
        FROM respuesta_evaluacion r
        INNER JOIN evaluacion e ON r.id_evaluacion = e.id_evaluacion
        INNER JOIN asignaturas a ON e.id_asignatura = a.id_asignatura
        INNER JOIN docentes d ON a.id_docente = d.id_docente
        GROUP BY e.id_evaluacion, a.nombre, d.nombre
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
