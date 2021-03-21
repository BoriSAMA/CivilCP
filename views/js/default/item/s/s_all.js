const item_type = ['item_material', 'item_gang', 'item_machinery', 'item_transport'];

$("#item_type").on('change', function() {
  showTable($("#item_type").val());
});

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

function showTable(num){
  var aux = [$('#item_material'), $('#item_gang'), $('#item_machinery'), $('#item_transport')];
  aux[num-1].prop('hidden', false);
  aux.splice(num-1, 1);
  aux.forEach(element => {
      element.prop('hidden', true);
  }); 
}
