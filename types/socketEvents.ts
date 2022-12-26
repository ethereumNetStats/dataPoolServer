// ソケット通信で送受信するデータ型のインポート
import type {
    blockData,
    blockDataArray,
    netStats,
    netStatsArray,
    requestBlockDetail, requestBlockList, requestBlockListPageByBlockNumber,
    responseBlockDetail,
    responseBlockList, responseBlockListPageByBlockNumber
} from "./types";

//
// データプールサーバーからデータパブリッシャーに送るソケット通信のイベント名とデータ型の定義
//
type dataPoolServerToEthChartSocketServerEvents = {
    initialMinutelyNetStats: (minutelyNetStatsArray: netStatsArray) => void,
    stillNoInitialMinutelyNetStats: () => void,

    initialHourlyNetStats: (hourlyNetStatsArray: netStatsArray) => void,
    stillNoInitialHourlyNetStats: () => void,

    initialDailyNetStats: (dailyNetStatsArray: netStatsArray) => void,
    stillNoInitialDailyNetStats: () => void,

    initialWeeklyNetStats: (weeklyNetStatsArray: netStatsArray) => void,
    stillNoInitialWeeklyNetStats: () => void,

    initialBlockData: (blockDataArray: blockDataArray) => void,
    stillNoInitialBlockData: () => void,

    responseBlockDetail: (responseBlockDetail: responseBlockDetail) => void,
    responseBlockList: (responseBlockList: responseBlockList) => void,
    responseBlockListPageByBlockNumber: (responseBlockListPageByBlockNumber: responseBlockListPageByBlockNumber) => void,
}

//
// データパブリッシャーからデータプールサーバーに送るソケット通信のイベント名とデータ型の定義
//
type ethChartSocketServerToDataPoolServerEvents = {
    requestInitialMinutelyNetStats: () => void,
    requestInitialHourlyNetStats: () => void,
    requestInitialDailyNetStats: () => void,
    requestInitialWeeklyNetStats: () => void,

    requestInitialBlockData: () => void,

    requestBlockDetail: (requestBlockDetail: requestBlockDetail) => void,
    requestBlockList: (requestBlockList: requestBlockList) => void,
    requestBlockListPageByBlockNumber: (requestBlockListPageByBlockNumber: requestBlockListPageByBlockNumber) => void,
}

//
// ソケットサーバーからデータプールサーバーに送るソケット通信のイベント名とデータ型の定義
//
type SocketServerToDataPoolServerEvents = {
    initialMinutelyNetStats: (minutelyNetStatsArray: netStatsArray) => void,
    newMinutelyNetStats: (newMinutelyNetStats: netStats) => void,

    initialHourlyNetStats: (hourlyNetStatsArray: netStatsArray) => void,
    newHourlyNetStats: (newHourlyNetStats: netStats) => void,

    initialDailyNetStats: (dailyNetStatsArray: netStatsArray) => void,
    newDailyNetStats: (newDailyNetStats: netStats) => void,

    initialWeeklyNetStats: (weeklyNetStatsArray: netStatsArray) => void,
    newWeeklyNetStats: (newWeeklyNetStats: netStats) => void,

    initialBlockData: (blockDataArray: blockDataArray) => void,
    newBlockData: (blockData: blockData) => void,

    responseBlockDetail: (responseBlockDetail: responseBlockDetail) => void,
    responseBlockList: (responseBlockList: responseBlockList) => void,
    responseBlockListPageByBlockNumber: (responseBlockListPageByBlockNumber: responseBlockListPageByBlockNumber) => void,
}

//
// データプールサーバーからソケットサーバーに送るソケット通信のイベント名とデータ型の定義
//
type DataPoolServerToSocketServerEvents = {
    requestInitialMinutelyNetStats: () => void,
    requestInitialHourlyNetStats: () => void,
    requestInitialDailyNetStats: () => void,
    requestInitialWeeklyNetStats: () => void,

    requestInitialBlockData: () => void,

    requestBlockDetail: (requestBlockDetail: requestBlockDetail) => void,
    requestBlockList: (requestBlockList: requestBlockList) => void,
    requestBlockListPageByBlockNumber: (requestBlockListPageByBlockNumber: requestBlockListPageByBlockNumber) => void,
}

export type {dataPoolServerToEthChartSocketServerEvents, ethChartSocketServerToDataPoolServerEvents, SocketServerToDataPoolServerEvents, DataPoolServerToSocketServerEvents}
