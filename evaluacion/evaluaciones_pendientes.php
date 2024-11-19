
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>CONTROL ESCOLAR UNIJAL</title>
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
                        <a class="nav-link" href="./">
                            <i class="fas fa-home"></i> Inicio
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../alumnos/alumnos.php"><i class="fas fa-user-graduate"></i> Alumnos</a>
                    </li>
                    <li class="nav-item">
                    <a class="nav-link" href="../docentes/docentes.php"><i class="fa fa-university"></i> Docentes</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../asignaturas/asignaturas.php"><i class="fa fa-book"></i> Asignaturas</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../carreras/carreras.php"><i class="fa fa-briefcase"></i> Carreras</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../usuarios/usuarios.php"><i class="fa fa-address-card"></i> Usuarios</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../helpers/cerrar_session.php"><i class="fas fa-sign-out-alt"></i> Cerrar Sesion</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>
<body>
    

<div id="evaluaciones-container" class="container mt-5">
    <h2>Evaluaciones Disponibles</h2>
    <div id="evaluaciones-list"></div>
</div>

<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script>
$(document).ready(function() {
    $.getJSON('obtener-evaluaciones.php', function(response) {
        if (response.status === 'success') {
            const evaluaciones = response.evaluaciones;
            let html = '';

            if (evaluaciones.length > 0) {
                evaluaciones.forEach(ev => {
                    html += `
                        <div class="evaluacion mb-4 p-3 border rounded">
                            <h4>${ev.asignatura}</h4>
                            <p>Inicio: ${ev.fecha_inicio}</p>
                            <p>Fin: ${ev.fecha_fin}</p>
                            <p>Estado: ${ev.estado}</p>
                            ${
                                ev.estado === 'Pendiente'
                                    ? `<a href="formulario_evaluacion.php?id_evaluacion=${ev.id_evaluacion}" 
                                         class="btn btn-primary">Realizar Evaluación</a>`
                                    : `<button class="btn btn-secondary" disabled>Ya realizada</button>`
                            }
                        </div>
                    `;
                });
            } else {
                html = '<p>No tienes evaluaciones asignadas en este momento.</p>';
            }

            $('#evaluaciones-list').html(html);
        } else {
            alert(response.message);
        }
    });
});
</script>

<!-- Fin de modal -->

        <!-- Scripts -->
        <script src="../helpers/jquery-3.7/jquery-3.7.1.min.js"></script>
        <script src="../helpers/popper-2.11.8/popper.min.js"></script>
        <script src="../helpers/moment-18.1/moment.min.js"></script>
        <script src="../helpers/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
        <script src="//cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>
        <script src="../js/b4_sidebar.js"></script>


<script>
    
</script>
</body>
</html>




