const select_apu_content = ['Materiales y equipo', 'Cuadrilla', 'Maquinaria', 'Transporte'];
const item_type = ['item_material', 'item_gang', 'item_machinery', 'item_transport'];
var curr_modal = 0;
var performance = false;

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

$('#apu_item_amon').on({
    'change': function () {
        calculateTotalCost();
}, 'keyup': function () {
        calculateTotalCost();
}})

$('#apu_item_perf').on({
    'change': function () {
        calculateTotalCost();
}, 'keyup': function () {
        calculateTotalCost();
}})

$('#upd_apu_item_amon').on({
    'change': function () {
        calculateTotalUpdCost();
}, 'keyup': function () {
        calculateTotalUpdCost();
}})

$('#upd_apu_item_perf').on({
    'change': function () {
        calculateTotalUpdCost();
}, 'keyup': function () {
        calculateTotalUpdCost();
}})

$('#apu_ot_mult_salary').on({
    'change': function () {
        checkNumber(0);
}})

$('#apu_o_mult_salary').on({
    'change': function () {
        checkNumber(1);
}})

$('#apu_a_mult_salary').on({
    'change': function () {
        checkNumber(2);
}})

$('#apu_item_ot').on({
    'change': function () {
        checkNumber(0);
}, 'keyup': function () {
        checkNumber(0);
        resetPerf();
}})

$('#apu_item_o').on({
    'change': function () {
        checkNumber(1);
}, 'keyup': function () {
        checkNumber(1);
        resetPerf()
}})

$('#apu_item_a').on({
    'change': function () {
        checkNumber(2);
}, 'keyup': function () {
        checkNumber(2);
        resetPerf()
}})

$('#upd_apu_ot_mult_salary').on({
    'change': function () {
        checkUpdNumber(0);
}})

$('#upd_apu_o_mult_salary').on({
    'change': function () {
        checkUpdNumber(1);
}})

$('#upd_apu_a_mult_salary').on({
    'change': function () {
        checkUpdNumber(2);
}})

$('#upd_apu_item_ot').on({
    'change': function () {
        checkUpdNumber(0);
}, 'keyup': function () {
        checkUpdNumber(0)
        resetPerf()
}})

$('#upd_apu_item_o').on({
    'change': function () {
        checkUpdNumber(1);
}, 'keyup': function () {
        checkUpdNumber(1)
        resetPerf()
}})

$('#upd_apu_item_a').on({
    'change': function () {
        checkUpdNumber(2);
}, 'keyup': function () {
        checkUpdNumber(2)
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

async function getItem(id) {
    let response = await fetch(host + item + "/" + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      });
      var json = await response.json();
      return json[0];
}

async function initGang(id) {
    let response = await fetch(host + apu + "/gang/" + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      });
      var json = await response.json();
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
        $('#upd_item_gang_alert').prop('hidden', true);

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
    aux[7] = [translateNum($("#apu_ot_quantity").val()), translateNum($("#apu_o_quantity").val()), translateNum($("#apu_a_quantity").val())]
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
    aux[7] = [translateNum($("#upd_apu_ot_quantity").val()), translateNum($("#upd_apu_o_quantity").val()), translateNum($("#upd_apu_a_quantity").val())]
    return aux;
}

async function selectItem(id) {
    const item_fetch = await getItem(id);
    $('#apu_item_id').val(item_fetch.ID);
    translateTxt($('#apu_item_cost'), item_fetch.COST);
    $('#apu_item_name').val(item_fetch.NAME);
    if (item_fetch.PERFORMANCE != 0) {
        $('#apu_item_perf').val(item_fetch.PERFORMANCE);
    }
    if (item_fetch.ID_CONTENT == 2) {
        var aux = item_fetch.DESCRIPTION.split(':');
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
        performance = true;
        $('#add_item_perf').prop('hidden', false); 
        if(cont == 2){
            $('#add_item_gang').prop('hidden', false);
            $('#btn_item').prop('hidden', true);
            $('#btn_gang').prop('hidden', false);
            $('#div-quantity').prop('hidden', true);
            $('#apu_item_amon').val('1');
        }else{
            $('#add_item_gang').prop('hidden', true);
            $('#div-quantity').prop('hidden', false);
        } 
    }else{
        performance = false;
        $('#div-quantity').prop('hidden', false);
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
    $('#upd-div-quantity').prop('hidden', false);
    $('#upd_apu_item_amon').val('');
    $('#upd_apu_item_total').val('');
    $('#upd_apu_item_perf').val('');
    $('#upd_apu_item_perf').prop( "disabled", true );
    $('#upd_salary_gang_alert').prop('hidden', true);

    if (cont == 3) {
        performance = true;
        $('#upd_item_perf').prop('hidden', false); 
    }else{
        performance = false;
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
    $('#upd-div-quantity').prop('hidden', true);
    $('#apu_item_amon').val('1');
    $('#upd_apu_item_total').val('');
    $('#upd_apu_item_perf').val('');

    $("#upd_apu_ot_quantity").val('');
    $("#upd_apu_o_quantity").val('');
    $("#upd_apu_a_quantity").val('');
    $("#upd_apu_ot_quantity").prop( "disabled", false );
    $("#upd_apu_o_quantity").prop( "disabled", false );
    $("#upd_apu_a_quantity").prop( "disabled", false );
    
    $('#upd_apu_item_perf').prop( "disabled", true );
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

    performance = true;
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
    $('#apu_item_perf').val('').trigger('change');
    $('#apu_item_perf').prop('disabled', false);
    $('#upd_apu_item_perf').val('').trigger('change');
    $('#upd_apu_item_perf').prop('disabled', false);
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
        translateTxt($('#apu_'+type+'_salary'), sal);
        $('#apu_'+type+'_id_salary').val(id);
        $('#apu_'+type+'_mult_salary').val(mult).trigger('change');
    }else{
        translateTxt($('#upd_apu_'+type+'_salary'), sal)
        $('#upd_apu_'+type+'_id_salary').val(id);
        $('#upd_apu_'+type+'_mult_salary').val(mult).trigger('change');
    }
       
    $('#selectSalaryModal').modal('hide');
}

function checkNumber(tipo){
    let worker_type = ['ot', 'o', 'a'];
    if ($('#apu_item_'+ worker_type[tipo]).val() == 0 || $('#apu_item_'+ worker_type[tipo]).val() == '') {
        $("#apu_" + worker_type[tipo] + "_id_salary").val('');
        $("#apu_" + worker_type[tipo] + "_quantity").val(0);
    }

    var aux1 = $("#apu_item_" + worker_type[tipo]).val() == '' ? 0 : parseFloat($("#apu_item_" + worker_type[tipo]).val());
    var aux2 = $("#apu_" + worker_type[tipo] + "_salary").val() == '' ? 0 : translateNum($('#apu_' + worker_type[tipo] + '_salary').val());
    let aux = aux1 * aux2;
    translateTxt($('#apu_' + worker_type[tipo] + '_quantity'), aux);
    calculateTotalGang();
}

function calculateTotalGang() {
    var otq = parseFloat(translateNum($('#apu_ot_quantity').val()));
    var oq = parseFloat(translateNum($('#apu_o_quantity').val()));
    var aq = parseFloat(translateNum($('#apu_a_quantity').val()));

    let aux = otq +  oq + aq;
    translateTxt($('#apu_item_cost'), aux)
    calculateTotalCost();
}

function calculateTotalCost() {
    let perf =  $('#apu_item_perf').val() == ''? 0 : $('#apu_item_perf').val();
    let val = translateNum($('#apu_item_cost').val());
    if (performance) {
        if (perf != 0 && perf != '') {
            $('#add_item_gang_alert').prop('hidden', true);
            let aux = ($('#apu_item_amon').val() * val) /perf;
            translateTxt($('#apu_item_total'), aux)
        }else{ 
            $('#add_item_gang_alert').prop('hidden', false);
            translateTxt($('#apu_item_total'), 0);
        }
    }else{
        let aux = $('#apu_item_amon').val() * val;
        translateTxt($('#apu_item_total'), aux)
    }
}

function checkUpdNumber(tipo){
    let worker_type = ['ot', 'o', 'a'];
    if ($('#upd_apu_item_'+ worker_type[tipo]).val() == 0 || $('#upd_apu_item_'+ worker_type[tipo]).val() == '') {
        $("#upd_apu_" + worker_type[tipo] + "_id_salary").val('');
        $("#upd_apu_" + worker_type[tipo] + "_quantity").val(0);
    }

    var aux1 = $("#upd_apu_item_" + worker_type[tipo]).val() == '' ? 0 : parseFloat($("#upd_apu_item_" + worker_type[tipo]).val());
    var aux2 = $("#upd_apu_" + worker_type[tipo] + "_salary").val() == '' ? 0 : translateNum($('#upd_apu_' + worker_type[tipo] + '_salary').val());
    let aux = aux1 * aux2;
    translateTxt($('#upd_apu_' + worker_type[tipo] + '_quantity'), aux);
    calculateTotalUpdGang();
}

function calculateTotalUpdGang() {
    var otq = parseFloat(translateNum($('#upd_apu_ot_quantity').val()));
    var oq = parseFloat(translateNum($('#upd_apu_o_quantity').val()));
    var aq = parseFloat(translateNum($('#upd_apu_a_quantity').val()));

    let aux = otq +  oq + aq;
    translateTxt($('#upd_apu_item_cost'), aux)
    calculateTotalUpdCost();
}

function calculateTotalUpdCost() {
    let perf =  $('#upd_apu_item_perf').val() == ''? 0 : $('#upd_apu_item_perf').val();
    let val = translateNum($('#upd_apu_item_cost').val());
    if (performance) {
        if (perf != 0 && perf != '') {
            $('#upd_item_gang_alert').prop('hidden', true);
            let aux = ($('#upd_apu_item_amon').val() * val) /perf;
            translateTxt($('#upd_apu_item_total'), aux)
        } else {
            $('#upd_item_gang_alert').prop('hidden', false);
            translateTxt($('#upd_apu_item_total'), 0)
        }
    }else{
        let aux = $('#upd_apu_item_amon').val() * val;
        translateTxt($('#upd_apu_item_total'), aux)
    }
}