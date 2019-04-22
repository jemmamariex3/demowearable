var games = {
    // 03-17-2017
    s1g1: [1489785781161, 1489786200000],
    s1g2: [1489786620000, 1489787040000],
    s1g3: [1489787280000, 1489787700000],
    s1g4: [1489788000000, 1489788420000],

    // 03-17-2017
    s2g1: [1489789320000, 1489789740000],
    s2g2: [1489790100000, 1489790520000],
    s2g3: [1489790700000, 1489791120000],
    s2g4: [1489791240000, 1489791660000],
    s2g5: [1489792020000, 1489792440000]
};

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
    for(var i = 0; i < data.length; i += 15) { // a lot of overlap if i++
        if (i > 0 && data[i].id == data[i-1].id) {
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

// Handles button clicks on charts.php page
$(function() {
    // type: Multi-signal or Multi-user
    // display: gsr, ac, hr, skin or player1, player2, player3, player4
    var type, display;
    var custom = false;
    var live = false;

    // Multi-User OnClicks --------------------------------------------
    $("#chart-select").find("#multi-user").on('click', function() {
        type = "user";
        $('#multi-user-select').show();
        $('#multi-signal-select').hide();

        $('.toggle-select-chart').removeClass('button button-primary');
        $('#multi-user').addClass('button button-primary');

    });
    
    $("#type-select").find("#hr").on('click', function() {
        display = "heartRate";
        $('#session-select').show();
        $('.toggle-select-type').removeClass('button button-primary');
        $('#hr').addClass('button button-primary');
    });
    $("#type-select").find("#gsr").on('click', function() {
        display = "gsr";
        $('#session-select').show();
        $('.toggle-select-type').removeClass('button button-primary');
        $('#gsr').addClass('button button-primary');
    });
    $("#type-select").find("#skin").on('click', function() {
        display = "skin";
        $('#session-select').show();
        $('.toggle-select-type').removeClass('button button-primary');
        $('#skin').addClass('button button-primary');
    });
    $("#type-select").find("#ac").on('click', function() {
        display = "accelerometer";
        $('#session-select').show();
        $('.toggle-select-type').removeClass('button button-primary');
        $('#ac').addClass('button button-primary');
    });
    $("#type-select").find("#ba").on('click', function () {
        display = "breathAmp";
        $('#session-select').show();
        $('.toggle-select-type').removeClass('button button-primary');
        $('#ba').addClass('button button-primary');
    });
    $("#type-select").find("#csv").on('click', function () {
        display = "customData";
        $('#chart-container').show();
        $('.toggle-select-type').removeClass('button button-primary');
        $('#csv').addClass('button button-primary');
    });
    
    // Multi-Signal OnClicks -------------------------------------------
    $("#chart-select").find("#multi-signal").on('click', function() {
        type = "signal";
        $('#multi-user-select').hide();
        $('#multi-signal-select').show();

        $('.toggle-select-chart').removeClass('button button-primary');
        $('#multi-signal').addClass('button button-primary');
    });

    $("#type-select").find("#player1").on('click', function() {
        display = "1";
        $('#session-select').show();
        $('.toggle-select-type').removeClass('button button-primary');
        $('#player1').addClass('button button-primary');
    });
    $("#type-select").find("#player2").on('click', function() {
        display = "2";
        $('#session-select').show();
        $('.toggle-select-type').removeClass('button button-primary');
        $('#player2').addClass('button button-primary');
    });
    $("#type-select").find("#player3").on('click', function() {
        display = "3";
        $('#session-select').show();
        $('.toggle-select-type').removeClass('button button-primary');
        $('#player3').addClass('button button-primary');
    });
    $("#type-select").find("#player4").on('click', function() {
        display = "4";
        $('#session-select').show();
        $('.toggle-select-type').removeClass('button button-primary');
        $('#player4').addClass('button button-primary');
    });

    // Session Selection ------------------------------------------------
    $("#session-select").find("#s1").on('click', function () {
        custom = false;
        $('#game-select').show();
        $('#s2games').hide();
        $('#customGames').hide();
        $('#s1games').show();
        $('.toggle-select-session').removeClass('button button-primary');
        $('#s1').addClass('button button-primary');
    });
    $("#session-select").find("#s2").on('click', function () {
        custom = false;
        $('#game-select').show();
        $('#s1games').hide();
        $('#customGames').hide();
        $('#s2games').show();
        $('.toggle-select-session').removeClass('button button-primary');
        $('#s2').addClass('button button-primary');
    });
    $("#session-select").find("#custom").on('click', function () {
        custom = true;
        $('#game-select').show();
        $('#s1games').hide();
        $('#s2games').hide();
        $('#customGames').show();
        $('.toggle-select-session').removeClass('button button-primary');
        $('#custom').addClass('button button-primary');
    });

    // Game Selection ---------------------------------------------------
    $("#game-select").find("button").on('click', function() {
        var start, end;
        if (!custom) {
            var id = $(this).attr('id');
            $('.toggle-select-game').removeClass('button button-primary');
            $('#' + id).addClass('button button-primary');

            var chartTitle = $(this).parent().find(".session-name").text() + "<br>" + $(this).text();
            $("#chart-title").html(chartTitle);
        
            $('#chart-container').show();
            var key = $(this).attr('id');
            start = games[key][0];
            end = games[key][1];
        }
        else {
            $('.toggle-select-game').removeClass('button button-primary');
            $('#customFilter').addClass('button button-primary');
            
            var filteredTime = convertTime($('#customStart').val(), $('#customEnd').val());
            start = filteredTime.start;
            end = filteredTime.end;

            $('#chart-container').show();

            var chartTitle = "Custom: " + $('#customStart').val() + " to " + $('#customEnd').val();
            $("#chart-title").html(chartTitle);

        }
        // Build chart
        switch(type) {
            case "user": 
                getAllDataByTime(display, start, end, buildMultiUserChart); break;
            case "signal":
                getAllDataByTime(display, start, end, buildMultiSignalChart); break;
        }
    });
});
