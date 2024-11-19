<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Evaluaciones</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=no">
        <link rel="stylesheet" href="../css/bootstrap.min.css">
        <link rel="stylesheet" href="../css/style.css">
        <link rel="stylesheet" href="../css/b4_sidebar.css">
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.3.1/css/all.css" integrity="sha384-mzrmE5qonljUremFsqc01SB46JvROS7bZs3IO2EmfFsd15uHvIt+Y8vEf7N7fWAU" crossorigin="anonymous">
        <link rel="stylesheet" href="../helpers/DataTables/datatables.min.css">
        <link rel="icon" type="image/png" href="../images/faviicon.png">
    </head>

    <body>

    <header>
        <nav class="navbar-fixed-top" role="navigation">
            <div class="container-fluid container-fixed" role="navigation">
                <div class="navbar-header">
                    <p class="banner-txt">#CentroUniversitarioJalisco</p>
                </div>
            </div>
        </nav>

        <nav class="navbar-fixed-top sidebarNavigation" data-sidebarClass="sidebarNav">
            <button class="navbar-toggler leftNavbarToggler" type="button" data-toggle="collapse" data-target="#navbarsExampleDefault"
                    aria-controls="navbarsExampleDefault" aria-expanded="false" aria-label="Toggle navigation">
                <i class="fas fa-bars ico-menu-main"></i>
            </button>
            <a href="../helpers/cerrar_session.php">
                <i class="fas fa-sign-out-alt btn-close-session"></i>
            </a>

            <div class="collapse navbar-collapse sidebarNav" id="navbarsExampleDefault">

                <div class="text-center header-sidebarNav">
                    <img src="../images/student-default.png" class="header-sidebarNav-img">
                    <h5>SEDUJAL</h5>
                </div>
                <div class="options-navbar">
                    <ul class="navbar-nav mr-auto">
                        <li class="nav-item active">
                            <a class="nav-link" href="../userplace/index.php">
                                <i class="fas fa-home"></i>
                                Inicio
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="../evaluacion/evaluaciones_activas.php"><i class="fa fa-book"></i>
                                Evaluaciones</a>
                        </li>
                        

                        <li class="nav-item">
                            <a class="nav-link" href="../helpers/cerrar_session.php"><i class="fas fa-sign-out-alt"></i>Cerrar Sesion</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>
    <?php
include('../conexion.php'); // Archivo de conexión con PDO


// Consulta para obtener evaluaciones activas
$hoy = date('Y-m-d');
$query = "SELECT e.id_evaluacion, a.nombre AS asignatura, e.fecha_inicio, e.fecha_fin 
          FROM evaluacion e
          INNER JOIN asignaturas a ON e.id_asignatura = a.id_asignatura
          WHERE e.fecha_inicio <= :hoy AND e.fecha_fin >= :hoy";
$stmt = $conexion->prepare($query);
$stmt->bindValue(':hoy', $hoy, PDO::PARAM_STR);
$stmt->execute();
$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
?>


    <div class="container" id="mainContent">

<div class="container mt-5">
    <h1 class="text-center mb-4">Evaluaciones Activas</h1>
    <table class="table table-bordered table-striped">
        <thead class="table-dark">
            <tr>
                <th>ID Evaluación</th>
                <th>Asignatura</th>
                <th>Fecha de Inicio</th>
                <th>Fecha de Fin</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($result as $row): ?>
            <tr>
                <td><?= htmlspecialchars($row['id_evaluacion']); ?></td>
                <td><?= htmlspecialchars($row['asignatura']); ?></td>
                <td><?= htmlspecialchars($row['fecha_inicio']); ?></td>
                <td><?= htmlspecialchars($row['fecha_fin']); ?></td>
                <td>
                    <a href="formulario_respuesta.php?id_evaluacion=<?= htmlspecialchars($row['id_evaluacion']); ?>" 
                       class="btn btn-primary">Responder</a>
                </td>
            </tr>
            <?php endforeach; ?>
        </tbody>
    </table>
</div>

        <!-- Scripts -->
        <script src="../helpers/jquery-3.7/jquery-3.7.1.min.js"></script>
        <script src="../helpers/popper-2.11.8/popper.min.js"></script>
        <script src="../helpers/moment-18.1/moment.min.js"></script>
        <script src="../helpers/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
        <script src="//cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>
        <script src="../js/b4_sidebar.js"></script>
</body>
</html>


