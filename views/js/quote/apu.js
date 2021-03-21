const select_apu_content = ['Materiales y equipo', 'Cuadrilla', 'Maquinaria', 'Transporte'];

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

$("#selectItemModal").on("shown.bs.modal", function () {
    $('#addItemModal').modal('hide');
});

$("#selectItemModal").on("hidden.bs.modal", function () {
    $('#addItemModal').modal('show');
});

$("#selectItemModal").on("hidden.bs.modal", function () {
    $('#addItemModal').modal('show');
});

$('#apu_item_amon').on('keyup', function () {
    let aux = $('#apu_item_amon').val() * $('#apu_item_cost').val();
    translateTxt($('#apu_item_total'), aux)
})

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
    
    var json = await response.json();
    
    manageModals(json);
}

function getAddItemData() {
    var aux = [];
    aux[0] = $('#apu_item_amon').val(); 
    aux[1] = translateNum($('#apu_item_total').val()); 
    aux[2] = $('#apu_item_id').val();
    aux[3] = $('#apu_item_content').val();
    return aux;
}

function selectItem(id, name, cost) {
    $('#apu_item_id').val(id);
    $('#apu_item_cost').val(cost);
    $('#apu_item_name').val(name);
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

    var aux = [$('#item_material'), $('#item_gang'), $('#item_machinery'), $('#item_transport')];
    aux[cont-1].prop('hidden', false);

    aux.splice(cont-1, 1);
    aux.forEach(element => {
        element.prop('hidden', true);
    }); 
}