const host = "http://127.0.0.1:1337/";
const group = "group";
var edit_bool = false;
var edit_obj = ['', '', '', ''];

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

async function delGroup(num, id) {
    var char = getUrl(num);
    let response = await fetch(host + group + char + id, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }, body: JSON.stringify({
                  id: id
              })
        });
      
      var json = await response.json();
    
      $('.modal-title').html(json.name);
      $('.modal-body').html(json.message);
      $("#msgModal").modal();
}

async function getGroup(num, id) {
    var char = getUrl(num);
    let response = await fetch(host + group + char + id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        }
      });
      var json = await response.json();
      return json[0];
}

async function updGroup(num, id) {
    var group = getGroup(num, id);
}

function initGroup(num, id) {
    var type = ['char_chp_grp', 'char_act_grp'];
    var num_aux = 0;
    if (!edit_bool) {
        edit_bool = true;
        var first = parseInt(num);
        $( "#" + type[num-1] + ' #' + id ).addClass('editing');
        $( "#" + type[num-1] + ' #' + id ).find('td').each (function(ind) {
            if (ind >= first) {
                if (ind < first+2) {
                    edit_obj[num_aux] = $(this).text();
                    num_aux++;
                    $( this ).html('<input class="form-control" type="text" value=\"'+ $(this).text() + '\">');
                }else{    
                    $( this ).find('.col').each(function (ind) {
                        $( this ).html(returnButton(ind, num, id));
                    });
                }
            }else if (first == 2 && ind == 1) {
                edit_obj[2] = $(this).text();
                edit_obj[3] = $( this ).attr('cg_id');
                var select = '<select id="char_pg_2" class="custom-select selectBuscar">' + $('#char_pg').html() + '</select>';
                $( this ).html(select);
                $('.selectBuscar').select2({theme: 'bootstrap4'});
                $('#char_pg_2').val($( this ).attr('cg_id')).trigger('change');
            }
        });
    }else{
        canEditGroup();
    }
}

function canEditGroup() {
    $( ".editing" );
}

function returnButton(index, num, id) {
    var buttons = ['btn-success','btn-danger'];
    var icons = ['fa-check', 'fa-times'];
    var actions = ['updGroup('+ num + ',' + id +')', 'canEditGroup('+ num + ',' + id +')']

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