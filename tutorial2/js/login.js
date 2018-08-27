$(function() {
    Nebula.initialize(NebulaConfig);

    var login = function() {
        var email = $("#email").val();
        var password = $("#password").val();
        var userInfo = { email: email, password: password };
        Nebula.User.login(userInfo)
            .then(function(user) {
                window.location.href = "app.html";
            })
            .catch(function(e) {
                alert(e.status + " " + e.statusText + " " + e.responseText);
            });
    };

    var clear = function() {
        $(":text").val("");
        $(":password").val("");
    }


    $("#login").click(login);
});
