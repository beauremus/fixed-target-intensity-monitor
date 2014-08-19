MTest.startUpDateString = null;
MTest.bufferIndex = 0;
MTest.xmlLast;

function MTest()
{
	
}

MTest.parseXML = function(xml)
{
	if (MTest.isDataThere(xml))
	{
		if (MTest.bufferIndex >= 10)
		{
			MTest.bufferIndex = 9;
			this.incrementRenew();
		}

		$("#tabs-1 .renewable_" + MTest.bufferIndex).empty()
		
		$(xml).find("reply").each(function()
		{
			var $device = $(this).find("request").attr("device");
			var $value = $(this).find("value");
			var dateString = Date.parse($(this).attr('time').split("T")[0]).toString("M/dd/yy");
			var timeString = $(this).attr('time').split("T")[1].split(".")[0];
			
			if ($device == "F:MT6SC1")
			{
				if (MTest.isSwitchGood(xml))
				{
					$("#tabs-1 .inhibit .switch").empty();
										
					if (MTest.isCdcGood(xml))
					{
						if (MTest.isDataNew(xml))
						{
							$("#tabs-1 .date").html(dateString + "</br>");
							MTest.xmlLast = xml;
							
							var reply = [];

							if (dateString != MTest.startUpDateString && MTest.startUpDateString != null)
							{
								MTest.startUpDateString = dateString;
								$("#tabs-1 .renewable_" + MTest.bufferIndex).html(dateString + "</br>");
							}
							else if (dateString != MTest.startUpDateString)
							{
								MTest.startUpDateString = dateString;
							}
							
							//alert("[" + $value.text() + "]" + "Value");
							reply.push
							(
								$value.text(),
								"  ",
								"@ ",
								timeString,
								"</br>"
							);
							$("#tabs-1 .renewable_" + MTest.bufferIndex).empty()
							
							$("#tabs-1 .renewable_" + MTest.bufferIndex).append(reply.join(""));
							
							MTest.bufferIndex++;
							MTest.xmlLast = xml;
							
						}
					}
					else
					{
						$("#tabs-1 .inhibit .cdc").html("CDC is Disabled");
					}
				}
				else
				{
					$("#tabs-1 .inhibit .switch").html("Switch is taken");
					
					if (MTest.isCdcGood(xml))
					{
						return true;
					}
					else
					{
						$("#tabs-1 .inhibit .cdc").html("CDC is Disabled");
					}
				}
			}
			else if ($device == "S:MTNRG")
			{
				var NRG = parseFloat($value.text()).toFixed();
				$("#tabs-1 .status .energy").html(" " + NRG + " " + "GeV");
			}
			else if ($device == "F:MT6AB1")
			{
				var $value = $(this).find("value").text();

				if (parseInt($("#tabs-1 .status .energy").text()) <= 32)
				{						
					if ($value == "true")
					{										
						$("#tabs-1 .status .mode").html(" " + "LE Muons");
					}
					else
					{
						$("#tabs-1 .status .mode").html(" " + "LE Pions");
					}
				}
				else if (parseInt($("#tabs-1 .status .energy").text()) == 120)
				{
					$("#tabs-1 .status .mode").html(" " + "Protons");
				}
				else if (parseInt($("#tabs-1 .status .energy").text()) > 32)
				{
					if ($value == "true")
					{
						$("#tabs-1 .status .mode").html(" " + "Muons");
					}
					else
					{
						$("#tabs-1 .status .mode").html(" " + "Pions");
					}
				}
			}
		});	
	}
}

MTest.isDataNew = function(xml)
{	
	if (MTest.xmlLast != null)
	{
		var isNew = false;
		var lastDateString;
		var lastValue;
		
		var dateString;
		var value;
		
		$(MTest.xmlLast).find("reply").each(function()
		{
			var $device = $(this).find("request").attr("device");
			var $value = $(this).find("value");
			
			if ($device == "F:MT6SC1")
			{
				lastValue = $value.text();
				lastDateString = Date.parse($(this).attr('time').split("T")[0]).toString("M/dd/yy") + " " + $(this).attr('time').split("T")[1].split(".")[0];
			}
		});
		
		$(xml).find("reply").each(function()
		{
			var $device = $(this).find("request").attr("device");
			var $value = $(this).find("value");
									
			if ($device == "F:MT6SC1")
			{
				value = $value.text();
				dateString = Date.parse($(this).attr('time').split("T")[0]).toString("M/dd/yy") + " " + $(this).attr('time').split("T")[1].split(".")[0];
			}
		});
				
		if (lastDateString != null && lastValue != null && dateString != null && value != null)
		{
			if (lastDateString != dateString)
			{
				if (lastValue != value)
				{
					if (parseInt(value) > 116)
					{
						isNew = true;
					}
					else
					{
						//alert("Parsed value not greater than 70: " + parseInt(value) + ", " + value);
					}
				}
				else
				{
					//alert("Values do match: " + lastValue + ", " + value);
				}
			}
			else
			{
				//alert("Date strings do match: " + lastDateString + ", " + dateString);
			}
		}
		else
		{
			//alert("Something is null: " + lastDateString + ", " + lastValue + ", " + dateString + ", " + value);
		}
		
		//alert(isNew);
		return isNew;
	}
		
	return true;
}

MTest.isSwitchGood = function(xml)
{
	var boolean = false;
	
	try
	{
		$(xml).find("reply").each(function ()
		{
			var $device = $(this).find("request").attr("device");
			var $value = $(this).find("value").text();
			
			if ($device == "G:SYBS")
			{
				if ($value == "true")
				{
					$("#tabs-1 .inhibit .switch").empty();
					boolean = true;
				}
				else
				{
					boolean = false;
				}
			}
		});
	}
	catch(error)
	{
		alert(error);
	}
	
	return boolean;
}

MTest.isCdcGood = function(xml)
{
	var boolean = false;

	try
	{
		$(xml).find("reply").each(function ()
		{
			var $device = $(this).find("request").attr("device");
			var $value = $(this).find("value").text();
			
			if ($device == "F:MTPCDC")
			{
				if ($value == "true")
				{
					$("#tabs-1 .inhibit .cdc").empty();
					boolean = true;
				}
				else
				{
					boolean = false;
				}
			}
		});
	}
	catch(error)
	{
		alert(error);
	}
	
	return boolean;
}
	
MTest.isDataThere = function(xml)
{	
	var boolean = false;
	
	$(xml).find("reply").each(function ()
	{
		if ($(this).find("value").length > 0)
		{
			boolean = true;
		}
	});
	
	return boolean;
}

MTest.incrementRenew = function()
{
	for (i = 0; i <= 9; i++)
	{
		$("#tabs-1 .renewable_" + i).html($("#tabs-1 .renewable_" + (i+1)).html());
	}
}