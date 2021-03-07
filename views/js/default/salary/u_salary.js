var smmlv;

$(async function() {
  smmlv = await getSmmlv();
});

if ($('#all-salaries tbody tr td:nth-child(1)').html() === "1") {
  $('#all-salaries tbody tr td:nth-child(3)').each( function(){
    translateTxt($(this), $(this).html());    
  });
  
  $('#all-salaries tbody tr td:nth-child(4)').each( function(){
    if ($(this).html() != "Por definir") {
      translateTxt($(this), $(this).html());  
    }
  });
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

async function getSmmlv() {
  let response = await fetch(host + salary + "/mult/1", {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    }
  });
  var json = await response.json();
  return json;
}

async function initSalary(id){
    $('#information').attr('hidden', true);
    disableFields();
    var ide = "/" + id;
    var auxSalary = await getSalary(ide);
    console.log(auxSalary);
    console.log(smmlv);
    
    chargeSalary(auxSalary);


    addValues();
    chargeHours($('#hca'), $('#vhc'));
    chargeHours($('#hl'), $('#vhl'));
    chargeHours($('#hea'), $('#vhe'));
  }

function disableFields() {
    $("#information :input").prop( "disabled", true );
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
    translateTxt($('#dot'), salAux.ENDOWMENT);
    translateTxt($('#is'), salAux.SAFETY_EQUIPMENT);

    if ($('#mul1').val() != 1) {
        if (salAux.TOTAL_ANNUAL_EFFECTIVE_HOURS === 0) {
          $('#hca').val(smmlv.ANNUAL_CALENDAR_HOURS);
          $('#hl').val(smmlv.ANNUAL_WORKING_HOURS);
          $('#hea').val(smmlv.TOTAL_ANNUAL_EFFECTIVE_HOURS);
        }else{
          $('#hca').val(salAux.ANNUAL_CALENDAR_HOURS);
          $('#hl').val(salAux.ANNUAL_WORKING_HOURS);
          $('#hea').val(salAux.TOTAL_ANNUAL_EFFECTIVE_HOURS);
        }
        translateTxt($('#fic'), (smmlv.VALUE * 12) * 0.025);
    }else{
        $('#hca').val(salAux.ANNUAL_CALENDAR_HOURS);
        $('#hl').val(salAux.ANNUAL_WORKING_HOURS);
        $('#hea').val(salAux.TOTAL_ANNUAL_EFFECTIVE_HOURS);
        translateTxt($('#fic'), anu_val * 0.025);
    }
  } 
  $('#information').attr('hidden', false);
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