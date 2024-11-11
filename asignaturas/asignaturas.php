<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Asignaturas</title>
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
                                <i class="fas fa-home"></i>
                                Inicio
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="../alumnos.php"><i class="fas fa-user-graduate"></i>
                                Alumnos</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="javascript:loadContent('../docentes.php');"><i class="fa fa-university"></i>
                                Docentes</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="javascript:loadContent('../asignaturas.php');"><i class="fa fa-book"></i>
                                Asignaturas</a>
                        </li>
                        

                        <li class="nav-item">
                            <a class="nav-link" href="../helpers/cerrar_session.php"><i class="fas fa-sign-out-alt"></i>Cerrar Sesion</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        
    </header>

    <div class="container" id="mainContent">

         <!-- ?php -->
            <!-- include ('content.php');
        ?> -->
        <div class="container my-5">
        <h2 class="mb-4">ASIGNATURAS</h2>
        <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#asignaturaModal" onclick="limpiarFormulario()">Agregar Alumno</button>
        
        <table id="tablaAsignatura" class="table table-striped" style="width:100%">
            <thead>
                <tr>
                        <th>ID Asignatura</th>
                        <th>Nombre</th>
                        <th>Docente</th>
                        <th>Cuatrimestre</th>
                        <th>Carrera</th>
                        <th>Acciones</th>
                </tr>
            </thead>
        </table>
    </div>

    <div class="modal fade" id="asignaturaModal" tabindex="-1" aria-labelledby="asignaturaModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="asignaturaModalLabel">Agregar/Editar Asignatura</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="formAsignatura">
                        <div class="mb-3">
                            <label for="id_asignatura" class="form-label">ID Asignatura</label>
                            <input type="number" class="form-control" id="id_asignatura" required>
                        </div>
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="nombre" required>
                        </div>
                        <div class="mb-3">
                            <label for="id_docente" class="form-label">Docente</label>
                            <select class="form-control" id="id_docente" required></select>
                        </div>
                        <p></p>
                        <div class="mb-5">
                            <label for="cuatrimestre" class="form-label">Cuatrimestre</label>
                            <input type="number" class="form-control" id="cuatrimestre" required>
                        </div>
                        <div class="mb-5">
                            <label for="id_carrera" class="form-label">Carrera</label>
                            <select class="form-control" id="id_carrera" required></select>
                        </div>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
        
    </div>

    
    <!-- Fin de modal -->

        <!-- Scripts -->
        <script src="../helpers/jquery-3.7/jquery-3.7.1.min.js"></script>
        <script src="../helpers/popper-2.11.8/popper.min.js"></script>
        <script src="../helpers/moment-18.1/moment.min.js"></script>
        <script src="../helpers/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
        <script src="//cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>


    <script>
       let tabla;
        let modoEdicion = false;
        $(document).ready(function() {
    tabla = $('#tablaAsignatura').DataTable({
        ajax: {
            url: 'json-asignaturas.php',
            dataSrc: ''
        },
        columns: [
            { "data": "id_asignatura" },
            { "data": "nombre" },
            { "data": "nombre_docente" },  // Nombre del docente
            { "data": "cuatrimestre" },
            { "data": "nombre_carrera" },  // Nombre de la carrera
            {
                data: null,
                render: function(data, type, row) {
                    return `
                        <button class="btn btn-warning btn-sm" onclick="editarAsignatura('${row.id_asignatura}')">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarAsignatura('${row.id_asignatura}')">Eliminar</button>
                    `;
                }
            }
        ]
    });



            $('#formAsignatura').on('submit', function(e) {
                e.preventDefault();
                let id_asignatura = $('#id_asignatura').val();
                let url = modoEdicion ? 'actualizar_asignatura.php' : 'agregar_asignatura.php';
                let datos = {
                    id_asignatura: id_asignatura,
                    nombre: $('#nombre').val(),
                    id_docente: $('#id_docente').val(),
                    cuatrimestre: $('#cuatrimestre').val(),
                    id_carrera: $('#id_carrera').val(),
                };
                console.log("Enviando datos:", datos);
                $.post(url, datos, function(response) {
                    console.log("Respuesta del servidor al agregar:", response);
                    $('#asignaturaModal').modal('hide');
                    tabla.ajax.reload();
                });
            });
        });

        function limpiarFormulario() {
            $('#formAsignatura')[0].reset();
            $('#id_asignatura').val('');
            modoEdicion = false;
        }

        function editarAsignatura(id_asignatura) {
            $.get('obtener_asignatura.php', { id_asignatura: id_asignatura }, function(data) {
                console.log(data);
                $('#id_asignatura').val(data.id_asignatura);
                $('#nombre').val(data.nombre);
                $('#id_docente').val(data.id_docente);
                $('#cuatrimestre').val(data.cuatrimestre);
                $('#id_carrera').val(data.id_carrera);
                $('#asignaturaModal').modal('show');
                modoEdicion = true;
            }, 'json');
        }

        function eliminarAsignatura(id_asignatura) {
            console.log("ID a eliminar:", id_asignatura); // Verifica que el id sea correcto
            if (confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
                $.post('eliminar_asignatura.php', { id_asignatura: id_asignatura }, function(response) {
                    console.log("Respuesta de eliminación:", response); 
                    tabla.ajax.reload();
                });
            }
        }
       
    // Cargar opciones de carreras
    function cargarDocentes() {
    $.ajax({
        url: 'obtener_docente.php', 
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            let selectDocentes = $('#id_docente');
            selectDocentes.empty(); // Limpiar opciones anteriores
            data.forEach(function(carrera) {
                selectDocentes.append(`<option value="${carrera.id_docente}">${carrera.nombre}</option>`);
            });
        },
        error: function(xhr, status, error) {
            console.error("Error al obtener los docentes:", error);
        }
    });
}
function cargarCarreras() {
    $.ajax({
        url: 'obtener_carreras.php', 
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            let selectCarreras = $('#id_carrera');
            selectCarreras.empty(); // Limpiar opciones anteriores
            data.forEach(function(carrera) {
                selectCarreras.append(`<option value="${carrera.id_carrera}">${carrera.nombre}</option>`);
            });
        },
        error: function(xhr, status, error) {
            console.error("Error al obtener las carreras:", error);
        }
    });
}
cargarCarreras();
cargarDocentes();

    </script>
    </body>
</html>


