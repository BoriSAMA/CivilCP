var uwu

$(async function(){
  uwu = await initGant();
  google.charts.load('current', {'packages':['gantt']});
  google.charts.setOnLoadCallback(drawChart);
});


function daysToMilliseconds(days) {
  return days * 24 * 60 * 60 * 1000;
}

async function drawChart() {
  var owo = [];

  var data = new google.visualization.DataTable();
  data.addColumn('string', 'ID de la Tarea');
  data.addColumn('string', 'Nombre de la Tarea');
  data.addColumn('date', 'Fecha de Inicio');
  data.addColumn('date', 'Fecha de Fin');
  data.addColumn('number', 'Duración');
  data.addColumn('number', 'Porcentaje Hecho');
  data.addColumn('string', 'Predecesora');

  var awa = uwu.activities;

  for (var i = 0; i < awa.length; i++) {
    let aux = awa[i];
    console.log(aux);
    owo[i] = [aux.ID+"", aux.quote_activity.QUOTE_NUMBER + "-" + aux.quote_activity.CUSTOM_NAME, new Date(aux.START_DATE), null, daysToMilliseconds(1), 0, typeof aux.ID_PRE_ACT == "number" ? aux.ID_PRE_ACT+"":null];
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
      return json;
  }

  async function initActtUpd(id) {
      let response = await fetch(host + schedule + "/act/" + id, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json;charset=utf-8'
          }
      });
      var json = await response.json();
      initActtEdit(json);
  }

  async function initActtEdit(json) {
      $("#upd_sch_id").val(json.ID);
      $("#upd_sch_sdate").val(json.START_DATE);
      $("#upd_sch_fdate").val(json.FINISH_DATE);
      $("#upd_sch_duration").val(json.DURATION);
      var ewe = await showDeps(json.ID_PRE_ACT);
      console.log(ewe);
      $("#upd_sch_pre").val(ewe.quote_activity.CUSTOM_NAME);
      $("#upd_sch_taskid").val(json.ID_PRE_ACT);
      $("#upd_sch_pfdate").val(ewe.FINISH_DATE);
      applyfilter(json.ID);
  }

  async function updAct() {
      var aux = getupdActData();

      let response = await fetch(host + schedule + "/act/" + aux[0], {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json;charset=utf-8'
          }, body: JSON.stringify({
              date_s: aux[1],
              date_f: aux[2],
              dur: aux[3],
              idpa: aux[4]
          })
      });

        var json = await response.json();

        manageModals(json);
  }

  async function showDeps(id) {
      let response = await fetch(host + schedule + "/act/" + id, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json;charset=utf-8'
          }
      });
      var json = await response.json();

      return json;
  }

  function getupdActData() {
      var aux = [];
      aux[0] = $("#upd_sch_id").val();
      aux[1] = $("#upd_sch_sdate").val();
      aux[2] = $("#upd_sch_fdate").val();
      aux[3] = $("#upd_sch_duration").val();
      aux[4] = $("#upd_sch_taskid").val();
      aux[5] = $("#upd_sch_pfdate").val();
      return aux;
  }

  function slcPre(id, name, taskid) {
      console.log(name);
      $("#upd_sch_pre").val(taskid+ "-" +name);
      $("#upd_sch_taskid").val(id);
      $("#slcPreModal").modal('hide');
  }

  function applyfilter(id) {
    $("#item_material2 table tbody").each(function(ind) {
      $(this).find("tr").each(function(ind) {
        if ($(this).attr('clase') == id) {
          $(this).hide();
        }else{
          $(this).show();
        }
      });
    });
  }

  $('#msgModal').on('hidden.bs.modal', function () {
      if ($('#msgModal .modal-title').html() == "Exito") {
          window.location = window.location.href;
      }
  })

  $("#updActModal").on("shown.bs.modal", function () {
      $('#slcSchModal').modal('hide');
  });

  $("#updActModal").on("hidden.bs.modal", function () {
      $('#slcSchModal').modal('show');
  });

  $("#upd_sch_fdate").on("change", function () {
      verifDate();
  });

  $("#upd_sch_sdate").on("change", function () {
      verifDate();
  });

  function verifDate(){
    var d1 = new Date($("#upd_sch_pfdate").val());
    var d2 = new Date($("#upd_sch_sdate").val());
    if(d2.getTime()>d1.getTime()){
      dateOps();
    }else{
      manageModals({name:"Error", message:"La fecha de inicio no puede ser anterior a la fecha de fin de su predecesora"});
    }
  }

  function dateOps(){
    var d1 = new Date($("#upd_sch_sdate").val());
    var d2 = new Date($("#upd_sch_fdate").val());
    let diferencia = d2.getTime() - d1.getTime();
    let horasTranscurridas = diferencia / 1000 / 60 / 60 / 24;
    if(d2.getTime()>d1.getTime()){
      $("#upd_sch_duration").val(horasTranscurridas);
    }else{
      manageModals({name:"Error", message:"La fecha de fin no puede ser anterior o igual a la fecha de inicio"});
    }
  }

  function manageModals(json) {
      $('#addSchModal').modal('hide');
      $('#slcSchModal').modal('hide');
      $('#msgModal .modal-title').html(json.name);
      $('#msgModal .modal-body').html(json.message);
      $("#msgModal").modal();
  }
