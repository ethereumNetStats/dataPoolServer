# dataPoolServerについて

dataPoolServerは、以下の動作をします。
- データパブリッシャーとsocketServerの通信の中継
- データパブリッシャーに必要な各種初期データの保持

なお、dataPoolServerは全ての通信で[sokcet.io](https://socket.io/)を使用しています。  

# 事前準備
事前に以下のことを完了して下さい。
- [blockDataRecorder](https://github.com/ethereumNetStats/blockDataRecorder)のDockerのインストール〜ソースコードの実行
- [minutelyBasicNetStatsRecorder](https://github.com/ethereumNetStats/minutelyBasicNetStatsRecorder)の実行
- [hourlyBasicNetStatsRecorder](https://github.com/ethereumNetStats/hourlyBasicNetStatsRecorder)の実行
- [dailyBasicNetStatsRecorder](https://github.com/ethereumNetStats/dailyBasicNetStatsRecorder)の実行
- [weeklyBasicNetStatsRecorder](https://github.com/ethereumNetStats/weeklyBasicNetStatsRecorder)の実行
- [socketServer](https://github.com/ethereumNetStats/socketServer)の実行  

# ソースコード
ソースコードを確認したい場合は、以下のソースコードを確認して下さい。
- メイン：https://github.com/ethereumNetStats/dataPoolServer/blob/main/dataPoolServer.ts

# 使い方
以下では、ubuntu server v22.04での使用例を説明します。  
まずこのレポジトリを`clone`します。
```shell
git clone https://github.com/ethereumNetStats/dataPoolServer.git
```
`clone`が終わったら以下のコマンドでクローンしたディレクトリに移動して下さい。
```shell
cd ./dataPoolServer
```
ディレクトリ内にある`.envSample`を`.env`にリネームして下さい。
```shell
mv ./.envSample ./.env
```
次に[Node.js](https://nodejs.org/ja/)のインストールをします。
以下のコマンドを実行して下さい。なお、以下の手順は最も簡単なインストール方法です。必要に応じて`nvm`などのバージョンマネージャーを使用してインストールしても構いません。
```shell
sudo apt update
sudo apt install nodejs
```
次にパッケージマネージャー(`npm`)をインストールします。
```shell
sudo apt install npm
```
`npm`をインストールしたら以下のコマンドでパッケージをインストールします。
```shell
npm install
```
次にdataPoolServerをデーモン化して永続的に実行するために`forever`をインストールします。
```shell
npm install -g forever
```
`forever`のインストールが終了したら次のコマンドでTypescriptソースをコンパイルします。
```shell
tsc --project tsconfig.json
```
コンパイルが終了したら`forever`で`dataPoolServer.js`を起動します。
```shell
forever start dataPoolServer.js
```
