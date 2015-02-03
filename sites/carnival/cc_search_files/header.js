var myResRend = false;
var favRend = false;
var authenticated = false;
var loggedIn = false;

$(document).ready(function ()
{
    var liDaysUntilCruise = getDaysTillSailMessage();
    if (liDaysUntilCruise != "" && liDaysUntilCruise != null)
    {
        $("#header-num-days").html(liDaysUntilCruise);
        $("#header2010 .btm #subnav").addClass("dl");
        $("#header-days-left").show();
    }
    $("#dropdowns li, #subnav li").hover(function ()
    {
        if ($(this).find('.flyout').length > 0)
        {
            if (!($(this).hasClass('find') && $('.quick-search').not('#header2010 .quick-search').length > 0))
            {
                $(this).addClass('active');
                if ($.browser.msie && parseInt($.browser.version) == 6)
                {
                    $(this).find(".flyout").bgiframe();
                }
            }
        }
    }, function ()
    {
        var lbHasFocus = false;
        var lsActiveID = document.activeElement.id;
        $(this).find('select').each(function ()
        {
            if ($(this).attr('id') == lsActiveID)
            {
                lbHasFocus = true;
            }
        });

        if (!lbHasFocus)
        {
            $(this).removeClass('active');
        }
    });

    var lsUserAgent = navigator.userAgent.toLowerCase();
    if (lsUserAgent.indexOf('safari') != -1 && lsUserAgent.indexOf('chrome') == -1)
    {
        $('select.med').css('width', '210px').css('height', '38px').css('background', 'none').css('border', '1px solid');
    }

    // For Safari Find a Cruise tooltip only
    if ($.browser.webkit)
    {
        $("#imgTooltipHeader").css("margin-right", "0px").css("margin-left", "162px").css("margin-top", "-38px");
    }
});
jQuery.extend(jQuery.expr[':'], {
    focus: function (aoElement)
    {
        return aoElement == document.activeElement;
    }
});

function ParseDateFromMMddyyyyCultureInvariant(dateToParse) {
    if (dateToParse != null && dateToParse != "") {
        var year, month, day;
        var dateSplit = [];
        if (dateToParse.indexOf("-") != -1)
            dateSplit = dateToParse.split("-");
        if (dateToParse.indexOf("/") != -1)
            dateSplit = dateToParse.split("/");
        if (dateSplit.length > 0) {
            month = dateSplit[0];
            day = dateSplit[1];
            year = dateSplit[2];
            return new Date(year, parseInt(month, 10) - 1, day);
        } else {
            if (dateToParse.length != 8)
                return null;
            month = dateToParse.substring(0, 2);
            day = dateToParse.substring(2, 4);
            year = dateToParse.substring(4);
            return new Date(year, parseInt(month, 10) - 1, day);
        }
    }
    return null;
}


function getDaysTillSailMessage()
{
    var lsReturn = "";
    var liMinutes = 1000 * 60;
    var liHours = liMinutes * 60;
    var liDays = liHours * 24;

    try
    {
        var lsSailDate = $.cookie("SailDate");
        var loSailDate = ParseDateFromMMddyyyyCultureInvariant(lsSailDate);
        if(loSailDate != null) {
            var lsParsedSailDate = Date.parse(Date());
            var lsLabel = " Days";
            liDays = parseInt(((loSailDate - lsParsedSailDate) / liDays), 10) + 1; //Plus one to account for partial day
            if (liDays == 1) {
                lsLabel = " Day";
            }
            lsReturn = 'You cruise in ' + liDays + lsLabel;
        }
    }
    catch (aoXcp)
    {
    }

    return lsReturn;
}


// logged in user personalization logic

$(document).ready(function () {
    var userName = "";
    var emailAddress = "";

    // Log out clicked
    $("#lnkAction2").click(function () {

        if (loc.toLowerCase().indexOf('bookedguest') > 0 || loc.toLowerCase().indexOf('myres') > 0) {

            document.location = "/BookedGuest/Guest/LogOutRedirect";
            return false; // stop event propagation (prevent page to go to href of the link)

        }
    });

    // Remove log on links from FunVille
    try {
        var loc = new String(location.href);
        if (loc.toLowerCase().indexOf('/funville') != -1 || loc.toLowerCase().indexOf('/activities') != -1) {
            $("ul.login-links").hide();
            $("#header2010 .top ul.right").hide();
        }
        else {
            if (loc.toLowerCase().indexOf('bookedguest') < 0 && loc.toLowerCase().indexOf('/myres') < 0) {
                $("#toplogin2").attr("action", sURL);
            }
        }
    }
    catch (aoXcp) {
        $("ul.login-links").hide();
        $("#header2010 .top ul.right").hide();
    }
    //else {
    if (loc.toLowerCase().indexOf('bookedguest') < 0 && loc.toLowerCase().indexOf('/myres') < 0) {
        $("#toplogin2").attr("action", sURL);
    }
    //}

    try {
        if ($.cookie("CarnivalUserCookie") != null) {
            userName = $.cookie("UserFirstName");
            emailAddress = $.cookie("UserEmailAddress");
            loggedIn = true;
        }

        if ($.cookie("MSCSAuth") != null) {
            authenticated = true;
        }

    }
    catch (aoXcp) {
    }

    if (loggedIn && authenticated) {
        $("#welcome").show();
        $("#txtAction1").html(userName);

        $("#lnkLogin").attr("href", "").addClass("not-a-link").click(function () {
            return false;
        });

        $("li#myprofile").css("display", "block");
        if (emailAddress != null && emailAddress != "") {
            $("#tbEmailAddress").attr("value", emailAddress);
        }

        $("#txtAction2").html("Logout");

        $("#lnkAction2").attr("href", "/SignInRegister.aspx?action=signout").click(function () {
            var url = location.href.toLowerCase();
            var dom = "carnival.com";
            if (url.indexOf("dev.carnival.com") != -1) {
                dom = "dev.carnival.com";
            }

            if (url.indexOf("syscarnival.com") != -1) {
                dom = "syscarnival.com";
            }

            if (url.indexOf("uatcarnival.com") != -1) {
                dom = "uatcarnival.com";
            }

            $.cookie('MSCSAuth', null, { path: '/', domain: dom, secure: false });
        });

        $(window).load(function () {
            if ($("#cruise-message").text().length > 5) {

                $("#header").addClass("loggedIn");
                $("ul.top-nav .top-link1").show();
                var txt = $("#cruise-message").text();
                var pat = /\d+\.?\d*/g;
                var num = txt.match(pat)[0];
                if (num < 10) {
                    $(".loggedIn a.top-manage-cruises").css("left", "70px");
                }

                if (num > 99) {
                    $(".loggedIn a.top-manage-cruises").css("left", "75px");
                }
            }
        });

    }

    if (loggedIn && !authenticated) {
        $("#welcome").show();
        $("#txtAction1").html(userName);
        $("li#myprofile").css("display", "block");
        $("#lnkLogin").addClass("not-a-link").click(function () {
            if (loc.toLowerCase().indexOf('bookedguest') != -1) {
                document.location.href = "/BookedGuest/Guest";
            }
            else {
                $("#loginform").fadeIn();
            }
        });

        if (emailAddress != null && emailAddress != "") {
            $("#tbEmailAddress").attr("value", emailAddress);
        }

        $("#txtAction2").html("Not " + userName);
        $("#lnkAction2").attr("href", "/SignInRegister.aspx?action=signout");
        if (loc.toLowerCase().indexOf('bookedguest') != -1) {
            $("#lnkAction2").attr("href", "/BookedGuest/Guest");
        }

        $(window).load(function () {
            if ($("#cruise-message").text().length > 5) {

                $("#header").addClass("loggedIn");
                $("ul.top-nav .top-link1").show();
                var txt = $("#cruise-message").text();
                var pat = /\d+\.?\d*/g;
                var num = txt.match(pat)[0];
                if (num < 10) {
                    $(".loggedIn a.top-manage-cruises").css("left", "70px");
                }

                if (num > 99) {
                    $(".loggedIn a.top-manage-cruises").css("left", "75px");
                }
            }
        });
    }

    if (!loggedIn && !authenticated) {
        $("#txtAction1").html("Log In");
        $("li#myprofile").css("display", "none");
        $("#lnkLogin").removeClass("not-a-link").click(function () {
            if (loc.toLowerCase().indexOf('bookedguest') != -1) {
                document.location.href = "/BookedGuest/Guest";
            }
            else {
                $("#loginform").fadeIn();
            }
        });

        $("#txtAction2").html("Register");
        $("#lnkAction2").attr("href", "/FullRegistration.aspx");
        if (loc.toLowerCase().indexOf('bookedguest') != -1) {
            $("#lnkAction2").attr("href", "/BookedGuest/Guest");
        }
    }

    var msg = getDaysTillSailMessage();
    if (msg != "") {
        $("#cruise-message").html(msg);
        $("#cruise-days").show();
    }

    // Populate saved cruise count without calling service
    UpdateFavoritesHeaderCount();


    // Favorites call out
    $("#lnkFavs").mouseover(function () {
        if (!favRend) {
            GetFavorites(favoritesDoneHeader, favoritesFailed);
        }

    });

    var $headerSearch = $("#qslink");

    $headerSearch.find("a.special-rates").bind("click", function () {
        if ($(this).hasClass("open")) {
            $(this).toggleClass("open", false);
            $(this).parents("div.quick-search").find("div.block").slideUp();
        }
        else {
            $(this).toggleClass("open", true);
            $(this).parents("div.quick-search").find("div.block").slideDown();
        }
    });

    var resetList = false;
    $headerSearch.one("mouseenter", function (event) {
        ddlMonthsHeader = $("#ddlMonthHeader-top");
        ddlPortsHeader = $("#ddlPortsHeader-top");
        ddlDestinationsHeader = $("#ddlDestinationHeader-top");
        ddlCruiseLengthsHeader = $("#ddlCruiseLengthsHeader-top");
        ddlStateResidenceHeader = $("#ddlStatesHeader-top");
        chkSeniorHeader = $("#chkSeniorHeader-top");
        chkPastGuestHeader = $("#chkPastGuestHeader-top");

        ddlPortsHeader.unbind('change');
        ddlPortsHeader.change(dropDownChangedHeader);

        ddlMonthsHeader.unbind('change');
        ddlMonthsHeader.change(dropDownChangedHeader);

        ddlDestinationsHeader.unbind('change');
        ddlDestinationsHeader.change(dropDownChangedHeader);

        ddlCruiseLengthsHeader.unbind('change');
        ddlCruiseLengthsHeader.change(dropDownChangedHeader);

        ddlStateResidenceHeader.unbind('change');
        ddlStateResidenceHeader.change(specialRatesChangedHeader);

        chkSeniorHeader.unbind('click');
        chkSeniorHeader.click(specialRatesChangedHeader);

        chkPastGuestHeader.unbind('click');
        chkPastGuestHeader.click(specialRatesChangedHeader);
    }).mouseenter(function (event) {
        if (!resetList) {
            SearchHeader(null, SuccessHeader, FailedHeader);
            resetList = true;
        }
    });



});

String.prototype.count = function (s1) {
    return (this.length - this.replace(new RegExp(s1, "g"), '').length) / s1.length;
};

function setNumberOfFavorites() {
    var liCountOfFavorites = 0;
    var loFavoriteCookie = FAVCOOKIE.current;
    if (loFavoriteCookie != "" && loFavoriteCookie != null) {
        var loSailings = loFavoriteCookie.split(FAVCOOKIE.favDelim);

        // Check for expired favorites before assignment
        $.each(loSailings, function (aiIndex, asValue) {
            var loDate = new Date(asValue.split("&")[1]);
            if (loDate >= new Date()) {
                liCountOfFavorites++;
            }
            else {
                // Remove expired favorite
                RemoveFavorite(asValue.split("&")[0]);
            }
        });


        self.NumberOfFavorites = liCountOfFavorites;
    }
    else {
        self.NumberOfFavorites = liCountOfFavorites;
    }

    return self.NumberOfFavorites;
}

function UpdateFavoritesHeaderCount() {
    var savedCruisesCount = 0;
    var FavoritesCookieName = "FAVSBSK";
    var liCountOfFavorites = 0;
    try {
        if ($.cookie(FavoritesCookieName) != null) {
            var cookieVal = $.cookie(FavoritesCookieName);
            var loSailings = cookieVal.split("|");

            // Check for expired favorites before assignment
            $.each(loSailings, function (aiIndex, asValue) {
                var loDate = new Date(asValue.split("&")[1]);
                if (loDate >= new Date()) {
                    liCountOfFavorites++;
                }
                else {
                    // Remove expired favorite
                    RemoveFavorite(asValue.split("&")[0]);
                }
            });
        }
      
        
  savedCruisesCount = liCountOfFavorites;
       
    }
    catch (aoXcp) {
    }

    if (location.href.toLowerCase().indexOf("search2") > -1) {
        $("#favorite-cruises").html(savedCruisesCount);
    }

    $("#savedCount").html(savedCruisesCount);
    if (savedCruisesCount > 0) {
        $("#mysavedcruises").show();
    }
    else {
        $("#mysavedcruises").hide();
    }
}



function clearSearch() {
    var searchText = document.getElementById("search-input1");
    searchText.value = "";
}

function trim(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function goSearch() {
    var searchText = document.getElementById("search-input1");
    var searchTerm = searchText.value; //jQuery.trim(searchText.value);
    searchTerm = trim(str);

    if (searchTerm.length > 0) {
        //alert(searchTerm + " " +"/Search/Default.aspx?q=" + searchTerm);
        location.href = "/cms/SiteSearch/index.aspx?q=" + searchTerm; //$.trim(searchTerm);
    }
}

function favoritesDoneHeader(context) {
    $("#crlistspinner").hide();
    favRend = true;
    var sailingIDs = [];
    var loSailingDates = [];
    var s = context.Itineraries;
    var disc = [];
    try {
        if (s.length > 0) {
            for (var liCounter = 0; s[liCounter].value != 'undefined'; liCounter++) {
                var temp = new Object();

                for (var j = 0, len = s[liCounter].Sailings.length; j < len; j++) {
                    var lsSailDate = s[liCounter].Sailings[j].CalendarDaysText;
                    if (lsSailDate.indexOf("<") > -1) {
                        lsSailDate = lsSailDate.split("<")[0];
                    }

                    loSailingDates.push(lsSailDate);
                    sailingIDs.push(s[liCounter].Sailings[j].SailingId);
                    var temp = new Object();
                    temp['desc'] = s[liCounter].ItnDescriptionText;
                    temp['url'] = "/BookingEngine/ProductView/" + s[liCounter].Sailings[j].DetailsHREF;

                    // Set price of interior cabin, unless that is empty and then cascade down
                    if (s[liCounter].Sailings[j].INPriceText.indexOf("empty") == -1) {
                        temp['price'] = s[liCounter].Sailings[j].INPriceText;
                    }
                    else {
                        if (s[liCounter].Sailings[j].OVPriceText.indexOf("empty") == -1) {
                            temp['price'] = s[liCounter].Sailings[j].OVPriceText;
                        }
                        else {
                            if (s[liCounter].Sailings[j].BAPriceText.indexOf("empty") == -1) {
                                temp['price'] = s[liCounter].Sailings[j].BAPriceText;
                            }
                            else {
                                if (s[liCounter].Sailings[j].STPriceText.indexOf("empty") == -1) {
                                    temp['price'] = s[liCounter].Sailings[j].STPriceText;
                                }
                            }
                        }
                    }

                    disc.push(temp);
                }
            }
        }
    }
    catch (aoXcp) {
    }

    $("#cruises-list").html("");
    for (var liCounter0 = 0, len = disc.length; liCounter0 < len; liCounter0++) {
        var liHtml;
        if (liCounter0 % 2 == 0) {
            liHtml = "<li class='colored'><a href='" + disc[liCounter0].url + "'>" + disc[liCounter0].desc + " from " + disc[liCounter0].price + "</a></li>";
        }
        else {
            liHtml = "<li><a href='" + disc[liCounter0].url + "'>" + disc[liCounter0].desc + " from " + disc[liCounter0].price + "</a></li>";
        }

        $("#cruises-list").append(liHtml);

    }

    UpdateFavoritesHeaderCount();
    UpdateFavorites(sailingIDs, loSailingDates);
}

function favoritesFailed() {
}

function closeLogin() {
    $("#loginform").fadeOut();
}

function tbxEnterKeyPressedTOP(aoEvent) {
    if ((aoEvent.which && aoEvent.which == 13) || (aoEvent.keyCode && aoEvent.keyCode == 13)) {
        if (!aoEvent) {
            aoEvent = window.event;
        }

        aoEvent.cancelBubble = true;
        if (aoEvent.stopPropagation) {
            aoEvent.stopPropagation();
        }

        var loButton = document.getElementById("imglogin");
        if (loButton) {
            if (location.protocol == "https:") {
                document.forms['toplogin'].submit();
            }
            else {
                document.forms['toplogin'].submit();
            }
        }
    }

    return false;
}

function showPhoneNumber() {
    $(".showPhoneNumberLink").hide();
    var $marginLefty = $(".showPhoneNumberNumber").css({ overflow: "hidden", display: "block", marginLeft: 110 });
    $marginLefty.animate(
    {
        marginLeft: parseInt($marginLefty.css('marginLeft'), 10) == 0 ? $marginLefty.outerWidth() : 0
    });

    var s = s_gi("carnivalprod");
    s.linkTrackVars = 'events';
    s.linkTrackEvents = 'event56';
    s.events = 'event56';
    s.tl(this, 'o', 'Call Us Click');
}

function urlToObj(url) {
    var obj = {};
    obj.params = {};

    var temp = url.split("?");
    var path = temp[0];
    var loParameters = decodeURI(temp[1]);

    obj["path"] = temp[0];

    paramsArr = loParameters.split("&");

    obj.params.length = paramsArr.length;

    var tempArr = null;
    for (var i = 0, len = paramsArr.length; i < len; i++) {
        tempArr = paramsArr[i].split("=");
        obj.params[tempArr[0]] = tempArr[1];

    }

    return obj;
}

function favoritesDone(context) {
    if ($("#remove").css("display") == "inline") {
        $("#remove").css("display", "none");
        $("#save").css("display", "inline");
        $("#lisave").css("padding", "6px 22px 4px");
        $("#lishare").css("padding", "3px 22px 4px");
        $("#liprint").css("padding", "3px 22px 4px");
        UpdateFavoritesHeaderCount();
    }
    else {
        if ($("#save").css("display") == "inline") {
            $("#remove").css("display", "inline");
            $("#save").css("display", "none");
            $("#lisave").css("padding", "6px 19px 4px");
            $("#lishare").css("padding", "3px 19px 4px");
            $("#liprint").css("padding", "3px 19px 4px");
            UpdateFavoritesHeaderCount();
        }
    }
}

function failed() {
}


// favorites logic

var favoritesSvcURL = "/BookingEngine/SailingSearch/GetFavorites";
var searchSvcRESTURL = "/BookingEngine/SailingSearch/Get";
var COOKIE_NAME = 'FAVSBSK';
var COptions = {
    path: '/',
    expires: 90
};
var FAVORITE_DELIM = "|";
var DATE_DELIM = "&";

function AddFavorite(sailingID, redraw, asSailDate) {
    if (!asSailDate) {
        return;
    }
    var strCurrentValue = null;
    var lbIsCountLessThan21 = true;
    if (document.cookie.search(COOKIE_NAME) < 0) {
        $.cookie(COOKIE_NAME, "", COptions);
    }
    try {
        strCurrentValue = $.cookie(COOKIE_NAME);
    }
    catch (e)
    { }
    if (strCurrentValue != "" && strCurrentValue != null) {
        if (strCurrentValue.indexOf(sailingID) < 0) {
            var favs = strCurrentValue.split(FAVORITE_DELIM);
            lbIsCountLessThan21 = favs.length + 1 < 21;
            if (lbIsCountLessThan21) {
                var date = new Date(asSailDate);
                if (strCurrentValue != "") {
                    strCurrentValue += (FAVORITE_DELIM + sailingID + DATE_DELIM + date.toDateString() + DATE_DELIM + new Date().toDateString());
                }
                else {
                    strCurrentValue = new String(sailingID + DATE_DELIM + date.toDateString() + DATE_DELIM + new Date().toDateString());
                }
                $.cookie(COOKIE_NAME, strCurrentValue, COptions);
            }
            else {
                $("#removeFavsLink").trigger("click");
            }
        }
    }
    else {
        var date = new Date(asSailDate);
        if (strCurrentValue != "" && strCurrentValue != null) {
            strCurrentValue += (FAVORITE_DELIM + sailingID + DATE_DELIM + date.toDateString() + DATE_DELIM + new Date().toDateString());
        }
        else {
            strCurrentValue = new String(sailingID + DATE_DELIM + date.toDateString() + DATE_DELIM + new Date().toDateString());
        }
        $.cookie(COOKIE_NAME, strCurrentValue, COptions);
    }
    if (redraw && lbIsCountLessThan21) {
        GetFavorites(favoritesDone, failed);
    }
}

function FavoriteExists(sailingId) {
    var returnVal = false;
    try {
        strCurrentValue = $.cookie(COOKIE_NAME);
    }
    catch (e)
    { }
    if (strCurrentValue != "" && strCurrentValue != null && strCurrentValue.indexOf(sailingId) >= 0) {
        returnVal = true;
    }
    return returnVal;
}

function RemoveFavorite(sailingID, redraw) {
    if (document.cookie.search(COOKIE_NAME) > -1) {
        var strCurrentValue = $.cookie(COOKIE_NAME);
        var favorites = strCurrentValue.split(FAVORITE_DELIM);
        var newStrCookieValue;
        for (var i = 0; i < favorites.length; i++) {
            if (favorites[i].search(sailingID) >= 0) favorites.splice(i, 1);
        }
        newStrCookieValue = favorites.join(FAVORITE_DELIM);
        $.cookie(COOKIE_NAME, newStrCookieValue, COptions);
        UpdateFavoritesHeaderCount();
    }
    if (redraw) GetFavorites(favoritesDone, failed)
}

function RemoveFavs(removeArr, delCookie) {
    for (var i = 0, len = removeArr.length; i < len; i++) {
        RemoveFavorite(removeArr[i], false);
    }
}

function UpdateFavorites(availableArr, aoSailingDates) {
    $.cookie(COOKIE_NAME, null);
    for (var i = 0, len = availableArr.length; i < len; i++) {
        AddFavorite(availableArr[i], false, aoSailingDates[i]);
    }
}

function GetFavorites(callback, error) {
    var url = favoritesSvcURL;
    $.ajax(
    {
        url: url,
        data: "",
        type: "GET",
        processData: true,
        contentType: "application/json",
        timeout: 30000,
        dataType: "json",
        success: callback,
        error: error
    });
}
var cache = new Array();

function CCLSailingSearchRequest() {
    this.FromDate = null;
    this.ToDate = null;
    this.DestinationCodes = null;
    this.DurationCodes = null;
    this.PortCodes = null;
    this.IsOver55 = false;
    this.IsPastGuest = false;
    this.PageNumber = 1;
    this.PageSize = 5;
    this.SortExpression = "FromPrice";
    this.StateCode = null;
    this.ShipCodes = null;
    this.NumGuests = 2;
    this.AddShipCodes = function AddShipCodes(newShip) {
        if (this.ShipCodes != null) this.ShipCodes.push(newShip);
        else this.ShipCodes = new Array(newShip);
    };
    this.RemoveShipCodes = function RemoveShipCodes(removeShip) {
        if (jQuery.inArray(removeShip, this.ShipCodes) > -1) {
            var tempArr = new Array();
            jQuery.each(this.ShipCodes, function (i, val) {
                if (val != removeShip) {
                    tempArr.push(val);
                }
            });
            this.ShipCodes = tempArr;
        }
    };
    this.AddPortCode = function AddPortCode(newPortCode) {
        var tempArr = new Array();
        $("#departures input:checkbox").each(function () {
            if ($(this).attr("checked")) {
                tempArr.push($(this).val());
            }
        });
        this.PortCodes = tempArr;
    };
    this.RemovePortCode = function RemovePortCode(removePortCode) {
        var tempArr = new Array();
        $("#departures input:checkbox").each(function () {
            if ($(this).attr("checked")) {
                tempArr.push($(this).val());
            }
        });
        this.PortCodes = tempArr;
    };
    // updated use as template
    this.AddDurationCode = function AddDurationCode(newDurationCode) {
        var tempArr = new Array();
        $("#duration input:checkbox").each(function () {
            if ($(this).attr("checked")) {
                tempArr.push($(this).val());
            }
        });
        this.DurationCodes = tempArr;
    };
    this.RemoveDurationCode = function RemoveDurationCode(removeDurationCode) {
        var tempArr = new Array();
        $("#duration input:checkbox").each(function () {
            if ($(this).attr("checked")) {
                tempArr.push($(this).val());
            }
        });
        this.DurationCodes = tempArr;
    };
    this.AddDestinationCode = function AddDestinationCode(newDestinationCode) {
        var tempArr = new Array();
        $("#destinations input:checkbox").each(function () {
            if ($(this).attr("checked")) {
                tempArr.push($(this).val());
            }
        });
        this.DestinationCodes = tempArr;
    };
    this.RemoveDestinationCode = function RemoveDestinationCode(removeDestinationCode) {
        var tempArr = new Array();
        $("#destinations input:checkbox").each(function () {
            if ($(this).attr("checked")) {
                tempArr.push($(this).val());
            }
        });
        this.DestinationCodes = tempArr;
    };
    this.ToJSON = function () {
        return JSON.stringify(this);
    };
    this.SearchAsync = function SearchAsync(callback, error, pageSize, pageNumber, sortExpression) {
        var url = searchSvcRESTURL;
        jQuery.query.SET('pageSize', (parseInt(pageSize) > 0) ? pageSize : 5);
        jQuery.query.SET('pageNumber', (parseInt(pageNumber) > 0) ? pageNumber : 1);
        var sortVal = sortExpression;
        if (sortExpression.length > 0) {
            sortVal = sortExpression;
        }
        else {
            tmp = $("#sel-sortby option:selected").val();
            sortVal = setSortExpression(tmp, "string");
        }
        jQuery.query.SET('sort', sortVal);
        var x = null;
        if (searchOptions.firstLoad) {
            x = jQuery.query.toString();
            //console.debug("first load %s  indexOf %d  %b", x, x.indexOf("?"), (x.indexOf("?")>-1));
            var discountObj = GetRateCriteriaCookie();
            if (discountObj) {
                if (x.toLowerCase().indexOf('senior') < 0 && discountObj.Senior) {
                    if (x.length > 0) x = x + "&Senior=" + discountObj.Senior;
                    else x = "Senior=" + discountObj.Senior;
                }
                if (x.toLowerCase().indexOf('pastguest') < 0 && discountObj.PastGuest) {
                    if (x.length > 0) x = x + "&PastGuest=" + discountObj.PastGuest;
                    else x = "PastGuest=" + discountObj.PastGuest;
                }
                if (x.toLowerCase().indexOf('statecode') < 0 && discountObj.StateCode) {
                    if (x.length > 0) x = x + "&StateCode=" + discountObj.StateCode;
                    else x = "StateCode=" + discountObj.StateCode;
                }
            }
            searchOptions.firstLoad = false;
        }
        else {
            x = buildNewUrl("");
        }
        if (x.indexOf("?") > -1) x = x.substring(1)
        //console.debug("query data %s", x);
        $.ajax(
        {
            url: url,
            data: x,
            type: "GET",
            processData: true,
            timeout: 30000,
            dataType: "json",
            success: callback,
            error: error
        });
    };

    this.SearchReset = function SearchReset() {
        this.DestinationCodes = null;
        this.DurationCodes = null;
        this.FromDate = null;
        this.IsOver55 = false;
        this.IsPastGuest = false;
        this.PageNumber = 1;
        this.PageSize = 5;
        this.PortCodes = null;
        this.SortExpression = "FromPrice";
        this.StateCode = null;
        this.ToDate = null;
        this.ShipCodes = null;
        RemoveRateCriteriaCookiePastGuest();
        RemoveRateCriteriaCookieSenior();
        SetRateCriteriaCookieState('st');
        location.search = "?src=ms"
    };
}
var sortVals = ["FromPrice", "FromPrice DESC", "DurationDays", "DeparturePortCode", "ItineraryCode", "FirstSailDate"]

function setSortExpression(value, type) {
    var foundLoc = (parseInt(value) > -1) ? parseInt(value) : ((jQuery.inArray(value, sortVals) > -1) ? jQuery.inArray(value, sortVals) : 0);
    $("#sel-sortby option[value='" + foundLoc + "']").attr("selected", true);
    searchOptions.sortExpression = sortVals[foundLoc];
    return (type == "number") ? foundLoc : sortVals[foundLoc];
}
var destCodes = {
    "C": ",CW,CE,CS",
    "A": "A,AG,AN,AS",
    "M": "M,MB,MR",
    "V": "V,BM,CN"
};
var urlParams = ["embkcode: %o", "dest: %s", "dur: %s", "minDays: %s", "maxDays: %s", "startDate: %s", "endDate: %s", "Senior: %s", "PastGuest: %s", "StateCode: %s", "pageNum: %s", "sort: %s", "shipCode: %s", "items: %s", "cruiseMonth: %s"]; /* urlencode/decode */
$.extend(
{
    URLEncode: function (c) {
        var o = '';
        var x = 0;
        c = c.toString();
        var r = /(^[a-zA-Z0-9_.]*)/;
        while (x < c.length) {
            var m = r.exec(c.substr(x));
            if (m != null && m.length > 1 && m[1] != '') {
                o += m[1];
                x += m[1].length;
            }
            else {
                if (c[x] == ' ') o += '+';
                else {
                    var d = c.charCodeAt(x);
                    var h = d.toString(16);
                    o += '%' + (h.length < 2 ? '0' : '') + h.toUpperCase();
                }
                x++;
            }
        }
        return o;
    },
    URLDecode: function (s) {
        var o = s;
        var binVal, t;
        var r = /(%[^%]{2})/;
        while ((m = r.exec(o)) != null && m.length > 1 && m[1] != '') {
            b = parseInt(m[1].substr(1), 16);
            t = String.fromCharCode(b);
            o = o.replace(m[1], t);
        }
        return o;
    }
});