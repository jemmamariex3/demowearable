  ////////////////////////////////////////////////////////////////////////////
  //                                                                        //
  // Minesweeper: Javascript                                                //
  //                                                                        //
  // Copyright 1998-2009, Andrew D. Birrell                                 //
  //                                                                        //
  // Usage: init(width, total, mines, player)                               //
  //                                                                        //
  ////////////////////////////////////////////////////////////////////////////

  //--Simon's Global Variables--
  var game_status;
  var game_id;
  var mines_layed = 1;
  var mines_array = [];
  var update_square = [];
  var isLoaded = 0;
  var waitTimer;
  var clickedSmileyFlag = 0;
  var player_turn;
  var maxPlayers = 4;
  var tileExposure;
  var store_mines = [10];
  var playerHasStarted = false;
  var exploded_status;
  var check_game_type;
  var game_type = 1;
  //--End of Simon's Global Variables--


  var width;                          // set by calling "init"
  var total;                          // set by calling "init"
  var mines;                          // set by calling "init"
  var player;                         // set by calling "init"
 
  var tilesTurned;	// updated every turn
  var minesFlagged; 	// updated every turn

  
  
  /* "adjacent" and "exposed" are indexed by square number = y*width+x */
    
  /* "adjacent" contains the board layout and derived state.  adjacent[i] is
     the count of mines adjacent to square i, or "mine" if square i contains
     a mine.  */
  var adjacent = new Array();         // count of adjacent mines
  var mine = 9;                       // adjacency count for a mine
    
  /* "exposed" contains the exposure state of the board.
     Values > "unexposed" represent exposed squares; these either have the
     distinquished values "exploded" or "incorrect", or some greater value
     (left over from the pending exposure queue) for plain old exposed
     squares.  Values <= "unexposed" include plain old unexposed squares, or
     one of the markers.
  
     During the "expose" method, the queue of pending exposures is a linked
     list through this array, using array indexes.  The method holds the head
     and tail.  "listEnd" is the tail marker.
  */
  var exposed = new Array();          // exposure state / pending exposures
  var listEnd = -1;                   // end marker in "exposed"
  var incorrect = -2;                 // incorrect flag, at end of game
  var exploded = -3;                  // exploded mine (at end of game!)
  var unexposed = -4;                 // default state at start of game
  var flagged = -5;                   // marker flag by user
  var queried = -6;                   // query flag by user
  
  var erasing = 0;                    // smiley absent during initialization
  var sad = 1;                        // smiley value after loss
  var bored = 2;                      // smiley value during game
  var happy = 3;                      // smiley value after win
    
  var flags = 0;                      // count of flags currently set
  var remaining = 0;                  // count of unexposed squares
  var sadness = happy;                // whether smiley is sad
  var startTime;                      // time of first click, if any
  var timer = false;                  // periodic elapsed time updater
  var clockTimer = false;             // clock timer
  
  var charInfinity = "&#x221E;";
  var charFlag = "!";                 // or 2691, but not on Windows
  var charQuestion = "?";
  //var charMine = "&#x2600;";
  var charMine = "&#x1f4a3;"; //this one looks more like a bomb - simon
  var charIncorrect = "&#x00D7;";
  
  function setMines() {
      // update remaining mines display
      // var elt = document.getElementById("mines");
      // var count = mines - flags;
      // elt.innerHTML = (count < -99 ? "-" + charInfinity : "" + count);
  }
  
  function setElapsed() {
      // update elapsed time display


//      var elt = document.getElementById("timer");
//      if (timer) {
//          var now = new Date();
//          var secs = Math.floor((now.getTime() - startTime.getTime())/1000);
//          elt.innerHTML = (secs > 999 ? charInfinity : "" + secs);
//      } else {
//          elt.innerHTML = "&nbsp;";
//      }

      var elapsedSecs = document.getElementById("elapsedTime");
      
      if (timer) {
        var now = new Date();
        var secs = Math.floor((now.getTime() - startTime.getTime())/1000);
        elapsedSecs.innerHTML = (secs > 999 ? charInfinity : "" + secs);
      } else {
        elapsedSecs.innerHTML = "&nbsp;";
      }

      updatePlayerStats();
      fetchAllPlayerStats();
  }
  
  function setHappy() {
      // update the happy/sad icon display
      var smiley = document.getElementById("smiley");
      smiley.src = "../img/";
      smiley.src +=
          (sadness == erasing ? "erasing.gif" :
          (sadness == sad ? "sad.gif" :
          (sadness == bored ? "bored.gif" :
          "happy.gif")));
  }
  
  function setSq(thisSquare) {
      // update square display, based on "exposed" and "adjacent"
      var sq = document.getElementById("sq-" + thisSquare);
      var exp = exposed[thisSquare];
      var className = "sq";
      var s;
      if (exp <= unexposed) {
          // unexposed squares, including flagged or queried
          if (exp == unexposed) {
              s = "&nbsp;";
          } else if (exp == flagged) {
              s = charFlag;
              className += " sqFlagged";
          } else {
              s = charQuestion;
              className += " sqQuestion";
          }
      } else {
          // exposed squares
          var adj = adjacent[thisSquare];
          className += " sqExposed";
          if (exp == exploded) {
              s = charMine;
              className += " sqExploded";
          } else if (exp == incorrect) {
              s = charIncorrect;
              className += " sqIncorrect";
          } else if (adj == mine) {
              s = charMine;
              className += " sqMine";
          } else {
              s = "" + (adj == 0 ? "&nbsp" : adj);
              className += " sq" + adj;
          }
      }
      sq.className = className;
      sq.innerHTML = s;
  }
  
  function timerAction() {
      // Called via setTimeout
      // Update the elapsed time, and schedule another call if wanted
      // Note: setInterval is similar, but stops (Safarai 1.3) after
      // user has navigated away then returned to the page.
      if (timer) {
          setElapsed();
          setTimeout("timerAction()", 1000);
      }
  }
  
  function startTimer() {
      startTime = new Date();
      timer = true;
      timerAction();
  }
  
  function setClockTime()
  {
      var currentTime = document.getElementById("currentTime");
      var now = new Date();
      if(clockTimer) {
        currentTime.innerHTML = now.toLocaleTimeString();
      } else {
        currentTime.innerHTML = "&nbsp;";
      }
  }

  function clockTimerAction() {
      if (clockTimer) {
          setClockTime();
          setTimeout("clockTimerAction()", 100);
      }
  }

  function startClock() {
      clockTimer = true;
      clockTimerAction();
  }

  function wait()
  {
    //gets current game status by checking the latest row in descending order
    $.ajax({url: "../php/getPlayers.php?func=gameStatus", 
      success: function(result) {
      game_status = result;
    }, async: false});
    
    if(game_status == 0 && clickedSmileyFlag == 0)
    {
      document.getElementById("loadingId").innerHTML = "Loading...";
      //alert("detected!");
      setTimeout("erase()", 4000); // allow repaint of score area
    }
    else
      waitTimer = window.setTimeout(function() {wait()}, 1000);
  }
  
  function stopWait()
  {
    clearTimeout(waitTimer);
  }

  function endGame(outcome) {
      // Turn off the timer and update the smiley
      timer = false;
      sadness = outcome;
      setHappy();    
      tilesTurned = 0;
      minesFlagged = 0;
      updatePlayerStats();
      playerHasStarted = false;
      isLoaded = 0;
   
      $(document).ready(function(){
        $(".sq").css("opacity", ".5");
      });

      if(player != 1)
      {
        wait();
      }
      //init(width, total, mines, player); 
      //console.log("isloaded = " + isLoaded);
  }
  
  function applyToNeighbours(thisSquare, f) {
      // Apply given function to each existing neighbours of given square
      // This is the only part of the program that knows the topology
      // The performance of this function has a visible effect on the program
      var x = thisSquare % width;
      if (thisSquare >= width) { // there's a row above
          if (x > 0) f(thisSquare - width - 1);
          f(thisSquare - width);
          if (x+1 < width) f(thisSquare - width + 1);
      }
      if (x > 0) f(thisSquare - 1);
      if (x+1 < width) f(thisSquare + 1);
      if (thisSquare < total-width) { // there's a row below
          if (x > 0) f(thisSquare + width - 1);
          f(thisSquare + width);
          if (x+1 < width) f(thisSquare + width + 1);
      }
  }
  
  var tail = listEnd;                  // tail of pending exposures
  
  function expose1(thisSquare) {
      // Expose square and add to pending exposure list.
      if (exposed[thisSquare] <= unexposed &&
              exposed[thisSquare] != flagged) {
          remaining--;
          exposed[thisSquare] = listEnd;
          exposed[tail] = thisSquare;
          tail = thisSquare;
          setSq(thisSquare);
      }
  }

  function updateCSS()
  {
    if(isLoaded == 1)
    {
      //gets the current player turn
      $.ajax({url: "../php/getPlayers.php?func=playerTurn&gameid=" + game_id,
        success: function(result) {
        player_turn = result;
      },async: false});
    
      if(player == player_turn && isLoaded != 0)
      {
        $(document).ready(function(){
            $(".sq").css("opacity", "1");
        });
      }
      else
      {
        $(document).ready(function(){
           $(".sq").css("opacity", ".5");
        });
      }

      if(player_turn > maxPlayers && player == 1)
      {
        $.ajax({url: "../php/insertGames.php?func=changeTurn&playerid=1&gameid=" + game_id});
      }
    }
    window.setTimeout(function() {updateCSS()}, 500);
    
  }

  function clickSqUpdate(click, thisSquare)
  {
      //gets the current game id by checking the latest row in descending order
/*
      $.ajax({url: "../php/getPlayers.php?func=gameId", 
        success: function(result) {
        game_id = result;
      },async: false});
*/    
      //SET EXPOSURE OF A matrixTile IN THE DATABASE TO TRUE
      $.ajax({url: "../php/insertGames.php?func=exposed&gameid=" + game_id + "&tileid=" + thisSquare,
          success: function(result){console.log("hi");},async: false});

      //console.log("hello?" + "gameid = " + game_id + " and tile = "  + thisSquare);
      if (click != 0) event = 0; // IE versus the rest
      if (sadness != bored) return false; // Game over: do nothing
      if (!timer) startTimer();
      if (exposed[thisSquare] > unexposed){}
      else if (adjacent[thisSquare] == mine) {
          // exposing a mine: explode it and expose other mines
          remaining--;
          exposed[thisSquare] = exploded;
          setSq(thisSquare);
          var i;
          for (i = 0; i < total; i++) {
              if (i==thisSquare) {
              } else if (adjacent[i] == mine && exposed[i] != flagged) {
                  remaining--;
                  exposed[i] = listEnd;
                  setSq(i);
              } else if (adjacent[i] != mine && exposed[i] == flagged) {
                  remaining--;
                  exposed[i] = incorrect;
                  setSq(i);
              }
          }
          endGame(sad);
      document.getElementById("loadingId").innerHTML = "Game Over...";

      } else {
          // expose the square, if not already exposed
          // If square has 0 adjacency, expose surrounding squares,
          // and iterate
          if (exposed[thisSquare] == flagged) {
              flags--;
              //setMines();
          }
          remaining--;
          exposed[thisSquare] = listEnd;
          tail = thisSquare;
          setSq(thisSquare);
          var pending = thisSquare;
          // Until pending reaches the end of the exposure list, expose
          // neighbors
          while (pending != listEnd) {
              if (adjacent[pending]==0) applyToNeighbours(pending, expose1);
              pending = exposed[pending];
          }
          if (remaining==mines) {
              // End of game: flag all remaining unflagged mines
              var i;
              for (i = 0; i < total; i++) {
                  if (adjacent[i] == mine && 
                  		exposed[i] <= unexposed &&
                      	exposed[i] != flagged ) {
                      exposed[i] = flagged;
                      flags++;
                      setSq(i);
                  }
              }
              // setMines();
              endGame(happy);
          }
      }

	// update this player's local stats
      //tilesTurned = total - remaining;
      //minesFlagged = flags;
      //updatePlayerStats();

      return false;

  }
  
  function clickSq(event, thisSquare) 
  {
    if(exposed[thisSquare] == unexposed && isLoaded != 0)
    {    
      playerHasStarted = true;
/*
      //gets the current game id by checking the latest row in descending order
      $.ajax({url: "../php/getPlayers.php?func=gameId", 
        success: function(result) {
        game_id = result;
      },async: false});

      //and if we pass maxplayers, reset it back to player 1's turn
      if(player_turn > maxPlayers && player == 1)
      {
        $.ajax({url: "../php/insertGames.php?func=changeTurn&playerid=1&gameid=" + game_id});
      }
*/
      if(player == player_turn)
      {
       //playerTurn++ in database
       $.ajax({url: "../php/insertGames.php?func=changeTurn&playerid="+ (player_turn+1) + "&gameid=" + game_id});

       //gets the current player turn
       $.ajax({url: "../php/getPlayers.php?func=playerTurn&gameid=" + game_id,
         success: function(result) {
         player_turn = result;
       },async: false}); 

       //and if we pass maxplayers, reset it back to player 1's turn.
       if(player_turn > maxPlayers)
       {
         $.ajax({url: "../php/insertGames.php?func=changeTurn&playerid=1&gameid=" + game_id});
       }

       //SET EXPOSURE OF A matrixTile IN THE DATABASE TO TRUE
       $.ajax({url: "../php/insertGames.php?func=exposed&gameid=" + game_id + "&tileid=" + thisSquare,
           success: function(result){console.log("hi");},async: false});
    
       //console.log("hello?" + "gameid = " + game_id + " and tile = "  + thisSquare);
       if (!event) event = window.event; // IE versus the rest
       if (sadness != bored) return false; // Game over: do nothing
       if (!timer) startTimer();
       if (exposed[thisSquare] > unexposed) {
           // already exposed: do nothing
       } else if (!event.which && event.button == 0) {
           // mouse-up after right-click on IE: do nothing
       } else if (event.shiftKey || event.button == 2) {
           // flag or unflag
           var exp = exposed[thisSquare];
           if (exp == unexposed) {
               exposed[thisSquare] = flagged;
               flags++;
               // setMines();
           } else if (exp == flagged) {
               exposed[thisSquare] = queried;
               flags--;
               // setMines();
           } else if (exp == queried) {
               exposed[thisSquare] = unexposed;
           }
           setSq(thisSquare);
       } else if (adjacent[thisSquare] == mine) {
           // exposing a mine: explode it and expose other mines
           remaining--;
           exposed[thisSquare] = exploded;
           setSq(thisSquare);
           var i;
           for (i = 0; i < total; i++) {
               if (i==thisSquare) {
               } else if (adjacent[i] == mine && exposed[i] != flagged) {
                   remaining--;
                   exposed[i] = listEnd;
                   setSq(i);
               } else if (adjacent[i] != mine && exposed[i] == flagged) {
                   remaining--;
                   exposed[i] = incorrect;
                   setSq(i);
               }
           }
           endGame(sad);
      document.getElementById("loadingId").innerHTML = "Game Over...";
       } else {
           // expose the square, if not already exposed
           // If square has 0 adjacency, expose surrounding squares,
           // and iterate
           if (exposed[thisSquare] == flagged) {
               flags--;
               //setMines();
           }
           remaining--;
           exposed[thisSquare] = listEnd;
           tail = thisSquare;
           setSq(thisSquare);
           var pending = thisSquare;
           // Until pending reaches the end of the exposure list, expose
           // neighbors
           while (pending != listEnd) {
               if (adjacent[pending]==0) applyToNeighbours(pending, expose1);
               pending = exposed[pending];
           }
           if (remaining==mines) {
               // End of game: flag all remaining unflagged mines
               var i;
               for (i = 0; i < total; i++) {
                   if (adjacent[i] == mine && 
                   		exposed[i] <= unexposed &&
                       	exposed[i] != flagged ) {
                       exposed[i] = flagged;
                       flags++;
                       setSq(i);
                   }
               }
               // setMines();
               endGame(happy);
           }
      }

	// update this player's local stats
      tilesTurned = total - remaining;
      minesFlagged = flags;
      updatePlayerStats();

      return false;
      }//end of if(player == playterTurn)
    }//end of if(tileExposure == 0)
  }
  
  function fetchPlayerStats(p)
  {
    /* only fetch if the player has started the game */
    if (!playerHasStarted) {
        return;
    }

    var playerStr = "player" + p;
    var playerGSRStr = playerStr + "GSR";
    var playerHRStr = playerStr + "HR";
    var playerSkintempStr = playerStr + "Skintemp";
    // var playerMinesStr = playerStr + "Mines";
    var playerTilesStr = playerStr + "Tiles";
    var playerElapsedStr = playerStr + "Elapsed";

    var playerGSR = document.getElementById(playerGSRStr);
    var playerHR = document.getElementById(playerHRStr);
    var playerSkintemp = document.getElementById(playerSkintempStr);
    // var playerMines = document.getElementById(playerMinesStr);
    var playerTiles = document.getElementById(playerTilesStr);
    var playerElapsed = document.getElementById(playerElapsedStr);


    $.ajax({
        url: "../php//getPlayers.php?func=gsr&player=" + p,
        success: function (result) {
            window.GSRManager.update(p, result);
        }
    });
    $.ajax({
        url: "../php/getPlayers.php?func=hr&player=" + p,
        success: function (result) {
            window.HeartRateManager.update(p, result);
        }
    });
    $.ajax({
        url: "../php/getPlayers.php?func=skintemp&player=" + p,
        success: function (result) {
            window.SkinTempManager.update(p, result);
        }
    });
    $.ajax({
        url: "../php/getPlayers.php?func=getgame&player=" + p,
        dataType: "json",
        success: function (result) {
            // var resultObj = JSON.parse(result);
            // playerMines.innerHTML = result.minesFlagged;
            playerTiles.innerHTML = result.tilesTurned;
            playerElapsed.innerHTML = result.elapsedTime;
            // playerMines.innerHTML = resultObj.minesFlagged;
            // playerTiles.innerHTML = resultObj.tilesTurned;
            // playerElapsed.innerHTML = resultObj.elapsedTime;

            var tilesExposed = result.tilesTurned + result.minesFlagged;
            var percentageCompleted = Math.round((tilesExposed / total) * 100);
            var playerIndex = p - 1;
            window.BarChartManager.update(playerIndex, percentageCompleted);
        }
    });
}

  function fetchAllPlayerStats() {

    for(var i = 1; i <= 4; i++)
    {
      fetchPlayerStats(i);
    }
  }


  function updatePlayerStats() {
      document.getElementById("localTilesTurned").innerHTML = tilesTurned;
      // document.getElementById("localMinesFlagged").innerHTML = minesFlagged;
      if(timer)
      {
        var now = new Date();
        var secs = Math.floor((now.getTime() - startTime.getTime())/1000);
        $.post( "../php/getPlayers.php", {func: "updgame", player: player, 
				elapsed: secs, tiles: tilesTurned, 
				mines: minesFlagged} );
      }
  }

  function neighbourIsMine(thisSquare) {
      // Increase adjacency count, if this isn't itself a mine
      if (adjacent[thisSquare] != mine) adjacent[thisSquare]++;
  }
  
  function layMines() 
  {
      // Lay the mines
      var laid = 0;

      //gets the current game id by checking the latest row in descending order
      $.ajax({url: "../php/getPlayers.php?func=gameId", 
        success: function(result) {
        game_id = result;
      },async: false});

      while (laid < mines) 
      {
          var target = Math.floor(Math.random() * total);

          // Despite what others might say, it's possible that "target
          // = total".  This is because although Math.random() is < 1,
          // in an extreme case the multiplication by "total" will round up.
          // We need to allow for this, if we really care about correctness.

          if (target < total && adjacent[target] != mine) 
          {
              adjacent[target] = mine;
	      store_mines[laid] = target;
	      //console.log("mine# " + laid + " = " + target);
              //set mine status of a tile to true on the database 
              //$.ajax({url: "../php/insertGames.php?func=mine&gameid=" + game_id + "&tileid=" + target,
                //success: function(result){},async: false});

              //console.log("gameid = " + game_id + " tileid = " + target);
              applyToNeighbours(target, neighbourIsMine);
              laid++;
          }
      }
      var myJSON = JSON.stringify(store_mines);
      //console.log(myJSON);
      $.ajax({url: "../php/insertGames.php?func=setMines&gameid=" + game_id + "&mines=" + myJSON,
        success: function(result){},async: false});
      mines_layed = 1;
      clickedSmileyFlag = 0;
  }
  
  function laySetMines()
  {
      // Lay the mines

      //gets the current game id by checking the latest row in descending order
      $.ajax({url: "../php/getPlayers.php?func=gameId", 
        success: function(result) {
        game_id = result;
      },async: false});

      //GET ALL TILE MINES AND SET THEM IN THE GAME
      $.ajax({url: "../php/getPlayers.php?func=getMines&gameid=" + game_id, 
        success: function(result) {
        mines_array = result;
      },async: false});
      
      for(var i = 0; i < mines_array.length; i++)
      {
          var j = parseInt(mines_array[i]);
          adjacent[j] = mine;
          applyToNeighbours(j, neighbourIsMine);
      }
  }
  
  function eraseRows() 
  {
      // erase square contents
      var i;

      for (i = 0; i < total; i++) {
          adjacent[i] = 0;
          if (exposed[i] != unexposed) {
              exposed[i] = unexposed;
              setSq(i);
          }
      }
  }
  
  function erase2() {
      // Forked part of erase
      eraseRows();
      if(mines_layed == 0)
      {
        layMines();
        isLoaded = 1;
        document.getElementById("loadingId").innerHTML = "Ready!";
      }
      else
      {
        laySetMines();
        isLoaded = 1;
        document.getElementById("loadingId").innerHTML = "Ready!";
      }
      sadness = bored;
      setHappy();
      return false;
  }
  
  function erase() {
      // Erase the board.  Uses "sadness" to disable clicks meanwhile
      if (sadness != erasing) {
          flags = 0;
          // setMines();
          remaining = total;
          //endGame(erasing);
          setElapsed();
          stopWait();
          setTimeout("erase2()", 1); // allow repaint of score area
      }
  }

  function clickSmiley(event)
  {
    if(player==1 && clickedSmileyFlag == 0)
    {
      document.getElementById("loadingId").innerHTML = "Game Over...";
      clickedSmileyFlag = 1;
      //resetting game to player 1's turn
      //$.ajax({url: "../php/insertGames.php?func=changeTurn&playerid=1&gameid=" + game_id});

      if(sadness == bored)
      {
        //gets the current game id by checking the latest row in descending order
        $.ajax({url: "../php/getPlayers.php?func=gameId", 
          success: function(result) {
          game_id = result;
        },async: false});

      //Activates a mine
      $.ajax({url: "../php/getPlayers.php?func=getMines&gameid=" + game_id, 
        success: function(result) {
        mines_array = result;
      },async: false});

      var j = mines_array[0];
      clickSqUpdate(0, j);
      clickedSmileyFlag = 0;
      }
      else
      {
      document.getElementById("loadingId").innerHTML = "Loading...";
      isLoaded = 0;
      mines_layed = 0; //we say that we need new mines | check erase2 function

      //gets the current game id by checking the latest row in descending order
      $.ajax({url: "../php/getPlayers.php?func=gameId", 
        success: function(result) {
        game_id = result;
      },async: false});
      
      //set current game tiles to gameState 0 so we can create new ones
      $.ajax({url: "../php/insertGames.php?func=gameOver&gameid=" + game_id,
        success: function(result) {
      },async: false});

      //gets current game status by checking the latest row in descending order
      $.ajax({url: "../php/getPlayers.php?func=gameStatus", 
        success: function(result) {
        game_status = result;
      }, async: false});

      //ADDING TILES TO DATABASE : TURN BASED GAME
      /*
      if(game_status == 0 || game_status == -1)
      {
        $.ajax({url: "../php/insertGames.php?func=turn&gameid=" + (game_id+1) + "&total=" + total + "&playerid=1" + "&gametype=1"}); 
      }

      // Click in the smiley face.
      if (!event) event = window.event; // IE versus the rest
      if (event.button != 2) erase();
      return false;
      */
      //alert("I'm waiting a little before I insert tiles");
      window.setTimeout(function() {waitForTiles()}, 2000);
      }
    }
  }

  function waitForTiles()
  {
    //ADDING TILES TO DATABASE : TURN BASED GAME
    if(game_status == 0 || game_status == -1)
    {
      $.ajax({url: "../php/insertGames.php?func=turn&gameid=" + (game_id+1) + "&total=" + total + "&playerid=1" + "&gametype=1"}); 

      $.ajax({url: "../php/getPlayers.php?func=gameId", 
        success: function(result) {
	game_id = result;
      }, async: false});

      //resetting game to player 1's turn
      $.ajax({url: "../php/insertGames.php?func=changeTurn&playerid=1&gameid=" + game_id});

    }
 
    // Click in the smiley face.
    //if (!event) event = window.event; // IE versus the rest
    //if (event.button != 2) erase();
    erase();
    return false;  
  }
  
  function noContext() {
      // Disable context menu in squares
      return false;
  }

  function update()
  { 
    if(isLoaded == 1)
    {
      //VERSION 2 OF THE UPDATE FUNCTION
      //GET ALL TILE EXPOSURE STATS ON DATABASE AND UPDATE/SET PLAYER'S SQUARES
      $.ajax({url: "../php/getPlayers.php?func=getExposureAll&gameid=" + game_id, 
      success: function(result) {
        update_square = result;
      }, async: false});

      for(var i= 0; i < update_square.length; i++)
      {
        var j = parseInt(update_square[i]);
        clickSqUpdate(0, j);
      }
      update_square = [];
      //console.log("game updated | time = 2 seconds");
    }
    window.setTimeout(function() {update()}, 500);
  }

  function init(w, t, m, p) {
      // Initial "onload" setup.  Set up globals and handlers, then erase.
      // 
      width = w;
      total = t;
      mines = m;
      player = p;      

      //checks if explosion has occured or if host is entering

      $.ajax({url: "../php/getPlayers.php?func=exploded&player1id=1&player2id=2",
      success: function(result) {
        exploded_status = result;
      }, async: false});

      //checks if the game type is the same just incase it's not exploded
      $.ajax({url: "../php/getPlayers.php?func=type&player1id=1&player2id=2",
      success: function(result) {
        check_game_type = result;
      }, async: false});

      if(exploded_status != -1 || (check_game_type != game_type && check_game_type != -1))
      {
        $.ajax({url: "../php/getPlayers.php?func=getGameIdQuad&player1id=1&player2id=2",
          success: function(result) {
          game_id = result;
        },async: false});
 
        //set game state to 0 since it's exploded
        //set current game tiles to gameState 0 so we can create new ones
        $.ajax({url: "../php/insertGames.php?func=gameOver&gameid=" + game_id,
          success: function(result) {
        },async: false});
      }
      else
      {
        //gets current game status by checking the latest row in descending order for players 1 and 2
/*
        $.ajax({url: "../php/getPlayers.php?func=getGameStatusQuad&player1id=1&player2id=2",
        success: function(result) {
          game_status = result;
        }, async: false});

        //restart the game if host is entering new

        if(player == 1 && game_status != 0 && game_status != -1)
        {
          $.ajax({url: "../php/getPlayers.php?func=getGameIdQuad&player1id=1&player2id=2",
            success: function(result) {
            game_id = result;
          },async: false});

          //set game state to 0 since it's exploded
          //set current game tiles to gameState 0 so we can create new ones
          $.ajax({url: "../php/insertGames.php?func=gameOver&gameid=" + game_id,
            success: function(result) {
          },async: false});
        }
*/
      }

      $.ajax({url: "../php/getPlayers.php?func=exploded&player1id=3&player2id=4",
      success: function(result) {
        exploded_status = result;
      }, async: false});

      //checks if the game type is the same just incase it's not exploded
      $.ajax({url: "../php/getPlayers.php?func=type&player1id=3&player2id=4",
      success: function(result) {
        check_game_type = result;
      }, async: false});

      if(exploded_status != -1 || (check_game_type != game_type && check_game_type != -1))
      {
        $.ajax({url: "../php/getPlayers.php?func=getGameIdQuad&player1id=3&player2id=4",
          success: function(result) {
          game_id = result;
        },async: false});
 
        //set game state to 0 since it's exploded
        //set current game tiles to gameState 0 so we can create new ones
        $.ajax({url: "../php/insertGames.php?func=gameOver&gameid=" + game_id,
          success: function(result) {
        },async: false});
      }
      else
      {
        //gets current game status by checking the latest row in descending order for players 3 and 4
/*
        $.ajax({url: "../php/getPlayers.php?func=getGameStatusQuad&player1id=3&player2id=4",
        success: function(result) {
          game_status = result;
        }, async: false});

        //restart the game if host is entering new
        if(game_status != 0 && game_status != -1)
        {
          $.ajax({url: "../php/getPlayers.php?func=getGameIdQuad&player1id=3&player2id=4",
            success: function(result) {
            game_id = result;
          },async: false});

          //set game state to 0 since it's exploded
          //set current game tiles to gameState 0 so we can create new ones
          $.ajax({url: "../php/insertGames.php?func=gameOver&gameid=" + game_id,
            success: function(result) {
          },async: false});
        }
*/
      }



      //INSERTING TILES INTO DATABASE IF THEY'RE NOT CREATED AND CHECKS IF GAME IS OVER OR NOT
      //console.log("i'm inside the init now");
      //gets current game status by checking the latest row in descending order
      $.ajax({url: "../php/getPlayers.php?func=gameStatus", 
      success: function(result) {
        game_status = result;
      }, async: false});

      //gets the current game id by checking the latest row in descending order
      /*using this to check the id then incrementing it by one when adding tiles to db
        since i don't want to auto_increment*/
      $.ajax({url: "../php/getPlayers.php?func=gameId", 
        success: function(result) {
	game_id = result;
      }, async: false});

      //gets the current player turn
      $.ajax({url: "../php/getPlayers.php?func=playerTurn&gameid=" + game_id,
        success: function(result) {
        player_turn = result;
      },async: false});

      if(player == player_turn)
      {
        $(document).ready(function(){
            $(".sq").css("opacity", "1");
        });
      }
      else
      {
        $(document).ready(function(){
            $(".sq").css("opacity", ".5");
        });
      }    


      //alert("game_status = " + game_status + " | game_id = " + game_id);

      //ADDING TILES TO DATABASE : TURN BASED GAME
      if(game_status == 0 || game_status == -1)
      {
        mines_layed = 0; //we say that we need new mines | check erase2 function

        $.ajax({url: "../php/insertGames.php?func=turn&gameid=" + (game_id+1) + "&total=" + total + "&playerid=1" + "&gametype=1"}); 

        $.ajax({url: "../php/getPlayers.php?func=gameId", 
          success: function(result) { 
  	  game_id = result;
        }, async: false});

      }

      tilesTurned = 0;
      minesFlagged = 0;
      updatePlayerStats();
      startClock();

      // The handlers here are non-standard and fail w3.org validation if
      // placed in the HTML.  Onselectstart prevents IE extending a selection
      // on shift-click, and oncontextmenu prevents right-click being grabbed
      // for context menus on some browsers.
      // self note: add code below to endGame() function with a timer
      // this will help us repaint.. also if player is not 1
      // we want to wait and check if game status is 1
      // when it is one we can then call erase() which
      // will set the new mines and shit. when game stat = 1 
      // is layed is then = 1 so players dont replant diff mine locations
      // find a way to disable clicks in the mean time. im thinking
      // out a flaf near click smiley and unflag after erase is done.

      var sqTable = document.getElementById("sqTable");
      sqTable.onselectstart = function() { return false; };
      var i;
      for (i = 0; i < total; i++) {
          var sq = document.getElementById("sq-" + i);
          sq.oncontextmenu = noContext;
      }

      erase();
      update();
      updateCSS();
  }
