const group = "group";

console.log(host);

$("#char_type").on('change', function() {
    changeModal();
});


$('#msgModal').on('hidden.bs.modal', function () {
    window.location = '/index/char';
  })
  
  $('#addModal').on('hidden.bs.modal', function () {
    $("#char_name").val("");
    $("#char_pref").val("");
  });

async function regGroup(){
    var aux = getAddData();
    var char = "";
    switch(aux[0]){
        case '1':
            char = "/chp_grp/";
            break;
        case '2':
            char = "/act_grp/";
            break;
        case '3':
            char = "/chapter/";
            break;
        case '4':
            char = "/activity/";
            break;
        default:
            break;
    }

    let response = await fetch(host + group + char, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
                    name: aux[1], 
                    pref: aux[2], 
                    idchgr: aux[3], 
                    idacgr: aux[4]             
                })
    });
    
    var json = await response.json();
    
    $('#addModal').modal('hide');
    $('#msgModal .modal-title').html(json.name);
    $('#msgModal .modal-body').html(json.message);
    $("#msgModal").modal();
}

function getAddData() {
    var aux = $("#char_type").val();
    var name = $("#char_name").val();
    var prefix = $("#char_pref").val();
    var ag = $("#char_ag").val();
    var pg = $("#char_pg").val();
    
    return [aux, name, prefix, pg, ag];
}

function changeModal() {
    var aux = $("#char_type").val();

    switch(aux){
        case '1':
            $('#add_pg').prop('hidden', true);
            $('#add_ag').prop('hidden', true);
            $('#add_pref').prop('hidden', false);
            break;
        case '2':
            $('#add_pg').prop('hidden', false);
            $('#add_ag').prop('hidden', true);
            $('#add_pref').prop('hidden', false);
            break;
        case '3':
            $('#add_pg').prop('hidden', false);
            $('#add_ag').prop('hidden', true);
            $('#add_pref').prop('hidden', true);
            break;
        case '4':
            $('#add_pg').prop('hidden', true);
            $('#add_ag').prop('hidden', false);
            $('#add_pref').prop('hidden', true);
            break;    
        default:
            break;
    }
}