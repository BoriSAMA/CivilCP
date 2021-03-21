$(function () {
    for (var i = 0; i < workers_type.length; i++) {
      jQuery("<option/>", {
        value: i+1,
        html: workers_type[i],
      }).appendTo("#wk_rank");
      jQuery("<option/>", {
        value: i+1,
        html: workers_type[i],
      }).appendTo("#upd_wk_rank");
    }
    $(".selectBuscar").select2({ theme: "bootstrap4" });
});

$('#msgModal').on('hidden.bs.modal', function () {
    if ($('#msgModal .modal-title').html() == "Exito") {
        window.location = '/index/workers';
    }
})

async function regWk(){
    var aux = getAddWkData();

    let response = await fetch(host + worker, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
                    name: aux[0],
                    cc: aux[1],
                    phone: aux[2],
                    rank: aux[3],
                    skill: aux[4]
                })
    });

    var json = await response.json();

    manageModals(json);
}

async function delWk(id) {

    let response = await fetch(host + worker + "/" + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }});

      var json = await response.json();

      manageModals(json);
}

async function updWk() {
    var aux = getUpdWkData();
    console.log(aux);
    let response = await fetch(host + worker + "/" + aux[0], {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
            name: aux[1],
            cc: aux[2],
            phone: aux[3],
            rank: aux[4],
            skill: aux[5]
        })
    });

      var json = await response.json();

      manageModals(json);
}

function getAddWkData() {
    var aux = [];
    aux[0] = $("#wk_name").val();
    aux[1] = $("#wk_cc").val();
    aux[2] = $("#wk_phone").val();
    aux[3] = $("#wk_rank").val();
    aux[4] = $("#wk_skill").val();
    return aux;
}

function getUpdWkData() {
    var aux = [];
    aux[0] = $("#upd_wk_id").val();
    aux[1] = $("#upd_wk_name").val();
    aux[2] = $("#upd_wk_cc").val();
    aux[3] = $("#upd_wk_phone").val();
    aux[4] = $("#upd_wk_rank").val();
    aux[5] = $("#upd_wk_skill").val();
    return aux;
}

async function initWk(id) {
    let response = await fetch(host + worker+ "/" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
    var json = await response.json();
    upd_aux  = json[0];
    initWkEdit(json[0]);
}

function initWkEdit(json) {
    $("#upd_wk_id").val(json.ID);
    $("#upd_wk_name").val(json.NAME);
    $("#upd_wk_cc").val(json.CC);
    $("#upd_wk_phone").val(json.PHONE);
    $("#upd_wk_rank").val(json.ID_RANK);
    $("#upd_wk_skill").val(json.SKILL);
}

function manageModals(json) {
    $('#addWkModal').modal('hide');
    $('#updWkModal').modal('hide');
    $('#msgModal .modal-title').html(json.name);
    $('#msgModal .modal-body').html(json.message);
    $("#msgModal").modal();
}
