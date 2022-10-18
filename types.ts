type recordOfEthDB = {
    'id'?: number,
    'startTimeReadable'?: string,
    'endTimeReadable'?: string,
    'startTimeUnix': number,
    'endTimeUnix': number,
    'actualStartTimeUnix': number,
    'actualEndTimeUnix': number,
    'startBlockNumber': number,
    'endBlockNumber': number,
    'blocks': number,
    'totalBlockSize': number,
    'averageBlockSize': number,
    'totalDifficulty': number,
    'averageDifficulty': number,
    'totalUncleDifficulty': number,
    'hashRate': number,
    'transactions': number,
    'transactionsPerBlock': number,
    'noRecordFlag'?: boolean,
};

type recordOfEthDBArray = Array<recordOfEthDB>;

type addresses = {
    startTime: number,
    endTime: number,
    value: number,
}

type arrayOfAddresses = Array<addresses>

type addressesInTimeRange = {
    minutely: arrayOfAddresses,
    hourly: arrayOfAddresses,
    daily: arrayOfAddresses,
    weekly: arrayOfAddresses
}

type minutelyAddressCount = {
    startTimeReadable: string,
    endTimeReadable: string,
    startTimeUnix: number,
    endTimeUnix: number,
    numberOfAddress: number,
    noRecordFlag: boolean,
};

type minutelyNetStats = recordOfEthDB & Pick<minutelyAddressCount, "numberOfAddress">;

type minutelyNetStatsArray = Array<minutelyNetStats>;

export type {
    recordOfEthDB,
    recordOfEthDBArray,
    arrayOfAddresses,
    addressesInTimeRange,
    addresses,
    minutelyNetStats,
    minutelyNetStatsArray
}
