/*!
    * Start Bootstrap - SB Admin v6.0.2 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    (function($) {
    "use strict";

    // Add active state to sidbar nav links
    var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
        $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function() {
            if (this.href === path) {
                $(this).addClass("active");
            }
        });

    // Toggle the side navigation
    $("#sidebarToggle").on("click", function(e) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
    });
})(jQuery);

// TODO loading screen

const host = "http://127.0.0.1:1337/";
const salary = "salary";
const group = "group";
const item = "item";


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
    if (input.is('input')) {
      input.val(ret);
    }else{
      input.html(ret);
    }
}
