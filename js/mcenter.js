MCenter.startUpDateString = null;
MCenter.bufferIndex = 0;
MCenter.xmlLast;

function MCenter()
{
	
}

MCenter.parseXML = function(xml)
{
	if (MCenter.isDataThere(xml))
	{
		if (MCenter.bufferIndex >= 10)
		{
			MCenter.bufferIndex = 9;
			this.incrementRenew();
		}
		
		$(xml).find("reply").each(function()
		{
			var $device = $(this).find("request").attr("device");
			var $value = $(this).find("value");
			var dateString = Date.parse($(this).attr('time').split("T")[0]).toString("M/dd/yy");
			var timeString = $(this).attr('time').split("T")[1].split(".")[0];
			
			if ($device == "F:MC6SC")
			{
				if (MCenter.isSwitchGood(xml))
				{
					$("#tabs-3 .inhibit .switch").empty();
										
					if (MCenter.isCdcGood(xml))
					{
						if (MCenter.isDataNew(xml))
						{
							$("#tabs-3 .date").html(dateString + "</br>");
							MCenter.xmlLast = xml;
							
							var reply = [];

							if (dateString != MCenter.startUpDateString && MCenter.startUpDateString != null)
							{
								MCenter.startUpDateString = dateString;
								$("#tabs-3 .renewable_" + MCenter.bufferIndex).html(dateString + "</br>");
							}
							else if (dateString != MCenter.startUpDateString)
							{
								MCenter.startUpDateString = dateString;
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
							$("#tabs-3 .renewable_" + MCenter.bufferIndex).empty()

							$("#tabs-3 .renewable_" + MCenter.bufferIndex).append(reply.join(""));
							
							MCenter.bufferIndex++;
							MCenter.xmlLast = xml;
						}
					}
					else
					{
						$("#tabs-3 .inhibit .cdc").html("CDC is Disabled");
					}
				}
				else
				{
					$("#tabs-3 .inhibit .switch").html("Switch is taken");
					
					if (MCenter.isCdcGood(xml))
					{
						return true;
					}
					else
					{
						$("#tabs-3 .inhibit .cdc").html("CDC is Disabled");
					}
				}
			}
			else if ($device == "S:SYNRG")
			{
				$("#tabs-3 .status .energy").html(" " + $value.text() + " " + "GeV");
			}
			else if ($device == "F:MT6AB1")
			{
				if (parseInt($("#tabs-3 .status .energy").text()) <= 32)
				{
					$(this).find("field").each(function()
					{
						$fieldName = $(this).attr('name');
						
						if ($fieldName == "on")
						{										
							if ($(this).text() == "true")
							{
								$("#tabs-3 .status .mode").html(" " + "LE Muons");
							}
							else
							{
								$("#tabs-3 .status .mode").html(" " + "LE Pions");
							}
						}
					});
				}
				else if (parseInt($("#tabs-3 .status .energy").text()) == 120)
				{
					$("#tabs-3 .status .mode").html(" " + "Protons");
				}
				else if (parseInt($("#tabs-3 .status .energy").text()) > 32)
				{
					$(this).find("field").each(function()
					{
						$fieldName = $(this).attr('name');
						
						if ($fieldName == "on")
						{
							if ($(this).text() == "true")
							{
								$("#tabs-3 .status .mode").html(" " + "Muons");
							}
							else
							{
								$("#tabs-3 .status .mode").html(" " + "Pions");
							}
						}
					});
				}
			}
		});	
	}
}

MCenter.isDataNew = function(xml)
{	
	if (MCenter.xmlLast != null)
	{
		var isNew = false;
		var lastDateString;
		var lastValue;
		
		var dateString;
		var value;
		
		$(MCenter.xmlLast).find("reply").each(function()
		{
			var $device = $(this).find("request").attr("device");
			var $value = $(this).find("value");
			
			if ($device == "F:MC6SC")
			{
				lastValue = $value.text();
				lastDateString = Date.parse($(this).attr('time').split("T")[0]).toString("M/dd/yy") + " " + $(this).attr('time').split("T")[1].split(".")[0];
			}
		});
		
		$(xml).find("reply").each(function()
		{
			var $device = $(this).find("request").attr("device");
			var $value = $(this).find("value");
									
			if ($device == "F:MC6SC")
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
					if (parseInt(value) > 80)
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

MCenter.isSwitchGood = function(xml)
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

MCenter.isCdcGood = function(xml)
{
	var boolean = false;

	try
	{
		$(xml).find("reply").each(function ()
		{
			var $device = $(this).find("request").attr("device");
			var $value = $(this).find("value");
			
			if ($device == "F:MCCDC")
			{
				if (parseInt($value.text()) == 8241) //8241 = good value & 9283 is tripped value
				{
					$("#tabs-3 .inhibit .cdc").empty();
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
	
MCenter.isDataThere = function(xml)
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

MCenter.incrementRenew = function()
{
	for (i = 0; i < 9; i++)
	{
		$("#tabs-3 .renewable_" + i).html($("#tabs-3 .renewable_" + (i+1)).html());
	}
}