<div class="container my-5">
        <h2 class="mb-4">ASIGNATURAS</h2>
        <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#asignaturaModal" onclick="limpiarFormulario()">Agregar Asignatura</button>
        
        <table id="tablaAsignatura" class="table table-striped" style="width:100%">
            <thead>
                <tr>
                        <!-- <th>ID Asignatura</th> -->
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
                    <input type="hidden" id="id_asignatura" name="id_asignatura">
                    </div>
                    <div class="mb-3">
                        <label for="nombre" class="form-label">Nombre</label>
                        <input type="text" class="form-control" id="nombre" pattern="^[a-zA-Z\s]+$" required>
                    </div>
                    <div class="mb-3">
                        <label for="id_docente" class="form-label">Docente</label>
                        <select class="form-control" id="id_docente" required></select>
                    </div>
                    <div class="mb-5">
                        <label for="cuatrimestre" class="form-label">Cuatrimestre</label>
                        <input type="number" class="form-control" id="cuatrimestre" min="0" max="9" required>
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

$(document).ready(function () {
    tabla = $('#tablaAsignatura').DataTable({
        ajax: {
            url: 'json-asignaturas.php',
            dataSrc: ''
        },
        columns: [
            // { "data": "id_asignatura" },
            { "data": "nombre" },
            { "data": "nombre_docente" },
            { "data": "cuatrimestre" },
            { "data": "nombre_carrera" },
            {
                data: null,
                render: function (data, type, row) {
                    return `
                        <button class="btn btn-warning btn-sm" onclick="editarAsignatura('${row.id_asignatura}')">Editar</button>

                    `;
                }
            }
        ],
        language: {
            url: "../js/datatable-es.json"
        }
    });

    $('#formAsignatura').on('submit', function (e) {
        e.preventDefault();

        let url = modoEdicion ? 'actualizar_asignatura.php' : 'agregar_asignatura.php';
        let datos = {
    id_asignatura: $('#id_asignatura').val(),
    nombre: $('#nombre').val(),
    id_docente: $('#id_docente').val(),
    cuatrimestre: $('#cuatrimestre').val(),
    id_carrera: $('#id_carrera').val(),
};


        if (modoEdicion) datos.id_asignatura = $('#id_asignatura').val(); // Solo si estamos editando

        $.post(url, datos, function (response) {
            console.log("Respuesta del servidor:", response);
            $('#asignaturaModal').modal('hide');
            tabla.ajax.reload();
        });
    });
});

function limpiarFormulario() {
    $('#formAsignatura')[0].reset();
    modoEdicion = false;
}

function editarAsignatura(id_asignatura) {
    console.log("ID recibido para editar:", id_asignatura); // Depuración
    $.get('obtener_asignatura.php', { id_asignatura: id_asignatura }, function(response) {
        console.log("Respuesta recibida:", response);
        if (response.status === "success" && response.data) {
            let asignatura = response.data;
            $('#id_asignatura').val(asignatura.id_asignatura); // Aquí debe llenarse correctamente
            $('#nombre').val(asignatura.nombre);
            $('#id_docente').val(asignatura.id_docente);
            $('#cuatrimestre').val(asignatura.cuatrimestre);
            $('#id_carrera').val(asignatura.id_carrera);
            modoEdicion = true;
            $('#asignaturaModal').modal('show');
        } else {
            alert("No se encontraron datos para la asignatura seleccionada.");
        }
    }, 'json').fail(function() {
        alert("Ocurrió un error al obtener los datos de la asignatura.");
    });
}


function eliminarAsignatura(id_asignatura) {
    if (confirm('¿Estás seguro de que deseas eliminar esta asignatura?')) {
        $.post('eliminar_asignatura.php', { id_asignatura: id_asignatura }, function (response) {
            tabla.ajax.reload();
        });
    }
}

// Cargar opciones de carreras y docentes
function cargarDocentes() {
    $.get('obtener_docente.php', function (data) {
        $('#id_docente').empty().append(data.map(docente => `<option value="${docente.id_docente}">${docente.nombre}</option>`));
    }, 'json');
}

function cargarCarreras() {
    $.get('obtener_carreras.php', function (data) {
        $('#id_carrera').empty().append(data.map(carrera => `<option value="${carrera.id_carrera}">${carrera.nombre}</option>`));
    }, 'json');
}

cargarCarreras();
cargarDocentes();

    </script>