<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Alumnos</title>
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
        <h2 class="mb-4">ALUMNOS</h2>
        <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#alumnoModal" onclick="limpiarFormulario()">Agregar Alumno</button>
        
        <table id="tablaAlumnos" class="table table-striped" style="width:100%">
            <thead>
                <tr>
                    <th>Numero de control</th>
                    <th>Nombre</th>
                    <th>Id Carrera</th>
                    <th>Fecha de ingreso</th>
                    <th>Acciones</th>
                </tr>
            </thead>
        </table>
    </div>

    <div class="modal fade" id="alumnoModal" tabindex="-1" aria-labelledby="alumnoModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="alumnoModalLabel">Agregar/Editar Alumno</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="formAlumno">
                        <div class="mb-3">
                            <label for="num_control" class="form-label">Número de control</label>
                            <input type="text" class="form-control" id="num_control" required>
                        </div>
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="nombre" required>
                        </div>
                        <div class="mb-3">
                            <label for="id_carrera" class="form-label">Id Carrera</label>
                            <select class="form-control" id="id_carrera" required></select>
                        </div>
                        <p></p>
                        <div class="mb-5">
                            <label for="fecha_ingreso" class="form-label">Fecha ingreso</label>
                            <input type="date" class="form-control" id="fecha_ingreso" required>
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
        <!-- <script src="helpers/DataTables/datatables.min.css" ></script> -->
        <script src="//cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>

        <!-- <script src="ajax-alumno.js"></script> -->
    <!-- <script src="../js/jquery-3.3.1.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js" integrity="sha384-ZMP7rVo3mIykV+2+9J3UJ46jBk0WLaUAdn689aCwoqbBJiSnjAK/l8WvCWPIPm49" crossorigin="anonymous"></script>
    <script src="../js/bootstrap.min.js" integrity="sha384-smHYKdLADwkXOn1EmN1qk/HfnUcbVRZyYmZ4qpPea6sjB/pTJ0euyQp0Mk8ck+5T" crossorigin="anonymous"></script>
    <script src="../js/b4_sidebar.js"></script>
    <script src="../js/moment.js"></script>
    <script src="../js/ajax-alumno.js"></script>
    <script src="//cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>
    <script src="../helpers/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
     -->
    <script>
       let tabla;
        let modoEdicion = false;
        $(document).ready(function() {
            tabla = $('#tablaAlumnos').DataTable({
                ajax: {
                    url: 'json-alumno.php',
                    dataSrc: ''
                },
                columns: [
                    { "data": "num_control" },
                    { "data": "nombre" },
                    { "data": "id_carrera" },
                    { "data": "fecha_inscripcion" },
                    {
                        data: null,
                        render: function(data, type, row) {
                            return `
                                <button class="btn btn-warning btn-sm" onclick="editarAlumno('${row.num_control}')">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="eliminarAlumno('${row.num_control}')">Eliminar</button>
                            `;
                        }
                    }
                ]
            });

            $('#formAlumno').on('submit', function(e) {
                e.preventDefault();
                let num_control = $('#num_control').val();
                let url = modoEdicion ? 'actualizar_alumno.php' : 'agregar_alumno.php';
                let datos = {
                    num_control: num_control,
                    nombre: $('#nombre').val(),
                    id_carrera: $('#id_carrera').val(),
                    fecha_inscripcion: $('#fecha_ingreso').val(),
                    
                };
                console.log("Enviando datos:", datos);
                $.post(url, datos, function(response) {
                    console.log("Respuesta del servidor al agregar:", response);
                    $('#alumnoModal').modal('hide');
                    tabla.ajax.reload();
                });
            });
        });

        function limpiarFormulario() {
            $('#formAlumno')[0].reset();
            $('#num_control').val('');
            modoEdicion = false;
        }

        function editarAlumno(num_control) {
            $.get('obtener_alumno.php', { num_control: num_control }, function(data) {
                $('#num_control').val(data.num_control);
                $('#nombre').val(data.nombre);
                $('#id_carrera').val(data.id_carrera);
                $('#fecha_ingreso').val(data.fecha_inscripcion);
                $('#alumnoModal').modal('show');
                modoEdicion = true;
            }, 'json');
        }

        function eliminarAlumno(num_control) {
            console.log("ID a eliminar:", num_control); // Verifica que el id sea correcto
            if (confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
                $.post('eliminar_alumno.php', { num_control: num_control }, function(response) {
                    console.log("Respuesta de eliminación:", response); 
                    tabla.ajax.reload();
                });
            }
        }
       
    // Cargar opciones de carreras
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

    </script>
    </body>
</html>


