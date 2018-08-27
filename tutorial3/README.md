Tutorial3: アルバムアプリサンプル
=================================

概要
----

NEC BaaS のアルバムアプリサンプルです。
ファイルストレージ機能を使用しています。

バケット一覧表示、バケット内のファイル一覧表示、
ダウンロード、アップロードができます。

必要環境
--------

HTML5 File API に対応したブラウザが必要です。
Chrome, Firefox, IE10以降などを使用して下さい。
(IE8, 9 では動作しません。)

使い方
------

js/config.sample.js を js/config.js にコピーし、
config.js にテナントID, アプリID, アプリキー, ベースURI
を指定してください。

デフォルトでは anonymous 権限でアクセスできる領域しか
表示されません。全データを閲覧したい場合は、アプリキー
ではなくマスターキーを指定してください。

index.html をブラウザで開いて使用して下さい。