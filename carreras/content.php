<div class="container my-5">
        <h2 class="mb-4">Carreras</h2>
        <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#carreraModal" onclick="limpiarFormulario()">Agregar Carrera</button>
        
        <table id="tablaCarrera" class="table table-striped" style="width:100%">
            <thead>
                <tr>
                    <th>id_carrera</th>
                    <th>Nombre</th>
                    <th>Acciones</th>
                </tr>
            </thead>
        </table>
    </div>

    <div class="modal fade" id="carreraModal" tabindex="-1" aria-labelledby="carreraModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="carreraModalLabel">Agregar/Editar Carrera</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="FormCarrera">
                        <div class="mb-3">
                            <label for="id_carrera" class="form-label">ID Carrera</label>
                            <input type="number" class="form-control" id="id_carrera" required>
                        </div>
                        <div class="mb-3">
                            <label for="nombre" class="form-label">Nombre De la Carrera</label>
                            <input type="text" class="form-control" id="nombre" required>
                        </div>

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
            tabla = $('#tablaCarrera').DataTable({
                ajax: {
                    url: 'json-carrera.php',
                    dataSrc: ''
                },
                columns: [
                    { "data": "id_carrera" },
                    { "data": "nombre" },
                    {
                        data: null,
                        render: function(data, type, row) {
                            return `
                                <button class="btn btn-warning btn-sm" onclick="editarCarrera('${row.id_carrera}')">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="eliminarCarrera('${row.id_carrera}')">Eliminar</button>
                            `;
                        }
                    }
                ]
            });

            $('#FormCarrera').on('submit', function(e) {
                e.preventDefault();
                let id_carrera = $('#id_carrera').val();
                let url = modoEdicion ? 'actualizar_carrera.php' : 'agregar_carrera.php';
                let datos = {
                    id_carrera: id_carrera,
                    nombre: $('#nombre').val(),
                    id_carrera: $('#id_carrera').val(),
                    fecha_inscripcion: $('#fecha_ingreso').val(),
                    
                };
                console.log("Enviando datos:", datos);
                $.post(url, datos, function(response) {
                    console.log("Respuesta del servidor al agregar:", response);
                    $('#carreraModal').modal('hide');
                    tabla.ajax.reload();
                });
            });
        });

        function limpiarFormulario() {
            $('#FormCarrera')[0].reset();
            $('#id_carrera').val('');
            modoEdicion = false;
        }

        function editarCarrera(id_carrera) {
            $.get('obtener_carrera.php', { id_carrera: id_carrera }, function(data) {
                $('#id_carrera').val(data.id_carrera);
                $('#nombre').val(data.nombre);
                $('#carreraModal').modal('show');
                modoEdicion = true;
            }, 'json');
        }

        function eliminarCarrera(id_carrera) {
            console.log("ID a eliminar:", id_carrera); // Verifica que el id sea correcto
            if (confirm('¿Estás seguro de que deseas eliminar este Carrera?')) {
                $.post('eliminar_carrera.php', { id_carrera: id_carrera }, function(response) {
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