<?php
include "../session_check.php";

// Verificar que sea un administrador
if ($_SESSION['rol'] != 'admin') {
    header("Location: ../login.php");
    exit();
}
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Asignación de evaluacion</title>
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
                        <a class="nav-link" href="../adminplace/">
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
                        <a class="nav-link" href="../evaluacion/formulario-asignacion.php"><i class="fa fa-archive"></i> Evaluación Docente</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="../helpers/cerrar_session.php"><i class="fas fa-sign-out-alt"></i> Cerrar Sesion</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
</header>



<div class="container mt-5">
    <h2 class="mb-4">Asignar Evaluación Docente</h2>
    <form id="formAsignacion" class="border p-4 rounded shadow-sm bg-light">
        <div class="mb-3">
            <label for="id_asignatura" class="form-label">Selecciona una asignatura:</label>
            <select name="id_asignatura" id="id_asignatura" class="form-control" required>
            </select>
        </div>
        <div class="mb-3">
            <label for="fecha_inicio" class="form-label">Fecha de inicio:</label>
            <input type="date" id="fecha_inicio" name="fecha_inicio" class="form-control" required>
        </div>
        <div class="mb-3">
            <label for="fecha_fin" class="form-label">Fecha de fin:</label>
            <input type="date" id="fecha_fin" name="fecha_fin" class="form-control" required>
        </div>
        <button type="submit" class="btn btn-primary">Asignar Evaluación</button>
    </form>
</div>
<p></p>
<div class="container mt-3">
    <button onclick="location.href='evaluacion_resultados.php'" type="button" class="btn btn-success">Ver resultados</button>
</div>
<p></p>

<!-- Fin de modal -->
<script src="../helpers/jquery-3.7/jquery-3.7.1.min.js"></script>
<script src="../helpers/popper-2.11.8/popper.min.js"></script>
<script src="../helpers/moment-18.1/moment.min.js"></script>
<script src="../helpers/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
<script src="//cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>
<script src="../js/b4_sidebar.js"></script>

<script>
    $(document).ready(function () {
        // Establecer el valor mínimo en los campos de fecha
        const today = new Date().toISOString().split("T")[0];
        $("#fecha_inicio").attr("min", today);
        $("#fecha_fin").attr("min", today);

        $('#formAsignacion').on('submit', function (e) {
            e.preventDefault();

            // Validar campos antes de enviar
            let id_asignatura = $('#id_asignatura').val();
            let fecha_inicio = $('#fecha_inicio').val();
            let fecha_fin = $('#fecha_fin').val();

            if (!id_asignatura || !fecha_inicio || !fecha_fin) {
                alert("Todos los campos son obligatorios.");
                return;
            }

            let url = 'asignar_evaluacion.php';
            let datos = {
                id_asignatura: id_asignatura,
                fecha_inicio: fecha_inicio,
                fecha_fin: fecha_fin,
            };

            console.log("Enviando datos:", datos);

            $.post(url, datos, function (response) {
                console.log("Respuesta del servidor:", response);

                // Mostrar un mensaje y limpiar el formulario si la solicitud es exitosa
                alert(response);
                limpiarFormulario();
            }).fail(function (xhr, status, error) {
                console.error("Error en la solicitud:", error);
                alert("Hubo un error al asignar la evaluación. Por favor, inténtalo nuevamente.");
            });
        });

        function limpiarFormulario() {
            $('#formAsignacion')[0].reset();
        }

        function cargarAsignaturas() {
            $.ajax({
                url: 'obtener-asignaturas.php',
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    let selectAsignaturas = $('#id_asignatura');
                    selectAsignaturas.empty(); // Limpiar opciones anteriores
                    data.forEach(function (asignaturas) {
                        selectAsignaturas.append(`<option value="${asignaturas.id_asignatura}">${asignaturas.nombre}</option>`);
                    });
                },
                error: function (xhr, status, error) {
                    console.error("Error al obtener las carreras:", error);
                }
            });
        }
        cargarAsignaturas();
    });
</script>

</body>
</html>







