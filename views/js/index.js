const dir = "http://127.0.0.1:1337/";
const log = "user/login";

function logout(){
    sessionStorage.clear();
    window.location="/user/login"
}