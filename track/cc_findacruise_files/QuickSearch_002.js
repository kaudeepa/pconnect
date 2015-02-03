/*
*   A minimized version of this file exists using the file name of inserting .min before .js
*   To minimize, use http://refresh-sf.com/yui/ and save output to the .min equivalent of this file.
*/
var msURL = "/BookingEngine/QuickSearch/";
var msSearchResultsURL = "/BookingEngine/SailingSearch/Search2/";
var ddlMonthsVal;
var ddlPortsVal;
var ddlShipsVal;
var ddlNumberOfGuestsVal;
var ddlDestinationsVal;
var ddlStateResidenceVal;
var btnSearch;

/**
* Called on document load and on dropdown box changes.
*/
function Search(asQueryString, aoCallBack, aoError)
{
    //if (!SessionStore.QuickSearch0 && !asQueryString)
    //{
        $.ajax(
        {
            url: msURL,
            data: asQueryString,
            type: "GET",
            processData: true,
            timeout: 30000,
            dataType: "json",
            success: function (data)
            {
                aoCallBack(data);
                //SessionStore.QuickSearch0 =
                //{
                //    data: data
                //};
            },
            error: aoError
        });
    /*}
    else if (SessionStore.QuickSearch0 && !asQueryString)
    {
        Success(SessionStore.QuickSearch0.data);
    }
    else
    {
        $.ajax(
        {
            url: msURL,
            data: asQueryString,
            type: "GET",
            processData: true,
            timeout: 30000,
            dataType: "json",
            success: aoCallBack,
            error: aoError
        });
    }*/
}

/**
* Constructs a query string using current selected values in dropdown boxes.
*/
function BuildQueryString(event)
{
    var lsQuery = "";
    ddlMonthsVal = ddlMonths.val();
    var ddlMonthsValText = $("#ddlMonth option[value='" + ddlMonthsVal + "']").text();
    try { ddlPortsVal = ddlPorts.val(); } catch (e) { ddlPortsVal = "Any"; }
    try { ddlShipsVal = ddlShips.val(); } catch (e) { ddlShipsVal = "Any"; }
    ddlNumberOfGuestsVal = ddlNumberOfGuests.val();
    ddlDestinationsVal = ddlDestinations.val();
    if (ddlMonthsVal != "Any")
    {
        lsQuery = lsQuery + "month=" + ddlMonthsVal + "&";
    }

    if (ddlPortsVal != "Any")
    {
        lsQuery = lsQuery + "port=" + ddlPortsVal + "&";
    }

    if (ddlShipsVal != "Any") {
        lsQuery = lsQuery + "shipCode=" + ddlShipsVal + "&";
    }

    if (ddlNumberOfGuestsVal != "Any")
    {
        lsQuery = lsQuery + "numGuests=" + ddlNumberOfGuestsVal + "&";
    }

    if (ddlDestinationsVal != "Any")
    {
        lsQuery = lsQuery + "dest=" + ddlDestinationsVal + "&";
    }

    return lsQuery;
}

/**
* Called when any dropdown boxes value is changed.
*/
function DropDownChanged(event)
{
    var lsQuery = BuildQueryString(null);
    Search(lsQuery, Success, Failed);
}

/**
* Called on AJAX success.
*/
function Success(aoResponse)
{
    ResetLists();
    if (typeof(aoResponse) !== "undefined")
    {
        BuildDropDowns(aoResponse);
    }

    RestoreSelections();
}

/**
* Called on AJAX failure.
*/
function Failed()
{
    ResetLists();
}

/**
* Populated the dropdown boxes using response data.
*/
function BuildDropDowns(aoResponse)
{
    if (aoResponse.MonthYear != null)
    {
        for (var liCounter = 0; liCounter < aoResponse.MonthYear.length; liCounter++)
        {
            AddOptions(ddlMonths, aoResponse.MonthYear[liCounter].Code, aoResponse.MonthYear[liCounter].Description);
        }
    }

    if (aoResponse.DeparturePorts != null && (typeof(ddlPorts) !== "undefined"))
    {
        for (liCounter = 0; liCounter < aoResponse.DeparturePorts.length; liCounter++)
        {
            AddOptions(ddlPorts, aoResponse.DeparturePorts[liCounter].Code, aoResponse.DeparturePorts[liCounter].Description);
        }
    }

    if (aoResponse.Ships != null && (typeof(ddlShips) !== "undefined")) {
        try {
            for (liCounter = 0; liCounter < aoResponse.Ships.length; liCounter++) {
                AddOptions(ddlShips, aoResponse.Ships[liCounter].Code, aoResponse.Ships[liCounter].Description);
            } 
        }
        catch (e) { }
    }

    if (aoResponse.Destinations != null)
    {
        for (liCounter = 0; liCounter < aoResponse.Destinations.length; liCounter++)
        {
            AddOptions(ddlDestinations, aoResponse.Destinations[liCounter].Code, aoResponse.Destinations[liCounter].Description);
        }
    }

    for (liCounter = 1; liCounter < 6; liCounter++)
    {
        AddOptions(ddlNumberOfGuests, liCounter, liCounter);
    }

    $(".btn-quick-search").unbind("click");
    $(".btn-quick-search").click(SearchClick);
    $(".advanced").unbind("click");
    $(".advanced").click(FindACruise);
}

/**
* A helper function to generate option html.
*/
function AddOptions(aoTarget, asValue, asDescription)
{
    var lsOption = "<option value=\"" + asValue + "\">" + asDescription + "</option>";
    aoTarget.append(lsOption);
}

/**
* Resets the dropdown boxes to default values.
*/
function ResetLists()
{
    ddlMonths.html("<option value=\"Any\">Select a Month</option>");
    try { ddlPorts.html("<option value=\"Any\">Select a Departure Port</option>"); } catch (e) { }
    try { ddlShips.html("<option value=\"Any\">Select a Ship</option>"); } catch (e) { }
    ddlDestinations.html("<option value=\"Any\">Select a Destination</option>");
    ddlNumberOfGuests.html("<option value=\"Any\">Number of Travelers</option>");
}

/**
* Resets the dropdown boxes to selected or original values.
*/
function RestoreSelections()
{
    ddlMonths.val(ddlMonthsVal);
    try { ddlPorts.val(ddlPortsVal); } catch (e) { }
    try { ddlShips.val(ddlShipsVal); } catch (e) { }
    ddlDestinations.val(ddlDestinationsVal);
    ddlNumberOfGuests.val(ddlNumberOfGuestsVal);
}

/**
* Called when the user clicks the search button.
*/
function SearchClick()
{
    var lsQuery = [];
    ddlMonthsVal = ddlMonths.val();
    try { ddlPortsVal = ddlPorts.val(); } catch (e) { ddlPortsVal = "Any"; }
    try { ddlShipsVal = ddlShips.val(); } catch (e) { ddlShipsVal = "Any"; }
    ddlNumberOfGuestsVal = ddlNumberOfGuests.val();
    ddlDestinationsVal = ddlDestinations.val();
    if (ddlMonthsVal != "Any")
    {
        lsQuery.push("dat=" + ddlMonthsVal);
    }

    if (ddlPortsVal != "Any")
    {
        lsQuery.push("embkCode=" + ddlPortsVal);
    }

    if (ddlShipsVal != "Any") {
        lsQuery.push("shipCode=" + ddlShipsVal);
    }

    if (ddlNumberOfGuestsVal != "Any")
    {
        lsQuery.push("numGuests=" + ddlNumberOfGuestsVal);
    }

    if (ddlDestinationsVal != "Any")
    {
        lsQuery.push("dest=" + ddlDestinationsVal);
    }

    location.href = msSearchResultsURL + "?" + lsQuery.join("&");
}

function FindACruise()
{
    location.href = "/bookingengine/findacruise";
}