// 注意事項:
// Root バケットの create 権限を "g:anonymous" に変更しておくこと。
$(function() {
    // 初期化
    Nebula.initialize(NebulaConfig);

    var ENTER_KEY = 13;
    var BUCKET_NAME = "TodoTutorial1";

    var App = {
        // モデル
        model: {
            todos: []
        },

        // 初期化
        init: function () {
            var self = this;

            // 入力処理
            $("#todoText").keypress(self.onKeyPress);
            $("#assignUsr").keypress(self.onKeyPress);

            // バケットから TODO を読み込む
            this.bucket = new Nebula.ObjectBucket(BUCKET_NAME);
            this.fetch();
        },

        onKeyPress: function(e) {
            if (e.which == ENTER_KEY) {
                var todoText = $("#todoText").val();
                var username = $("#assignUsr").val();

                App.addTodo(todoText, username);

                $("#todoText").val("");
                //$("#assignUsr").val("");
                return false;
            }
        },

        // BaaS サーバから TODO をダウンロードする
        fetch: function() {
            var self = this;

            // クエリ生成
            var query = new Nebula.ObjectQuery();
            query.setSortOrder("updatedAt", true);

            // クエリ実行
            this.bucket.query(query)
                .then(function (objects) {
                    self.model.todos = objects;
                    self.render();
                })
                .catch(function (e) {
                    console.log("refresh failed:"  + e);
                    alert("接続エラー");
                });
        },

        // TODO の追加
        addTodo: function (text, username) {
            var self = this;

            var data = { description: text, username: username };
            this.bucket.save(data)
                .then(function (object) {
                    self.fetch();
                })
                .catch(function (err) {
                    console.log(err);
                });
        },

        // TODO 削除
        deleteTodo: function (id) {
            var self = this;

            this.bucket.remove(id)
                .then(function () {
                    self.fetch(); // リロード
                })
                .catch(function (err) {
                    console.log(err);
                })
        },

        // ビューのアップデート
        render: function () {
            var self = this;

            var $todos = $("#todos");
            $todos.empty();
            for (var i in this.model.todos) {
                var todo = this.model.todos[i];

                // 削除ボタンを生成
                var delButton = $("<button/>");
                delButton.text("✖").addClass("destroy");

                // 削除イベントハンドラを設定
                (function() {
                    var id = todo._id;
                    delButton.click(function() {
                       self.deleteTodo(id);
                    });
                })();

                // TODO 一行分を生成
                var li = $("<li/>");
                var text = todo.description;
                if (todo.username) {
                    text = text + " (" + todo.username + ")";
                }

                li.text(text).append(delButton);
                $todos.append(li);
            }
        }
    };

    App.init();
});
