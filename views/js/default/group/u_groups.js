var char_type = ['char_chp_grp', 'char_act_grp'];
var filter_chap = 0;

$(function() {
    chargeFilters();
});

$("#char_type").on('change', function() {
    changeModal();
});

$("#select_filter_chp_grp").on('change', function() {
    filter_chap = $("#select_filter_chp_grp").val();
    applyfilter();
});

function changeModal() {
    var aux = $("#char_type").val();
    showTable(aux);
    switch(aux){
        case '1':
            $('#add_type').val("Grupo de procesos");
            $('#add_pg').prop('hidden', true);
            $('#add_pref').prop('hidden', false);
            filter_chap = 0;
            applyfilter();
            $('.filters').prop('hidden',true);
            $('#filter-section').prop('hidden', true);
            $('#select_filter_chp_grp').val(0).trigger('change');
            break;
        case '2':
            $('#add_type').val("Grupo de actividades");
            $('#add_pg').prop('hidden', false);
            $('#add_pref').prop('hidden', false);
            $('#filter-section').prop('hidden', false);
            $('#select_filter_chp_grp').val(0).trigger('change');
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

async function chargeFilters(){
    var groups = await getGroups();
    for(var i=0; i< groups.cg.length;i++){
      jQuery('<option/>', {
            value: groups.cg[i].ID,
            html: groups.cg[i].PREFIX + " - " + groups.cg[i].NAME
            }).appendTo('#select_filter_chp_grp');
    }
}

async function getGroups(){
    let response = await fetch(host + group + "/all/fill", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    });
    var json = await response.json();
    return json;
}

function showfilters() {
    if ($('.filters').is(":hidden")) {
      $('.filters').prop('hidden',false);
    }else{
      $('.filters').prop('hidden',true);
    }
}

async function getGroups(){
    let response = await fetch(host + group + "/all/fill", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    });
    var json = await response.json();
    return json;
}

function applyfilter() {
    if (filter_chap != 0) {
        $("table tbody").each(function() {
          $(this).find("tr").each(function() {
            if ($(this).attr('chp_grp') != filter_chap) {
              $(this).hide();
            }else{
              $(this).show();
            }
          });
        });
    }else{
      $("table tbody").each(function() {
        $(this).find("tr").each(function() {
          $(this).show();
        });
      });
    }
}