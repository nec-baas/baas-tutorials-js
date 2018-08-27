$(function() {
    Nebula.initialize(NebulaConfig);

    var signup = function() {
        var email = $("#email").val();
        var password = $("#password").val();
        var password_confirmation = $("#password_confirm").val();

        if (password !== password_confirmation) {
            alert("Passwords does not match.");
            return;
        }

        var user = new Nebula.User();
        user.set("email", email);
        user.set("password", password);
        user.register()
            .then(function(u) {
                alert("User registered.");
                window.location.href = "index.html";
            })
            .catch(function(e) {
                alert(e.status + " " + e.statusText + " " + e.responseText);
                clear();
            })
    };

    var clear = function() {
        $(":text").val("");
        $(":password").val("");
    }

    $("#signup").click(signup);
});
