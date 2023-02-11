// 集計データのデータベースのテーブルの型定義
type basicNetStats = {
    startTimeReadable: string,
    endTimeReadable: string,
    startTimeUnix: number,
    endTimeUnix: number,
    actualStartTimeUnix: number,
    actualEndTimeUnix: number,
    startBlockNumber: number,
    endBlockNumber: number,
    blocks: number,
    totalBlockSize: number,
    averageBlockSize: number,
    blockSizePerBlock: number,
    totalDifficulty: string,
    averageDifficulty: string,
    difficultyPerBlock: string,
    totalUncleDifficulty: string,
    averageUncleDifficulty: string,
    uncleDifficultyPerBlock: string,
    totalNumberOfUncleBlocks: number,
    averageNumberOfUncleBlocks: number,
    numberOfUncleBlocksPerBlock: number,
    hashRate: number,
    totalTransactions: number,
    averageTransactions: number,
    transactionsPerBlock: number,
    totalBaseFeePerGas: number,
    averageBaseFeePerGas: number,
    baseFeePerGasPerBlock: number,
    totalGasUsed: number,
    averageGasUsed: number,
    gasUsedPerBlock: number,
    noRecordFlag: boolean,
};

// アドレス数の集計データの型定義
type numberOfAddresses = {
    startTimeReadable: string,
    endTimeReadable: string,
    startTimeUnix: number,
    endTimeUnix: number,
    numberOfAddress: number,
    noRecordFlag: boolean,
};

// Gethのブロックデータの型定義
type blockData = {
    id?: number,
    number: number,
    hash: string,
    parentHash: string,
    baseFeePerGas: number,
    nonce: string,
    sha3Uncles: string,
    logsBloom: string,
    transactionsRoot: string,
    miner: string,
    difficulty: string,
    totalDifficulty: string,
    extraData: string,
    size: number,
    gasLimit: number,
    gasUsed: number,
    timestamp: number,
    transactions: string,
    uncles: string,
    mixHash: string,
    receiptsRoot: string,
    timestampReadable?: string,
}

// ブロックデータの配列を定義
type blockDataArray = Array<blockData>;

// 集計データにアドレス数を加えた型の定義
type netStats = basicNetStats & Pick<numberOfAddresses, "numberOfAddress">;

// 集計データにアドレス数を加えたデータの配列の定義
type netStatsArray = Array<netStats>;

// 'requestBlockDetail'イベントで送信するデータの型定義
type requestBlockDetail = {
    number: number,
    frontendId: string,
}

// 'requestBlockList'イベントで送信するデータの型定義
type requestBlockList = {
    pageOffset: number,
    frontendId: string,
}

// 'responseBlockDetail'イベントで受信するデータの型定義
type responseBlockDetail = Pick<requestBlockDetail, "frontendId"> & blockData & {
    noRecord: boolean,
};

// 'responseBlockList'イベントで受信するデータの型定義
type responseBlockList = {
    list: Array<blockData>,
    latestBlockNumber: number,
    totalPage: number,
    currentPage: number,
    topBlockNumber: number,
    lastBlockNumber: number,
    itemsPerPage: number,
    pageOffset: number,
    frontendId: string,
}

// 'requestBlockListPageByBlockNumber'イベントで送信するデータの型定義
type requestBlockListPageByBlockNumber = {
    blockNumber: number,
    frontendId: string,
};

// 'responseBlockListPageByBlockNumber'イベントで受信するデータの型定義
type responseBlockListPageByBlockNumber = responseBlockList;

// transactionデータの型定義
type transactionDetail = {
    hash: string,
    nonce: number,
    blockHash: string | null,
    blockNumber: number | null,
    transactionIndex: number | null,
    from: string,
    to: string | null,
    input: string,
    value: string,
    gasPrice: string,
    gas: number,
    type?: number,
    v?: string,
    r?: string,
    s?: string,
    chainId?: string
}

// requestTransactionDetailのデータ型の定義
type requestTransactionDetail = {
    transactionHash: string,
    frontendId: string,
}

// responseTransactionDetailのデータ型の定義
type responseTransactionDetail = {
    transactionDetail?: transactionDetail
    frontendId: string,
    error: string,
}

export type {
    basicNetStats,
    netStats,
    netStatsArray,
    blockData,
    blockDataArray,
    requestBlockDetail,
    responseBlockDetail,
    responseBlockList,
    requestBlockList,
    requestBlockListPageByBlockNumber,
    responseBlockListPageByBlockNumber,
    requestTransactionDetail,
    responseTransactionDetail
}
