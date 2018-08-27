$(function() {
    // 初期化
    Nebula.initialize(NebulaConfig);

    var App = {
        // モデル
        model: {
            buckets: [],
            currentBucket: null
        },

        // 初期化
        init: function () {
            var self = this;

	/*
            // ファイルバケット一覧を取得する
            Nebula.FileBucket.getBucketList()
                .then(function (buckets) {
                    self.model.buckets = buckets;
                    self.renderBuckets();
                })
                .catch(function (e) {
                    alert("get bucket list failed" + e);
                });
	*/
	self.showBucket("AlbumTutorial");
        },

        // バケット一覧の描画
        renderBuckets: function() {
            var self = this;

            var $app = $("#app");
            $app.empty();

            var template = _.template($("#template_buckets").text());
            var el = template({buckets: self.model.buckets});
            var $el = $(el).appendTo($app);
            $el.find("a").click(function() {
                self.showBucket($(this).data('bucket'));
            });
        },

        // バケットロード
        showBucket: function(bucketName) {
            var self = this;

            var bucket = new Nebula.FileBucket(bucketName);
            self.model.currentBucket = bucket;

            bucket.getList()
                .then(function(metas) {
                    self.showFiles(bucket, metas);
                })
                .catch(function(e) {
                    alert("load files failed : " + e);
                });
        },

        // ファイル一覧画面
        showFiles: function(bucket, metas) {
            var self = this;

            var $app = $("#app");
            $app.empty();

            var table_template = _.template($("#template_file_table").text());
            var $table = $(table_template({})).appendTo($app);

            var file_template = _.template($("#template_file_entry").text());

            // ファイル一覧表示
            _.each(metas, function(meta) {
                var filename = meta.getFileName();

                var row = file_template({
                    filename: filename,
                    contentType: meta.getContentType(),
                    size: meta.getSize(),
                    createdAt: meta.getCreatedAt(),
                    updatedAt: meta.getUpdatedAt(),
                    publicUrl: meta.getPublicUrl(),
                    acl: meta.getAcl()
                });

                var tr = $(row).appendTo($table);
                var id = Math.floor(Math.random()*100);
                //後で画像を張り付けるためのIDを設定
                $(tr).attr("id", id);

                self.downloadFile(bucket, filename, id);

                // イベントハンドラ設定
                tr.find(".delete").click(function() {
                    self.deleteFile(bucket, filename);
                });
            });

            // アップロード用フォーム
            var upload_template = _.template($("#template_file_upload").text());
            var el = $(upload_template({})).appendTo($app);

            $("#uploadButton").click(function() {
                self.uploadFile();
            });

            $("#back").click(function() {
                self.renderBuckets();
                return false;
            });
        },

        downloadFile: function(bucket, filename, id) {
            bucket.load(filename)
                .then(function(blob) {
                    // コンテンツを表示ないしダウンロードさせるために URL を作成
                    var url = window.URL.createObjectURL(blob);

                    //まずファイル名を消す
                    //var image = $("td:contains('"+filename+"')");
                    var tr = $('#'+id);
                    var image = tr.find(".show");
                    image.text("");
                    //画像を挿入
                    image.append('<img src="' + url + '" width="100%">');
                })
                .catch(function(e) {
                    console.log("load failed");
                });

        },

        uploadFile: function() {
            var self = this;

            // File オブジェクトを得る
            var fileInput = $("#inputFile").get();
            var file = fileInput[0].files[0];
            if (file === undefined) return;

            var bucket = self.model.currentBucket;

            // ファイルを保存する
            var meta = new Nebula.FileMetadata();
            meta.setFileName(file.name);
            meta.setContentType(file.type);
            bucket.saveAs(file.name, file, meta)
                .then(function(meta) {
                    alert("Saved");
                    // 画面をリロードする
                    self.showBucket(bucket.getBucketName());
                })
                .catch(function(error) {
                    alert(error);
                });
        },

        deleteFile: function(bucket, filename) {
            var self = this;

            if (window.confirm("削除してよろしいですか？")) {
                bucket.delete(filename)
                    .then(function (name) {
                        // リロード
                        self.showBucket(bucket.getBucketName());
                    })
                    .catch(function (e) {
                        alert(e);
                    });
            }
        }
    };

    App.init();

});
