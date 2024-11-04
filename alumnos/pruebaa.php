<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.11.5/css/dataTables.bootstrap5.min.css">
</head>

<body>
    <div class="container my-5">
        <h2 class="mb-4">Tabla Dinámica de Alumnos</h2>
        <!-- Botón para agregar nuevo registro -->
        <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#alumnoModal" onclick="limpiarFormulario()">Agregar Alumno</button>
        
        <!-- Tabla de alumnos -->
        <table id="tablaAlumnos" class="table table-striped" style="width:100%">
            <thead>
                <tr>
                <th>Numero de control</th>
                <th>nombre</th>
                <th>Id Carrera</th>
                <th>Fecha de ingreso</th>
                </tr>
            </thead>
        </table>
    </div>

    <!-- Modal para agregar/editar alumno -->
    <div class="modal fade" id="alumnoModal" tabindex="-1" aria-labelledby="alumnoModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="alumnoModalLabel">Agregar/Editar Alumno</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="formAlumno">
                        <label for="num_control" class="form-label">Número de control</label>
                        <input type="text" id="num_control">
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="nombre" required>
                        </div>
                        <div class="mb-3">
                            <label for="carrera" class="form-label">Id Carrera</label>
                            <input type="text" class="form-control" id="id_carrera" required>
                        </div>
                        <div class="mb-3">
                            <label for="fecha_ingreso" class="form-label">Fecha ingreso</label>
                            <input type="date" class="form-control" id="fecha_ingreso" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Guardar</button>
                    </form>
                </div>
            </div>
        </div>
    </div>




<script src="../helpers/jquery-3.7/jquery-3.7.1.min.js"></script>
        <script src="../helpers/popper-2.11.8/popper.min.js"></script>
        <script src="../helpers/moment-18.1/moment.min.js"></script>
        <script src="../helpers/bootstrap-5.0.2-dist/js/bootstrap.bundle.js"></script>
        <!-- <script src="helpers/DataTables/datatables.min.css" ></script> -->
        <script src="//cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>
        <script src="ajax-alumno.js"></script>
        <script src="tabla.js"></script>
        <script>
    // $(document).ready(function() {
    //     $('#tablaAlumnos').DataTable({
    //         "ajax": {
    //             "url": "json-alumno.php",  // Reemplaza con la ruta a tu script PHP
    //             "dataSrc": ""
    //         },
    //         "columns": [
    //             { "data": "num_control" },           // Ajusta estos nombres de acuerdo con los campos de tu tabla
    //             { "data": "nombre" },
    //             { "data": "id_carrera" },
    //             { "data": "fecha_inscripcion" },

    //         ]
    //     });
    // });
    </script>

     <!-- Script para inicializar DataTables y manejo de CRUD -->
     <script>
        let tabla;

        $(document).ready(function() {
            // Inicializar DataTable
            tabla = $('#tablaAlumnos').DataTable({
                ajax: {
                    url: 'json-alumno.php',
                    dataSrc: ''
                },
                columns: [
                    { "data": "num_control" },           // Ajusta estos nombres de acuerdo con los campos de tu tabla
                    { "data": "nombre" },
                    { "data": "id_carrera" },
                    { "data": "fecha_inscripcion" },
                    {
                        data: null,
                        render: function(data, type, row) {
                            return `
                                <button class="btn btn-warning btn-sm" onclick="editarAlumno(${row.num_control})">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="eliminarAlumno(${row.num_control})">Eliminar</button>
                            `;
                        }
                    }
                ]
            });

            // Manejar envío del formulario 
            $('#formAlumno').on('submit', function(e) {
                e.preventDefault();
                let id = $('#num_control').val();
                let url = id ? 'actualizar_alumno.php' : 'agregar_alumno.php';
                let datos = {
                    id: id,
                    nombre: $('#nombre').val(),
                    id_carrera: $('#id_carrera').val(),
                    fecha_inscripcion: $('#fecha_inscripcion').val(),
                };

                $.post(url, datos, function(response) {
                    $('#alumnoModal').modal('hide');
                    tabla.ajax.reload();
                });
            });
        });

        // Función para limpiar el formulario
        function limpiarFormulario() {
            $('#formAlumno')[0].reset();
            $('#num_control').val('');
        }

        // Función para editar un alumno
        function editarAlumno(id) {
            $.get('obtener_alumno.php', { id: id }, function(data) {
                $('#num_control').val(data.num_control);
                $('#nombre').val(data.nombre);
                $('#fecha_inscripcion').val(data.fecha_inscripcion);
                $('#alumnoModal').modal('show');
            }, 'json');
        }

        // Función para eliminar un alumno
        function eliminarAlumno(id) {
            if (confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
                $.post('eliminar_alumno.php', { id: id }, function(response) {
                    tabla.ajax.reload();
                });
            }
        }
    </script>
    </html>