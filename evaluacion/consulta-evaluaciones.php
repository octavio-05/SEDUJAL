<?php
require_once '../conexion.php'; // Archivo con la conexión PDO include "../conexion.php"; // Conectar a la base de datos

$num_control = $_SESSION['id_usuario']; // Número de control del alumno

try {
    // Obtener carrera y cuatrimestre del alumno
    $sql = "SELECT id_carrera, 
                   CEIL(DATEDIFF(CURDATE(), fecha_inscripcion) / 120) AS cuatrimestre 
            FROM alumnos WHERE num_control = :num_control";
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['num_control' => $num_control]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        $id_carrera = $row['id_carrera'];
        $cuatrimestre = $row['cuatrimestre'];

        // Obtener evaluaciones activas
        $sql_eval = "SELECT e.id_evaluacion, a.nombre AS asignatura, e.fecha_inicio, e.fecha_fin
                     FROM evaluacion e
                     JOIN asignatura a ON e.id_asignatura = a.id_asignatura
                     WHERE a.id_carrera = :id_carrera 
                       AND a.cuatrimestre = :cuatrimestre 
                       AND CURDATE() BETWEEN e.fecha_inicio AND e.fecha_fin";
        $stmt_eval = $pdo->prepare($sql_eval);
        $stmt_eval->execute([
            'id_carrera' => $id_carrera,
            'cuatrimestre' => $cuatrimestre
        ]);

        // Mostrar evaluaciones en una tabla
        echo '<div class="container mt-4">';
        echo '<h3 class="mb-3">Evaluaciones Activas</h3>';
        echo '<table class="table table-striped table-hover">';
        echo '<thead class="table-dark">';
        echo '<tr>';
        echo '<th>Asignatura</th>';
        echo '<th>Fecha de Inicio</th>';
        echo '<th>Fecha de Fin</th>';
        echo '</tr>';
        echo '</thead>';
        echo '<tbody>';
        $hay_evaluaciones = false;
        while ($row_eval = $stmt_eval->fetch(PDO::FETCH_ASSOC)) {
            $hay_evaluaciones = true;
            echo '<tr>';
            echo '<td>' . htmlspecialchars($row_eval['asignatura']) . '</td>';
            echo '<td>' . htmlspecialchars($row_eval['fecha_inicio']) . '</td>';
            echo '<td>' . htmlspecialchars($row_eval['fecha_fin']) . '</td>';
            echo '</tr>';
        }
        if (!$hay_evaluaciones) {
            echo '<tr>';
            echo '<td colspan="3" class="text-center">No hay evaluaciones activas</td>';
            echo '</tr>';
        }
        echo '</tbody>';
        echo '</table>';
        echo '</div>';
    } else {
        echo '<p class="text-danger text-center">No se encontró información del alumno.</p>';
    }
} catch (PDOException $e) {
    echo '<p class="text-danger text-center">Error en la base de datos: ' . htmlspecialchars($e->getMessage()) . '</p>';
}
?>
