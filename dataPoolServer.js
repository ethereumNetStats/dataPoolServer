import { Server } from "socket.io";
const currentTimeReadable = () => {
    let date_obj = new Date();
    return `${date_obj.getUTCFullYear()}-${('0' + (date_obj.getUTCMonth() + 1)).slice(-2)}-${('0' + date_obj.getUTCDate()).slice(-2)} ${('0' + date_obj.getUTCHours()).slice(-2)}:${('0' + date_obj.getUTCMinutes()).slice(-2)}:${('0' + date_obj.getUTCSeconds()).slice(-2)}`;
};
const unixTimeReadable = (unix_sec) => {
    let date_obj = new Date(unix_sec);
    return `${date_obj.getUTCFullYear()}-${('0' + (date_obj.getUTCMonth() + 1)).slice(-2)}-${('0' + date_obj.getUTCDate()).slice(-2)} ${('0' + date_obj.getUTCHours()).slice(-2)}:${('0' + date_obj.getUTCMinutes()).slice(-2)}:${('0' + date_obj.getUTCSeconds()).slice(-2)}`;
};
const dataPoolServer = new Server(2226);
let minutelyNetStatsMakerId = '';
let minutelyBasicData = [];
const minutelyDataDuration = 60 * 1000;
let hourlyBasicNetStatsMakerId = '';
let hourlyBasicData = [];
let hourlyDataDuration = 60 * 60 * 1000;
let dailyBasicNetStatsMakerId = '';
let dailyBasicData = [];
let dailyDataDuration = 24 * 60 * 60 * 1000;
let weeklyBasicNetStatsMakerId = '';
let weeklyBasicData = [];
let weeklyDataDuration = 7 * 24 * 60 * 60 * 1000;
let ethChartSocketServerId = '';
const minutelyBasicNetStatsMakerName = 'minutelyBasicNetStatsMaker';
const hourlyBasicNetStatsMakerName = 'hourlyBasicNetStatsMaker';
const dailyBasicNetStatsMakerName = 'dailyBasicNetStatsMaker';
const weeklyBasicNetStatsMakerName = "weeklyBasicNetStatsMaker";
const ethChartSocketServerName = 'ethChartSocketServer';
dataPoolServer.on('connect', async (client) => {
    console.log(`${currentTimeReadable()} | Connect with a socket client. ID : ${client.id}`);
    if (client.handshake.query.name === minutelyBasicNetStatsMakerName) {
        minutelyNetStatsMakerId = client.id;
        console.log(`${currentTimeReadable()} | The minutelyNetStatsMaker is connected.`);
        dataPoolServer.to(minutelyNetStatsMakerId).emit('requestMinutelyBasicInitialData');
    }
    else if (client.handshake.query.name === hourlyBasicNetStatsMakerName) {
        hourlyBasicNetStatsMakerId = client.id;
        console.log(`${currentTimeReadable()} | The hourlyNetStatsMaker is connected.`);
        dataPoolServer.to(hourlyBasicNetStatsMakerId).emit('requestHourlyBasicInitialData');
    }
    else if (client.handshake.query.name === dailyBasicNetStatsMakerName) {
        dailyBasicNetStatsMakerId = client.id;
        console.log(`${currentTimeReadable()} | The dailyNetStatsMaker is connected.`);
        dataPoolServer.to(dailyBasicNetStatsMakerId).emit('requestDailyBasicInitialData');
    }
    else if (client.handshake.query.name === weeklyBasicNetStatsMakerName) {
        weeklyBasicNetStatsMakerId = client.id;
        console.log(`${currentTimeReadable()} | The weeklyNetStatsMaker is connected.`);
        dataPoolServer.to(weeklyBasicNetStatsMakerId).emit('requestWeeklyBasicInitialData');
    }
    else if (client.handshake.query.name === ethChartSocketServerName) {
        ethChartSocketServerId = client.id;
        console.log(`${currentTimeReadable()} | The ethChartSocketServer is connected.`);
    }
    else {
        dataPoolServer.to(client.id).emit('whoAreYou');
    }
    client.on('sendMinutelyBasicInitialData', (minutelyBasicInitialData) => {
        minutelyBasicData = minutelyBasicInitialData;
        console.log(`${currentTimeReadable()} | Receive the minutely basic initial data. ${unixTimeReadable(minutelyBasicInitialData[0].startTimeUnix * 1000)} ${unixTimeReadable(minutelyBasicInitialData[minutelyBasicInitialData.length - 1].startTimeUnix * 1000)}`);
    });
    client.on('collectingMinutelyBasicData', () => {
        console.log(`${currentTimeReadable()} | The minutely data maker is collecting data until current time.`);
        setTimeout(() => {
            dataPoolServer.to(minutelyNetStatsMakerId).emit('requestMinutelyBasicInitialData');
        }, minutelyDataDuration);
    });
    client.on(`minutelyBasicNewData`, (minutelyBasicNewData) => {
        console.log(`${currentTimeReadable()} | Receive the minutelyBasicNewData event.`);
        if (minutelyBasicData.length !== 0) {
            minutelyBasicData = [...minutelyBasicData.slice(1), minutelyBasicNewData];
            console.log(`${currentTimeReadable()} | Update the minutely basic data. ${unixTimeReadable(minutelyBasicData[0].startTimeUnix * 1000)} ${unixTimeReadable(minutelyBasicData[minutelyBasicData.length - 1].startTimeUnix * 1000)}`);
            dataPoolServer.to(ethChartSocketServerId).emit('minutelyBasicNewData', minutelyBasicNewData);
            console.log(`${currentTimeReadable()} | Emit the minutelyBasicNewData event.`);
        }
    });
    client.on('requestMinutelyBasicInitialData', () => {
        console.log(`${currentTimeReadable()} | Receive the requestMinutelyBasicInitialData event.`);
        if (minutelyBasicData.length !== 0) {
            dataPoolServer.to(ethChartSocketServerId).emit('minutelyBasicInitialData', (minutelyBasicData));
            console.log(`${currentTimeReadable()} | Emit the minutelyBasicInitialData event.`);
        }
        else {
            dataPoolServer.to(ethChartSocketServerId).emit('stillNoMinutelyBasicInitialData');
            console.log(`${currentTimeReadable()} | The basicInitialChartData is not stored yet. Emit the stillNoMinutelyBasicInitialData event.`);
        }
    });
    client.on('sendHourlyBasicInitialData', (hourlyBasicInitialData) => {
        hourlyBasicData = hourlyBasicInitialData;
        console.log(`${currentTimeReadable()} | Receive the hourly basic initial data. ${unixTimeReadable(hourlyBasicInitialData[0].startTimeUnix * 1000)} ${unixTimeReadable(hourlyBasicInitialData[hourlyBasicInitialData.length - 1].startTimeUnix * 1000)}`);
    });
    client.on('collectingHourlyBasicData', () => {
        console.log(`${currentTimeReadable()} | The hourly data maker is collecting data until current time.`);
        setTimeout(() => {
            dataPoolServer.to(hourlyBasicNetStatsMakerId).emit('requestHourlyBasicInitialData');
        }, hourlyDataDuration);
    });
    client.on(`hourlyBasicNewData`, async (hourlyBasicNewData) => {
        console.log(`${currentTimeReadable()} | Receive the hourlyBasicNewData event.`);
        if (hourlyBasicData.length !== 0) {
            hourlyBasicData = [...hourlyBasicData.slice(1), hourlyBasicNewData];
            console.log(`${currentTimeReadable()} | Update the hourly basic data. ${unixTimeReadable(hourlyBasicData[0].startTimeUnix * 1000)} ${unixTimeReadable(hourlyBasicData[hourlyBasicData.length - 1].startTimeUnix * 1000)}`);
            dataPoolServer.to(ethChartSocketServerId).emit('hourlyBasicNewData', hourlyBasicNewData);
            console.log(`${currentTimeReadable()} | Emit the hourlyBasicNewData event.`);
        }
    });
    client.on('requestHourlyBasicInitialData', () => {
        console.log(`${currentTimeReadable()} | Receive the requestHourlyBasicInitialData event.`);
        if (hourlyBasicData.length !== 0) {
            dataPoolServer.to(ethChartSocketServerId).emit('hourlyBasicInitialData', (hourlyBasicData));
            console.log(`${currentTimeReadable()} | Emit the hourlyBasicInitialData event.`);
        }
        else {
            dataPoolServer.to(ethChartSocketServerId).emit('stillNoHourlyBasicInitialData');
            console.log(`${currentTimeReadable()} | The hourlyBasicInitialChartData is not stored yet. Emit the stillNoHourlyBasicInitialData event.`);
        }
    });
    client.on('sendDailyBasicInitialData', (dailyBasicInitialData) => {
        dailyBasicData = dailyBasicInitialData;
        console.log(`${currentTimeReadable()} | Receive the daily basic initial data. ${unixTimeReadable(dailyBasicInitialData[0].startTimeUnix * 1000)} ${unixTimeReadable(dailyBasicInitialData[dailyBasicInitialData.length - 1].startTimeUnix * 1000)}`);
    });
    client.on('collectingDailyBasicData', () => {
        console.log(`${currentTimeReadable()} | The daily data maker is collecting data until current time.`);
        setTimeout(() => {
            dataPoolServer.to(dailyBasicNetStatsMakerId).emit('requestDailyBasicInitialData');
        }, dailyDataDuration);
    });
    client.on(`dailyBasicNewData`, async (dailyBasicNewData) => {
        console.log(`${currentTimeReadable()} | Receive the dailyBasicNewData event.`);
        if (dailyBasicData.length !== 0) {
            dailyBasicData = [...dailyBasicData.slice(1), dailyBasicNewData];
            console.log(`${currentTimeReadable()} | Update the daily basic data. ${unixTimeReadable(dailyBasicData[0].startTimeUnix * 1000)} ${unixTimeReadable(dailyBasicData[dailyBasicData.length - 1].startTimeUnix * 1000)}`);
            dataPoolServer.to(ethChartSocketServerId).emit('dailyBasicNewData', dailyBasicNewData);
            console.log(`${currentTimeReadable()} | Emit the dailyBasicNewData event.`);
        }
    });
    client.on('requestDailyBasicInitialData', () => {
        console.log(`${currentTimeReadable()} | Receive the requestDailyBasicInitialData event.`);
        if (dailyBasicData.length !== 0) {
            dataPoolServer.to(ethChartSocketServerId).emit('dailyBasicInitialData', (dailyBasicData));
            console.log(`${currentTimeReadable()} | Emit the dailyBasicInitialData event.`);
        }
        else {
            dataPoolServer.to(ethChartSocketServerId).emit('stillNoDailyBasicInitialData');
            console.log(`${currentTimeReadable()} | The dailyBasicInitialData is not stored yet. Emit the stillNoDailyBasicInitialData event.`);
        }
    });
    client.on('sendWeeklyBasicInitialData', (weeklyBasicInitialData) => {
        weeklyBasicData = weeklyBasicInitialData;
        console.log(`${currentTimeReadable()} | Receive the weekly basic initial data. ${unixTimeReadable(weeklyBasicInitialData[0].startTimeUnix * 1000)} ${unixTimeReadable(weeklyBasicInitialData[weeklyBasicInitialData.length - 1].startTimeUnix * 1000)}`);
    });
    client.on('collectingWeeklyBasicData', () => {
        console.log(`${currentTimeReadable()} | The weekly data maker is collecting data until current time.`);
        setTimeout(() => {
            dataPoolServer.to(weeklyBasicNetStatsMakerId).emit('requestWeeklyBasicInitialData');
        }, weeklyDataDuration);
    });
    client.on(`weeklyBasicNewData`, async (weeklyBasicNewData) => {
        console.log(`${currentTimeReadable()} | Receive the dailyBasicNewData event.`);
        if (weeklyBasicData.length !== 0) {
            weeklyBasicData = [...weeklyBasicData.slice(1), weeklyBasicNewData];
            console.log(`${currentTimeReadable()} | Update the weekly basic data. ${unixTimeReadable(weeklyBasicData[0].startTimeUnix * 1000)} ${unixTimeReadable(weeklyBasicData[weeklyBasicData.length - 1].startTimeUnix * 1000)}`);
            dataPoolServer.to(ethChartSocketServerId).emit('weeklyBasicNewData', weeklyBasicNewData);
            console.log(`${currentTimeReadable()} | Emit the weeklyBasicNewData event.`);
        }
    });
    client.on('requestWeeklyBasicInitialData', () => {
        console.log(`${currentTimeReadable()} | Receive the requestWeeklyBasicInitialData event.`);
        if (weeklyBasicData.length !== 0) {
            dataPoolServer.to(ethChartSocketServerId).emit('weeklyBasicInitialData', (weeklyBasicData));
            console.log(`${currentTimeReadable()} | Emit the weeklyBasicInitialData event.`);
        }
        else {
            dataPoolServer.to(ethChartSocketServerId).emit('stillNoWeeklyBasicInitialData');
            console.log(`${currentTimeReadable()} | The weeklyBasicInitialData is not stored yet. Emit the stillNoWeeklyBasicInitialData event.`);
        }
    });
    client.on("disconnect", (reason) => {
        if (client.id === minutelyNetStatsMakerId) {
            console.log(`${currentTimeReadable()} | Disconnect from minutelyBasicNetStatsMaker. Reason : ${reason}`);
        }
        else if (client.id === hourlyBasicNetStatsMakerId) {
            console.log(`${currentTimeReadable()} | Disconnect from hourlyBasicNetStatsMaker. Reason : ${reason}`);
        }
        else if (client.id === dailyBasicNetStatsMakerId) {
            console.log(`${currentTimeReadable()} | Disconnect from dailyBasicNetStatsMaker. Reason : ${reason}`);
        }
        else if (client.id === weeklyBasicNetStatsMakerId) {
            console.log(`${currentTimeReadable()} | Disconnect from weeklyBasicNetStatsMaker. Reason : ${reason}`);
        }
        else if (client.id === ethChartSocketServerId) {
            console.log(`${currentTimeReadable()} | Disconnect from ethChartSocketServer. Reason : ${reason}`);
        }
        else {
            console.log(`${currentTimeReadable()} | Disconnect from an unknown client. Reason : ${reason}`);
        }
        client.disconnect();
    });
});
dataPoolServer.on("reconnect", (attempt) => {
    console.log(`${currentTimeReadable()} | Reconnect with the backend server.`);
    console.log(attempt);
});
dataPoolServer.on("reconnect_error", (error) => {
    console.log(`${currentTimeReadable()} | Reconnect error occurred.`);
    console.log(error);
});
dataPoolServer.on("reconnect_failed", () => {
    console.log(`${currentTimeReadable()} | Reconnection failed.`);
});
