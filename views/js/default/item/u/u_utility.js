var filter_chap = 0;
var filter_act = 0;

$(function() {
    chargeFilters();
});

$("#select_filter_chp_grp").on('change', function() {
    filter_chap = $("#select_filter_chp_grp").val();
    filterByChapter();
});

$("#select_filter_act_grp_2").on('change', function() {
    filter_act = $("#select_filter_act_grp_2").val();
    applyfilter()
});

async function regItem(){
  var aux = getAddData();
  
  let response = await fetch(host + item, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json;charset=utf-8'
      }, body: JSON.stringify({
                  name: aux[0],
                  mesu: aux[1],
                  perf: aux[2],
                  desc: aux[3],
                  cost: aux[4],
                  actg: aux[5],
                  cont: aux[6]      
              })
  });
  
  var json = await response.json();
  
  $('#addModal').modal('hide');
  $('#msgModal .modal-title').html(json.name);
  $('#msgModal .modal-body').html(json.message);
  $("#msgModal").modal();
}

async function delItem(id) {

  let response = await fetch(host + item + "/" + id, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }});
    
    var json = await response.json();
  
    $('#msgModal .modal-title').html(json.name);
    $('#msgModal .modal-body').html(json.message);
    $("#msgModal").modal();
}

async function chargeFilters(){
    var groups = await getGroups();
    for(var i=0; i< groups.cg.length;i++){
      jQuery('<option/>', {
            value: groups.cg[i].ID,
            html: groups.cg[i].PREFIX + " - " + groups.cg[i].NAME
            }).appendTo('#select_filter_chp_grp');
    }
    for(var i=0; i< groups.ag.length;i++){
      jQuery('<option/>', {
            chp_grp: groups.ag[i].ID_CHP_GRP,
            value: groups.ag[i].ID,
            html: groups.ag[i].PREFIX + " - " + groups.ag[i].NAME
            }).appendTo('#select_filter_act_grp');
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
      if (filter_act != 0) {
        $("table tbody").each(function(ind) {
          $(this).find("tr").each(function(ind) {
            if ($(this).attr('act_grp') != filter_act) {
              $(this).hide();
            }else{
              $(this).show();
            }
          });
        });
      }else{
        $("table tbody").each(function() {
          $(this).find("tr").each(function() {
            if ($(this).attr('chp_grp') != filter_chap) {
              $(this).hide();
            }else{
              $(this).show();
            }
          });
        });
      }  
    }else{
      $("table tbody").each(function() {
        $(this).find("tr").each(function() {
          $(this).show();
        });
      });
    }
}
  
function showfilters() {
    if ($('.filters').is(":hidden")) {
      $('.filters').prop('hidden',false);
    }else{
      $('.filters').prop('hidden',true);
    }
}

function filterByChapter() {
    var html = '<option value="0">Ninguno</option>';
    if (filter_chap == 0) {
      $('#select_filter_act_grp_2').html(html);
    }else{
      $('#select_filter_act_grp_2').html($('#select_filter_act_grp').html());
  
      $('#select_filter_act_grp_2 option').each( function () {
        if ($(this).val() != 0 && $(this).attr('chp_grp') != filter_chap) {
          $(this).remove();
        }
      });
    }
    applyfilter()
}

function getAddData() {
  var aux = [];
  aux[0] = $("#item_name").val();
  aux[1] = $("#item_unit").val();
  aux[2] = $("#item_perf").val();
  aux[3] = ($("#item_ot").val()==""?0:$("#item_ot").val())  + ":" + 
           ($("#item_o").val()==""?0:$("#item_o").val()) + ":" + 
           ($("#item_a").val()==""?0:$("#item_a").val());
  aux[4] = translateNum($("#item_cost").val());
  aux[5] = $("#select_filter_act_grp_3").val()
  aux[6] = $("#item_cont").val();

  return aux;
}

function filterAddByChapter(chapter) {
  var html = '<option value="0">Ninguno</option>';
  if (chapter == 0) {
      $('#select_filter_act_grp_3').html(html);
      $('#select_filter_act_grp_3').prop('disabled',true);
  }else{
      $('#select_filter_act_grp_3').html($('#select_filter_act_grp').html());
      $('#select_filter_act_grp_3').prop('disabled',false);

      $('#select_filter_act_grp_3 option').each( function () {
          if ($(this).val() != 0 && $(this).attr('chp_grp') != chapter) {
            $(this).remove();
          }
        });
  }
}