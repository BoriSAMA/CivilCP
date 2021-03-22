google.charts.load('current', {'packages':['gantt']});
google.charts.setOnLoadCallback(drawChart);

function daysToMilliseconds(days) {
  return days * 24 * 60 * 60 * 1000;
}

async function drawChart() {
  var uwu = await initGant();
  var owo = [];

  var data = new google.visualization.DataTable();
  data.addColumn('string', 'ID de la Tarea');
  data.addColumn('string', 'Nombre de la Tarea');
  data.addColumn('date', 'Fecha de Inicio');
  data.addColumn('date', 'Fecha de Fin');
  data.addColumn('number', 'Duración');
  data.addColumn('number', 'Porcentaje Hecho');
  data.addColumn('string', 'Predecesora');

  for (var i = 0; i < uwu.activities.length; i++) {
    let aux = uwu.activities[i];
    owo[i] = [aux.quote_activity.QUOTE_NUMBER, aux.quote_activity.CUSTOM_NAME, new Date(aux.START_DATE), null, daysToMilliseconds(1), 0, null];
  }

  data.addRows(owo);

  /** Definición de columnas a usar en el Gantt
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'ID de la Tarea');
  data.addColumn('string', 'Nombre de la Tarea');
  data.addColumn('date', 'Fecha de Inicio');
  data.addColumn('date', 'Fecha de Fin');
  data.addColumn('number', 'Duración');
  data.addColumn('number', 'Porcentaje Hecho');
  data.addColumn('string', 'Predecesora');

  data.addRows([
    ['Investigar', 'Buscar fuentes', new Date(2021, 2, 21), new Date(2021, 2, 25), null,  100,  null],
    ['Escribir', 'Escribir ensayo', null, new Date(2021, 2, 29), daysToMilliseconds(3), 100, 'Investigar,Bosquejo'],
    ['Citar', 'Crear bibliografia', null, new Date(2021, 2, 27), daysToMilliseconds(1), 100, 'Investigar'],
    ['Completar', 'Ensayo en mano', null, new Date(2021, 2, 30), daysToMilliseconds(1), 0, 'Citar,Escribir'],
    ['Bosquejo', 'Bosquejo del ensayo', null, new Date(2021, 2, 26), daysToMilliseconds(1), 100, 'Investigar'],
    ['Matarse', 'Suicidarse', null, new Date(2021, 3, 2), daysToMilliseconds(1), 0, 'Escribir']
  ]);**/

  var options = {
    height: 275
  };

  var chart = new google.visualization.Gantt(document.getElementById('chart_div'));

  chart.draw(data, options);
}

  async function initGant() {
      var id = $("#sch_id").val();
      let response = await fetch(host + schedule + "/sch/" + id, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json;charset=utf-8'
          }
      });
      var json = await response.json();
      console.log(json);
      return json;
  }
