const host = "http://127.0.0.1:1337/";
const salary = "salary";
var real_value = 0;

$('#msgModal').on('hidden.bs.modal', function () {
  window.location = '/index/salary';
})

$('#addModal').on('hidden.bs.modal', function () {
  $('#vsm').val("");
  $('#stp').val("");
  $('#mul').val("");
  $("#vsm").prop( "disabled", false );
  $("#stp").prop( "disabled", false );
});

$('#hca').on('keyup', function() {
  chargeHours($('#hca'), $('#vhc'));
});

$('#hl').on('keyup', function() {
  chargeHours($('#hl'), $('#vhl'));
});

$('#hea').on('keyup', function() {
  chargeHours($('#hea'), $('#vhe'));
});

$("#mul").on('blur', function() { 
    calculateSal();
});

$("input[data-type='currency']").on({
  keyup: function() {
    formatCurrency($(this));
  },
  blur: function() { 
    formatCurrency($(this), "blur");
  }
});

async function regSalary(){
    let response = await fetch(host + salary, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }, body: JSON.stringify({
                mult: $('#mul').val(),
                val: parseFloat(translateNum($('#vsm').val())),
                tran: parseFloat(translateNum($('#stp').val()))                
            })
    });

    var json = await response.json();
    $('#addModal').modal('hide');
    $('#msgModal .modal-title').html(json.name);
    $('#msgModal .modal-body').html(json.message);
    $("#msgModal").modal();
}


async function delSalary(id){
  let response = await fetch(host + salary, {
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

async function getSalary(id){
  let response = await fetch(host + salary + id, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
  var json = await response.json();
  return json[0];
}

async function updSalary(id){
    var qdai = 0, qhrly = 0;
    qhrly = parseFloat(translateNum($('#vhe').val()))
    qdai = qhrly * 8

  let response = await fetch(host + salary + id, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },body: JSON.stringify({
        val: parseFloat(translateNum($('#vsm1').val())),
        tran: parseFloat(translateNum($('#stp1').val())),
        endo: parseFloat(translateNum($('#dot').val())),
        saeq: parseFloat(translateNum($('#is').val())),
        ach: $('#hca').val(),
        awh: $('#hl').val(),
        aeh: $('#hea').val(),
        daily: qdai,
        hourly: qhrly
    })
  });

  var json = await response.json();

  $('#msgModal .modal-title').html(json.name);
  $('#msgModal .modal-body').html(json.message);
  $("#msgModal").modal();
}

async function chargeSalary(salAux){
  if (typeof salAux.name !== 'undefined') {
    $('#msgModal .modal-title').html(salAux.name);
    $('#msgModal .modal-body').html(salAux.message);
    $("#msgModal").modal();
  }else{
    $('#mul1').val(salAux.MULTIPLIER);
    translateTxt($('#vsm1'), salAux.VALUE);
    translateTxt($('#stp1'), salAux.TRANSPORT_SUBSIDY);
    translateTxt($('#smcp'), salAux.TRANSPORT_SUBSIDY + salAux.VALUE);
    translateTxt($('#sacp'), parseFloat($('#smcp').attr("value")) * 12);
    var anu = parseFloat($('#sacp').attr("value"));
    var anu_val = salAux.VALUE * 12;
    translateTxt($('#ca'), anu / 10);
    translateTxt($('#tsc'), anu * 0.012);
    translateTxt($('#pri'), salAux.TRANSPORT_SUBSIDY + salAux.VALUE);
    translateTxt($('#vac'), salAux.VALUE * 0.5);
    translateTxt($('#pen'), anu_val * 0.12);
    translateTxt($('#salu'), 0);
    translateTxt($('#arl'), anu_val * 0.0696);
    translateTxt($('#sena'), 0);
    translateTxt($('#icbf'), 0);
    translateTxt($('#ccf'), anu_val * 0.04);
    translateTxt($('#fic'), anu_val * 0.025);
    translateTxt($('#dot'), salAux.ENDOWMENT);
    translateTxt($('#is'), salAux.SAFETY_EQUIPMENT);
    if (salAux.MULTIPLIER > 2) {
      $( "#dot" ).prop( "disabled", true );
    }
    $('#hca').val(salAux.ANNUAL_CALENDAR_HOURS);
    $('#hl').val(salAux.ANNUAL_WORKING_HOURS);
    $('#hea').val(salAux.TOTAL_ANNUAL_EFFECTIVE_HOURS);
  } 
  $('#information').removeAttr('hidden');
}

async function initSalary(id){
  var ide = "/" + id;
  var auxSalary = await getSalary(ide);
  $("#agg").on("click", function(){
    updSalary(ide)
  });
  $("#sav").on("click", function(){
    updSalary(ide)
  });

  chargeSalary(auxSalary);
  addValues();
  chargeHours($('#hca'), $('#vhc'));
  chargeHours($('#hl'), $('#vhl'));
  chargeHours($('#hea'), $('#vhe'));
}

function formatNumber(n) {
  return n.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}
  
function formatCurrency(input, blur) {
  var input_val = input.val();
  if (input_val === "") { 
    return;
  }
  var original_len = input_val.length;
  var caret_pos = input.prop("selectionStart");
  if (input_val.indexOf(".") >= 0) {
    var decimal_pos = input_val.indexOf(".");
    var left_side = input_val.substring(0, decimal_pos);
    var right_side = input_val.substring(decimal_pos);
    left_side = formatNumber(left_side);
    right_side = formatNumber(right_side);
    if (blur === "blur") {
      right_side += "00";
    }
    right_side = right_side.substring(0, 2);
    input_val = "$" + left_side + "." + right_side;

  } else {
    input_val = formatNumber(input_val);
    input_val = "$" + input_val;
    
    if (blur === "blur") {
      input_val += ".00";
    }
  }

  input.val(input_val);
  var updated_len = input_val.length;
  caret_pos = updated_len - original_len + caret_pos;
  input[0].setSelectionRange(caret_pos, caret_pos);
}
  
function translateNum(text){
  var aux, ret = "";
  aux = text.substring(1);
  aux = aux.split(",");
  for (let i = 0; i < aux.length; i++) {
    ret += aux[i];
  }
  return ret;
}

function translateTxt(input, num){
  input.attr("value",num);
  var right_side = "", left_side = "", ret = "";
  var aux = num.toString();
  var decimal_pos = aux.indexOf(".");
  
  if (decimal_pos !== -1) {
    right_side = aux.substring(decimal_pos + 1);
    left_side = aux.substring(0, decimal_pos);
    right_side = right_side.substring(0, 2);
    left_side = formatNumber(left_side);
  }else{
    left_side = formatNumber(aux);
    right_side = "00";
  }
  ret = "$" + left_side + "." + right_side;
  input.val(ret);
}

async function calculateSal(){
  var json, aux = parseFloat($('#mul').val());
  if (aux > 1 && aux <= 3) {
    let response = await fetch(host + salary + "/mult/1", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      }
    });
    json = await response.json();
    if (typeof json.name !== 'undefined') {
      return;
    }
    $( "#vsm" ).prop( "disabled", true );
    translateTxt($('#vsm'), json.VALUE * aux);
    if (aux <= 2) {
      $( "#stp" ).prop( "disabled", true );
      translateTxt($('#stp'), json.TRANSPORT_SUBSIDY);
    }else{
      $( "#stp" ).prop( "disabled", true );
      translateTxt($('#stp'), 0);
    }
  }
}

function addValues(){
  real_value = (parseFloat($('#vsm1').attr("value")) * 12) + (parseFloat($('#stp1').attr("value")) * 11.4) + parseFloat($('#ca').attr("value")) +
                parseFloat($('#tsc').attr("value")) + parseFloat($('#pri').attr("value")) + parseFloat($('#vac').attr("value")) +
                parseFloat($('#pen').attr("value")) + parseFloat($('#salu').attr("value")) + parseFloat($('#arl').attr("value")) +
                parseFloat($('#sena').attr("value")) + parseFloat($('#icbf').attr("value")) + parseFloat($('#ccf').attr("value")) +
                parseFloat($('#fic').attr("value")) + parseFloat($('#dot').attr("value")) + parseFloat($('#is').attr("value"));
}

function chargeHours(input1, input2) {
    var aux = real_value / parseInt(input1.val());
    translateTxt(input2, aux);
}