
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

  <button id="s" class="btn btn-danger" onclick="changeIcon(this, 0)"><i class="fa fa-sort-alpha-asc" aria-hidden="true"></i></button>

    
var lastId = ""; 

function changeIcon(e, n){
  var ids = ["t", "ty", "d", "s", "de", "v"];
  var id = e.id;

  ids.splice(ids.indexOf(e.id),1);
  resetIcons(ids);

  if (lastId == id) {
    if (id == "d" || id =="v") {
      if ($('#' + id + ' i').hasClass('fa-sort-amount-asc')) {
        $('#' + id + ' i').removeClass('fa-sort-amount-asc').addClass('fa-sort-amount-desc');
      }else{
        $('#' + id + ' i').removeClass('fa-sort-amount-desc').addClass('fa-sort-amount-asc');
      }
    }else{
      if ($('#' + id + ' i').hasClass('fa-sort-alpha-asc')) {
        $('#' + id + ' i').removeClass('fa-sort-alpha-asc').addClass('fa-sort-alpha-desc');
      }else{
        $('#' + id + ' i').removeClass('fa-sort-alpha-desc').addClass('fa-sort-alpha-asc');
      }
    }
  }

  $(e).removeClass('btn-danger').addClass('btn-secondary');
  lastId = id;
  sort(n);
}

function resetIcons(arr){
  for (var i = arr.length - 1; i >= 0; i--) {
    $('#' + arr[i]).removeClass('btn-secondary').addClass('btn-danger');
    if (arr[i] == "d") {
      $('#' + arr[i] + ' i').removeClass('fa-sort-amount-desc').addClass('fa-sort-amount-asc');
    }else{
      $('#' + arr[i] + ' i').removeClass('fa-sort-alpha-desc').addClass('fa-sort-alpha-asc');
    }
  }
}

function sort(n) {
  var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  table = document.getElementById("table");
  switching = true;
  dir = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}

function search() {

    var input, filter, found, table, tr, td;
    
    input = $('#search-params');
    filter = input.val().toUpperCase();
    table = document.getElementById("table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        for (j = 0; j < td.length; j++) {
            if (td[j].innerHTML.toUpperCase().indexOf(filter) > -1) {
                found = true;
            }
        }
        if (found) {
            tr[i].style.display = "";
            found = false;
        } else {
            if (i>0) { //this skips the headers
            tr[i].style.display = "none";
            }
        }
    }
}