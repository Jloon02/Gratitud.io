function handleLogin(){
    var form = $('form').serializeArray();

    if((form[0].value == "ruffles") && (form[1].value == "ruffles123")){
        window.location = "../html/landing.html";
    }else{
        $("#incorrect_credentials").show();
    }
}