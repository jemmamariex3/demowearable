<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

<?php
        //session_destroy();
?>

<html xmlns="http://www.w3.org/1999/xhtml">

<head>

    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />

    <!--Style Sheets-->
    <!--<link rel="stylesheet" href="css/timer.css" />-->

    <!--Scripts-->
    <script src="/scripts/jquery.js"></script>

    <title>Game Timer</title>

</head>

<h1 align = "center"> Game Timer </h1><hr />

<body style = "margin: 0 auto;">
<div style="margin-left: 0%; margin-top: 2%;">
  <table>
    <tr><th>GAME TYPE: 4 PLAYER TURN</th></tr>
    <tr>
        <th align = "right"><p>4 player turn: </p></th><td><button id = "timer1start">start</button></td><td align="center"><p id = "timer1">0 (s)</p></td><td><button id = "timer1stop">stop</button></td>
        <td><p id ="result1"> 0 (s)</p></td>
    </tr>

    <tr><th>GAME TYPE: 2 PLAYER COOP</th></tr>
    <tr>
        <th align = "right"><p>player 1 vs player 2 coop: </p></th><td><button id = "timer2start">start</button></td><td align="center"><p id = "timer2">0 (s)</p></td><td><button id = "timer2stop">stop</button></td>
        <td><p id ="result2"> 0 (s)</p></td>
    </tr>

    <tr>
        <th align = "right"><p>player 3 vs player 4 coop: </p></th><td><button id = "timer3start">start</button></td><td align = "center"><p id = "timer3">0 (s)</p></td><td><button id = "timer3stop">stop</button></td>
        <td><p id ="result3"> 0 (s)</p></td>
    </tr>

    <tr><th>GAME TYPE: 2 PLAYER TURN</th></tr>
    <tr>
        <th align = "right"><p>player 1 vs player 2 turn: </p></th><td><button id = "timer4start">start</button></td><td align = "center"><p id = "timer4">0 (s)</p></td><td><button id = "timer4stop">stop</button></td>
        <td><p id ="result4"> 0 (s)</p></td>
    </tr>

    <tr>
        <th align = "right"><p>player 3 vs player 3 turn: </p></th><td><button id = "timer5start">start</button></td><td align = "center"><p id = "timer5">0 (s)</p></td><td><button id = "timer5stop">stop</button></td>
        <td><p id ="result5"> 0 (s)</p></td>
    </tr>
    <tr>
        <th align = "right">CLEAR TIMERS IN DATABASE</th><td><button id ="clearButton">CLEAR</button></td><td><input placeholder ="Enter Key Code" type = "text" id ="codeId"/></td>
    </tr>
    <tr>
        <th align = "right">RETURN HOME</th><td><button id = "homeButton">Go Home</button></td>
    </tr>
  </table>
</div>

</body>
</html>

<script>
//GLOBALS
var timer1 = 0;
var timer2 = 0;
var timer3 = 0;
var timer4 = 0;
var timer5 = 0;

var timer1flag = 0;
var timer2flag = 0;
var timer3flag = 0;
var timer4flag = 0;
var timer5flag = 0;

var myTimer1;
var myTimer2;
var myTimer3;
var myTimer4;
var myTimer5;

//START TIMER BUTTON PRESSED
$("#timer1start").click(function()
{
  if(!timer1flag)
  {
    beginTimer1();
    clearInterval(myTimer1);
    myTimer1 = setInterval(function(){ beginTimer1() }, 1000);
  }
  timer1flag = 1;
});

$("#timer2start").click(function()
{
  if(!timer2flag)
  {
    beginTimer2();
    myTimer2 = setInterval(function(){ beginTimer2() }, 1000);
  }
  timer2flag = 1;
});
$("#timer3start").click(function()
{
  if(!timer3flag)
  {
    beginTimer3();
    myTimer3 = setInterval(function(){ beginTimer3() }, 1000);
  }
  timer3flag = 1;

});
$("#timer4start").click(function()
{
  if(!timer4flag)
  {
    beginTimer4();
    myTimer4 = setInterval(function(){ beginTimer4() }, 1000);
  }
  timer4flag = 1;
});
$("#timer5start").click(function()
{
  if(!timer5flag)
  {
    beginTimer5();
    myTimer5 = setInterval(function(){ beginTimer5() }, 1000);
  }
  timer5flag = 1;
});

//STOP TIMER BUTTON PRESSED
$("#timer1stop").click(function()
{
  timer1flag = 0;
  clearInterval(myTimer1);
  document.getElementById("result1").innerHTML = timer1 + " (s)";
  if(timer1)
   $.ajax({url: "php/insertTimer.php?func=4player&time=" + timer1});
  timer1 = 0;
  document.getElementById("timer1").innerHTML = timer1 + " (s)";
});

$("#timer2stop").click(function()
{
  timer2flag = 0;
  clearInterval(myTimer2);
  document.getElementById("result2").innerHTML = timer2 + " (s)";
  if(timer2)
    $.ajax({url: "php/insertTimer.php?func=coop1v2&time=" + timer2});
  timer2 = 0;
  document.getElementById("timer2").innerHTML = timer2 + " (s)";
});
$("#timer3stop").click(function()
{
  timer3flag = 0;
  clearInterval(myTimer3);
  document.getElementById("result3").innerHTML = timer3 + " (s)";
  if(timer3)
    $.ajax({url: "php/insertTimer.php?func=coop3v4&time=" + timer3});
  timer3 = 0;
  document.getElementById("timer3").innerHTML = timer3 + " (s)";
});
$("#timer4stop").click(function()
{
  timer4flag = 0;
  clearInterval(myTimer4);
  document.getElementById("result4").innerHTML = timer4 + " (s)";
  if(timer4)
    $.ajax({url: "php/insertTimer.php?func=turn1v2&time=" + timer4});
  timer4 = 0;
  document.getElementById("timer4").innerHTML = timer4 + " (s)";
});
$("#timer5stop").click(function()
{
  timer5flag = 0;
  clearInterval(myTimer5);
  document.getElementById("result5").innerHTML = timer5 + " (s)";
  if(timer5)
    $.ajax({url: "php/insertTimer.php?func=turn3v4&time=" + timer5});
  timer5 = 0;
  document.getElementById("timer5").innerHTML = timer5 + " (s)";
});

$("#clearButton").click(function()
{
  var code = document.getElementById("codeId").value;
  $.ajax({url: "php/insertTimer.php?func=clear&time=" + code});
});

$("#homeButton").click(function()
{
  var code = document.getElementById("codeId").value;
  window.location.href = '/';
});

//FUNCTIONS INCREMENTING TIMER
function beginTimer1()
{
    timer1++;
    document.getElementById("timer1").innerHTML = timer1 + " (s)";
}
function beginTimer2()
{
    timer2++;
    document.getElementById("timer2").innerHTML = timer2 + " (s)";
}
function beginTimer3()
{
    timer3++;
    document.getElementById("timer3").innerHTML = timer3 + " (s)";
}
function beginTimer4()
{
    timer4++;
    document.getElementById("timer4").innerHTML = timer4 + " (s)";
}
function beginTimer5()
{
    timer5++;
    document.getElementById("timer5").innerHTML = timer5 + " (s)";
}
</script>
