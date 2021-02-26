const item_type = ['item_material', 'item_gang', 'item_machinery', 'item_transport'];
const item_unit = ['ML', 'M2', 'M3', 'UND', 'GB', 'PT'];

var filter_chap = 0;
var filter_act = 0;


for (let i = 0; i < item_type.length; i++) {
  if ($('#' + item_type[i] + ' tbody tr td:nth-child(1)').html() === "1") {
    if (i == 0 || i==3) {
      $('#' + item_type[i] + ' tbody tr td:nth-child(6)').each( function(){
        translateTxt($(this), $(this).html());
      });
    }else{
      $('#' + item_type[i] + ' tbody tr td:nth-child(7)').each( function(){
        translateTxt($(this), $(this).html());
      });
    }
    
  }
}

$(function() {
    chargeFilters();
});

$("#chp_grp").on('change', function() {
    filter_chap = $("#chp_grp").val();
    filterByChapter();
});

$("#act_grp").on('change', function() {
    filter_act = $("#act_grp_2").val();
    applyfilter()
});

$("#item_type").on('change', function() {
  showTable($("#item_type").val());
});

function filterByChapter() {
  var html = '<option value="0">Ninguno</option>';
  if (filter_chap == 0) {
    $('#act_grp_2').html(html);
  }else{
    $('#act_grp_2').html($('#act_grp').html());

    $('#act_grp_2 option').each( function () {
      if ($(this).attr('chp_grp') != filter_chap) {
        $(this).remove();
      }
    });

    if( $('#act_grp_2').has('option').length == 0 ) {
      $('#act_grp_2').html(html);
    }
  }
  applyfilter()
}

async function addCopy(id) {
  console.log(id);
  let response = await fetch(host + item + "/copy/" + id, {
    method: 'GET',
    headers: {'Content-Type': 'application/json;charset=utf-8'}
  });

  var json = await response.json();
  $('#msgModal .modal-title').html(json.name);
  $('#msgModal .modal-body').html(json.message);
  $("#msgModal").modal();
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

async function chargeFilters(){
  var groups = await getGroups();
  for(var i=0; i< groups.cg.length;i++){
    jQuery('<option/>', {
          value: groups.cg[i].ID,
          html: groups.cg[i].PREFIX + " - " + groups.cg[i].NAME
          }).appendTo('#chp_grp');
  }
  for(var i=0; i< groups.ag.length;i++){
    jQuery('<option/>', {
          chp_grp: groups.ag[i].ID_CHP_GRP,
          value: groups.ag[i].ID,
          html: groups.ag[i].PREFIX + " - " + groups.ag[i].NAME
          }).appendTo('#act_grp');
  }
  $('#select_act_grp').prop('hidden',true);
}

function applyfilter() {
  if (filter_chap != 0) {
    if (filter_act != 0) {
      $("table").each(function(ind) {
        $(this).find("tr").each(function(ind) {
          console.log($(this).attr('act_grp'));
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

function showTable(num){
  var aux = [$('#item_material'), $('#item_gang'), $('#item_machinery'), $('#item_transport')];
  aux[num-1].prop('hidden', false);
  aux.splice(num-1, 1);
  aux.forEach(element => {
      element.prop('hidden', true);
  }); 
}
