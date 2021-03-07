var char_type = ['char_chp_grp', 'char_act_grp'];

$("#char_type").on('change', function() {
    changeModal();
});

function changeModal() {
    var aux = $("#char_type").val();
    showTable(aux);
    switch(aux){
        case '1':
            $('#add_type').val("Grupo de procesos");
            $('#add_pg').prop('hidden', false);
            $('#add_pg').prop('hidden', true);
            $('#add_pref').prop('hidden', false);
            break;
        case '2':
            $('#add_type').val("Grupo de actividades");
            $('#add_pg').prop('hidden', false);
            $('#add_pref').prop('hidden', false);
            break;
        default:
            break;
    }
}

function showTable(num){
    var aux = [$('#char_chp_grp'), $('#char_act_grp')];
    aux[num-1].prop('hidden', false);
    aux.splice(num-1, 1);
    aux.forEach(element => {
        element.prop('hidden', true);
    }); 
}