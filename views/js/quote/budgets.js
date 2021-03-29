var upd_aux;

$('#msgModal').on('hidden.bs.modal', function () {
    if ($('#msgModal .modal-title').html() == "Exito") {
        window.location = '/index/budgets';
    }
})

$('#upd_budget_admn').on('keyup', function() {
    let aux = (parseFloat($('#upd_budget_admn').val())/100) * upd_aux.TOTAL_DIRECT;
    $("#upd_budget_admn_val").val(aux).trigger('blur');
    calculateTotal();
});

$('#upd_budget_unex').on('keyup', function() {
    let aux = (parseFloat($('#upd_budget_unex').val())/100) * upd_aux.TOTAL_DIRECT;
    $("#upd_budget_unex_val").val(aux).trigger('blur');
    calculateTotal();
});

$('#upd_budget_util').on('keyup', function() {
    let aux = (parseFloat($('#upd_budget_util').val())/100) * upd_aux.TOTAL_DIRECT;
    $("#upd_budget_util_val").val(aux).trigger('blur');
    calculateTotal();
});

$('#upd_budget_iva').on('keyup', function() {
    let aux = (parseFloat($('#upd_budget_iva').val())/100) * upd_aux.TOTAL_DIRECT;
    $("#upd_budget_iva_val").val(aux).trigger('blur');
    calculateTotal();
});

async function regQuote(){
    var aux = getAddData();
    
    let response = await fetch(host + budgets, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
                    name: aux[0],
                    padm: aux[1],
                    pune: aux[2],
                    puti: aux[3],
                    piva: aux[4]        
                })
    });
    
    var json = await response.json();
    
    manageModals(json);
}

async function delQuote(id) {

    let response = await fetch(host + budgets + "/" + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }});
      
      var json = await response.json();
    
      manageModals(json);
}

async function updQuote() {
    var aux = getUpdData();
    var id = upd_aux.ID;   

    let response = await fetch(host + budgets + "/" + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
                        name: aux[0],
                        tdir: aux[1],
                        padm: aux[2],
                        admi: aux[3],
                        pune: aux[4],
                        unex: aux[5],
                        puti: aux[6],
                        util: aux[7],
                        piva: aux[8],
                        iva: aux[9],
                        total: aux[10]         
                })
    });
    
    var json = await response.json();
    recalculate(id)
    manageModals(json);
}

async function initQuote(id, ids) {
    let response = await fetch(host + budgets + "/" + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }
    });
    var json = await response.json();
    upd_aux = json[0];
    initQuoteEdit(ids);
}

function initQuoteEdit(ids) {
    $("#btn_budget_delete").on("click", function(){
        delQuote(upd_aux.ID)
    });
    
    $("#btn_go_budget").attr("href", "index/budget?bid=" + upd_aux.ID);
    $("#btn_go_gantt").attr("href", "index/schedule?sid=" + ids);

    $("#upd_budget_id").val(upd_aux.ID);
    $("#upd_budget_name").val(upd_aux.NAME);
    $("#upd_budget_tdir").val(upd_aux.TOTAL_DIRECT).trigger('blur');
    $("#upd_budget_admn").val(upd_aux.PRC_ADMIN);
    $("#upd_budget_admn_val").val(upd_aux.ADMIN).trigger('blur');
    $("#upd_budget_unex").val(upd_aux.PRC_UNEXPECTED);
    $("#upd_budget_unex_val").val(upd_aux.UNEXPECTED).trigger('blur');
    $("#upd_budget_util").val(upd_aux.PRC_UTILITY);
    $("#upd_budget_util_val").val(upd_aux.UTILITY).trigger('blur');
    $("#upd_budget_iva").val(upd_aux.PRC_IVA);
    $("#upd_budget_iva_val").val(upd_aux.IVA).trigger('blur');
    $("#upd_budget_total").val(upd_aux.TOTAL).trigger('blur');
}

function cancelUpd() {
    $("#upd_budget_name").val(upd_aux.NAME);   
    $("#upd_budget_admn").val(upd_aux.PRC_ADMIN);
    $("#upd_budget_unex").val(upd_aux.PRC_UNEXPECTED);
    $("#upd_budget_util").val(upd_aux.PRC_UTILITY);
    $("#upd_budget_iva").val(upd_aux.PRC_IVA); 
    $("#upd_budget_name").prop( "disabled", true );  
    $("#upd_budget_admn").prop( "disabled", true );
    $("#upd_budget_unex").prop( "disabled", true );
    $("#upd_budget_util").prop( "disabled", true );
    $("#upd_budget_iva").prop( "disabled", true );
    $("#button1").html(
        `<button class="btn btn-primary btn-block"  type="button" onclick="enableUpd()">
            Actualizar porcentajes
        </button>`
    );
    $("#button2").prop('hidden',true);
}

function enableUpd() {
    $("#upd_budget_name").prop( "disabled", false );  
    $("#upd_budget_admn").prop( "disabled", false );
    $("#upd_budget_unex").prop( "disabled", false );
    $("#upd_budget_util").prop( "disabled", false );
    $("#upd_budget_iva").prop( "disabled", false );  
    $("#button1").html(
        `<button class="btn btn-success btn-block"  type="button" onclick="updQuote()">
            Aceptar
        </button>`
    );
    $("#button2").prop('hidden',false);
}

function getUpdData() {
    var aux = [];
    aux[0] = $("#upd_budget_name").val();   
    aux[1] = translateNum($("#upd_budget_tdir").val());
    aux[2] = $("#upd_budget_admn").val();
    aux[3] = translateNum($("#upd_budget_admn_val").val());
    aux[4] = $("#upd_budget_unex").val();
    aux[5] = translateNum($("#upd_budget_unex_val").val());
    aux[6] = $("#upd_budget_util").val();
    aux[7] = translateNum($("#upd_budget_util_val").val());
    aux[8] = $("#upd_budget_iva").val();
    aux[9] = translateNum($("#upd_budget_iva_val").val());  
    aux[10] = translateNum($("#upd_budget_total").val());    
    return aux;
}

function getAddData() {
    var aux = [];
    aux[0] = $("#budget_name").val();
    aux[1] = $("#budget_admn").val();
    aux[2] = $("#budget_unex").val();
    aux[3] = $("#budget_util").val();
    aux[4] = $("#budget_iva").val();
    return aux;
}

function calculateTotal() {
    let aux =   parseFloat(translateNum($("#upd_budget_tdir").val())) + 
                parseFloat(translateNum($("#upd_budget_admn_val").val())) +
                parseFloat(translateNum($("#upd_budget_unex_val").val())) + 
                parseFloat(translateNum($("#upd_budget_util_val").val())) +
                parseFloat(translateNum($("#upd_budget_iva_val").val()));

    translateTxt($("#upd_budget_total"), aux);
}

function manageModals(json) {
    $('#addModal').modal('hide');
    $('#updModal').modal('hide');
    $('#detailModal').modal('hide');
    $('#msgModal .modal-title').html(json.name);
    $('#msgModal .modal-body').html(json.message);
    $("#msgModal").modal();
}

function openUpdModal(){
    $('#updModal').modal('show');
    $('#detailModal').modal('hide');
}

async function recalculate(b_id){
    await fetch(host + apu + "/calculate", {
        method: 'PATCH',
        headers: {
        'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
            bid: b_id
        })
    });
}