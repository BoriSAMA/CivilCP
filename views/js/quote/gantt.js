var uwu;

$(async function () {
  uwu = await initGant();
  google.charts.load('current', { 'packages': ['gantt'] });
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
  var h = (awa.length*42)+40;
  for (var i = 0; i < awa.length; i++) {
    let aux = awa[i];
    var ayu = aux.START_DATE.split("-");
    var azu = aux.FINISH_DATE.split("-");
    owo[i] = [aux.ID + "",
              aux.quote_activity.QUOTE_NUMBER + "-" + aux.quote_activity.CUSTOM_NAME,
              new Date(ayu[0], ayu[1]-1, ayu[2]),
              new Date(azu[0], azu[1]-1, azu[2]),
              daysToMilliseconds(aux.DURATION),
              0,
              typeof aux.ID_PRE_ACT == "number" ? aux.ID_PRE_ACT + "" : null];
  }
  
  data.addRows(owo);

  var options = {
    height: h
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
  if (json.pre_activity != null ) {
    $("#upd_sch_pre").val(json.pre_activity.quote_activity.QUOTE_NUMBER + "-" +
                          json.pre_activity.quote_activity.CUSTOM_NAME);
    $("#upd_sch_pfdate").val(json.pre_activity.FINISH_DATE);
    $("#upd_sch_psdate").val(json.pre_activity.START_DATE);
  }else{
    $("#upd_sch_pre").val('');
    $("#upd_sch_pfdate").val('');
    $("#upd_sch_psdate").val('');
  }
  $("#upd_sch_taskid").val(json.ID_PRE_ACT);
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

function getupdActData() {
  var aux = [];
  aux[0] = $("#upd_sch_id").val();
  aux[1] = $("#upd_sch_sdate").val();
  aux[2] = $("#upd_sch_fdate").val();
  aux[3] = $("#upd_sch_duration").val();
  aux[4] = $("#upd_sch_taskid").val();
  return aux;
}

function slcPre(id, name, taskid) {
  $("#upd_sch_pre").val(taskid + "-" + name);
  $("#upd_sch_taskid").val(id);
  $("#slcPreModal").modal('hide');
}

function applyfilter(id) {
  $("#item_material2 table tbody").each(function (ind) {
    $(this).find("tr").each(function (ind) {
      if ($(this).attr('clase') == id) {
        $(this).hide();
      } else {
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

$("#upd_sch_fdate").on("change", function () {
  verifDate();
});

$("#upd_sch_sdate").on("change", function () {
  verifDate();
});

$("#upd_sch_taskid").on("change", function () {
  verifDate();
});

$("#slcPreModal").on({
    "shown.bs.modal": function () {
        $('#updActModal').modal('hide');
    }, "hidden.bs.modal": function () {
        $('#updActModal').modal('show');
    }
});

function verifDate() {
  var d1 = new Date($("#upd_sch_psdate").val());
  var d2 = new Date($("#upd_sch_sdate").val());

  if (d1 == 'Invalid Date' || d2.getTime() >= d1.getTime()) {
    dateOps();
  } else {
    
    manageModals({ name: "Error", message: "La fecha de inicio no puede ser anterior a la fecha de inicio de su predecesora" });
  }
}

function dateOps() {
  var d1 = new Date($("#upd_sch_sdate").val());
  var d2 = new Date($("#upd_sch_fdate").val());
  let diferencia = d2.getTime() - d1.getTime();
  let horasTranscurridas = diferencia / 1000 / 60 / 60 / 24;
  if (d2.getTime() > d1.getTime()) {
    $("#upd_sch_duration").val(horasTranscurridas);
  } else {
    manageModals({ name: "Error", message: "La fecha de fin no puede ser anterior o igual a la fecha de inicio" });
  }
}

function manageModals(json) {
  $('#addSchModal').modal('hide');
  $('#slcSchModal').modal('hide');
  $('#updActModal').modal('hide');
  $('#msgModal .modal-title').html(json.name);
  $('#msgModal .modal-body').html(json.message);
  $("#msgModal").modal();
}
