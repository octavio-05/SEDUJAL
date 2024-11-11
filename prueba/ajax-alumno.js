$(document).ready(function (){

    $("#CargarDatos").click(function(e){
        e.preventDefault();
        console.log("Funciona");
        $.ajax({
            type: "GET",
            url: "../alumnos/json-alumno.php",
            dataType: "json",
            success: function(response){
                console.log(response);
                 
                let table = "<table class='table'>";
                table +="<thead class='table-dark'>";
                  table +="<tr>";
                    table +="<th scope='col'>Num Control</th>";
                    table +="<th scope='col'>Nombre Alumno</th>";
                   table +=" <th scope='col'>Carrera</th>";
                    table +="<th scope='col'>Fecha de ingreso</th>";
                  table +="</tr>";
                table +="</thead>";
               table +=" <tbody>";


            $.each(response, function(indexInArray, valueOfElement){
                table +="<tr>";
                table +="<th scope='col'" + valueOfElement["num_control"] + "</th>";
                table +="<th scope='col'>" + valueOfElement["nombre"] + "</th>";
                table +=" <th scope='col'>" + valueOfElement["id_carrera"] + "</th>";
                table +="<th scope='col'>" + valueOfElement["fecha_inscripcion"] + "</th>";
                table +="</tr>";
            });
            table +="</tbody></table>";
            $('#tabla').html(table);
            }

        })
    });
});