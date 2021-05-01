
  /**
   *  js/quote/gantt.js
   *  Definición de columnas a usar en el Gantt
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