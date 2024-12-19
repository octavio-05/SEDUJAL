<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resultados Evaluaciones</title>
    <link rel="stylesheet" href="css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center">Resultados de Evaluaciones por Docente</h1>
        <div id="graficas-container">
            <!-- Aquí se generarán dinámicamente las gráficas -->
        </div>
    </div>

    <script>
        // Función para obtener los datos del servidor
        async function fetchResultados() {
            const response = await fetch('get_evaluacion_docentes.php');
            return response.json();
        }

        // Función para crear un gráfico
        function crearGrafico(docente, promedios, containerId) {
            const ctx = document.getElementById(containerId).getContext('2d');
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Array.from({ length: 22 }, (_, i) => `Pregunta ${i + 1}`),
                    datasets: [{
                        label: `Promedio de respuestas (${docente})`,
                        data: promedios,
                        backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 5
                        }
                    }
                }
            });
        }

        // Función para renderizar las gráficas
        async function renderGraficas() {
            const data = await fetchResultados();
            const container = document.getElementById('graficas-container');
            
            data.forEach((docenteData, index) => {
                const { docente, ...promedios } = docenteData;
                const promedioArray = Object.values(promedios);

                // Crear un canvas para cada gráfico
                const canvasId = `grafico-${index}`;
                const canvas = document.createElement('canvas');
                canvas.id = canvasId;
                canvas.className = 'mb-5';
                container.appendChild(canvas);

                // Crear el gráfico
                crearGrafico(docente, promedioArray, canvasId);
            });
        }

        // Llamar a la función para renderizar las gráficas
        renderGraficas();
    </script>
</body>
</html>
