function sendMessageHandler(){
    var selectedUser = $(".dropdown").find(":selected").text();
    var text = $(".text").val();
    console.log(selectedUser);
    console.log(text)

    if(selectedUser == "Ruffles"){
        if(text){
            $(".text").val("");
            $('.text').attr("placeholder", "Message:");
            $(".message_button").addClass("button-animation");
            $(".message_button").html("Sent!");

            setTimeout(()=>{
                $(".message_button").html("Send!");
                $(".message_button").removeClass("button-animation");
                $(".message_button").css('background-color','#9695D9');
            }, 2000)
        }else{
            console.log("here!");
            $('.text').attr("placeholder", "Please enter a message!");
        }
    }
}