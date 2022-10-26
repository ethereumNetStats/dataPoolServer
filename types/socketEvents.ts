import {netStats, netStatsArray} from "./types";

//
//Define the socket events from the data pool server to the ethChartClient.
//
type dataPoolServerToEthChartSocketServerEvents = {
    initialMinutelyNetStats: (minutelyNetStatsArray: netStatsArray) => void,
    stillNoInitialMinutelyNetStats: () => void,

    initialHourlyNetStats: (hourlyNetStatsArray: netStatsArray) => void,
    stillNoInitialHourlyNetStats: () => void,

    initialDailyNetStats: (dailyNetStatsArray: netStatsArray) => void,
    stillNoInitialDailyNetStats: () => void,
}

//
//Define the socket events from the ethChartServer to the socket server.
//
type ethChartSocketServerToDataPoolServerEvents = {
    requestInitialMinutelyNetStats: () => void,
    requestInitialHourlyNetStats: () => void,
    requestInitialDailyNetStats: () => void,
}

//
//Define the socket events from the socket server to the dataPoolServer.
//
type SocketServerToDataPoolServerEvents = {
    initialMinutelyNetStats: (minutelyNetStatsArray: netStatsArray) => void,
    newMinutelyNetStats: (newMinutelyNetStats: netStats) => void,

    initialHourlyNetStats: (hourlyNetStatsArray: netStatsArray) => void,
    newHourlyNetStats: (newHourlyNetStats: netStats) => void,

    initialDailyNetStats: (dailyNetStatsArray: netStatsArray) => void,
    newDailyNetStats: (newDailyNetStats: netStats) => void,
}

//
//Define the socket events from the dataPoolServer to the socketServer.
//
type DataPoolServerToSocketServerEvents = {
    requestInitialMinutelyNetStats: () => void,
    requestInitialHourlyNetStats: () => void,
    requestInitialDailyNetStats: () => void,
}

export type {dataPoolServerToEthChartSocketServerEvents, ethChartSocketServerToDataPoolServerEvents, SocketServerToDataPoolServerEvents, DataPoolServerToSocketServerEvents}
