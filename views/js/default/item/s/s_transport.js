$(function () {
  for (var i = 0; i < item_unit.length; i++) {
    jQuery("<option/>", {
      value: item_unit[i],
      html: item_unit[i],
    }).appendTo("#item_unit");
    jQuery("<option/>", {
      value: item_unit[i],
      html: item_unit[i],
    }).appendTo("#upd_item_unit");
  }
  $(".selectBuscar").select2({ theme: "bootstrap4" });
});

$("#addModal").on("shown.bs.modal", function () {
  $("#select_filter_chp_grp_2").html($("#select_filter_chp_grp").html());
  $(".selectBuscar").select2({ theme: "bootstrap4" });
});

$("#select_filter_chp_grp_3").on("change", function () {
  filterUpdByChapter($("#updModal #select_filter_chp_grp_3").val());
});

$("#select_filter_chp_grp_2").on("change", function () {
  filterAddByChapter($("#addModal #select_filter_chp_grp_2").val());
});

$("#msgModal").on("hidden.bs.modal", function () {
  if ($("#msgModal .modal-title").html() == "Exito") {
    window.location = "/index/transports";
  }
});

$("#updModal").on("hidden.bs.modal", function () {
  resetUpdModal();
});

async function updItem() {
  var aux = getUdpData();

  let response = await fetch(host + item + "/" + aux[0], {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify({
      name: aux[2],
      unit: aux[3],
      perf: 0,
      desc: 'na',
      cost: aux[4],
      actg: aux[1],
    }),
  });

  var json = await response.json();

  $("#updModal").modal("hide");
  $("#msgModal .modal-title").html(json.name);
  $("#msgModal .modal-body").html(json.message);
  $("#msgModal").modal();
}

async function initItem(id) {
  $("#select_filter_chp_grp_3").html($("#select_filter_chp_grp").html());
  $("#select_filter_act_grp_4").html($("#select_filter_act_grp").html());

  let response = await fetch(host + item + "/" + id, {
    method: "GET",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
  });
  let json = await response.json();
  $("#select_filter_chp_grp_3")
    .val(json[0].activity_group.ID_CHP_GRP)
    .trigger("change");
  $("#select_filter_act_grp_4").val(json[0].ID_ACT_GRP).trigger("change");
  $("#upd_item_name").val(json[0].NAME);
  $("#upd_item_unit").val(json[0].MEASSURE_UNIT).trigger("change");
  translateTxt($("#upd_item_cost"), json[0].COST);
  $("#upd_item_id").val(id);
}

function getUdpData() {
  var aux = [];
  aux[0] = $("#upd_item_id").val();
  aux[1] = $("#select_filter_act_grp_4").val();
  aux[2] = $("#upd_item_name").val();
  aux[3] = $("#upd_item_unit").val();
  aux[4] = translateNum($("#upd_item_cost").val());
  return aux;
}

function resetUpdModal() {
  $("#select_filter_chp_grp_3").val(0).trigger("change");
  $("#select_filter_act_grp_4").val(0);
  $("#upd_item_name").val("");
  $("#upd_item_unit").val("ML");
  $("#upd_item_cost").val("");
  $("#upd_item_perf").val("");
  $("#upd_item_ot").val("");
  $("#upd_item_o").val("");
  $("#upd_item_a").val("");
}

function filterUpdByChapter(chapter) {
  var html = '<option value="0">Ninguno</option>';
  if (chapter == 0) {
    $("#select_filter_act_grp_4").html(html);
    $("#select_filter_act_grp_4").prop("disabled", true);
  } else {
    $("#select_filter_act_grp_4").html($("#select_filter_act_grp").html());
    $("#select_filter_act_grp_4").prop("disabled", false);

    $("#select_filter_act_grp_4 option").each(function () {
      if ($(this).val() != 0 && $(this).attr("chp_grp") != chapter) {
        $(this).remove();
      }
    });
  }
}
