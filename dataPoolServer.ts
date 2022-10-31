//Import environment variables.
import "dotenv/config";

//Import packages.
import {Server} from "socket.io";
import {io} from "socket.io-client";

//Import self-made packages.
import {currentTimeReadable, unixTimeReadable} from "@pierogi.dev/readable_time";

//Import types.
import type {Socket} from "socket.io-client";
import type {
    netStats,
    netStatsArray,
} from "./types/types";
import type {
    ethChartSocketServerToDataPoolServerEvents,
    dataPoolServerToEthChartSocketServerEvents,
    SocketServerToDataPoolServerEvents,
    DataPoolServerToSocketServerEvents
} from "./types/socketEvents"


//
//Followings are code for communicating the dataPoolServer with the ethChartSocketServer.
//

//Launch the dataPool socket server.
const dataPoolServer: Server = new Server<ethChartSocketServerToDataPoolServerEvents, dataPoolServerToEthChartSocketServerEvents>(2226);

let minutelyNetStats: netStatsArray = [];
let hourlyNetStats: netStatsArray = [];
let dailyNetStats: netStatsArray = [];
let weeklyNetStats: netStatsArray = [];

let ethChartSocketServerId: string = '';

//Define a socket server name.
const ethChartSocketServerName: string = 'ethChartSocketServer';

//Event listener and emitter with the ethChartSocketServer.
dataPoolServer.on('connect', async (client) => {

    switch (client.handshake.query.name) {
        case ethChartSocketServerName:
            ethChartSocketServerId = client.id;
            console.log(`${currentTimeReadable()} | Connect : ${ethChartSocketServerName}`);
            break;
    }

    client.on('requestInitialMinutelyNetStats', () => {
        if (minutelyNetStats.length !== 0) {
            dataPoolServer.to(ethChartSocketServerId).emit('initialMinutelyNetStats', minutelyNetStats);
            console.log(`${currentTimeReadable()} | Emit : 'initialMinutelyNetStats' | To : ethChartSocketServer`);
        } else {
            dataPoolServer.to(ethChartSocketServerId).emit('stillNoInitialMinutelyNetStats');
            console.log(`${currentTimeReadable()} | Emit : 'stillNoInitialMinutelyNetStats' | To : ethChartSocketServer`);
        }
    });

    client.on('requestInitialHourlyNetStats', () => {
        if (hourlyNetStats.length !== 0) {
            dataPoolServer.to(ethChartSocketServerId).emit('initialHourlyNetStats', hourlyNetStats);
            console.log(`${currentTimeReadable()} | Emit : 'initialHourlyNetStats' | To : ethChartSocketServer`);
        } else {
            dataPoolServer.to(ethChartSocketServerId).emit('stillNoInitialHourlyNetStats');
            console.log(`${currentTimeReadable()} | Emit : 'stillNoInitialHourlyNetStats' | To : ethChartSocketServer`);
        }
    });

    client.on('requestInitialDailyNetStats', () => {
        if (dailyNetStats.length !== 0) {
            dataPoolServer.to(ethChartSocketServerId).emit('initialDailyNetStats', dailyNetStats);
            console.log(`${currentTimeReadable()} | Emit : 'initialDailyNetStats' | To : ethChartSocketServer`);
        } else {
            dataPoolServer.to(ethChartSocketServerId).emit('stillNoInitialDailyNetStats');
            console.log(`${currentTimeReadable()} | Emit : 'stillNoInitialDailyNetStats' | To : ethChartSocketServer`);
        }
    });

    client.on('requestInitialWeeklyNetStats', () => {
        if (weeklyNetStats.length !== 0) {
            dataPoolServer.to(ethChartSocketServerId).emit('initialWeeklyNetStats', weeklyNetStats);
            console.log(`${currentTimeReadable()} | Emit : 'initialWeeklyNetStats' | To : ethChartSocketServer`);
        } else {
            dataPoolServer.to(ethChartSocketServerId).emit('stillNoInitialWeeklyNetStats');
            console.log(`${currentTimeReadable()} | Emit : 'stillNoInitialWeeklyNetStats' | To : ethChartSocketServer`);
        }
    });

    client.on("disconnect", (reason) => {

        switch (client.id) {
            case ethChartSocketServerId:
                console.log(`${currentTimeReadable()} | Disconnect : ethChartServer | Reason : ${reason}`);
        }

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
//Followings are code for communicating the dataPoolServer with the socketServer.
//

//Define a socket client name.
const dataPoolServerName: string = "dataPoolServer";

//Connect with the socketServer.
const socketClient: Socket<SocketServerToDataPoolServerEvents, DataPoolServerToSocketServerEvents> = io(`${process.env.SOCKET_SERVER_ADDRESS}`, {
    forceNew: true,
    query: {name: dataPoolServerName}
});

//Event listener and emitter with the dataPoolServer.
socketClient.on("connect", () => {
    console.log(`${currentTimeReadable()} | Connect : socketServer.`);
    socketClient.emit("requestInitialMinutelyNetStats");
    console.log(`${currentTimeReadable()} | Emit : 'requestInitialMinutelyNetStats' | To : socketServer`);
    socketClient.emit('requestInitialHourlyNetStats');
    console.log(`${currentTimeReadable()} | Emit : 'requestInitialHourlyNetStats' | To : socketServer`);
    socketClient.emit('requestInitialDailyNetStats');
    console.log(`${currentTimeReadable()} | Emit : 'requestInitialDailyNetStats' | To : socketServer`);
    socketClient.emit('requestInitialWeeklyNetStats');
    console.log(`${currentTimeReadable()} | Emit : 'requestInitialWeeklyNetStats' | To : socketServer`);
});

//
//Socket minutely event handlers with the socketServer.
//

socketClient.on("initialMinutelyNetStats", (initialMinutelyNetStats: netStatsArray) => {
    console.log(`${currentTimeReadable()} | Receive : 'initialMinutelyNetStats' | From : socketServer`);
    minutelyNetStats = initialMinutelyNetStats;
});

socketClient.on("newMinutelyNetStats", (newMinutelyNetStats: netStats) => {
    console.log(`${currentTimeReadable()} | Receive : 'newMinutelyNetStats' | From : socketServer`);
    if (minutelyNetStats.length !== 0) {
        minutelyNetStats = [...minutelyNetStats.slice(1), newMinutelyNetStats];
        console.log(`${currentTimeReadable()} | Update : minutelyNetStats. | Data range : ${unixTimeReadable(minutelyNetStats[minutelyNetStats.length - 1].startTimeUnix)} - ${unixTimeReadable(minutelyNetStats[0].startTimeUnix)}`);
        dataPoolServer.to(ethChartSocketServerId).emit('newMinutelyNetStats', newMinutelyNetStats);
        console.log(`${currentTimeReadable()} | Emit : 'newMinutelyNetStats' | To : ethChartSocketServer`);
    }
});

//
//Socket hourly event handlers with the socketServer.
//

socketClient.on("initialHourlyNetStats", (initialHourlyNetStats: netStatsArray) => {
    console.log(`${currentTimeReadable()} | Receive : 'initialHourlyNetStats' | From : socketServer`);
    hourlyNetStats = initialHourlyNetStats;
});

socketClient.on("newHourlyNetStats", (newHourlyNetStats: netStats) => {
    console.log(`${currentTimeReadable()} | Receive : 'newHourlyNetStats' | From : socketServer`);
    if (hourlyNetStats.length !== 0) {
        hourlyNetStats = [...hourlyNetStats.slice(1), newHourlyNetStats];
        console.log(`${currentTimeReadable()} | Update : hourlyNetStats. | Data range : ${unixTimeReadable(hourlyNetStats[hourlyNetStats.length - 1].startTimeUnix)} - ${unixTimeReadable(hourlyNetStats[0].startTimeUnix)}`);
        dataPoolServer.to(ethChartSocketServerId).emit('newHourlyNetStats', newHourlyNetStats);
    }
});

//
//Socket daily event handlers with the socketServer.
//

socketClient.on("initialDailyNetStats", (initialDailyNetStats: netStatsArray) => {
    console.log(`${currentTimeReadable()} | Receive : 'initialDailyNetStats' | From : socketServer`);
    dailyNetStats = initialDailyNetStats;
});

socketClient.on("newDailyNetStats", (newDailyNetStats: netStats) => {
    console.log(`${currentTimeReadable()} | Receive : 'newDailyNetStats' | From : socketServer`);
    if (dailyNetStats.length !== 0) {
        dailyNetStats = [...dailyNetStats.slice(1), newDailyNetStats];
        console.log(`${currentTimeReadable()} | Update : dailyNetStats. | Data range : ${unixTimeReadable(dailyNetStats[dailyNetStats.length - 1].startTimeUnix)} - ${unixTimeReadable(dailyNetStats[0].startTimeUnix)}`);
        dataPoolServer.to(ethChartSocketServerId).emit('newDailyNetStats', newDailyNetStats);
    }
});

//
//Socket weekly event handlers with the socketServer.
//

socketClient.on("initialWeeklyNetStats", (initialWeeklyNetStats: netStatsArray) => {
    console.log(`${currentTimeReadable()} | Receive : 'initialWeeklyNetStats' | From : socketServer`);
    weeklyNetStats = initialWeeklyNetStats;
});

socketClient.on("newWeeklyNetStats", (newWeeklyNetStats: netStats) => {
    console.log(`${currentTimeReadable()} | Receive : 'newWeeklyNetStats' | From : socketServer`);
    if (weeklyNetStats.length !== 0) {
        weeklyNetStats = [...weeklyNetStats.slice(1), newWeeklyNetStats];
        console.log(`${currentTimeReadable()} | Update : weeklyNetStats. | Data range : ${unixTimeReadable(weeklyNetStats[weeklyNetStats.length - 1].startTimeUnix)} - ${unixTimeReadable(weeklyNetStats[0].startTimeUnix)}`);
        dataPoolServer.to(ethChartSocketServerId).emit('newWeeklyNetStats', newWeeklyNetStats);
    }
});
