<div class="container my-5">
        <h2 class="mb-4">USUARIOS</h2>
        <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#usuarioModal" onclick="limpiarFormulario()">Agregar Usuario</button>
        
        <table id="tablaUsuarios" class="table table-striped" style="width:100%">
            <thead>
                <tr>
                    <th>id_usuario</th>
                    <th>Rol</th>
                    <th>Contraseña</th>
                    <th>Fecha de actualización</th>
                    <th>Acciones</th>
                </tr>
            </thead>
        </table>
    </div>

    <div class="modal fade" id="usuarioModal" tabindex="-1" aria-labelledby="usuarioModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="usuarioModalLabel">Agregar/Editar Usuario</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="formAlumno">
                        <div class="mb-3">
                            <label for="id_usuario" class="form-label">Número de control</label>
                            <input type="text" class="form-control" id="id_usuario" required>
                        </div>
                        <div class="mb-3">
                            <label for="rol" class="form-label">Rol</label>
                            <select class="form-control" id="rol" name="rol" required>
                            <option value="alumno">Alumno</option>
                            <option value="admin">Administrador</option>
                        </select>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Contraseña</label>
                            <input type="text" class="form-control" id="password" required>
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
            tabla = $('#tablaUsuarios').DataTable({
                ajax: {
                    url: 'json-usuarios.php',
                    dataSrc: ''
                },
                columns: [
                    { "data": "id_usuario" },
                    { "data": "rol" },
                    { "data": "password" },
                    { "data": "fecha_actualizacion" },
                    {
                        data: null,
                        render: function(data, type, row) {
                            return `
                                <button class="btn btn-warning btn-sm" onclick="editarAlumno('${row.id_usuario}')">Editar</button>
                                <button class="btn btn-danger btn-sm" onclick="eliminarAlumno('${row.id_usuario}')">Eliminar</button>
                            `;
                        }
                    }
                ]
            });

            $('#formAlumno').on('submit', function(e) {
                e.preventDefault();
                let id_usuario = $('#id_usuario').val();
                let url = modoEdicion ? 'actualizar_usuario.php' : 'agregar_usuario.php';
                let datos = {
                    id_usuario: id_usuario,
                    rol: $('#rol').val(),
                    password: $('#password').val(),

                    
                };
                console.log("Enviando datos:", datos);
                $.post(url, datos, function(response) {
                    console.log("Respuesta del servidor al agregar:", response);
                    $('#usuarioModal').modal('hide');
                    tabla.ajax.reload();
                });
            });
        });

        function limpiarFormulario() {
            $('#formAlumno')[0].reset();
            $('#id_usuario').val('');
            modoEdicion = false;
        }

        function editarAlumno(id_usuario) {
            $.get('obtener_usuario.php', { id_usuario: id_usuario }, function(data) {
                $('#id_usuario').val(data.id_usuario);
                $('#rol').val(data.rol);
                $('#password').val(data.password);
                $('#usuarioModal').modal('show');
                modoEdicion = true;
            }, 'json');
        }

        function eliminarAlumno(id_usuario) {
            console.log("ID a eliminar:", id_usuario); // Verifica que el id sea correcto
            if (confirm('¿Estás seguro de que deseas eliminar este alumno?')) {
                $.post('eliminar_usuario.php', { id_usuario: id_usuario }, function(response) {
                    console.log("Respuesta de eliminación:", response); 
                    tabla.ajax.reload();
                });
            }
        }
       
    // Cargar opciones de carreras
//     function cargarCarreras() {
//     $.ajax({
//         url: 'obtener_carreras.php', 
//         method: 'GET',
//         dataType: 'json',
//         success: function(data) {
//             let selectCarreras = $('#password');
//             selectCarreras.empty(); // Limpiar opciones anteriores
//             data.forEach(function(carrera) {
//                 selectCarreras.append(`<option value="${carrera.password}">${carrera.rol}</option>`);
//             });
//         },
//         error: function(xhr, status, error) {
//             console.error("Error al obtener las carreras:", error);
//         }
//     });
// }
// cargarCarreras();

    </script>