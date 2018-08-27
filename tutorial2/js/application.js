$(function() {
    // 初期化
    Nebula.initialize(NebulaConfig);

    var ENTER_KEY = 13;
    var BUCKET_NAME = "TodoTutorial2";

    var App = {
        // モデル
        model: {
            todos: []
        },

        // 初期化(ログインチェック)
        init: function () {
            var self = this;

            // ログインチェック
            var user = Nebula.User.current();
            if (user === null) {
                window.location.href = "index.html"; // 未ログイン
                return;
            }
            self.user = user; // ユーザ情報保存
            self.initApp();
        },

        initApp: function() {
            var self = this;

            // 入力処理
            $("#todoText").keypress(function (e) {
                if (e.which == ENTER_KEY) {
                    self.addTodo($("#todoText").val());
                    $("#todoText").val("");
                    return false;
                }
            });

            // ログアウト
            $("#logout").click(function() {
                self.logout();
            });

            // Object Bucket を準備し、データをロードする
            this.bucket = new Nebula.ObjectBucket(BUCKET_NAME);
	    this.fetch();
        },

        // ログアウト処理
        logout: function() {
            Nebula.User.logout()
                .then(function() {
                    window.location.href = "index.html";
                })
                .catch(function(e) {
                    window.location.href = "index.html";
                })
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
                    console.log("refresh failed");
                });
        },

        // TODO の追加
        addTodo: function (text) {
            var self = this;

            var data = { description: text };
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

            this.bucket.delete(id)
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
                li.text(todo.description).append(delButton);
                $todos.append(li);
            }
        }
    };

    App.init();
});
