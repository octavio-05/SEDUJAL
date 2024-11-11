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