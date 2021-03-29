const select_apu_content = ['Materiales y equipo', 'Cuadrilla', 'Maquinaria', 'Transporte'];
const item_type = ['item_material', 'item_gang', 'item_machinery', 'item_transport'];
var curr_modal = 0;

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

$("#addItemModal").on({
    "hidden.bs.modal": function () {
        curr_modal = 0;
    }
});

$("#updItemModal").on({
    "hidden.bs.modal": function () {
        curr_modal = 1;
    }
});

$("#selectSalaryModal").on({
    "shown.bs.modal": function () {
        $('#addItemModal').modal('hide');
        $('#updItemModal').modal('hide');
    }, "hidden.bs.modal": function () {
        if (curr_modal == 0) {
            $('#addItemModal').modal('show');
        }else{
            $('#updItemModal').modal('show');
        }
    }
});

$('#apu_item_amon').on('keyup', function () {
    calculateTotalCost();
})

$('#upd_apu_item_amon').on('keyup', function () {
    calculateTotalUpdCost();
})

$('#apu_item_perf').on('keyup', function () {
    calculateTotalCost();
})

$('#upd_apu_item_perf').on('keyup', function () {
    calculateTotalUpdCost();
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
        
    checkAddition();
}, 'keyup': function () {
    resetPerf()
}})

$('#upd_apu_ot_mult_salary').on({
    'change': function () {
        checkUpdAddition();
}})

$('#upd_apu_o_mult_salary').on({
    'change': function () {
        checkUpdAddition();
}})

$('#upd_apu_a_mult_salary').on({
    'change': function () {
        checkUpdAddition();
}})

$('#upd_apu_ot_quantity').on({
    'change': function () {
        checkUpdAddition();
}})

$('#upd_apu_o_quantity').on({
    'change': function () {
        checkUpdAddition();
}})

$('#upd_apu_a_quantity').on({
    'change': function () {
        checkUpdAddition();
}})

$('#upd_apu_item_ot').on({
    'change': function () {
        if ($('#upd_apu_item_ot').val() == 0 || $('#upd_apu_item_ot').val() == '') {
            $("#upd_apu_ot_id_salary").val('');
            $("#upd_apu_ot_quantity").val(0);
            $("#upd_apu_ot_quantity").prop('disabled', true);
        }else{
            $("#upd_apu_ot_quantity").prop('disabled', false);
        }
    
    checkUpdAddition();
}, 'keyup': function () {
    resetPerf()
}})

$('#upd_apu_item_o').on({
    'change': function () {
        if ($('#upd_apu_item_o').val() == 0 || $('#upd_apu_item_o').val() == '') {
            $("#upd_apu_o_id_salary").val('');
            $("#upd_apu_o_quantity").val(0);
            $("#upd_apu_o_quantity").prop('disabled', true);
        }else{
            $("#upd_apu_o_quantity").prop('disabled', false);
        }

    checkUpdAddition();
}, 'keyup': function () {
    resetPerf()
}})

$('#upd_apu_item_a').on({
    'change': function () {
        if ($('#upd_apu_item_a').val() == 0 || $('#upd_apu_item_a').val() == '') {
            $("#upd_apu_a_id_salary").val('');
            $("#upd_apu_a_quantity").val(0);
            $("#upd_apu_a_quantity").prop('disabled', true);
        }else{
            $("#upd_apu_a_quantity").prop('disabled', false);
        }
    checkUpdAddition();
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

async function updItem(){
    var aux = getUpdItemData();
    console.log(aux);
    let response = await fetch(host + apu + "/" + aux[0], {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
                    total : aux[1],
                    quan: aux[2],
                    perf: aux[3]
                })
    });

    var json = await response.json();
    recalculate(aux[4]);
    manageModals(json);
}

async function updGang(){
    var aux = getUpdGangData();

    let response = await fetch(host + apu + "/gang/" + aux[0], {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
                    total: aux[1],
                    quan: aux[2],
                    c_perf: aux[3],
                    c_desc: aux[5],
                    salary: aux[6],
                    quantity: aux[7]
                })
    });

    var json = await response.json();
    recalculate(aux[4]);
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
    let response = await fetch(host + apu + "/" + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      });
      var json = await response.json();
      initItemEdit(json, content);
}

async function initGang(id) {
    let response = await fetch(host + apu + "/gang/" + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      });
      var json = await response.json();
      console.log(json);
      initGangEdit(json);
}

function initItemEdit(json, cont) {
    updResetModal(cont);

    $('#upd_apu_item_id').val(json.ID);
    $('#upd_apu_item_content').val(json.ID_APU_CONTENT);

    $('#upd_apu_item_name').val(json.item_list.NAME);
    translateTxt($('#upd_apu_item_total'), json.TOTAL);
    $('#upd_apu_item_amon').val(json.QUANTITY);
    translateTxt($('#upd_apu_item_cost'), json.item_list.COST);
    if (cont == 3) {
        $('#upd_apu_item_perf').val(json.item_list.PERFORMANCE);
    }
    
    $('#updItemModal').modal('show');
}

function initGangEdit(json) {
    updGangResetModal();

    $('#upd_apu_item_id').val(json.ID);
    $('#upd_apu_item_content').val(json.ID_APU_CONTENT);

    $('#upd_apu_item_name').val(json.item_list.NAME);

    if (json.gang.OT != '') {
        $("#upd_apu_ot_quantity").val(json.gang.OT.QUANTITY);
        $("#upd_apu_ot_mult_salary").val(json.gang.OT.salary.MULTIPLIER);
        $("#upd_apu_ot_id_salary").val(json.gang.OT.ID_SALARY);
        translateTxt($('#upd_apu_ot_salary'), json.gang.OT.salary.HOURLY_VALUE);
    }
    if (json.gang.O != '') {
        $("#upd_apu_o_quantity").val(json.gang.O.QUANTITY);
        $("#upd_apu_o_mult_salary").val(json.gang.O.salary.MULTIPLIER);
        $("#upd_apu_o_id_salary").val(json.gang.O.ID_SALARY);
        translateTxt($('#upd_apu_o_salary'), json.gang.O.salary.HOURLY_VALUE);
    }
    if (json.gang.A != '') {
        $("#upd_apu_a_quantity").val(json.gang.A.QUANTITY);
        $("#upd_apu_a_mult_salary").val(json.gang.A.salary.MULTIPLIER);
        $("#upd_apu_a_id_salary").val(json.gang.A.ID_SALARY);
        translateTxt($('#upd_apu_a_salary'), json.gang.A.salary.HOURLY_VALUE);
    }

    let aux = json.CUSTOM_DESCRIPTION.split(':');
        $("#upd_apu_item_ot").val(aux[0]).trigger('change');
        $("#upd_apu_item_o").val(aux[1]).trigger('change');
        $("#upd_apu_item_a").val(aux[2]).trigger('change');

        translateTxt($('#upd_apu_item_total'), json.TOTAL);
        $('#upd_apu_item_amon').val(json.QUANTITY);
        $('#upd_apu_item_perf').val(json.CUSTOM_PERFORMANCE);

    $('#updItemModal').modal('show');
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

function getUpdItemData() {
    var aux = [];
    aux[0] = $('#upd_apu_item_id').val();
    aux[1] = translateNum($('#upd_apu_item_total').val()); 
    aux[2] = $('#upd_apu_item_amon').val(); 
    aux[3] = ($("#upd_apu_item_perf").val() == "" ? 0 : $("#upd_apu_item_perf").val())
    aux[4] = $('#upd_apu_item_content').val();
    return aux;
}

function getUpdGangData() {
    var aux = [];

    aux[0] = $('#upd_apu_item_id').val();
    aux[1] = translateNum($('#upd_apu_item_total').val()); 
    aux[2] = $('#upd_apu_item_amon').val(); 
    aux[3] = $('#upd_apu_item_perf').val(); 
    aux[4] = $('#upd_apu_item_content').val();
    aux[5] = ($("#upd_apu_item_ot").val() == "" ? 0 : $("#upd_apu_item_ot").val()) +
                ":" +
                ($("#upd_apu_item_o").val() == "" ? 0 : $("#upd_apu_item_o").val()) +
                ":" +
                ($("#upd_apu_item_a").val() == "" ? 0 : $("#upd_apu_item_a").val());
    aux[6] = [$("#upd_apu_ot_id_salary").val(), $("#upd_apu_o_id_salary").val(), $("#upd_apu_a_id_salary").val()]
    aux[7] = [$("#upd_apu_ot_quantity").val(), $("#upd_apu_o_quantity").val(), $("#upd_apu_a_quantity").val()]
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
    $('#updItemModal').modal('hide');
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
    $("#apu_ot_quantity").prop( "disabled", false );
    $("#apu_o_quantity").prop( "disabled", false );
    $("#apu_a_quantity").prop( "disabled", false );
    $("#apu_ot_quantity").val('');
    $("#apu_o_quantity").val('');
    $("#apu_a_quantity").val('');
    $("#apu_item_ot").val('');
    $("#apu_item_o").val('');
    $("#apu_item_a").val('');
    $('#apu_item_perf').prop( "disabled", true );
    $('#add_item_gang_alert').prop('hidden', true);
    $('#add_salary_gang_alert').prop('hidden', true);

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

function updResetModal(cont) {
    $('#upd_apu_item_id').val('');
    $('#upd_apu_item_content').val('');
    $('#upd_apu_item_cost').val('');
    $('#upd_apu_item_name').val('');
    $('#upd_apu_item_amon').val('');
    $('#upd_apu_item_total').val('');
    $('#upd_apu_item_perf').val('');
    $('#upd_apu_item_perf').prop( "disabled", true );
    $('#upd_item_gang_alert').prop('hidden', true);
    $('#upd_salary_gang_alert').prop('hidden', true);

    if (cont == 3) {
        $('#upd_item_perf').prop('hidden', false); 
    }else{
        $('#upd_item_perf').prop('hidden', true); 
    }
    
    $('#upd_btn_item').prop('hidden', false);
    $('#upd_btn_gang').prop('hidden', true);
    $('#upd_item_gang').prop('hidden', true);
}

function updGangResetModal() {

    $('#upd_apu_item_id').val('');
    $('#upd_apu_item_content').val('');
    $('#upd_apu_item_cost').val('');
    $('#upd_apu_item_name').val('');
    $('#upd_apu_item_amon').val('');
    $('#upd_apu_item_total').val('');
    $('#upd_apu_item_perf').val('');

    $("#upd_apu_ot_quantity").val('');
    $("#upd_apu_o_quantity").val('');
    $("#upd_apu_a_quantity").val('');
    $("#upd_apu_ot_quantity").prop( "disabled", false );
    $("#upd_apu_o_quantity").prop( "disabled", false );
    $("#upd_apu_a_quantity").prop( "disabled", false );
    
    $('#upd_apu_item_perf').prop( "disabled", true );
    $('#upd_item_gang_alert').prop('hidden', true);
    $('#upd_salary_gang_alert').prop('hidden', true);

    $("#upd_apu_ot_mult_salary").val('');
    $("#upd_apu_o_mult_salary").val('');
    $("#upd_apu_a_mult_salary").val('');
    $("#upd_apu_ot_id_salary").val('');
    $("#upd_apu_o_id_salary").val('');
    $("#upd_apu_a_id_salary").val('');
    $('#upd_apu_ot_salary').val('');
    $('#upd_apu_o_salary').val('');
    $('#upd_apu_a_salary').val('');
    
    $("#upd_apu_item_ot").val('');
    $("#upd_apu_item_o").val('');
    $("#upd_apu_item_a").val('');
    
    $('#upd_item_perf').prop('hidden', false); 
    $('#upd_item_gang').prop('hidden', false);
    $('#upd_btn_item').prop('hidden', true);
    $('#upd_btn_gang').prop('hidden', false);
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
    $('#upd_apu_item_perf').val('')
    $('#upd_apu_item_perf').prop('disabled', false)
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
    if (curr_modal == 0) {
        $('#apu_'+type+'_mult_salary').val(mult);
        $('#apu_'+type+'_id_salary').val(id);
        translateTxt($('#apu_'+type+'_salary'), sal);
    }else{
        $('#upd_apu_'+type+'_mult_salary').val(mult);
        $('#upd_apu_'+type+'_id_salary').val(id);
        translateTxt($('#upd_apu_'+type+'_salary'), sal)
    }
       
    $('#selectSalaryModal').modal('hide');
}

function checkAddition() {
    var otq = $("#apu_ot_quantity").val() == '' ? 0 : parseFloat($("#apu_ot_quantity").val())
    var oq = $("#apu_o_quantity").val() == '' ? 0 : parseFloat($("#apu_o_quantity").val())
    var aq = $("#apu_a_quantity").val() == '' ? 0 : parseFloat($("#apu_a_quantity").val())
    
    var aux_q = otq + oq + aq;
    if (Math.round(aux_q) != 100) {
        $('#add_item_gang_alert').prop('hidden', false);
        translateTxt($('#upd_apu_item_cost'), 0);
        calculateTotalCost();
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

    let aux = (otq/100 * ots) + (oq/100 * os) + (aq/100 * as);
    translateTxt($('#apu_item_cost'), aux)
    calculateTotalCost();
}

function calculateTotalCost() {
    let perf =  $('#apu_item_perf').val();
    let val = translateNum($('#apu_item_cost').val());
    if (perf != '') {
        let aux = ($('#apu_item_amon').val() * val) /perf;
        translateTxt($('#apu_item_total'), aux)
    }else{
        let aux = $('#apu_item_amon').val() * val;
        translateTxt($('#apu_item_total'), aux)
    }
}

function checkUpdAddition() {
    var otq = $("#upd_apu_ot_quantity").val() == '' ? 0 : parseFloat($("#upd_apu_ot_quantity").val())
    var oq = $("#upd_apu_o_quantity").val() == '' ? 0 : parseFloat($("#upd_apu_o_quantity").val())
    var aq = $("#upd_apu_a_quantity").val() == '' ? 0 : parseFloat($("#upd_apu_a_quantity").val())
    
    var aux_q = otq + oq + aq;
    if (Math.round(aux_q) != 100) {
        $('#upd_item_gang_alert').prop('hidden', false);
        translateTxt($('#upd_apu_item_cost'), 0);
        calculateTotalUpdCost();
    } else {
        $('#upd_item_gang_alert').prop('hidden', true);
        calculateTotalUpdGang(otq, oq, aq);
    }

}

function calculateTotalUpdGang(otq, oq, aq) {
    var ots = translateNum($('#upd_apu_ot_salary').val());
    var os = translateNum($('#upd_apu_o_salary').val());
    var as = translateNum($('#upd_apu_a_salary').val());

    if ((ots == 0 && otq != 0) || (os == 0 && oq != 0) || (as == 0 && aq != 0) ) {
        $('#upd_salary_gang_alert').prop('hidden', false);
    }else{
        $('#upd_salary_gang_alert').prop('hidden', true);
    }
    let aux = (otq/100 * ots) + (oq/100 * os) + (aq/100 * as);
    translateTxt($('#upd_apu_item_cost'), aux)
    calculateTotalUpdCost();
}

function calculateTotalUpdCost() {
    let perf =  $('#upd_apu_item_perf').val();
    let val = translateNum($('#upd_apu_item_cost').val());
    if (perf != '') {
        let aux = ($('#upd_apu_item_amon').val() * val) /perf;
        translateTxt($('#upd_apu_item_total'), aux)
    }else{
        let aux = $('#upd_apu_item_amon').val() * val;
        translateTxt($('#upd_apu_item_total'), aux)
    }
}