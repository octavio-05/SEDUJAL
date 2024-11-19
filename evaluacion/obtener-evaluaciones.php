<?php
require_once '../conexion.php';

// Iniciar sesión y obtener el ID del usuario logueado
session_start();
$id_usuario = $_SESSION['id_usuario']; // Esto debe ser el `id_usuario` actual del sistema.

try {
    // Verificar que el usuario esté registrado como alumno
    $sqlAlumno = "
        SELECT a.id_carrera, a.fecha_inscripcion 
        FROM alumnos a
        JOIN usuarios u ON a.num_control = u.id_usuario
        WHERE u.id_usuario = :id_usuario";
    $stmtAlumno = $pdo->prepare($sqlAlumno);
    $stmtAlumno->bindParam(':id_usuario', $id_usuario, PDO::PARAM_STR);
    $stmtAlumno->execute();
    $alumno = $stmtAlumno->fetch(PDO::FETCH_ASSOC);

    if ($alumno) {
        $id_carrera = $alumno['id_carrera'];
        $fecha_inscripcion = $alumno['fecha_inscripcion'];
        
        // Calcular el cuatrimestre, considerando 3 cuatrimestres por año
        $anio_inscripcion = (int)date('Y', strtotime($fecha_inscripcion));
        $mes_inscripcion = (int)date('m', strtotime($fecha_inscripcion));

        // Calcular cuatrimestres: 3 cuatrimestres por año
        $cuatrimestre = (date('Y') - $anio_inscripcion) * 3; // Multiplicamos por 3 para cada año completo
        if (date('m') >= 9) { 
            // Si estamos en o después de septiembre, sumamos 1 para el cuatrimestre del nuevo ciclo
            $cuatrimestre++;
        }
        if (date('m') >= 1 && date('m') < 5) { 
            // Si estamos entre enero y abril, es el 2do cuatrimestre
            $cuatrimestre++;
        }
        if (date('m') >= 5 && date('m') < 9) { 
            // Si estamos entre mayo y agosto, es el 3er cuatrimestre
            $cuatrimestre++;
        }

        // Comprobamos que no sobrepasemos el límite de 9 cuatrimestres
        $cuatrimestre = min($cuatrimestre, 9); 

        // Obtener evaluaciones asignadas según carrera y cuatrimestre
        $sqlEvaluaciones = "
            SELECT e.id_evaluacion, a.nombre AS asignatura, e.fecha_inicio, e.fecha_fin,
                   IF(r.id_evaluacion IS NULL, 'Pendiente', 'Realizada') AS estado
            FROM evaluacion e
            JOIN asignatura a ON e.id_asignatura = a.id_asignatura
            LEFT JOIN respuesta_evaluacion r ON e.id_evaluacion = r.id_evaluacion 
                                              AND r.num_control = :id_usuario
            WHERE a.id_carrera = :id_carrera 
              AND a.cuatrimestre = :cuatrimestre
              AND CURDATE() BETWEEN e.fecha_inicio AND e.fecha_fin";
        $stmtEvaluaciones = $pdo->prepare($sqlEvaluaciones);
        $stmtEvaluaciones->bindParam(':id_usuario', $id_usuario, PDO::PARAM_STR);
        $stmtEvaluaciones->bindParam(':id_carrera', $id_carrera, PDO::PARAM_INT);
        $stmtEvaluaciones->bindParam(':cuatrimestre', $cuatrimestre, PDO::PARAM_INT);
        $stmtEvaluaciones->execute();

        $evaluaciones = $stmtEvaluaciones->fetchAll(PDO::FETCH_ASSOC);

        // Respuesta en formato JSON
        echo json_encode(['status' => 'success', 'evaluaciones' => $evaluaciones]);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Alumno no encontrado o sin acceso válido.']);
    }
} catch (PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error en la base de datos: ' . $e->getMessage()]);
}
?>
