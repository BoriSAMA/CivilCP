$(function () {
  // Cargar googlecharts
  google.charts.load('current', { 'packages': ['corechart'] });
  google.charts.setOnLoadCallback(drawChart);
});

// Crear y asignar los valores del grafico
function drawChart() {
  var aux = [parseFloat($("#section_0_total").val()), parseFloat($("#section_1_total").val()), parseFloat($("#section_2_total").val()), parseFloat($("#section_3_total").val()), parseFloat($("#section_4_total").val())]
  console.log(aux);
  var data = google.visualization.arrayToDataTable([
    ['Sección', 'Costo'],
    ['Materiales', aux[0]],
    ['Mano de Obra', aux[1] + aux[4]],
    ['Maquinaria', aux[2]],
    ['Transporte', aux[3]],
  ]);

  // Cambiar titulo y tamaño del pie
  var options = { 'title': 'Resumen de Costos', 'width': 450, 'height': 300 };

  // Muestra el grafico dentro del div con el id grafico
  var chart = new google.visualization.PieChart(document.getElementById('grafico'));
  chart.draw(data, options);
}