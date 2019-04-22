var buttonFlag = 0;

$(document).ready(function() 
{
	$("#heartButton").click(function()
	{
		if(buttonFlag == 1)
		{
			$("#errorMsg").html("Please Stop Live Script");
		}
		else
		{
			$("#results").load("/php/getHeart.php");
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
			$("#results").load("/php/getSkin.php");
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
			$("#results").load("/php/getGSR.php");
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
			$("#results").empty();		
		}
	});
	
	$("#appletButton").click(function()
	{
		$("#results").empty();
		buttonFlag = 1;
		document.getElementById('playerHeader1').style.visibility = 'visible';
		document.getElementById('playerHeader2').style.visibility = 'visible';
		document.getElementById('playerHeader3').style.visibility = 'visible';
		appletFunction();
		appletFunction2();
		appletFunction3();
	});

	$("#stopAppletButton").click(function()
	{
		location.reload();	
	});
	
	  //#####$########\\
	 //  MY FUNCTIONS  \\
    //########$#########\\
	
	function appletFunction()
	{
		$("#results2").load("/php/player1/getHeart.php");
		$("#results5").load("/php/player2/getHeart.php");
		$("#results8").load("/php/player3/getHeart.php");
		window.setTimeout(function() {appletFunction()}, 500)
	}
	
	function appletFunction2()
	{
		$("#results3").load("/php/player1/getSkin.php");
		$("#results6").load("/php/player2/getSkin.php");
		$("#results9").load("/php/player3/getSkin.php");
		window.setTimeout(function() {appletFunction2()}, 5000)
	}

	function appletFunction3()
	{
		$("#results4").load("/php/player1/getGSR.php");
		$("#results7").load("/php/player2/getGSR.php");
		$("#results10").load("/php/player3/getGSR.php");
		window.setTimeout(function() {appletFunction3()}, 1000)
	}
});
