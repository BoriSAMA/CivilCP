const select_apu_content = ['Materiales y equipo', 'Cuadrilla', 'Maquinaria', 'Transporte']

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

async function regitem(){
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

function manageModals(json) {
    $('#addSectionModal').modal('hide');
    $('#msgModal .modal-title').html(json.name);
    $('#msgModal .modal-body').html(json.message);
    $("#msgModal").modal();
}