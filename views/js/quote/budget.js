var upd_aux;

$(function() {
    chargeSelects();
});

$(function () {
    for (var i = 0; i < item_unit.length; i++) {
      jQuery("<option/>", {
        value: item_unit[i],
        html: item_unit[i],
      }).appendTo("#ac_item_unit");
    }
    $("#upd_ac_item_unit").html($("#ac_item_unit").html())
    $(".selectBuscar").select2({ theme: "bootstrap4" });
});

$('#msgModal').on('hidden.bs.modal', function () {
    if ($('#msgModal .modal-title').html() == "Exito") {
        window.location = '/index/budget?bid=' + $("#quote_info").attr("qid");
    }
})

async function regCg(){
    var aux = getAddCgData();
    
    let response = await fetch(host + budget + "/cg", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
                    numb: aux[0],
                    idq: aux[1],
                    idcg: aux[2]      
                })
    });
    
    var json = await response.json();
    
    manageModals(json);
}

async function regCh(){
    var aux = getAddChData();
    
    let response = await fetch(host + budget + "/ch", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
                    numb: aux[0],
                    name: aux[1],
                    idcg: aux[2]      
                })
    });
    
    var json = await response.json();
    
    manageModals(json);
}

async function regAc(){
    var aux = getAddAcData();
    
    let response = await fetch(host + budget + "/ac", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
                    numb: aux[0],
                    name: aux[1],
                    idch: aux[2],
                    idac: aux[3],
                    mesu: aux[4],
                    idqu: aux[5]      
        })
    });
    
    var json = await response.json();
    
    manageModals(json);
}

async function delCg(id) {
    let response = await fetch(host + budget + "/cg/" + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }});
      
      var json = await response.json();
    
      recalculate(0);

      manageModals(json);
}

async function delCh() {
    var id = $("#upd_ch_id").val();
    let response = await fetch(host + budget + "/ch/" + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }});
      
      var json = await response.json();
    
      recalculate(0);

      manageModals(json);
}

async function delAc(id) {
    let response = await fetch(host + budget + "/ac/" + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }});
      
      var json = await response.json();
    
      recalculate(0);

      manageModals(json);
}

async function updCh() {
    var aux = getUpdChData();

    let response = await fetch(host + budget + "/ch/" + aux[2], {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
            numb: aux[0],
            name: aux[1]
        })
    });
      
      var json = await response.json();
    
      manageModals(json);
}

async function updAc() {
    var aux = getUpdAcData();

    let response = await fetch(host + budget + "/ac/" + aux[4], {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
            numb: aux[0],
            name: aux[1],
            idac: aux[2],
            mesu: aux[3],
            quan: aux[5]  
        })
    });

    recalculate(aux[4]);
    var json = await response.json();
    manageModals(json);
}

async function getGroups(){
    let response = await fetch(host + group + "/all/fill", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    });
    var json = await response.json();
    return json;
}

async function recalculate(a_id){ 
    var b_id = $("#quote_info").attr("qid");; 

    await fetch(host + apu + "/calculate", {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
            bid: b_id,
            aid: a_id,
            apid: 0,
            acid: 0
        })
    });
    
    var json = await response.json();
    
    manageModals(json);
}

async function chargeSelects(){
    var groups = await getGroups();
    for(var i=0; i< groups.cg.length;i++){
      jQuery('<option/>', {
            value: groups.cg[i].ID,
            html: groups.cg[i].PREFIX + " - " + groups.cg[i].NAME
            }).appendTo('#select_chp_grp');
    }
    for(var i=0; i< groups.ag.length;i++){
      jQuery('<option/>', {
            chp_grp: groups.ag[i].ID_CHP_GRP,
            value: groups.ag[i].ID,
            html: groups.ag[i].PREFIX + " - " + groups.ag[i].NAME
            }).appendTo('#select_act_grp');
    }
    copySelects();
}

function copySelects(){
    $('#cg_select_chp_grp').html($('#select_chp_grp').html());
    $('#ac_select_act_grp').html($('#select_act_grp').html());
    $(".selectBuscar").select2({ theme: "bootstrap4" });
}

function getAddCgData() {
    var aux = [];
    aux[0] = $("#cg_pref").val();
    aux[1] = $("#quote_info").attr("qid");
    aux[2] = $("#cg_select_chp_grp").val();
    return aux;
}

function getAddChData() {
    var aux = [];
    aux[0] = $("#ch_pref").val();
    aux[1] = $("#ch_name").val();
    aux[2] = $("#ch_idcg").val();
    return aux;
}

function getAddAcData() {
    var aux = [];
    aux[0] = $("#ac_pref").val();
    aux[1] = $("#ac_name").val();
    aux[2] = $("#ac_idch").val();
    aux[3] = $("#ac_select_act_grp").val();
    aux[4] = $("#ac_item_unit").val();
    aux[5] = $("#quote_info").attr("qid");
    return aux;
}

function getUpdChData() {
    var aux = [];
    aux[0] = $("#upd_ch_pref").val();
    aux[1] = $("#upd_ch_name").val();
    aux[2] = $("#upd_ch_id").val();
    return aux;
}

function getUpdAcData() {
    var aux = [];
    aux[0] = $("#upd_ac_pref").val();
    aux[1] = $("#upd_ac_name").val();
    aux[2] = $("#upd_ac_select_act_grp").val();
    aux[3] = $("#upd_ac_item_unit").val();
    aux[4] = $("#upd_ac_id").val();
    aux[5] = $("#upd_ac_quan").val();
    return aux;
}

async function initCh(id) {
    let response = await fetch(host + budget + "/ch/" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
    var json = await response.json();
    upd_aux  = json[0];
    initChEdit(json[0]);
}

async function initAc(id) {
    let response = await fetch(host + budget + "/ac/" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
    var json = await response.json();
    initAcEdit(json[0]);
}

function initChEdit(json) {
    $("#upd_ch_id").val(json.ID);
    $("#upd_ch_pref").val(json.QUOTE_NUMBER);
    $("#upd_ch_name").val(json.CUSTOM_NAME);
}

function initAcEdit(json) {
    $('#upd_ac_select_act_grp').html($('#select_act_grp').html());
    $('#upd_ac_select_act_grp option').each( function () {
        if ($(this).val() != 0 && $(this).attr('chp_grp') != json.activity_group.ID_CHP_GRP) {
          $(this).remove();
        }
    });
    $("#upd_ac_id").val(json.ID);
    $("#upd_ac_pref").val(json.QUOTE_NUMBER);
    $("#upd_ac_name").val(json.CUSTOM_NAME);
    $("#upd_ac_select_act_grp").val(json.ID_ACT_GRP);
    $("#upd_ac_item_unit").val(json.MEASSURE_UNIT);
    $("#upd_ac_quan").val(json.QUANTITY);
}

function cancelUpd() {
    $("#upd_ch_pref").val(upd_aux.QUOTE_NUMBER);
    $("#upd_ch_name").val(upd_aux.CUSTOM_NAME);

    $("#upd_ch_pref").prop( "disabled", true );
    $("#upd_ch_name").prop( "disabled", true );
    $("#button1").html(
        `<button class="btn btn-primary btn-block" type="button" onclick="enableUpd()">
            Actualizar capitulo
        </button>`
    );
    $("#button2").html(
        `<button class="btn btn-primary btn-block" type="button"  onclick="delCh()">
            Eliminar capitulo
        </button>`
    );
}

function enableUpd() {
    $("#upd_ch_pref").prop( "disabled", false );
    $("#upd_ch_name").prop( "disabled", false ); 
    $("#button1").html(
        `<button class="btn btn-success btn-block"  type="button" onclick="updCh()">
            Aceptar
        </button>`
    );
    $("#button2").html(
        `<button class="btn btn-warning btn-block" type="button" onclick="cancelUpd()">
            Cancelar
        </button>`
    );
}

function manageModals(json) {
    $('#addCGModal').modal('hide');
    $('#addCHModal').modal('hide');
    $('#addACModal').modal('hide');
    $('#updCHModal').modal('hide');
    $('#updACModal').modal('hide');
    $('#msgModal .modal-title').html(json.name);
    $('#msgModal .modal-body').html(json.message);
    $("#msgModal").modal();
}

function prefijoCh(pref, number, id) {
    $("#ch_idcg").val(id)
    $("#ch_pref").val(pref + number + ".");
}

function prefijoAc(pref, number, id, chapter) {
    copySelects();
    $("#ac_idch").val(id)
    $("#ac_pref").val(pref.substr(3) + number + ".");+
    removeOptions(chapter)
}

function removeOptions(chapter) {
    $('#ac_select_act_grp option').each( function () {
        if ($(this).val() != 0 && $(this).attr('chp_grp') != chapter) {
          $(this).remove();
        }
    });
}