$(function() {
    Nebula.initialize(NebulaConfig);

    var reset = function() {
        var email = $("#email").val();

        Nebula.User.resetPassword({email: email})
            .then(function(response) {
                alert("パスワードリセットメールを送信しました");
                window.location.href = "index.html";
            })
            .catch(function(e) {
                alert(e.status + " " + e.statusText + " " + e.responseText);
            });
    };

    $("#reset").click(reset);
});
