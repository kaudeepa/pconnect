var LOC = window.location.href;
var url = "/BookingEngine/QuickSearch/";
var searchResultsURL = "/BookingEngine/SailingSearch/Search2/";
var ddlMonths, ddlPorts, ddlShips, ddlDestinations, destinationChange = false,
        ddlCruiseLengths, ddlStateResidence, ddlNumGuests, chkPastGuest, chkSenior, chkPastGuestEnable, chkMilitary;
var ddlMonthsVal, ddlPortsVal, ddlShipsVal, ddlCruiseLengthVal, ddlDestinationval = "Any",
        ddlStateResidenceVal, ddlNumGuestsVal;
var btnSearch;
var chkPastGuestVal, chkSeniorVal, chkPastGuestEnableVal, chkMilitaryVal;
var ddlStartDate, ddlStartDateVal = "Any",
        ddlEndDate, ddlEndDateVal = "Any",
        dateRange = false,
        datTemp = "";
var debugDiv = null;
var debugBool = false;
var over55, res, pg, pgEnable, military;
var CurrentRatesCriteria_Cookie_Name = 'CurrentRatesCriteria';
var monthResetOptStr = "<option value=\"Any\">Any Month</option>";

function Search(asQueryString, aoCallBack, aoError)
{
    if (debugBool && $("#qs-debug").length == 0)
    {
        debugDiv = $("#footer-final").append("<div id='qs-debug' class='hid'></div>");
    }
    //if (!SessionStoreQuickSearch0HasData() && !asQueryString)
    //{
        $.ajax({
            url: url,
            data: asQueryString,
            type: "GET",
            processData: true,
            timeout: 30000,
            dataType: "json",
            success: function (data)
            {
                aoCallBack(data);
                //SessionStore.QuickSearch0 = {
                //    data: data
                //};
            },
            error: aoError
        });
    /*}
    else
    {
        if (SessionStoreQuickSearch0HasData() && !asQueryString && !$.browser.msie)
        {
            aoCallBack(SessionStore.QuickSearch0.data);
        }
        else
        {
            if (SessionStoreQuickSearch0HasData() && !asQueryString && $.browser.msie)
            {
                setTimeout(FixDropDownsDelegate, 250);
            }
            else
            {
                $.ajax({
                    url: url,
                    data: asQueryString,
                    type: "GET",
                    processData: true,
                    timeout: 30000,
                    dataType: "json",
                    success: aoCallBack,
                    error: aoError
                });
            }
        }
    }*/
}

/**
 * Delegate for timeout call for IE only to avoid jqTransform problem.
 */
function FixDropDownsDelegate()
{
    try
    {
        //fixDropdowns(SessionStore.QuickSearch0.data);
    }
    catch (aoXcp)
    {
    }
}

function SearchCashback(request, callback, error, status)
{
    $.ajax({
        url: url,
        data: request,
        type: "GET",
        processData: true,
        timeout: 30000,
        dataType: "json",
        success: callback,
        error: error,
        complete: status
    });
}

function buildQuery(event)
{
    if (document.location.href.toLowerCase().indexOf("findcruise") > -1 || document.location.href.toLowerCase().indexOf("findacruise") > -1)
    {
        return BuildQueryLegacy(event);
    }
    var ddlMonthsValText = $("#ddlMonth option[value='" + ddlMonthsVal + "']").text();
    var lsQuery = "";
    try
    {
        ddlMonthsVal = ddlMonths.val();
        ddlMonthsValText = $("#ddlMonth option[value='" + ddlMonthsVal + "']").text();
    }
    catch (aoXcp)
    {
        ddlMonthsValText = "Any";
        ddlMonthsVal = "Any";
    }
    try
    {
        ddlPortsVal = ddlPorts.val();
    }
    catch (aoXcp)
    {
        ddlPortsVal = "Any";
    }
    try {
        ddlShipsVal = ddlShips.val();
    }
    catch (aoXcp) {
        ddlShipsVal = "Any";
    }
    try
    {
        ddlNumberOfGuestsVal = ddlNumGuests.val();
    }
    catch (aoXcp)
    {
        ddlNumberOfGuestsVal = "Any";
    }
    try
    {
        ddlDestinationval = ddlDestinations.val();
    }
    catch (aoXcp)
    {
        ddlDestinationval = "Any";
    }
    try
    {
        ddlCruiseLengthVal = $("#ddl-duration").val();
    }
    catch (aoXcp)
    {
        ddlCruiseLengthVal = "Any";
    }
    try
    {
        ddlStartDateVal = $("#ddl-from").val();
    }
    catch (aoXcp)
    {
        ddlStartDateVal = "Any";
    }
    try
    {
        ddlEndDateVal = $("#ddl-to").val();
    }
    catch (aoXcp)
    {
        ddlEndDateVal = "Any";
    } 
    
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
    if (ddlDestinationval != "Any")
    {
        lsQuery = lsQuery + "dest=" + ddlDestinationval + "&";
    }
    if (ddlCruiseLengthVal != "Any") 
    {
       lsQuery = lsQuery + "dur=" + ddlCruiseLengthVal + "&";
    }
    return lsQuery;
}

function BuildQueryLegacy(event)
{
    var arrQuery = [];
    // for months we will send the description not the value,
    ddlPortsVal = ddlPorts.val();
    try { ddlShipsVal = ddlShips.val(); } catch (e) {ddlShipsVal = "Any"; }
    ddlCruiseLengthVal = ddlCruiseLengths.val();
    ddlNumGuestsVal = ddlNumGuests.val();
    destinationChange = (ddlDestinations.val() != ddlDestinationval);
    ddlDestinationval = ddlDestinations.val();
    if (!dateRange)
    {
        ddlMonthsVal = ddlMonths.val();
        var ddlMonthsValText = $("#ddlMonth option[value='" + ddlMonthsVal + "']").text();
    }
    if (ddlMonthsVal != "Any =" && !dateRange)
    {
        arrQuery.push("month=" + ddlMonthsValText);
    }
    else
    {
        if (dateRange)
        {
            //	if(destinationChange) {
            //	  ddlStartDate.val("Any");
            //	  ddlEndDate.val("Any");
            //
            //	}
            var rangeArr = [];
            var startIndex = ddlStartDate.attr("selectedIndex");
            var endIndex = ddlEndDate.attr("selectedIndex");
            var startOptions = $.makeArray(ddlStartDate.find("option"));
            var endOptions = $.makeArray(ddlEndDate.find("option"));
            ddlStartDateVal = startOptions[startIndex].value;
            ddlEndDateVal = endOptions[endIndex].value;
            if (ddlStartDate.val() == "Any" && ddlEndDate.val() == "Any")
            {
                // dont push a date open ended
                ddlStartDateVal = ddlEndDateVal = "Any";
                datTemp = "";
            }
            else
            {
                if (ddlStartDate.val() != "Any" && ddlEndDate.val() != "Any" && (ddlStartDateVal == ddlEndDateVal))
                {
                    datTemp = "dat=" + ddlStartDate.val();
                    arrQuery.push("dat=" + ddlStartDate.val());
                }
                else
                {
                    if (ddlStartDate.val() == "Any" && ddlEndDate.val() != "Any")
                    {
                        for (var i = endIndex, len = endOptions.length; i >= 1; i--)
                        {
                            rangeArr.push(startOptions[i].value);
                            //console.debug("%d option val %s", i, startOptions[i].value);
                        }
                        datTemp = "dat=" + rangeArr.join(",");
                        arrQuery.push(datTemp);
                        ddlEndDateVal = endOptions[endIndex].value;
                    }
                    else
                    {
                        if (ddlStartDate.val() != "Any" && ddlEndDate.val() == "Any")
                        {
                            for (var i = startIndex, len = startOptions.length; i < len; i++)
                            {
                                rangeArr.push(startOptions[i].value);
                                //console.debug("%d option val %s", i, startOptions[i].value);
                            }
                            datTemp = "dat=" + rangeArr.join(",");
                            arrQuery.push(datTemp);
                            ddlStartDateVal = startOptions[startIndex].value;
                        }
                        else
                        {
                            if (ddlStartDate.val() != "Any" && ddlEndDate.val() != "Any")
                            {
                                ddlStartDateVal = ddlStartDate.val();
                                ddlEndDateVal = ddlEndDate.val();
                                var startIndex = ddlStartDate.find("option[value=" + ddlStartDateVal + "]").attr("index");
                                var endIndex = ddlStartDate.find("option[value=" + ddlEndDateVal + "]").attr("index");
                                for (var i = startIndex; i <= endIndex; i++)
                                {
                                    //console.debug("%d: end %d val %d", i, endIndex, startOptions[i].value);
                                    rangeArr.push(startOptions[i].value);
                                }
                                datTemp = "dat=" + rangeArr.join(",");
                                //console.debug("pushing on the array", datTemp);
                                arrQuery.push(datTemp);
                            }
                        }
                    }
                }
            }
        }
    }
    if (ddlPortsVal != "Any") arrQuery.push("port=" + ddlPortsVal);
    if (ddlShipsVal != "Any") arrQuery.push("shipCode=" + ddlShipsVal);
    if (ddlCruiseLengthVal != "Any") arrQuery.push("dur=" + ddlCruiseLengthVal);
    if (ddlDestinationval != "Any") arrQuery.push("dest=" + ddlDestinationval);
    if (ddlNumGuestsVal != "Any") arrQuery.push("numGuests=" + ddlNumGuestsVal);
    return arrQuery.join("&");
}

function getCookieDomain()
{
    var domain = document.domain;
    if (domain == "localhost") return "";
    if (domain.indexOf(".com") > 0)
    {
        if (domain.indexOf(".") < domain.indexOf(".com")) domain = domain.substr(domain.indexOf(".") + 1);
        return domain;
    }
    else return "";
}

function getCookieOptions()
{
    var options = {
        path: '/',
        expires: 90
    };
    var domain = getCookieDomain();
    if (domain.length > 0) options = {
        path: '/',
        expires: 90,
        domain: domain
    };
    return options;
}

function SetRateCriteriaCookie()
{
    var cookieArr = [];
    if (ddlStateResidenceVal != "Any") cookieArr.push("StateCode=" + ddlStateResidenceVal);
    if (chkPastGuestVal == "Y") cookieArr.push("PastGuest=Y");
    if (chkPastGuestEnableVal == "Y") cookieArr.push("PGEnable=Y");
    if (chkSeniorVal == "Y") cookieArr.push("Senior=Y");
    if (chkMilitary.attr('checked')) cookieArr.push("Military=Y");
    var options = getCookieOptions();   
    $.cookie(CurrentRatesCriteria_Cookie_Name, cookieArr.join("&"), options);
}

function GetRateCriteriaCookie()
{
    cookiestring = "",temp = [],cookieObj = {};
    try
    {
        cookiestring = $.cookie(CurrentRatesCriteria_Cookie_Name);
        if (cookiestring != null && cookiestring.length > 0)
        {
            if (cookiestring.indexOf("&") > -1)
            {
                cookieArr = cookiestring.split("&");
                for (var i = 0, len = cookieArr.length; i < len; i++)
                {
                    temp = cookieArr[i].split("=");
                    cookieObj[temp[0]] = temp[1];
                    if (temp[0] == "StateCode") res = temp[1];
                    if (temp[0] == "PastGuest") pg = temp[1];
                    if (temp[0] == "Senior") over55 = temp[1];
                    if (temp[0] == "PGEnable") pgEnable = temp[1];
                    if (temp[0] == "Military") military = temp[1];
                }
            }
            else
            {
                cookieArr = cookiestring.split("=");
                cookieObj[cookieArr[0]] = cookieArr[1];
                if (cookieArr[0] == "StateCode") res = cookieArr[1];
                if (cookieArr[0] == "PastGuest") pg = cookieArr[1];
                if (cookieArr[0] == "Senior") over55 = cookieArr[1];
                if (cookieArr[0] == "PGEnable") pgEnable = cookieArr[1];
                if (cookieArr[0] == "Military") military = cookieArr[1];
            }
        }
    }
    catch (err)
    {
    }
    return cookieObj;
}

function SetUIFromCookie()
{
    GetRateCriteriaCookie();
    if (res != "Any" && res != "XX" && res != "")
    {
        ddlStateResidence.val(res);
        ddlStateResidenceVal = res;
        ddlStateResidence.value = res;
    }
    if (pg == "Y")
    {
        chkPastGuestVal = "Y";
        chkPastGuest.attr('checked', true);
    }
    else
    {
        chkPastGuestVal = "N";
        chkPastGuest.attr('checked', false);
    }
    if (over55 == "Y")
    {
        chkSeniorVal = "Y";
        chkSenior.attr('checked', true);
    }
    else
    {
        chkSeniorVal = "N";
        chkSenior.attr('checked', false);
    }
if (military == "Y") {
        chkMilitaryVal = "Y";
        chkMilitary.attr('checked', true);
    }
    else {
        chkMilitaryVal = "N";
        chkMilitary.attr('checked', false);
    }
    if (pgEnable == "Y")
    {
        chkPastGuestEnableVal = "Y";
        if (chkPastGuestEnable) {
            chkPastGuestEnable.attr('checked', true);
        }
    }
    else
    {
        chkPastGuestEnableVal = "N";
        if (chkPastGuestEnable) {
            chkPastGuestEnable.attr('checked', false);
        }
    }
}

function dropDownChanged(event)
{
    var strQuery = buildQuery();
    Search(strQuery, Success, Failed);
}

function specialRatesChanged()
{
    ddlStateResidenceVal = ddlStateResidence.val();
    chkPastGuestVal = (chkPastGuest.is(':checked')) ? "Y" : "N";
    chkSeniorVal = (chkSenior.is(':checked')) ? "Y" : "N";
    if (chkPastGuestEnable) {
        chkPastGuestEnableVal = (chkPastGuestEnable.is(':checked')) ? "Y" : "N";
}
    chkMilitaryVal = (chkMilitary.is(':checked')) ? "Y" : "N";
}

function Success(response)
{
    if (debugBool && $("#qs-debug").length == 1)
    {
        $("#qs-debug").append("<p>Success on service call</p>");
    }
    ResetLists();
    BuildDropDowns(response);
    RestoreSelctions();
    if (debugBool && $("#qs-debug").length == 1)
    {
        $("#qs-debug").append("<p>End service call</p>");
    }
}

function Failed()
{
    ResetLists();
}

function Status(xhr, text)
{
    //alert("status: " + xhr.status + ", ready state: " + xhr.readyState + ", text status: " + text);
}

function BuildDropDowns(d)
{
    if (debugBool && $("#qs-debug").length == 1)
    {
        $("#qs-debug").append("<p>build drop downs</p>");
        $("#qs-debug").append(d);
        $("#qs-debug").append(d.MonthYear);
        $("#qs-debug").append(d.DeparturePorts);
        $("#qs-debug").append(d.Ships);
        $("#qs-debug").append(d.Destinations);
        $("#qs-debug").append(d.CruiseLength);
    }
    if (d.MonthYear != null && !dateRange)
    {
        var _options = '<option value="Any">Any Month</option>';
        for (i = 0; i < d.MonthYear.length; i++)
        {
            _options += '<option value="' + d.MonthYear[i].Code + '">' + d.MonthYear[i].Description + '</option>';
        }
        ddlMonths.html(_options);
    }
    else if (dateRange)
    {
        var _options = '<option value="Any">Any Month</option>';
        for (i = 0; i < d.MonthYear.length; i++)
        {
            _options += '<option value="' + d.MonthYear[i].Code + '">' + d.MonthYear[i].Description + '</option>';
        }
        ddlStartDate.html(_options);
        ddlEndDate.html(_options);
    }
    if (d.DeparturePorts != null)
    {
        var _options = '<option value="Any">Any Departure Port</option>';
        for (i = 0; i < d.DeparturePorts.length; i++)
        {
            _options += '<option value="' + d.DeparturePorts[i].Code + '">' + d.DeparturePorts[i].Description + '</option>';
        }
        ddlPorts.html(_options);
    }
    if (d.Ships != null) {
        var _options = '<option value="Any">Any Ship</option>';
        for (i = 0; i < d.Ships.length; i++) {
            _options += '<option value="' + d.Ships[i].Code + '">' + d.Ships[i].Description + '</option>';
        }
        try { ddlShips.html(_options); } catch (e) { }
    }
    if (d.Destinations != null)
    {
        var _options = '<option value="Any">Any Destination</option>';
        for (i = 0; i < d.Destinations.length; i++)
        {
            _options += '<option value="' + d.Destinations[i].Code + '">' + d.Destinations[i].Description + '</option>';
        }
        ddlDestinations.html(_options);
    }
    if (d.CruiseLength != null)
    {
        var _options = '<option value="Any">Any Cruise Length</option>';
        for (i = 0; i < d.CruiseLength.length; i++)
        {
            _options += '<option value="' + d.CruiseLength[i].Code + '">' + d.CruiseLength[i].Description + '</option>';
        }
        ddlCruiseLengths.html(_options);
    }
    // This is a special case since list is static
    var lsHTML = '<option value="Any">Any Number of Travelers</option>';
    for (liCounter = 1; liCounter < 6; liCounter++)
    {
        lsHTML += '<option value="' + liCounter + '">' + liCounter + '</option>';
    }
    try
    {
        ddlNumGuests.html(lsHTML);
    }
    catch (aoXcp)
    {
    }
}

function AddOptions2(target, value, option)
{
    var strOption = "<option value=\"" + value + "\">" + option + "</option>";
    target.append(strOption);
    if (debugBool && $("#qs-debug").length == 1)
    {
        $("#qs-debug").append("<p>" + target.id + "<span val='" + value + "'>" + option + "</span></p>");
    }
    if (LOC.indexOf("cashback-dynamic.aspx") != -1)
    {
        $("#col-right .box-blue-gradient").append(option);
    }
}

function ResetLists()
{
    if (debugBool && $("#qs-debug").length == 1)
    {
        $("#qs-debug").append("<p>Rest Lists" + dateRange + "</p>");
    }
    if (!dateRange) ddlMonths.html(monthResetOptStr);
    else
    {
        ddlStartDate.html(monthResetOptStr);
        ddlEndDate.html(monthResetOptStr);
    }
    try
    {
        ddlPorts.html("<option value=\"Any\">Any Embarkation Port</option>");
    }
    catch (aoXcp)
    {
    }
    try {
        ddlShips.html("<option value=\"Any\">Any Ship</option>");
    }
    catch (aoXcp) {
    }
    try
    {
        ddlDestinations.html("<option value=\"Any\">Any Destination</option>");
    }
    catch (aoXcp)
    {
    }
    try
    {
        ddlCruiseLengths.html("<option value=\"Any\">Any Cruise Length</option>");
    }
    catch (aoXcp)
    {
    }
    try
    {
        ddlNumGuests.html("<option value=\"Any\">Any Number of Travelers</option>");
    }
    catch (aoXcp)
    {
    }
}

function RestoreSelctions()
{
    if (!dateRange)
    {
        ddlMonths.val(ddlMonthsVal);
    }
    else
    {
        ddlStartDate.val(ddlStartDateVal);
        ddlEndDate.val(ddlEndDateVal);
        //console.debug("restore startDateVal %s endDateVal %s", ddlStartDateVal, ddlEndDateVal);
        if (ddlStartDateVal == "Any" && ddlEndDateVal != "Any")
        {
            if (ddlStartDate.find("option[value=" + ddlEndDateVal + "]").length == 1)
            {
                var ddlId = ddlStartDate.attr("id");
                var index = ddlStartDate.find("option[value=" + ddlEndDateVal + "]").attr("index");

                var x = document.getElementById(ddlId);
                //console.debug("second case %s %o index %d totalLength %d", ddlId, x, index,ddlStartDate.find("option").length );
                for (var i = index + 1; i < ddlStartDate.find("option").length;)
                {
                    x.remove(i);
                }
            }
        }
        else if (ddlStartDateVal != "Any")
        {
            if (ddlEndDate.find("option[value=" + ddlStartDateVal + "]").length == 1)
            {
                var ddlId = ddlEndDate.attr("id");
                var index = ddlEndDate.find("option[value=" + ddlStartDateVal + "]").attr("index");

                var x = document.getElementById(ddlId);
                for (var i = index - 1; i > 0; i--)
                {
                    // console.debug("%d: endDDIndex %d title %s value %s", i, index, ddlEndDate.find("option").eq(i).text(),ddlEndDate.find("option").eq(i).val());
                    x.remove(i)
                }
            }
        }
    }
    try
    {
        ddlPorts.val(ddlPortsVal);
    }
    catch (aoXcp)
    {
    }
    try {
        ddlShips.val(ddlShipsVal);
    }
    catch (aoXcp) {
    }
    try
    {
        ddlDestinations.val(ddlDestinationval);
    }
    catch (aoXcp)
    {
    }
    try
    {
        ddlCruiseLengths.val(ddlCruiseLengthVal);
    }
    catch (aoXcp)
    {
    }
    try
    {
        ddlNumGuests.val(ddlNumGuestsVal);
    }
    catch (aoXcp)
    {
    }
}

function SearchClick(aTag) {
    var pgObj = $('#find-cruise #past-guest-number');
    if (pgObj && pgObj.length > 0) {
        if (!checkPgNumberValidity(false)) {
            $('html, body').animate({
                scrollTop: 800
            }, 'slow');
            return false;
        }
    }
    // initilize variables in case user just clicks Search
    var strQuery = new Array();
    if (!dateRange) ddlMonthsVal = ddlMonths.val();
    try
    {
        ddlPortsVal = ddlPorts.val();
    }
    catch (aoXcp)
    {
    }
    try {
        ddlShipsVal = ddlShips.val();
    }
    catch (aoXcp) {
    }
    try
    {
        ddlCruiseLengthVal = ddlCruiseLengths.val();
    }
    catch (aoXcp)
    {
    }
    try
    {
        ddlDestinationval = ddlDestinations.val();
    }
    catch (aoXcp)
    {
    }
    try
    {
        ddlNumGuestsVal = $("#numGuests").parents('.jqTransformSelectWrapper').find('div span').text();
        if (ddlNumGuestsVal == "")
        {
            ddlNumGuestsVal = ddlNumGuests.val();
        }
    }
    catch (aoXcp)
    {
    }
    specialRatesChanged();
    if (ddlMonthsVal != "Any" && !dateRange)
    {
        strQuery.push("dat=" + ddlMonthsVal);
    }
    else
    {
        strQuery.push(datTemp);
    }

    if (!ddlStartDate)
        ddlStartDate = ddlEndDate = $('#departure-date');

    // +++ passing both the 'From' and 'To' selected dates (instead of a range in varying sort order)
    var fromDateVal = ddlStartDate.val();
    var toDateVal = ddlEndDate.val();
    if (fromDateVal && fromDateVal != "Any") strQuery.push("datFrom=" + fromDateVal);
    if (toDateVal && toDateVal != "Any") strQuery.push("datTo=" + toDateVal);
    // +++
    if (ddlPortsVal && ddlPortsVal != "Any") strQuery.push("embkCode=" + ddlPortsVal);
    if (ddlShipsVal && ddlShipsVal != "Any") strQuery.push("shipCode=" + ddlShipsVal);
    if (ddlNumGuestsVal && ddlNumGuestsVal.indexOf('Any') == -1) strQuery.push("numGuests=" + ddlNumGuestsVal);
    if (ddlCruiseLengthVal && ddlCruiseLengthVal != "Any") strQuery.push("dur=" + ddlCruiseLengthVal);
    if (ddlDestinationval && ddlDestinationval != "Any") strQuery.push("dest=" + ddlDestinationval);
    if (ddlStateResidenceVal && ddlStateResidenceVal != "Any") strQuery.push("StateCode=" + ddlStateResidenceVal);
    if (chkPastGuestVal && chkPastGuestVal == "Y") strQuery.push("PastGuest=" + chkPastGuestVal);
    if (chkSeniorVal == "Y") strQuery.push("Senior=" + chkSeniorVal);
    if (chkMilitaryVal == "Y") strQuery.push("Military=" + chkMilitaryVal);
    if (chkPastGuestEnableVal == "Y") strQuery.push("PGEnable=" + chkPastGuestEnableVal);
    SetRateCriteriaCookie();
    // nsingh (04/19/11) - Added to remove undefined from query string
    if (Carnival.Live.ShowTargetedOffers === "true")
    {
        var targetedOffersRateCodes = "";
        var cookiestr_targetedOffers = "";
        cookiestr_targetedOffers = $.cookie('TargetedOffersCookie');
        if (cookiestr_targetedOffers && cookiestr_targetedOffers.length > 0)
        {
            targetedOffersRateCodes = cookiestr_targetedOffers.split('|')[0].split('=')[1];
            strQuery.push("tgo=" + targetedOffersRateCodes);
        }
    }
    if (aTag)
    {
        $(aTag).attr("href", searchResultsURL + "?" + strQuery.join("&"));
    }
    else
    {
        document.location.href = searchResultsURL + "?" + strQuery.join("&");
    }
}

function SuccessItineraryPage(response)
{
    ResetLists();
    BuildDropDowns(response);
    if (!firstLoad) RestoreSelctions();
    else
    {
        // IE6 timing hack with val()
        setTimeout(BindQueryStringValues, 500);
    }
    firstLoad = false;
}

function BindQueryStringValues()
{
    ddlPorts.val($.query.GET("embkCode"));
    try { ddlShips.val($.query.GET("shipCode")); } catch (e) { }
    try
    {
        ddlNumGuests.val($.query.GET("numGuests"));
    }
    catch (aoXcp)
    {
    }
    ddlDestinations.val($.query.GET("subRegionCode"));
    if ($.query.GET("durDays") != null) ddlCruiseLengths.val(GetDurationValue(parseInt($.query.GET("durDays"))));
    if ($.query.GET("sailDate") != null) ddlMonths.val(GetMonthValue($.query.GET("sailDate")));
}

function GetDurationValue(durDays)
{
    if (durDays > 1 && durDays <= 5) return "D1";
    if (durDays > 5 && durDays <= 9) return "D2";
    if (durDays >= 10) return "D3";
}

function GetMonthValue(monthVal)
{
    var month = monthVal.substr(0, 2);
    if (month.indexOf("/") != -1) month = "0" + monthVal.substring(0, 1);
    else month = monthVal.substr(0, 2);
    var year = monthVal.substr(monthVal.lastIndexOf("/") + 1, 4);
    return month + year;
}