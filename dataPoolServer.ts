// 環境変数のインポート
import "dotenv/config";

// パッケージのインポート
import {Server} from "socket.io";
import {io} from "socket.io-client";

// 自作パッケージのインポート
import {currentTimeReadable, unixTimeReadable} from "@ethereum_net_stats/readable_time";

// 型定義のインポート
import type {Socket} from "socket.io-client";
import type {
    blockData,
    blockDataArray,
    netStats,
    netStatsArray,
    requestBlockDetail, requestBlockList, requestBlockListPageByBlockNumber,
    responseBlockDetail,
    responseBlockList, responseBlockListPageByBlockNumber,
} from "./types/types";

// socket.ioイベントの定義のインポート
import type {
    dataPublisherToDataPoolServerEvents,
    dataPoolServerToDataPublisherEvents,
    SocketServerToDataPoolServerEvents,
    DataPoolServerToSocketServerEvents
} from "./types/socketEvents"

//
// データパブリッシャーと通信するためのsocket.ioサーバーの起動と処理の定義
//

// socket.ioサーバーの起動
const dataPoolServer: Server = new Server<dataPublisherToDataPoolServerEvents, dataPoolServerToDataPublisherEvents>(2226);

// 各集計データを格納する変数の初期化
let minutelyNetStats: netStatsArray = [];
let hourlyNetStats: netStatsArray = [];
let dailyNetStats: netStatsArray = [];
let weeklyNetStats: netStatsArray = [];

// Latest blocksセクションに表示するブロックデータを格納する変数の初期化
let blockDataArray: blockDataArray = [];

// データパブリッシャーのソケットIDを格納する変数の初期化
let dataPublisherId: string = '';

// データパブリッシャーの名前登録
const dataPublisherName: string = 'dataPublisher';

// データパブリッシャーとのソケットイベント登録
dataPoolServer.on('connect', async (client) => {

    // 接続してきたソケットクライアントの'query.name'が登録名と一致したらIDを格納
    switch (client.handshake.query.name) {
        case dataPublisherName:
            dataPublisherId = client.id;
            console.log(`${currentTimeReadable()} | Connect : ${dataPublisherName}`);
            break;
    }

    // データパブリッシャーから１分ごとの集計データの初期データの要求を受けた時の処理
    client.on('requestInitialMinutelyNetStats', () => {
        if (minutelyNetStats.length !== 0) {
            // 既に該当データをsocketServerから受け取っていた場合は、そのデータをデータパブリッシャーに返す
            dataPoolServer.to(dataPublisherId).emit('initialMinutelyNetStats', minutelyNetStats);
            console.log(`${currentTimeReadable()} | Emit : 'initialMinutelyNetStats' | To : dataPublisher`);
        } else {
            // 該当データをsocketServerから受け取っていない場合は、そのことを示すイベント'stillNoInitialMinutelyNetStats'をデータパブリッシャーに返す
            dataPoolServer.to(dataPublisherId).emit('stillNoInitialMinutelyNetStats');
            console.log(`${currentTimeReadable()} | Emit : 'stillNoInitialMinutelyNetStats' | To : dataPublisher`);
        }
    });

    // データパブリッシャーから１時間ごとの集計データの初期データの要求を受けた時の処理
    client.on('requestInitialHourlyNetStats', () => {
        if (hourlyNetStats.length !== 0) {
            // 既に該当データをsocketServerから受け取っていた場合は、そのデータをデータパブリッシャーに返す
            dataPoolServer.to(dataPublisherId).emit('initialHourlyNetStats', hourlyNetStats);
            console.log(`${currentTimeReadable()} | Emit : 'initialHourlyNetStats' | To : dataPublisher`);
        } else {
            // 該当データをsocketServerから受け取っていない場合は、そのことを示すイベント'stillNoInitialHourlyNetStats'をデータパブリッシャーに返す
            dataPoolServer.to(dataPublisherId).emit('stillNoInitialHourlyNetStats');
            console.log(`${currentTimeReadable()} | Emit : 'stillNoInitialHourlyNetStats' | To : dataPublisher`);
        }
    });

    // データパブリッシャーから１日ごとの集計データの初期データの要求を受けた時の処理
    client.on('requestInitialDailyNetStats', () => {
        if (dailyNetStats.length !== 0) {
            // 既に該当データをsocketServerから受け取っていた場合は、そのデータをデータパブリッシャーに返す
            dataPoolServer.to(dataPublisherId).emit('initialDailyNetStats', dailyNetStats);
            console.log(`${currentTimeReadable()} | Emit : 'initialDailyNetStats' | To : dataPublisher`);
        } else {
            // 該当データをsocketServerから受け取っていない場合は、そのことを示すイベント'stillNoInitialDailyNetStats'をデータパブリッシャーに返す
            dataPoolServer.to(dataPublisherId).emit('stillNoInitialDailyNetStats');
            console.log(`${currentTimeReadable()} | Emit : 'stillNoInitialDailyNetStats' | To : dataPublisher`);
        }
    });

    // データパブリッシャーから１週間ごとの集計データの初期データの要求を受けた時の処理
    client.on('requestInitialWeeklyNetStats', () => {
        if (weeklyNetStats.length !== 0) {
            // 既に該当データをsocketServerから受け取っていた場合は、そのデータをデータパブリッシャーに返す
            dataPoolServer.to(dataPublisherId).emit('initialWeeklyNetStats', weeklyNetStats);
            console.log(`${currentTimeReadable()} | Emit : 'initialWeeklyNetStats' | To : dataPublisher`);
        } else {
            // 該当データをsocketServerから受け取っていない場合は、そのことを示すイベント'stillNoInitialWeeklyNetStats'をデータパブリッシャーに返す
            dataPoolServer.to(dataPublisherId).emit('stillNoInitialWeeklyNetStats');
            console.log(`${currentTimeReadable()} | Emit : 'stillNoInitialWeeklyNetStats' | To : dataPublisher`);
        }
    });

    // データパブリッシャーからフロントエンドの"Latest blocks"セクションに表示するための初期データの要求を受けた時の処理
    client.on('requestInitialBlockData', () => {
        if (blockDataArray.length !== 0) {
            // 既に該当データをsocketServerから受け取っていた場合は、そのデータをデータパブリッシャーに返す
            dataPoolServer.to(dataPublisherId).emit('initialBlockData', blockDataArray);
            console.log(`${currentTimeReadable()} | Emit : 'initialBlockData' | To : dataPublisher`);
        } else {
            // 該当データをsocketServerから受け取っていない場合は、そのことを示すイベント'stillNoInitialBlock'をデータパブリッシャーに返す
            dataPoolServer.to(dataPublisherId).emit('stillNoInitialBlockData');
            console.log(`${currentTimeReadable()} | Emit : 'stillNoInitialBlockData' | To : dataPublisher`);
        }
    });

    // ユーザーがブロックデータの詳細を要求したことを示す'requestBlockDetail'イベントを受けた時の処理
    client.on('requestBlockDetail', (requestBlockDetail: requestBlockDetail) => {
        console.log(`${currentTimeReadable()} | Receive : 'requestBlockDetail' | From : dataPublisher | Frontend : ${requestBlockDetail.frontendId}`);
        // 要求を受けたデータをそのままバックエンドのsocketServerに転送
        socketClient.emit('requestBlockDetail', requestBlockDetail);
        console.log(`${currentTimeReadable()} | Emit : 'requestBlockDetail' | To : socketServer`);
    });

    // ユーザーがフロントエンドの"Block list"ページを要求したことを示す'requestBlockList'イベントを受けた時の処理
    client.on('requestBlockList', (requestBlockList: requestBlockList) => {
        console.log(`${currentTimeReadable()} | Receive : 'requestBlockList' | From : dataPublisher | PageOffset : ${requestBlockList.pageOffset}`);
        // 要求を受けたデータをそのままバックエンドのsocketServerに転送
        socketClient.emit('requestBlockList', requestBlockList);
        console.log(`${currentTimeReadable()} | Emit : 'requestBlockList' | To : socketServer | PageOffset: ${requestBlockList.pageOffset}`);
    });

    // ユーザーが'Block list'の特定のページ番号をクリックしたか、特定のブロックナンバーを入力したことを示す'requestBlockListPageByBlockNumber'イベントを受けた時の処理
    client.on('requestBlockListPageByBlockNumber', (requestBlockListPageByBlockNumber: requestBlockListPageByBlockNumber) => {
        console.log(`${currentTimeReadable()} | Receive : 'requestBlockListPageByBlockNumber' | From : dataPublisher | BlockNumber : ${requestBlockListPageByBlockNumber.blockNumber}`);
        // 要求を受けたデータをそのままバックエンドのsocketServerに転送
        socketClient.emit('requestBlockListPageByBlockNumber', requestBlockListPageByBlockNumber);
        console.log(`${currentTimeReadable()} | Emit : 'requestBlockListPageByBlockNumber' | To : socketServer | BlockNumber: ${requestBlockListPageByBlockNumber.blockNumber}`);
    });

    // ソケットクライアントの切断が発生した時の処理
    client.on("disconnect", (reason) => {

        switch (client.id) {
            case dataPublisherId:
                // データパブリッシャーとの接続が切れたことを示すメッセージを表示
                console.log(`${currentTimeReadable()} | Disconnect : ethChartServer | Reason : ${reason}`);
        }

        // 切断が発生したクライアントとの接続をソケットサーバー側から明示的に切断
        client.disconnect();
    });
});

dataPoolServer.on("reconnect", (attempt) => {
    console.log(`${currentTimeReadable()} | Reconnect : socket server`);
    console.log(attempt);
});

dataPoolServer.on("reconnect_error", (error) => {
    console.log(`${currentTimeReadable()} | Reconnect : Error`);
    console.log(error);
});

dataPoolServer.on("reconnect_failed", () => {
    console.log(`${currentTimeReadable()} | Reconnect :  Failed.`);
});

//
// 以下はsocketServerにイベントをemitするためのsocket.ioクライアントの起動と処理の定義
//

// socket.ioクライアントの名前定義
const dataPoolServerName: string = "dataPoolServer";

// socketServerへ接続
const socketClient: Socket<SocketServerToDataPoolServerEvents, DataPoolServerToSocketServerEvents> = io(`${process.env.SOCKET_SERVER_ADDRESS}`, {
    forceNew: true,
    query: {name: dataPoolServerName}
});

// socketServerとのイベントリスナーの登録
socketClient.on("connect", () => {
    console.log(`${currentTimeReadable()} | Connect : socketServer.`);

    // socketServerに接続したときに各集計データと、フロントエンドの'Latest blocks'セクションの表示データの初期データを要求
    socketClient.emit("requestInitialMinutelyNetStats");
    console.log(`${currentTimeReadable()} | Emit : 'requestInitialMinutelyNetStats' | To : socketServer`);
    socketClient.emit('requestInitialHourlyNetStats');
    console.log(`${currentTimeReadable()} | Emit : 'requestInitialHourlyNetStats' | To : socketServer`);
    socketClient.emit('requestInitialDailyNetStats');
    console.log(`${currentTimeReadable()} | Emit : 'requestInitialDailyNetStats' | To : socketServer`);
    socketClient.emit('requestInitialWeeklyNetStats');
    console.log(`${currentTimeReadable()} | Emit : 'requestInitialWeeklyNetStats' | To : socketServer`);
    socketClient.emit('requestInitialBlockData');
    console.log(`${currentTimeReadable()} | Emit : 'requestInitialBlockData' | To : socketServer`);
});

//
// １分ごとの集計データに関する処理
//

// １分ごとの集計データの初期データを受け取った時のイベント'initialMinutelyNetStats'を受けた時の処理
socketClient.on("initialMinutelyNetStats", (initialMinutelyNetStats: netStatsArray) => {
    // 受け取った初期データを格納する
    console.log(`${currentTimeReadable()} | Receive : 'initialMinutelyNetStats' | From : socketServer`);
    minutelyNetStats = initialMinutelyNetStats;
});

// 新しい１分データが集計されたときに発行されるイベント'newMinutelyNetStats'を受けた時の処理
socketClient.on("newMinutelyNetStats", (newMinutelyNetStats: netStats) => {
    console.log(`${currentTimeReadable()} | Receive : 'newMinutelyNetStats' | From : socketServer`);
    if (minutelyNetStats.length !== 0) {
        // １分ごとの集計データの初期データを受け取っているときには、最後の１分データを削除し、受け取った最新値を追加する
        minutelyNetStats = [...minutelyNetStats.slice(1), newMinutelyNetStats];
        console.log(`${currentTimeReadable()} | Update : minutelyNetStats. | Data range : ${unixTimeReadable(minutelyNetStats[minutelyNetStats.length - 1].startTimeUnix)} - ${unixTimeReadable(minutelyNetStats[0].startTimeUnix)}`);
        // 受け取った最新値をデータパブリッシャーに転送
        dataPoolServer.to(dataPublisherId).emit('newMinutelyNetStats', newMinutelyNetStats);
        console.log(`${currentTimeReadable()} | Emit : 'newMinutelyNetStats' | To : dataPublisher`);
    }
});

//
// １時間ごとの集計データに関する処理
//

// １時間ごとの集計データの初期データを受け取った時のイベント'initialHourlyNetStats'を受けた時の処理
socketClient.on("initialHourlyNetStats", (initialHourlyNetStats: netStatsArray) => {
    // 受け取った初期データを格納する
    console.log(`${currentTimeReadable()} | Receive : 'initialHourlyNetStats' | From : socketServer`);
    hourlyNetStats = initialHourlyNetStats;
});

// 新しい１時間データが集計されたときに発行されるイベント'newHourlyNetStats'を受けた時の処理
socketClient.on("newHourlyNetStats", (newHourlyNetStats: netStats) => {
    console.log(`${currentTimeReadable()} | Receive : 'newHourlyNetStats' | From : socketServer`);
    if (hourlyNetStats.length !== 0) {
        // １時間ごとの集計データの初期データを受け取っているときには、最後の１時間データを削除し、受け取った最新値を追加する
        hourlyNetStats = [...hourlyNetStats.slice(1), newHourlyNetStats];
        console.log(`${currentTimeReadable()} | Update : hourlyNetStats. | Data range : ${unixTimeReadable(hourlyNetStats[hourlyNetStats.length - 1].startTimeUnix)} - ${unixTimeReadable(hourlyNetStats[0].startTimeUnix)}`);
        // 受け取った最新値をデータパブリッシャーに転送
        dataPoolServer.to(dataPublisherId).emit('newHourlyNetStats', newHourlyNetStats);
    }
});

//
// １日ごとの集計データに関する処理
//

// １日ごとの集計データの初期データを受け取った時のイベント'initialDailyNetStats'を受けた時の処理
socketClient.on("initialDailyNetStats", (initialDailyNetStats: netStatsArray) => {
    // 受け取った初期データを格納する
    console.log(`${currentTimeReadable()} | Receive : 'initialDailyNetStats' | From : socketServer`);
    dailyNetStats = initialDailyNetStats;
});

// 新しい１日データが集計されたときに発行されるイベント'newDailyNetStats'を受けた時の処理
socketClient.on("newDailyNetStats", (newDailyNetStats: netStats) => {
    console.log(`${currentTimeReadable()} | Receive : 'newDailyNetStats' | From : socketServer`);
    if (dailyNetStats.length !== 0) {
        // １日ごとの集計データの初期データを受け取っているときには、最後の１日データを削除し、受け取った最新値を追加する
        dailyNetStats = [...dailyNetStats.slice(1), newDailyNetStats];
        console.log(`${currentTimeReadable()} | Update : dailyNetStats. | Data range : ${unixTimeReadable(dailyNetStats[dailyNetStats.length - 1].startTimeUnix)} - ${unixTimeReadable(dailyNetStats[0].startTimeUnix)}`);
        // 受け取った最新値をデータパブリッシャーに転送
        dataPoolServer.to(dataPublisherId).emit('newDailyNetStats', newDailyNetStats);
    }
});

//
// １週間ごとの集計データに関する処理
//

// １週間ごとの集計データの初期データを受け取った時のイベント'initialWeeklyNetStats'を受けた時の処理
socketClient.on("initialWeeklyNetStats", (initialWeeklyNetStats: netStatsArray) => {
    // 受け取った初期データを格納する
    console.log(`${currentTimeReadable()} | Receive : 'initialWeeklyNetStats' | From : socketServer`);
    weeklyNetStats = initialWeeklyNetStats;
});

// 新しい１週間データが集計されたときに発行されるイベント'newWeeklyNetStats'を受けた時の処理
socketClient.on("newWeeklyNetStats", (newWeeklyNetStats: netStats) => {
    console.log(`${currentTimeReadable()} | Receive : 'newWeeklyNetStats' | From : socketServer`);
    if (weeklyNetStats.length !== 0) {
        // １週間ごとの集計データの初期データを受け取っているときには、最後の１週間データを削除し、受け取った最新値を追加する
        weeklyNetStats = [...weeklyNetStats.slice(1), newWeeklyNetStats];
        console.log(`${currentTimeReadable()} | Update : weeklyNetStats. | Data range : ${unixTimeReadable(weeklyNetStats[weeklyNetStats.length - 1].startTimeUnix)} - ${unixTimeReadable(weeklyNetStats[0].startTimeUnix)}`);
        // 受け取った最新値をデータパブリッシャーに転送
        dataPoolServer.to(dataPublisherId).emit('newWeeklyNetStats', newWeeklyNetStats);
    }
});

// フロントエンドの'Latest blocks'セクションの初期データを受け取った時の処理
socketClient.on("initialBlockData", (initialBlockData: blockDataArray) => {
    // 受け取ったデータを格納
    console.log(`${currentTimeReadable()} | Receive : 'initialBlockData' | From : socketServer`);
    blockDataArray = initialBlockData;
});

// 'Latest blocks'セクションの新規データを受け取った時の処理
socketClient.on("newBlockData", (newBlockData: blockData) => {
    console.log(`${currentTimeReadable()} | Receive : 'newBlockData'`);
    if (blockDataArray.length !== 0) {
        // 初期データを受け取っているときには、最後の値を削除し、最新値を追加する
        blockDataArray.pop();
        blockDataArray.unshift(newBlockData);
        // 最新値をデータパブリッシャーに転送
        dataPoolServer.to(dataPublisherId).emit('newBlockData', newBlockData);
    }
});

// ユーザーによって入力あるいはクリックされたブロック番号の詳細を受け取った時のイベント'responseBlockDetail'の処理
socketClient.on('responseBlockDetail', (responseBlockDetail: responseBlockDetail) => {
    console.log(`${currentTimeReadable()} | Receive : 'responseBlockDetail' | From : socketServer | noRecord : ${responseBlockDetail.noRecord}`);
    // 受け取ったデータをそのままデータパブリッシャーに転送
    dataPoolServer.to(dataPublisherId).emit('responseBlockDetail', responseBlockDetail);
    console.log(`${currentTimeReadable()} | Emit : 'responseBlockDetail' | To : dataPublisher`);
});

// 'Block list'ページに表示するブロックデータを受け取るイベント'responseBlockList'の処理
socketClient.on('responseBlockList', (responseBlockList: responseBlockList) => {
    console.log(`${currentTimeReadable()} | Receive : 'responseBlockList' | From : socketServer`);
    // 受け取ったデータをそのままデータパブリッシャーに転送
    dataPoolServer.to(dataPublisherId).emit('responseBlockList', responseBlockList);
    console.log(`${currentTimeReadable()} | Emit : 'responseBlockList' | To : dataPublisher`);
});

// ユーザーが'Block list'ページのページ番号をクリックあるいはブロックナンバーを入力したときに、
// そのページ番号に含まれるブロックデータの検索結果を通知するイベント'responseBlockListPageByBlockNumber'を受け取った時の処理
socketClient.on('responseBlockListPageByBlockNumber', (responseBlockListPageByBlockNumber: responseBlockListPageByBlockNumber) => {
    console.log(`${currentTimeReadable()} | Receive : 'responseBlockListPageByBlockNumber' | From : socketServer`);
    // 受け取ったデータをそのまま転送
    dataPoolServer.to(dataPublisherId).emit('responseBlockListPageByBlockNumber', responseBlockListPageByBlockNumber);
    console.log(`${currentTimeReadable()} | Emit : 'responseBlockListPageByBlockNumber' | To : dataPublisher`);
});
