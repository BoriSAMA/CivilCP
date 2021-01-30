const dir = "http://127.0.0.1:1337/";
const reg = "user/register";
const log = "user/login";
const ind = "index";

async function register(){
  try{
    var complete = dir + reg;
    let response = await fetch( complete, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json;charset=utf-8',
      },body: JSON.stringify({
                name: $('#ingresarNombre').val(),
                code: $('#ingresarCodigo').val(),
                pass: $('#ingresarContraseña').val(),
                mail: $('#ingresarCorreo').val()
            })
    });

    if (response.ok) {
      alert("usuario registrado")
      window.location="/user/login";
    }else(
      alert("no se pudo :c")
    )
  }catch(err){
    alert(err);
  }
}


async function login(){
  try{
    var complete = dir + log;
    let response = await fetch( complete, {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json;charset=utf-8',
      },body: JSON.stringify({
                pass: $('#ingresarContraseña').val(),
                mail: $('#ingresarCorreo').val()
            })
    });
    if (response.ok) {
      var user = await response.json();
      sessionStorage.setItem("user", user);
      alert("bienvenido");
      window.location="/index";
    }else(
      alert(response.json().message)
    )
  }catch(err){
    alert(err);
  }
}
