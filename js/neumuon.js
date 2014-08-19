NeuMuon.startUpDateString = null;
NeuMuon.bufferIndex = 0;
NeuMuon.xmlLast;

function NeuMuon()
{
	
}

NeuMuon.parseXML = function(xml)
{
	if (NeuMuon.isDataThere(xml))
	{
		if (NeuMuon.bufferIndex >= 10)
		{
			NeuMuon.bufferIndex = 9;
			this.incrementRenew();
		}

		$("#tabs-2 .renewable_" + NeuMuon.bufferIndex).empty()
		
		$(xml).find("reply").each(function()
		{
			var $device = $(this).find("request").attr("device");
			var $value = $(this).find("value");
			var dateString = Date.parse($(this).attr('time').split("T")[0]).toString("M/dd/yy");
			var timeString = $(this).attr('time').split("T")[1].split(".")[0];
			
			if ($device == "S:G2SEM")
			{
				if (NeuMuon.isSwitchGood(xml))
				{
					$("#tabs-2 .inhibit .switch").empty();
										
					if (NeuMuon.isCdcGood(xml))
					{
						if (NeuMuon.isDataNew(xml))
						{
							$("#tabs-2 .date").html(dateString + "</br>");
							NeuMuon.xmlLast = xml;
							
							var reply = [];

							if (dateString != NeuMuon.startUpDateString && NeuMuon.startUpDateString != null)
							{
								NeuMuon.startUpDateString = dateString;
								$("#tabs-2 .renewable_" + bufferIndex).html(dateString + "</br>");
							}
							else if (dateString != NeuMuon.startUpDateString)
							{
								NeuMuon.startUpDateString = dateString;
							}
							
							var split = $value.text().toString().split('E');
							var value = parseFloat(split[0]);
							var roundValue = Math.round(value*100)/100;
							var units = split[1];
							
							if (value > 0 && units > 8)
							{
								reply.push
								(
									roundValue+'E'+units,
									"  ",
									"@ ",
									timeString,
									"</br>"
								);

								$("#tabs-2 .renewable_" + NeuMuon.bufferIndex).empty();

								$("#tabs-2 .renewable_" + NeuMuon.bufferIndex).append(reply.join(""));
								
								NeuMuon.bufferIndex++;
								NeuMuon.xmlLast = xml;
							}
							else
							{
								//alert("Parsed value not greater than 0: " + value + " or units not greater than 8: " + units);
							}
						}
					}
					else
					{
						$("#tabs-2 .inhibit .cdc").html("CDC is Disabled");
					}
				}
				else
				{
					$("#tabs-2 .inhibit .switch").html("Switch is taken");
					
					if (NeuMuon.isCdcGood(xml))
					{
						return true;
					}
					else
					{
						$("#tabs-2 .inhibit .cdc").html("CDC is Disabled");
					}
				}
			}
			else if ($device == "S:SYNRG")
			{
				$("#tabs-2 .status .energy").html(" " + $value.text() + " " + "GeV");
			}
		});	
	}
}

NeuMuon.isDataNew = function(xml)
{	
	if (NeuMuon.xmlLast != null)
	{
		var isNew = false;
		var lastDateString;
		var lastValue;
		
		var dateString;
		var value;
		
		$(NeuMuon.xmlLast).find("reply").each(function()
		{
			var $device = $(this).find("request").attr("device");
			var $value = $(this).find("value");
			
			if ($device == "S:G2SEM")
			{
				lastValue = $value.text();
				lastDateString = Date.parse($(this).attr('time').split("T")[0]).toString("M/dd/yy") + " " + $(this).attr('time').split("T")[1].split(".")[0];
			}
		});
		
		$(xml).find("reply").each(function()
		{
			var $device = $(this).find("request").attr("device");
			var $value = $(this).find("value");
									
			if ($device == "S:G2SEM")
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
					isNew = true;
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

NeuMuon.isSwitchGood = function(xml)
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

NeuMuon.isCdcGood = function(xml)
{
	var boolean = false;

	try
	{
		$(xml).find("reply").each(function ()
		{
			var $device = $(this).find("request").attr("device");
			var $value = $(this).find("value").text();
			
			if ($device == "F:NEUCDC")
			{
				if ($value == "true")
				{
					$("#tabs-2 .inhibit .cdc").empty();
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
	
NeuMuon.isDataThere = function(xml)
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

NeuMuon.incrementRenew = function()
{
	for (i = 0; i < 9; i++)
	{
		$("#tabs-2 .renewable_" + i).html($("#tabs-2 .renewable_" + (i+1)).html());
	}
}