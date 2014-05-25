var windowOriginHeight;
var	windowOriginWidth;
var	bodyFontSize;
var	headingFontSize;
var	NUT = null;

$(document).ready(function()
{
	bodyFontSize = parseInt($(".tab").css("font-size").substring(0,$(".tab").css("font-size").length));
	headingFontSize = parseInt($(".heading").css("font-size").substring(0,$(".heading").css("font-size").length));
	windowOriginHeight = $(window).height();
	windowOriginWidth = $(window).width();
});

function getDAQ()
{
	var date = new Date();
	var NOW = date.getTime();
	
	if (NUT == null || NOW > NUT)
	{
		$.ajax(
		{
			url: "http://www-bd.fnal.gov/getdaq/job/G:SYBS.STATUS[0].ON@U;F:MT6SC1.READING[0].RAW@E,36;S:MTNRG.READING[0].PRIMARY@U;F:MT6AB1.STATUS[0].ON@U;F:MTPCDC.STATUS[0].ON@U;S:G2SEM.READING[0].COMMON@E,36;F:NEUCDC.STATUS[0].ON@U;F:MC6SC.READING[0].RAW@E,36;F:MCCDC.STATUS[0].ON@U;G:SCTIME.READING[0].COMMON@U;G:SCTIME.SETTING[0].COMMON@U;G:E36SCT.READING[0].COMMON@U?iso-time=true&type=xml",
			datatype: "xml",
			success: function(xml, textStatus, jqXHR)
			{
				MTest.parseXML(xml);
				NeuMuon.parseXML(xml);
				MCenter.parseXML(xml);
				SCTime(xml);
			},
			error: function(error)
			{
				var NUT = NOW; //prevent polling on failure
				alert(error)
			}
		});
	};
	
	setTimeout('getDAQ()', 5000);
}

function windowScale()
{
	var newWidth = $(window).width();
	    newBodyFontSize = (newWidth/windowOriginWidth) * bodyFontSize;
		newHeadingFontSize = (newWidth/windowOriginWidth) * headingFontSize;
	
	if (newWidth != windowOriginWidth)
	{
		$(".tab").css("font-size", newBodyFontSize*.8 + "px");
		$(".heading").css("font-size", newHeadingFontSize*.8 + "px");
	}
	else
	{
		$(".tab").css("font-size", bodyFontSize + "px");
		$(".heading").css("font-size", headingFontSize + "px");
	}
}

function SCTime(xml)
{
	var date = Date.now();
	var NOW = date.getTime();
	
	var SCT;
	var SCTS;
	var E36;

	$(xml).find("reply").each(function ()
	{
		var $device = $(this).find("request").attr("device");
		var $prop = $(this).find("request").attr("property");
		var $value = parseFloat($(this).find("value").text());

			if ($device == "G:SCTIME" && $prop == "READING")
			{
				SCT = Math.ceil($value * 1000);
			}
			else if ($device == "G:SCTIME" && $prop == "SETTING")
			{
				SCTS = Math.ceil($value * 1000);
			}
			else if ($device == "G:E36SCT")
			{
				E36 = Math.ceil($value * 1000);
			}
			
			if ($device == "G:SCTIME" || $device == "G:E36SCT")
			{
				if (typeof $value != "number")
				{
					NUT = null;
				}
			}
	});
	
	NUT = NOW + ((SCTS - SCT) + E36);
	
}

function bigPopup()
{
	window.open("bigFTIM.html",null,"height=325,width=800,scrollbars=yes,status=no,toolbar=no,menubar=no");
}

function littlePopup()
{
	window.open("FTIM.html",null,"height=325,width=270,scrollbars=yes,status=no,toolbar=no,menubar=no");
}