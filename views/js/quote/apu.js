const select_apu_content = ['Materiales y equipo', 'Cuadrilla', 'Maquinaria', 'Transporte'];
const item_type = ['item_material', 'item_gang', 'item_machinery', 'item_transport'];

$(async function() {
    for (var i = 0; i < select_apu_content.length; i++) {
        jQuery("<option/>", {
            value: i + 1,
            html: select_apu_content[i],
        }).appendTo("#select_apu_content");
    }

    var id = $('#contents').val();
    if (typeof id !== 'undefined') {
        let aux = id.split(',').sort();
        if (aux.length == 4) {
            $('#btnSection').prop('hidden',true);
        }else{
            console.log(aux);
            aux.forEach(e => {
                $("#select_apu_content option[value='"+e+"']").remove();
            });
        }
    }
});

$('#msgModal').on('hidden.bs.modal', function () {
    if ($('#msgModal .modal-title').html() == "Exito") {
        window.location = window.location.href;
    }
})

$("#selectItemModal").on({
    "shown.bs.modal": function () {
        $('#addItemModal').modal('hide');
        $('#apu_item_perf').val('')
        $('#apu_item_perf').prop('disabled', true)
    }, "hidden.bs.modal": function () {
        $('#addItemModal').modal('show');
    }
});

$("#selectSalaryModal").on({
    "shown.bs.modal": function () {
        $('#addItemModal').modal('hide');
    }, "hidden.bs.modal": function () {
        $('#addItemModal').modal('show');
    }
});

$('#apu_item_amon').on('keyup', function () {
    let perf =  $('#apu_item_perf').val();
    let val = translateNum($('#apu_item_cost').val());
    if (perf != '') {
        let aux = ($('#apu_item_amon').val() * val) /perf;
        translateTxt($('#apu_item_total'), aux)
    }else{
        let aux = $('#apu_item_amon').val() * val;
        translateTxt($('#apu_item_total'), aux)
    }
})

$('#apu_ot_mult_salary').on({
    'change': function () {
        checkAddition();
}})

$('#apu_o_mult_salary').on({
    'change': function () {
        checkAddition();
}})

$('#apu_a_mult_salary').on({
    'change': function () {
        checkAddition();
}})

$('#apu_ot_quantity').on({
    'change': function () {
        checkAddition();
}})

$('#apu_o_quantity').on({
    'change': function () {
        checkAddition();
}})

$('#apu_a_quantity').on({
    'change': function () {
        checkAddition();
}})

$('#apu_item_ot').on({
    'change': function () {
        if ($('#apu_item_ot').val() == 0 || $('#apu_item_ot').val() == '') {
            $("#apu_ot_id_salary").val('');
            $("#apu_ot_quantity").val(0);
            $("#apu_ot_quantity").prop('disabled', true);
        }else{
            $("#apu_ot_quantity").prop('disabled', false);
        }
    
    resetPerf();
    checkAddition();
}, 'keyup': function () {
    resetPerf()
}})

$('#apu_item_o').on({
    'change': function () {
        if ($('#apu_item_o').val() == 0 || $('#apu_item_o').val() == '') {
            $("#apu_o_id_salary").val('');
            $("#apu_o_quantity").val(0);
            $("#apu_o_quantity").prop('disabled', true);
        }else{
            $("#apu_o_quantity").prop('disabled', false);
        }
    resetPerf()
    checkAddition();
}, 'keyup': function () {
    resetPerf()
}})

$('#apu_item_a').on({
    'change': function () {
        if ($('#apu_item_a').val() == 0 || $('#apu_item_a').val() == '') {
            $("#apu_a_id_salary").val('');
            $("#apu_a_quantity").val(0);
            $("#apu_a_quantity").prop('disabled', true);
        }else{
            $("#apu_a_quantity").prop('disabled', false);
        }
    resetPerf()
    checkAddition();
}, 'keyup': function () {
    resetPerf()
}})

async function regContent(){
    var aux = [$("#select_apu_content").val(), $("#id_apu").val()];

    let response = await fetch(host + apu + "/content", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
                    ida: aux[1],
                    idc: aux[0],     
                })
    });
    
    var json = await response.json();
    
    manageModals(json);
}

async function delContent(id){

    let response = await fetch(host + apu + "/content/" + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });

    recalculate(0);
    
    var json = await response.json();
    
    manageModals(json);
}

async function regItem(){
    var aux = getAddItemData();
    
    let response = await fetch(host + apu + "/item", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
                    quan: aux[0],
                    total: aux[1],
                    iditem: aux[2],
                    idapuc: aux[3]     
                })
    });

    recalculate(aux[3]);
    
    var json = await response.json();
    
    manageModals(json);
}

async function regGang(){
    var aux = getAddItemData();
    
    let response = await fetch(host + apu + "/gang", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
                    quan: aux[0],
                    total: aux[1],
                    iditem: aux[2],
                    idapuc: aux[3],
                    c_perf: aux[4],
                    c_desc: aux[5],
                    salary: aux[6],
                    quantity: aux[7]
                })
    });

    recalculate(aux[3]);
    
    var json = await response.json();
    
    manageModals(json);
}

async function delItem(id, idac){

    let response = await fetch(host + apu + "/item/" + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });

    recalculate(idac);
    
    var json = await response.json();
    
    manageModals(json);
}

async function updItem(id, idac){

    let response = await fetch(host + apu + "/item/" + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });

    recalculate(idac);
    
    var json = await response.json();
    
    manageModals(json);
}

async function recalculate(ac_id){
    var a_id = $('#id_activity').val(); 
    var b_id = $('#id_budget').val(); 
    var ap_id = $('#id_apu').val(); 

    await fetch(host + apu + "/calculate", {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
            bid: b_id,
            aid: a_id,
            apid: ap_id,
            acid: ac_id
        })
    });
}

async function initItem(content, id) {
    // hideContent(content)
    let response = await fetch(host + apu + "/" + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      });
      var json = await response.json();
      initItemEdit(json);
}

function initItemEdit(json) {
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

function getAddItemData() {
    var aux = [];
    aux[0] = $('#apu_item_amon').val(); 
    aux[1] = translateNum($('#apu_item_total').val()); 
    aux[2] = $('#apu_item_id').val();
    aux[3] = $('#apu_item_content').val();
    aux[4] = $('#apu_item_perf').val();
    aux[5] = ($("#apu_item_ot").val() == "" ? 0 : $("#apu_item_ot").val()) +
                ":" +
                ($("#apu_item_o").val() == "" ? 0 : $("#apu_item_o").val()) +
                ":" +
                ($("#apu_item_a").val() == "" ? 0 : $("#apu_item_a").val());
    aux[6] = [$("#apu_ot_id_salary").val(), $("#apu_o_id_salary").val(), $("#apu_a_id_salary").val()]
    aux[7] = [$("#apu_ot_quantity").val(), $("#apu_o_quantity").val(), $("#apu_a_quantity").val()]
    return aux;
}

function selectItem(id, name, cost, perf = '', gang = '') {
    $('#apu_item_id').val(id);
    translateTxt($('#apu_item_cost'), cost)
    $('#apu_item_name').val(name);
    if (perf != '') {
        $('#apu_item_perf').val(perf);
    }
    if (gang != '') {
        var aux = gang.split(':');
        $('#apu_item_ot').val(aux[0]).trigger('change');
        $('#apu_item_o').val(aux[1]).trigger('change');
        $('#apu_item_a').val(aux[2]).trigger('change');
    }

    $('#selectItemModal').modal('hide');
}

function manageModals(json) {
    $('#addItemModal').modal('hide');
    $('#addSectionModal').modal('hide');
    $('#msgModal .modal-title').html(json.name);
    $('#msgModal .modal-body').html(json.message);
    $("#msgModal").modal();
}

function resetModal(cont, id) {
    $('#apu_item_id').val('');
    $('#apu_item_cost').val('');
    $('#apu_item_content').val(id);
    $('#apu_item_name').val('');
    $('#apu_item_amon').val('');
    $('#apu_item_total').val('');

    $("#apu_ot_mult_salary").val('');
    $("#apu_o_mult_salary").val('');
    $("#apu_a_mult_salary").val('');
    $("#apu_ot_id_salary").val('');
    $("#apu_o_id_salary").val('');
    $("#apu_a_id_salary").val('');
    $('#apu_ot_salary').val('');
    $('#apu_o_salary').val('');
    $('#apu_a_salary').val('');
    $("#apu_ot_quantity").val('');
    $("#apu_o_quantity").val('');
    $("#apu_a_quantity").val('');
    $("#apu_item_ot").val('');
    $("#apu_item_o").val('');
    $("#apu_item_a").val('');

    if (cont == 2 || cont == 3) {
        $('#add_item_perf').prop('hidden', false); 
        if(cont == 2){
            $('#add_item_gang').prop('hidden', false);
            $('#btn_item').prop('hidden', true);
            $('#btn_gang').prop('hidden', false);
        }else{
            $('#add_item_gang').prop('hidden', true);
        } 
    }else{
        $('#btn_item').prop('hidden', false);
        $('#btn_gang').prop('hidden', true);
        $('#add_item_gang').prop('hidden', true); 
        $('#add_item_perf').prop('hidden', true); 
    }

    hideContent(cont);
}

function hideContent(num){
    var aux = [$('#item_material'), $('#item_gang'), $('#item_machinery'), $('#item_transport')];
    aux[num-1].prop('hidden', false);
    aux.splice(num-1, 1);
    aux.forEach(element => {
        element.prop('hidden', true);
    }); 
}

function resetPerf() {
    $('#apu_item_perf').val('')
    $('#apu_item_perf').prop('disabled', false)
}

function setSalaryType(num) {
    if (num == 1) {
        $('#salary_type').val('ot')
        $('#salary_type_txt').text('para los Oficiales tecnicos')
    }else if (num == 2) {
        $('#salary_type').val('o')
        $('#salary_type_txt').text('para los oficiales')
    }else{
        $('#salary_type').val('a')
        $('#salary_type_txt').text('para los ayudantes')
    }
}

function setSalary(id, mult, sal) {
    let type = $('#salary_type').val();
    $('#apu_'+type+'_mult_salary').val(mult);
    $('#apu_'+type+'_id_salary').val(id);
    translateTxt($('#apu_'+type+'_salary'), sal)
    $('#selectSalaryModal').modal('hide');
}

function checkAddition() {
    var otq = $("#apu_ot_quantity").val() == '' ? 0 : parseInt($("#apu_ot_quantity").val())
    var oq = $("#apu_o_quantity").val() == '' ? 0 : parseInt($("#apu_o_quantity").val())
    var aq = $("#apu_a_quantity").val() == '' ? 0 : parseInt($("#apu_a_quantity").val())
    
    var aux_q = otq + oq + aq;
    if (aux_q != 100) {
        $('#add_item_gang_alert').prop('hidden', false);
    } else {
        $('#add_item_gang_alert').prop('hidden', true);
        calculateTotalGang(otq, oq, aq);
    }

}

function calculateTotalGang(otq, oq, aq) {
    var ots = translateNum($('#apu_ot_salary').val());
    var os = translateNum($('#apu_o_salary').val());
    var as = translateNum($('#apu_a_salary').val());

    if ((ots == 0 && otq != 0) || (os == 0 && oq != 0) || (as == 0 && aq != 0) ) {
        $('#add_salary_gang_alert').prop('hidden', false);
    }else{
        $('#add_salary_gang_alert').prop('hidden', true);
    }

    console.log( os );
    let aux = (otq/100 * ots) + (oq/100 * os) + (aq/100 * as);
    translateTxt($('#apu_item_cost'), aux)
}