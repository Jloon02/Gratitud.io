$(function () {
    $("#header-component").load("commonComponents/header.html", function() {
        updateNavigation()
    })
})

function updateNavigation() {
    var url = window.location.href
    if (url.includes("card.html")){
        $("#card-button").attr("aria-current","page")
        $("#card-button").attr("class","nav-link active")
    } else if (url.includes("landing.html")){
        $("#home-button").attr("aria-current","page")
        $("#home-button").attr("class","nav-link active")
    } else if (url.includes("login.html")) {
        $("#home-button").attr("aria-current","page")
        $("#home-button").attr("class","nav-link active")
    } else if (url.includes("messageBox.html")){
        $("#message-box-button").attr("aria-current","page")
        $("#message-box-button").attr("class","nav-link active")
    }
}