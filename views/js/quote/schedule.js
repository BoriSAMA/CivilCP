$(async function () {
    let response = await getActivities();
    console.log(response);
});


$('#msgModal').on('hidden.bs.modal', function () {
    if ($('#msgModal .modal-title').html() == "Exito") {
        window.location = window.location.href;
    }
})

$('#select_worker').on({
    'change': function () {
        $("#id_worker").val($('#select_worker').val());
}})

async function getActivities() {
    var id = $("#quo_id").val();
    let response = await fetch(host + gang + "/json/" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
    var json = await response.json();
    return json;
}

async function getWorkers(rank) {
    let response = await fetch(host + worker + "/json/" + rank, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
    var json = await response.json();

    var html = '<option value="0">Ninguno</option>';
    $('#select_worker').html(html);
    for (var i = 0; i < json.length; i++) {
        jQuery("<option/>", {
            value: json[i].ID,
            html: json[i].CC + ' - ' + json[i].NAME,
        }).appendTo("#select_worker");
    }
    $(".selectBuscar").select2({ theme: "bootstrap4" });
}

async function getGangW(id) {
    let response = await fetch(host + gang + "/" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
    var json = await response.json();
    return json;
}

async function updWorker() {
    var aux = getUpdData();
    let metodo = 'PATCH';
    if (aux[2] == 0) {
        metodo = 'DELETE';
    }
    let response = await fetch(host + gang + "/" + aux[0], {
        method: metodo,
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
            idq: aux[1],
            idw: aux[2],   
            fstart: aux[3], 
            ffin: aux[4], 
        })
    });
    var json = await response.json();
    manageModals(json)
}

async function delWorker(id) {
    let response = await fetch(host + gang + "/" + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
    var json = await response.json();
    manageModals(json);
}

async function initWorker(id, rank, fstart, ffin, ids) {
    await getWorkers(rank);
    var gangWorker = await getGangW(id);

    if (gangWorker[0].ID_WORKER !== null) {
        $('#select_worker').val(gangWorker[0].ID_WORKER).trigger('change');
    } else {
        $('#select_worker').val(0).trigger('change');
    }

    $("#id_gang_worker").val(id);
    $("#id_schedule").val(ids);
    $("#date_start").val(fstart)
    $("#date_finish").val(ffin)

    $('#addModal').modal('show');

}

function getUpdData(){
    var aux = [];
    aux[0] = $("#id_gang_worker").val();
    aux[1] = $("#id_schedule").val();
    aux[2] = $("#id_worker").val();
    var ayu = $("#date_start").val().split("-");
    var azu = $("#date_finish").val().split("-");
    aux[3] = new Date(ayu[0], ayu[1]-1, ayu[2]);
    aux[4] = new Date(azu[0], azu[1]-1, azu[2]);
    return aux;
}

function manageModals(json) {
    $('#addModal').modal('hide');
    $('#msgModal .modal-title').html(json.name);
    $('#msgModal .modal-body').html(json.message);
    $("#msgModal").modal();
}