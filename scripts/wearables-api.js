/*
* This file provides an API for hitting the context-aware PHP backend.
*/

function _formatResponse(data, cb) {
    results = [];
    data.forEach(function(row) {
        results.push({
            id: parseInt(row[0]),
            data: parseInt(row[1]),
            time: parseInt(row[2])
        });
    });
    return cb(results);
}

function _formatResponseAC(data, cb) {
    results = [];
    data.forEach(function(row) {
        results.push({
            id: +(row[0]),
            dataX: +(row[1]),
            dataY: +(row[2]),
            dataZ: +(row[3]),
            time: +(row[4])
        });
    });
    return cb(results);
}

function _getDataByTime(func, start, end, cb) {
    var url = "/~jmt9642/wearable_web/php/getPlayers.php?func=" + func + "&start=" + start + "&end=" + end;
    $.ajax({
        url: url,
        success: function (data) { return _formatResponse(data, cb); }
    });
}

function _getACDataByTime(func, start, end, cb) {
    var url = "/~jmt9642/wearable_web/php/getPlayers.php?func=" + func + "&start=" + start + "&end=" + end;
    $.ajax({
        url: url,
        success: function (data) { return _formatResponseAC(data, cb); }
    });
}


function _getDataByLatest(func, player, cb) {
    var url = "/~jmt9642/wearable_web/php/getPlayers.php?func=" + func + "&player=" + player;
    $.ajax({
        async: false,
        url: url,
        success: function (data) { return cb(data); }
    });
}

var wearables = {
    getHeartRateByTime: function(start, end, cb) { _getDataByTime("allHRTime", start, end, cb); },
    getGSRByTime: function (start, end, cb) { _getDataByTime("allGSRTime", start, end, cb); },
    getSkinByTime: function (start, end, cb) { _getDataByTime("allSkinTime", start, end, cb); },
    getACByTime: function (start, end, cb) { _getACDataByTime("allACTime", start, end, cb); },
    getBAByTime: function (start, end, cb) { _getDataByTime("allBATime", start, end, cb); },

    getLatestHR: function (player, cb) { _getDataByLatest("hr", player, cb); },
    getLatestGSR: function (player, cb) { _getDataByLatest("gsr", player, cb); },
    getLatestSkin: function (player, cb) { _getDataByLatest("skintemp", player, cb); },
    getLatestAL: function (player, cb) { _getDataByLatest("al", player, cb); },
    getLatestAC: function (player, cb) { _getDataByLatest("ac", player, cb); },
    getLatestBA: function (player, cb) { _getDataByLatest("ba", player, cb); }
}
