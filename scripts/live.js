// TODO: Refactor Duplicate Code ----------------------------------------------
function getAllDataByTime(display, start, end, cb) {
    var hr, gsr, skin, ac, ba;

    wearables.getGSRByTime(start, end, function (data) {
        gsr = data;
        wearables.getHeartRateByTime(start, end, function (data) {
            hr = data;
            wearables.getSkinByTime(start, end, function (data) {
                skin = data;
                wearables.getACByTime(start, end, function (data) {
                    ac = acTransform(data);
                    wearables.getBAByTime(start, end, function (data) {
                        ba = data;
                        return cb(display, start, end,
                            {
                                heartRate: hr,
                                gsr: gsr,
                                skin: skin,
                                accelerometer: ac,
                                breathAmp: ba
                            }
                        );
                    });
                });
            });
        });
    });
}

// Transform dataX, dataY, dataZ into instantaneous acceleration data
function acTransform(data) {
    // sqrt( (xn - xp)^2 + (yn-yp)^2 + (zn-zp)^2 )
    // where xp is prior x and xn is current x.
    var dataTransform, xn, xp, yn, yp, zn, zp;
    var newData = [];
    for (var i = 0; i < data.length; i += 15) { // a lot of overlap if i++
        if (i > 0 && data[i].id == data[i - 1].id) {
            xn = data[i].dataX;
            xp = data[i - 1].dataX;
            yn = data[i].dataY;
            yp = data[i - 1].dataY;
            zn = data[i].dataZ;
            zp = data[i - 1].dataZ;

            var tmp1 = Math.pow(xn - xp, 2);
            var tmp2 = Math.pow(yn - yp, 2);
            var tmp3 = Math.pow(zn - zp, 2);
            dataTransform = Math.sqrt(tmp1 + tmp2 + tmp3);

            newData.push({
                id: data[i].id,
                data: dataTransform,
                time: data[i].time
            });
        }
    }
    return newData;
}

function convertTime(startDate, endDate) {
    var unixStart = new Date(startDate).getTime();
    var unixEnd = new Date(endDate).getTime();

    var time = {
        start: unixStart,
        end: unixEnd
    };

    return time;
}
// DUPLICATE ------------------------------------------------------

$(function () {
    var live, display, start, end;

    // listen for start/stop button to get start and end times
    $("#live-buttons").find("#start").on('click', function () {
        start = new Date(); // keep for later
        live = true;
        $('#stop').show();
        // convert it to unix time stamp in milliseconds
        var filteredTime = convertTime(start, end);
        start = filteredTime.start;

        // Build live charts
        buildLiveMultiUserChart();
        // buildLiveMultiSignalChart();
    });
    
    $("#live-buttons").find("#stop").on('click', function () {
        end = new Date();
        live = false;

        // convert it to unix time stamp in milliseconds
        var filteredTime = convertTime(start, end);
        end = filteredTime.end;
        display = "breathAmp";
        
        // regenerate charts with non-live values
        getAllDataByTime(display, start, end, buildMultiUserChart);
        // getAllDataByTime(display, start, end, buildMultiSignalChart);

        console.log("start: " + start + " end:" + end);
    });
});