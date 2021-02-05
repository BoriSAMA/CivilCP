const host = "http://127.0.0.1:1337/";
const salary = "salary";

$('#msgModal').on('hidden.bs.modal', function () {
  console.log("uwu")
  window.location = '/index/salary';
})

async function regSalary(){
    let response = await fetch(host + salary, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
                mult: $('#mul').val(),
                val: $('#vsm').val(),
                tran: $('#stp').val()                
            })
    });
    var json = await response.json();
    $('#addModal').modal('hide');
    $('.modal-title').html(json.name);
    $('.modal-body').html(json.message);
    $("#msgModal").modal();
}


async function delSalary(id){
  let response = await fetch(host + salary, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },body: JSON.stringify({
      id: id
  })
  });
  var json = await response.json();

  $('.modal-title').html(json.name);
  $('.modal-body').html(json.message);
  $("#msgModal").modal();
}

async function initSalary(id){
  var ide = "/" + id;
  var auxSalary = getSalary(ide);
  chargeSalary(auxSalary);
}

async function updSalary(id){
  let response = await fetch(host + salary + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },body: JSON.stringify({
        val: $('#mul').val(),
        tran: $('#stp').val(),
        endo: 0,
        saeq: 0,
        ach: 0,
        awh: 0,
        aeh: 0,
        daily: 0,
        hourly: 0
    })
  });

  var json = await response.json();

  $('.modal-title').html(json.name);
  $('.modal-body').html(json.message);
  $("#msgModal").modal();
}

async function getSalary(id){
  let response = await fetch(host + salary + ide, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
  return response;
}

async function chargeSalary(salAux){
  if (typeof salAux.name !== 'undefined') {
    $('.modal-title').html(json.name);
    $('.modal-body').html(json.message);
    $("#msgModal").modal();
  }

  if (salAux.endo != 0) {
    $('#mul').val(),
    $('#vsm').val(),
    $('#stp').val()
  }
}