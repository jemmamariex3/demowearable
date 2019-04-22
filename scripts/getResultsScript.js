var buttonFlag = 0;

$(document).ready(function()
{
 $(window).load(function()
 {

/*####################################
######## BUTTON LISTENERS  ###########
####################################*/

    $("#charts").click(function() {
        window.location.href = '/charts.php';
    });

    $("#live").click(function () {
        window.location.href = '/live.php';
    });

    $("#playTurn").click(function()
    {
        window.location.href = '/minesweeper/index_turn.php';
    });

    $("#play_p1_vs_p2").click(function()
    {
        window.location.href = '/minesweeper/index_p1_vs_p2.php';
    });

    $("#play_p3_vs_p4").click(function()
    {
        window.location.href = '/minesweeper/index_p3_vs_p4.php';
    });

    $("#play_p1_vs_p2_turn").click(function()
    {
        window.location.href = '/minesweeper/index_p1_vs_p2_turn.php';
    });

    $("#play_p3_vs_p4_turn").click(function()
    {
        window.location.href = '/minesweeper/index_p3_vs_p4_turn.php';
    });

    $("#singlePlayer").click(function()
    {
        window.location.href = 'http://context-aware.sandbox.csun.edu/~sg938410/ms_kaplan/chooseplayerblind.php';
    });

    $("#heartButton").click(function()
    {
        if(buttonFlag == 1)
        {
            $("#errorMsg").html("Please Stop Live Script");
        }
        else
        {
            fetchAllHRData();
        }

    });

    $("#skinButton").click(function()
    {
        if(buttonFlag == 1)
        {
            $("#errorMsg").html("Please Stop Live Script");
        }
        else
        {
            fetchAllSkinData();
        }
    });

    $("#stressButton").click(function()
    {
        if(buttonFlag == 1)
        {
            $("#errorMsg").html("Please Stop Live Script");
        }
        else
        {
            fetchAllGSRData();
        }
    });

    $("#hideButton").click(function()
    {
        if(buttonFlag == 1)
        {
            $("#errorMsg").html("Please Stop Live Script");
        }
        else
        {
            document.getElementById("results").innerHTML = null;
            //$("#results").empty();
        }
    });

    $("#liveScriptButton").click(function()
    {
        $("#results").empty();
        buttonFlag = 1;
        document.getElementById('playerHeader1').style.visibility = 'visible';
        document.getElementById('playerHeader2').style.visibility = 'visible';
        document.getElementById('playerHeader3').style.visibility = 'visible';
        document.getElementById('playerHeader4').style.visibility = 'visible';
        heartRateFunction();
        skinTempFunction();
        gsrRateFunction();
    });

    $("#stopScriptButton").click(function () {
        location.reload();
    });

    $("#playbackButton").click(function () {
        window.location.href = '/minesweeper/php/playerGsrPlayback.php';
    });

/*####################################
####### LIVE SCRIPT FUNCTIONS ########
####################################*/

    function heartRateFunction()
    {

        fetchPlayerHR(1,2);

        fetchPlayerHR(2,5);

        fetchPlayerHR(3,8);

        fetchPlayerHR(4,11);

        window.setTimeout(function() {heartRateFunction()}, 500)
    }

    function skinTempFunction()
    {
        fetchPlayerSkin(1,3);

        fetchPlayerSkin(2,6);

        fetchPlayerSkin(3,9);

        fetchPlayerSkin(4,12);

        window.setTimeout(function() {skinTempFunction()}, 5000)
    }

    function gsrRateFunction()
    {
        fetchPlayerGSR(1,4);

        fetchPlayerGSR(2,7);

        fetchPlayerGSR(3,10);

        fetchPlayerGSR(4,13);

        window.setTimeout(function() {gsrRateFunction()}, 200)
    }

/*###############################################
########### FETCH ALL DATA FUNCTIONS ############
#################################################*/

    function fetchAllHRData()
    {
      var playerHR = document.getElementById('results');

      $.ajax({url: "/php/getPlayers.php?func=allHR",
          success: function(result) {
              playerHR.innerHTML = result.join("");
          }  } );
    }

    function fetchAllSkinData()
    {
      var playerSkin = document.getElementById('results');

      $.ajax({url: "/php/getPlayers.php?func=allSkin",
          success: function(result) {
              playerSkin.innerHTML = result.join("");
          }  } );
    }

    function fetchAllGSRData()
    {
      var playerGSR = document.getElementById('results');

      $.ajax({url: "/php/getPlayers.php?func=allGSR",
          success: function(result) {
              playerGSR.innerHTML = result.join("");
          }  } );
    }

/*###################################################
########### FETCH EACH PLAYER FUNCTIONS  ############
###################################################*/

    function fetchPlayerHR(p, resultsID)
    {
      var playerHR = document.getElementById('results' + resultsID);

      $.ajax({url: "/php/getPlayers.php?func=hr&player=" + p,
          success: function(result) {
              playerHR.innerHTML = "-Heart Rate: " + result;
          }  } );
    }

    function fetchPlayerSkin(p, resultsID)
    {
      var playerSkin = document.getElementById('results' + resultsID);

      $.ajax({url: "/php/getPlayers.php?func=skintemp&player=" + p,
          success: function(result) {
              playerSkin.innerHTML = "-Skin Temp: " + result;
          }  } );
    }

    function fetchPlayerGSR(p, resultsID)
    {
      var playerGSR = document.getElementById('results' + resultsID);

      $.ajax({url: "/php/getPlayers.php?func=gsr&player=" + p,
          success: function(result) {
              playerGSR.innerHTML = "-GSR: " + result;
          }  } );
    }
 });
});
