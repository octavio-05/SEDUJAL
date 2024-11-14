<div class="container my-5">
    <h2 class="mb-4">Docentes</h2>
    <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#docenteModal" onclick="limpiarFormulario()">Agregar Docente</button>
    
    <table id="tablaDocente" class="table table-striped" style="width:100%">
        <thead>
            <tr>
                <th>ID Docente</th>
                <th>Nombre</th>
                <th>Acciones</th>
            </tr>
        </thead>
    </table>
</div>

<div class="modal fade" id="docenteModal" tabindex="-1" aria-labelledby="docenteModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="docenteModalLabel">Agregar/Editar Docente</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="FormDocente">
                    <div class="mb-3">
                        <label for="id_docente" class="form-label">ID Docente</label>
                        <input type="number" class="form-control" id="id_docente" required>
                    </div>
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre Del Docente</label>
                        <input type="text" class="form-control" id="nombre" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Guardar</button>
                </form>
            </div>
        </div>
    </div>
</div>

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
        tabla = $('#tablaDocente').DataTable({
            ajax: {
                url: 'json-docentes.php', // Cambié a json-docentes.php
                dataSrc: ''
            },
            columns: [
                { "data": "id_docente" },
                { "data": "nombre" },
                {
                    data: null,
                    render: function(data, type, row) {
                        return `
                            <button class="btn btn-warning btn-sm" onclick="editarDocente('${row.id_docente}')">Editar</button>
                            <button class="btn btn-danger btn-sm" onclick="eliminarDocente('${row.id_docente}')">Eliminar</button>
                        `;
                    }
                }
            ]
        });

        $('#FormDocente').on('submit', function(e) {
            e.preventDefault();
            let id_docente = $('#id_docente').val();
            let url = modoEdicion ? 'actualizar_docente.php' : 'agregar_docente.php';
            let datos = {
                id_docente: id_docente,
                nombre: $('#nombre').val()
            };
            console.log("Enviando datos:", datos);
            $.post(url, datos, function(response) {
                console.log("Respuesta del servidor al agregar:", response);
                $('#docenteModal').modal('hide');
                tabla.ajax.reload();
            });
        });
    });

    function limpiarFormulario() {
        $('#FormDocente')[0].reset();
        $('#id_docente').val('');
        modoEdicion = false;
    }

    function editarDocente(id_docente) {
        $.get('obtener_docente.php', { id_docente: id_docente }, function(data) {
            $('#id_docente').val(data.id_docente);
            $('#nombre').val(data.nombre);
            $('#docenteModal').modal('show');
            modoEdicion = true;
        }, 'json');
    }

    function eliminarDocente(id_docente) {
        console.log("ID a eliminar:", id_docente);
        if (confirm('¿Estás seguro de que deseas eliminar este docente?')) {
            $.post('eliminar_docente.php', { id_docente: id_docente }, function(response) {
                console.log("Respuesta de eliminación:", response); 
                tabla.ajax.reload();
            });
        }
    }

    // // Cargar opciones de docentes (si es necesario)
    // function cargarDocentes() {
    //     $.ajax({
    //         url: 'obtener_docentes.php',
    //         method: 'GET',
    //         dataType: 'json',
    //         success: function(data) {
    //             let selectDocentes = $('#id_docente');
    //             selectDocentes.empty(); // Limpiar opciones anteriores
    //             data.forEach(function(docente) {
    //                 selectDocentes.append(`<option value="${docente.id_docente}">${docente.nombre}</option>`);
    //             });
    //         },
    //         error: function(xhr, status, error) {
    //             console.error("Error al obtener los docentes:", error);
    //         }
    //     });
    // }
    // cargarDocentes();
</script>
