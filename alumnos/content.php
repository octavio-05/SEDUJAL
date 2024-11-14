<div class="container my-5">
        <h2 class="mb-4">ALUMNOS</h2>
        <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#alumnoModal" onclick="limpiarFormulario()">Agregar Alumno</button>
        
        <table id="tablaAlumnos" class="table table-striped" style="width:100%">
            <thead>
                <tr>
                    <th>Numero de control</th>
                    <th>Nombre</th>
                    <th>Carrera</th>
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
                            <label for="id_carrera" class="form-label">Carrera</label>
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
        <script src="//cdn.datatables.net/2.1.8/js/dataTables.min.js"></script>
        <script src="../js/b4_sidebar.js"></script>


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
                    { "data": "nombre_carrera" },
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