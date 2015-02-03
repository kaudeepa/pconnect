////////////////////////
$.namespace('Carnival.Header');

Carnival.Header.Personalizer = function () {
    var self = this;
    var loc = document.location.hostname + document.location.pathname;
    var userName = "", emailAddress = "";
    var loggedIn = false, authenticated = false;
    var $vifpTabHading = $('strong', '#vifp');
    var $vifpTabSubHeading = $('small', '#vifp');

    if ($.cookie("CarnivalUserCookie") != null) {
        userName = $.cookie("UserFirstName");
        emailAddress = $.cookie("UserEmailAddress");
        loggedIn = true;
    }

    if ($.cookie("MSCSAuth") != null) {
        authenticated = true;
    }

    // +++++++++++++
    this.PersonalizeTopLoginLinks = function () {
        // === begin set the Days To Cruise Message ---
        var daysToSailingEl = $("li#countdowncontainer a");
        var daysTilCruiseMessage = getDaysToSailMessage();
        if (daysTilCruiseMessage) {
            daysToSailingEl.html(daysTilCruiseMessage);
            daysToSailingEl.show();
        }
        else {
            daysToSailingEl.hide();
            $("li#countdowncontainer").addClass('last-child');
        }
        // --- end set the days To Cruise Message ---


        // === begin login/logout/register links personalization ---

        var $loginLink = $("#ccl_header_expand-login-link");
        var $registerLink = $("#lnkAction2");

        // Log out clicked
        $("#lnkAction2").click(function () {
            if (loc.toLowerCase().indexOf('bookedguest') > 0 || loc.toLowerCase().indexOf('myres') > 0) {
                document.location = "/bookedguest/guestmanagement/mycarnival/logout";
            }

        });

        if (loc.toLowerCase().indexOf('/funville') != -1 /* || loc.toLowerCase().indexOf('/activities') != -1*/) {
            $("div.account-bar ul.login").hide();
        }


        if (loggedIn && authenticated) {

            //VifpNumberOfDays

            $vifpTabHading.text('My VIFP');
            $vifpTabSubHeading.text('');

            if ($.cookie("VifpNumberOfDays") != null) {
                $vifpTabSubHeading.text($.cookie("VifpNumberOfDays") + ' days sailed');
            }


            $("#welcome").show();
            $loginLink.html(userName);
            $loginLink.attr("href", "#").addClass("not-a-link").click(function () {
                return false;
            });

            if (emailAddress) {
                $("#ccl_header_login-email").attr("value", emailAddress);
            }

            $registerLink.html("Logout");
            $registerLink.attr("href", "/bookedguest/guestmanagement/mycarnival/logout");
        }
        if (loggedIn && !authenticated) {

            $vifpTabHading.text(' JOIN');
            $vifpTabSubHeading.text('the VIFP Club');

            $("#welcome").show();
            $loginLink.html(userName);

            $loginLink.addClass("not-a-link").click(function () {
                if (loc.toLowerCase().indexOf('bookedguest') != -1) {
                    document.location.href = "/BookedGuest/guestmanagement/mycarnival/logon";
                }
                return false;
            });

            if (emailAddress) {
                $("#ccl_header_login-email").attr("value", emailAddress);
            }

            $registerLink.html("Not " + userName);
            $registerLink.attr("href", "/bookedguest/guestmanagement/mycarnival/logon?takeAction=signout");
        }
        if (!loggedIn && !authenticated) {

            $vifpTabHading.text(' JOIN');
            $vifpTabSubHeading.text('the VIFP Club');

            $loginLink.html("Login");
            $loginLink.removeClass("not-a-link").click(function () {
                if (loc.toLowerCase().indexOf('bookedguest') != -1) {
                    document.location.href = "/BookedGuest/guestmanagement/mycarnival/logon";
                }
            });

            $registerLink.html("Register");
            $registerLink.attr("href", "/bookedguest/guestmanagement/registration/enroll");

            if (loc.toLowerCase().indexOf('bookedguest') != -1) {
                $registerLink.attr("href", "/BookedGuest/guestmanagement/mycarnival/logon");
            }
        }

        // --- end login/logout/register links personalization ---


        // === begin Initialize the Login Popup handlers ---
        var loginComp = new Carnival.LoginComponent({
            userNameTextBoxId: "ccl_header_login-email",
            passwordTextBoxId: "ccl_header_login-pw",
            loginButtonId: "loginBttn",
            logOutButtonId: null,
            errorLabelId: null,
            isAjax: false,
            returnUrlSuccess: "",
            returnUrlFailure: "/bookedguest/guestmanagement/mycarnival/logon",
            isInsideIFrame: false,
            //ajaxSuccessCallbackFunc: function () { alert('test success') },
            formId: "headerLoginForm",
            useJQueryValidation: true
        });
        // ---

        // === initialize the other login section within the new header
        var loginComp2 = new Carnival.LoginComponent({
            userNameTextBoxId: "ccl_header_manage-login",
            passwordTextBoxId: "ccl_header_manage-pass",
            loginButtonId: "manage_login_bttn",
            logOutButtonId: null,
            errorLabelId: null,
            isAjax: false,
            returnUrlSuccess: "",
            returnUrlFailure: "/bookedguest/guestmanagement/mycarnival/logon",
            isInsideIFrame: false,
            //ajaxSuccessCallbackFunc: function () { alert('test success') },
            formId: "headerLoginForm2",
            useJQueryValidation: true
        });
    }
    // ------ end PersonalizeTopLoginLinks function ----------

    this.PersonalizeTabs = function (element, li) {

        var elementid = element.attr('id');
        var sectionToShow = element.data('sectionToShow');
        // if the ajax calls have already been executed, then do not repeat them
        if (sectionToShow) {

            // set active treatment for tab
            if (elementid == 'manage' || elementid == 'vifp') {
                li.addClass("active");
            }

            $(self).trigger('SectionReady', sectionToShow);
            return;
        }

        // we're going to handle hover overs for two elements in the header here:
        // the manage my cruises and the vfip tabs
        switch (elementid) {
            case "manage":

                li.addClass("active");
                // hide all sections, show loading gif and make the ajax call(s)
                $("div.manage").hide();

                if (!authenticated) {
                    // show the anonymous section of the Manage My Cruises Tab
                    var section = $(".logged-out");
                    $(self).trigger('SectionReady', section);

                    return;

                } else {

                    $("div.manageLoadingGif").show();

                    $.ajax({
                        cache: false,
                        url: "/bookedguest/guestmanagement/mycruises/getcurrentsailings",
                        success: function (data) {

                            var section, ul, html, desc;

                            if (data.CurrentSailings && data.CurrentSailings.length > 0) {
                                section = $("div.logged-in-cruises");
                                ul = $("ul.arrow-list", section);
                                var cruiseUrl = "/BookedGuest/Booking/Detail/";
                                html = '';
                                for (var i in data.CurrentSailings) {
                                    var date = new Date(parseInt(data.CurrentSailings[i].SailDate.replace("/Date(", "").replace(")/", ""), 10));
                                    var formattedDate = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
                                    desc = data.CurrentSailings[i].BookingNumber + " " + formattedDate + " to " + data.CurrentSailings[i].Destination;
                                    html += "<li><a href='" + cruiseUrl + data.CurrentSailings[i].BookingNumber + "'>" + desc + "</a></li>";
                                }

                                if (ul && html)
                                    ul.html(html);
                                //section.show();

                                $(self).trigger('SectionReady', section);
                                element.data('sectionToShow', section);
                            }
                            else {
                                // make another ajax call this time to get the saved sailings
                                $.ajax({
                                    cache: false,
                                    url: "/bookingengine/sailingsearch/getfavorites/?pageNumber=1&pageSize=2",
                                    success: function (data2) {

                                        if (data2.Itineraries && data2.Itineraries.length > 0) {
                                            section = $("div.logged-in-saved-cruises"); // this is the section to show
                                            ul = $("ul.arrow-list", section); // the list to populate
                                            var savedUrl = "/bookingengine/sailingsearch/search2?showSavedTab=Y";
                                            // populate the saved cruises
                                            html = '';
                                            for (i in data2.Itineraries) {
                                                desc = data2[i].ItnDescriptionText;
                                                html += "<li><a href='" + savedUrl + "'>" + desc + "</a></li>";
                                            }

                                        }
                                        else {
                                            // show the general section (if no current cruises and no saved cruises)
                                            section = $("div.logged-in-general");
                                        }

                                        if (ul && html)
                                            ul.html(html);
                                        //section.show();

                                        $(self).trigger('SectionReady', section);
                                        element.data('sectionToShow', section);
                                    }
                                });
                            }

                        }
                    });
                }


                break;
            case "vifp":


                if (!authenticated) {
                    document.location = "/loyalty/overview.aspx";
                    break;
                }

                li.addClass("active");

                $("div.vifpLoadingGif").show();

                // make the ajax call to get the profile data
                $.ajax({
                    cache: false,
                    url: "/bookedguest/guestmanagement/mycarnival/getdataforvifpheadertab",
                    success: function (data) {
                        if (!data)
                            return;

                        // populate content
                        var section = $("div.vifp");

                        $("#vifpPoints", section).text(data.Points);
                        $("#sailingSince", section).text(data.SailingSince);
                        $("#tierTitle", section).text(data.TierTitle);
                        $("img.badge", section).attr("src", data.TierImgUrl);

                        if (data.NextTierTitle && data.NumberOfPointsTilNextTier > 0) {
                            $("#nextTierH", section).show();
                            $("#nextTierP", section).show();
                            $("#nextTierName", section).text(data.NextTierTitle);
                            $("#pointsTilNextTier", section).text(data.NumberOfPointsTilNextTier);
                        }
                        else {
                            $("#nextTierH", section).hide();
                            $("#nextTierP", section).hide();
                        }

                        var el = $("div.stat-box.membership");
                        el.removeClass();
                        el.addClass('stat-box membership ' + (data.TierTitle ? data.TierTitle.toLowerCase() : ''));

                        $(self).trigger('SectionReady', section);

                        element.data('sectionToShow', section);
                    }
                });

                break;
        }
    }


    // --- private methods ---
    function getDaysToSailMessage() {

        var msgHtml = "";

        var mins = 1000 * 60;
        var hrs = mins * 60;
        var days = hrs * 24;

        try {
            var sailDateCookieVal = $.cookie("SailDate");
        } catch (aoXcp) {
        }
        if (sailDateCookieVal) {
            var d = new Date();
            if (Date.parse(d) > Date.parse(sailDateCookieVal)) {
                return "";
            }

            var sailDate = Date.parse(sailDateCookieVal);

            if (isNaN(sailDate)) {
                sailDateCookieVal = ParseDateFromMMddyyyyCultureInvariant2(sailDateCookieVal);
                sailDate = Date.parse(sailDateCookieVal);
            }

            var today = Date.parse(Date());

            days = parseInt(((sailDate - today) / days));

            if (isNaN(days)) {
                return "";
            }

            days = days + 1;

            var daysLbl = " Days";
            if (days == 1) {
                daysLbl = " Day";
            }

            msgHtml = '<span>' + days + daysLbl + '</span> To Sailing';
        }

        return msgHtml;
    }
}

// initialize the personalizer into a global variable
var cclHeaderPersonalizer = new Carnival.Header.Personalizer();
cclHeaderPersonalizer.PersonalizeTopLoginLinks();

$(document).ready(function () {
    $('#ccl_header_login-email, #ccl_header_login-pw').bind('keypress', function (e) {
        if (e.keyCode == 13) {
            if ($("#ccl_header_login-email").val().length > 0 && $("#ccl_header_login-pw").val().length > 0) {
                $('#loginBttn').click();
            }
        }
    });
    
    $('#ccl_header_manage-login, #ccl_header_manage-pass').bind('keypress', function (e) {
        if (e.keyCode == 13) {
            if ($("#ccl_header_manage-login").val().length > 0 && $("#ccl_header_manage-pass").val().length > 0) {
                $('#manage_login_bttn').click();
            }
        }
    });
});

function ParseDateFromMMddyyyyCultureInvariant2(dateToParse) {
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
            
