const host = "http://127.0.0.1:1337/";
const group = "group";
var edit_bool = false;
var edit_obj = [];
var char_type = ['char_chp_grp', 'char_act_grp'];

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
    var char = getUrl(aux[0]);
    
    let response = await fetch(host + group + char, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
                    name: aux[1], 
                    pref: aux[2], 
                    idchgr: aux[3]           
                })
    });
    
    var json = await response.json();
    
    $('#addModal').modal('hide');
    $('#msgModal .modal-title').html(json.name);
    $('#msgModal .modal-body').html(json.message);
    $("#msgModal").modal();
}

async function delGroup(num, id) {
    var char = getUrl(num);

    let response = await fetch(host + group + char + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }});
      
      var json = await response.json();
    
      $('.modal-title').html(json.name);
      $('.modal-body').html(json.message);
      $("#msgModal").modal();
}

async function updGroup(num, id) {
    var aux = getUdpData();
    var char = getUrl(num);
    console.log("as: " + aux);

    let response = await fetch(host + group + char + id, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
                    name: aux[0], 
                    pref: aux[1], 
                    idchgr: aux[2]          
                })
    });
    
    var json = await response.json();
    
    $('#addModal').modal('hide');
    $('#msgModal .modal-title').html(json.name);
    $('#msgModal .modal-body').html(json.message);
    $("#msgModal").modal();
}

function initGroup(num, id) {
    var num_aux = 0;
    if (!edit_bool) {
        edit_bool = true;
        var first = parseInt(num);
        $( "#" + char_type[num-1] + ' #' + id ).addClass('editing');
        $( "#" + char_type[num-1] + ' #' + id ).attr('type', char_type[num-1]);
        $( "#" + char_type[num-1] + ' #' + id ).find('td').each (function(ind) {
            if (ind >= num) {
                if (ind < first+2) {
                    edit_obj[num_aux] = $(this).text();
                    num_aux++;
                    $( this ).html('<input id="upd_data_' + num_aux + '" class="form-control" type="text" value=\"'+ $(this).text() + '\">');
                }else{    
                    edit_obj[3] = $(this).html();
                    $( this ).find('.col').each(function (ind) {
                        $( this ).html(returnButton(ind, num, id));
                    });
                }
            }else if (first == 2 && ind == 1) {
                edit_obj[2] = $(this).text();
                var select = '<select id="char_pg_2" class="custom-select selectBuscar">' + $('#char_pg').html() + '</select>';
                $( this ).html(select);
                $('.selectBuscar').select2({theme: 'bootstrap4'});
                $('#char_pg_2').val($( this ).attr('cg_id')).trigger('change');
            }
        });
    }else{
        canEditGroup();
        initGroup(num, id);
    }
}

function canEditGroup() {
    edit_bool = false;
    var num_aux = 0;
    var row = $(".editing");
    row.removeClass('editing');
    var first = char_type.indexOf(row.closest('div').attr('id')) + 1;

    row.find('td').each(function (ind) {
        if (ind >= first) {
            if (ind < first+2) {
                $( this ).html(edit_obj[num_aux]);
                num_aux++;
            }else{
                $( this ).html(edit_obj[3]);
            }
        }else if (first == 2 && ind == 1) {
            $( this ).html(edit_obj[2]);
        }
    });
    edit_obj = [];
}

function returnButton(index, num, id) {
    var buttons = ['btn-success','btn-danger'];
    var icons = ['fa-check', 'fa-times'];
    var actions = ['updGroup(\''+ num + '\' , \'' + id +'\')', 'canEditGroup()']

    var button = '<button class="w-100 btn '+ buttons[index] + '" onclick="'+ actions[index] + '">' +
                    '<i class="fa ' + icons[index] + '" aria-hidden="true"></i>'+
                    '</button>';
    return button;               
}

function getAddData() {
    var type = $("#char_type").val();
    var name = $("#char_name").val();
    var prefix = $("#char_pref").val();
    var pg = $("#char_pg").val();
    
    return [type, name, prefix, pg];
}


function getUdpData() {
    var name = $("#upd_data_2").val();
    var prefix = $("#upd_data_1").val();
    var pg = $("#char_pg_2").val();

    return [name, prefix, pg];
}

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

function getUrl(num) {
    switch(num){
        case '1':
            return "/chp_grp/";
        case '2':
            return "/act_grp/";
        default:
            return "";
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