// ---------------------------- Start TargetedOffers Manager ---------------------------------------
// This object is responsible for checking the pastguest number validity
//  (in the SailingSearch/Search2 page and findacruiseb.aspx)
Carnival.BookingEngine.SailingSearch.TargetedOffersManager = function (paramsObj) {

    var self = this;

    var lastInvalidPastGuestNumberFound = '';
    if (paramsObj.LastInvalidPastGuestNumberFound)
        lastInvalidPastGuestNumberFound = paramsObj.LastInvalidPastGuestNumberFound;

    this.tagetedOffersUrl = "/BookingEngine/TargetedOffers/Get";
    this.ClearCookieUrl = "/BookingEngine/TargetedOffers/ClearTargetedOffersCookie";
    this.dataForServer;

    this.CheckPastGuestNumberValidity = function (pgnum) {
        var isValidPastGuestNum = false;
        if (pgnum == '') return true;
        if (pgnum && pgnum != '') {
            self.dataForServer = { PastGuestNumber: jQuery.trim(pgnum), TimeStamp: new Date().getTime() };
            $.ajax(
                {
                    type: "GET",
                    url: self.tagetedOffersUrl,
                    async: false,
                    data: self.dataForServer,
                    success: function (obj) {
                        if (obj) {
                            if (obj.isValidPastGuestNum) {
                                isValidPastGuestNum = true;
                            } else {
                                isValidPastGuestNum = false;
                                updateLastInvalidPastGuestNumber(pgnum);
                            }
                        }
                    }
                });
            return isValidPastGuestNum;
        }
        return isValidPastGuestNum;

    };

    //This is a new method that validates pg number and triggers event. Eventually we should refactor out previous version of this method
    this.CheckPastGuestNumberValidity2 = function (pgnum) {

        if (!pgnum) {
            $(self).trigger('PastGuestNumberValidated', [{ PGNum: pgnum, PGNumberValid: false}]);
            return;
        }

        var lastinvalid = self.LastInvalidPastGuestNumber();
        if (pgnum == lastinvalid) {
            $(self).trigger('PastGuestNumberValidated', [{ PGNum: pgnum, PGNumberValid: false}]);
            return;
        }

        if (!IsNumeric(pgnum)) {
            $(self).trigger('PastGuestNumberValidated', [{ PGNum: pgnum, PGNumberValid: false}]);
            return;
        }

        self.dataForServer = { PastGuestNumber: jQuery.trim(pgnum), TimeStamp: new Date().getTime() };
        $.ajax(
            {
                type: "GET",
                url: self.tagetedOffersUrl,
                async: false,
                data: self.dataForServer,
                success: function (obj) {
                    var isValidPastGuestNum = false;
                    if (obj) {
                        if (obj.isValidPastGuestNum) {
                            isValidPastGuestNum = true;
                        } else {
                            isValidPastGuestNum = false;
                            updateLastInvalidPastGuestNumber(pgnum);
                        }
                    }

                    $(self).trigger('PastGuestNumberValidated', [{ PGNum: pgnum, PGNumberValid: isValidPastGuestNum}]);
                }
            });


    };

    this.ClearTargetedOffersCookie = function () {
        var success = false;
        $.ajax(
            {
                type: "GET",
                url: self.ClearCookieUrl,
                data: { TimeStamp: new Date().getTime() },
                async: false,
                success: function (obj) {
                    if (obj) {
                        success = true;
                    } else {
                        success = false;
                    }
                }
            });
        return success;
    };

    var TARGETEDOFFERS_COOKIE_NAME = 'TargetedOffersCookie'; // session only cookie set when user enteres pg# while browsing for rates
    var TIERCODE_COOKIE_NAME = 'TierCodeCookie'; // permanent cookie set during login 
    var TIERCODE_COOKIE_NAME_SESSION_ONLY = 'TierCodeCookieSessionOnly'; // used alongside the tgo cookie (both tgo and this cookie are session only and set only after user entered a past guest # while browsing rates)

    // ---------- Cookie Getters -----------------------
    this.getTierCodeFromCookie = function () {
        var tcc = $.cookie(TIERCODE_COOKIE_NAME_SESSION_ONLY); // takes precedence
        if (tcc && tcc.length > 0) {
            return tcc;
        }
        else {
            tcc = $.cookie(TIERCODE_COOKIE_NAME);
            return tcc;
        }
    };

    this.getTargetedOffersRateCodes = function () {
        if (!Carnival.Live.ShowTargetedOffers)
            return '';
        var targetedOffersRateCodes;
        var cookiestr_targetedOffers = "";
        cookiestr_targetedOffers = $.cookie(TARGETEDOFFERS_COOKIE_NAME);
        if (cookiestr_targetedOffers != null && cookiestr_targetedOffers.length > 0) {
            targetedOffersRateCodes = cookiestr_targetedOffers.split('|')[0].split('=')[1];
        }

        return targetedOffersRateCodes;
    };

    this.getEnteredPastGuestNumber = function () {
        var enteredPastGuestNumber = '';
        var cookiestr_targetedOffers = "";
        cookiestr_targetedOffers = $.cookie(TARGETEDOFFERS_COOKIE_NAME);
        if (cookiestr_targetedOffers != null && cookiestr_targetedOffers.length > 0) {
            enteredPastGuestNumber = cookiestr_targetedOffers.split('|')[1].split('=')[1];
        }

        return enteredPastGuestNumber;
    };

    this.LastInvalidPastGuestNumber = function () {
        var pgnuminval = $(lastInvalidPastGuestNumberFound);
        if (pgnuminval) {
            return pgnuminval.val();
        } else return '';
    };

    this.ChecktoPopulateTargetedOffersTab = function (profilePastGuestNumber) {
        var showResults = false;
        $(".offers-pastguest .messages").hide();
        var discountObj = GetRateCriteriaCookie();
        var valPGEnable = "";
        if (discountObj && discountObj.PGEnable)
            valPGEnable = discountObj.PGEnable;
        if (valPGEnable != "Y") {
            var targetedRateCodes = self.getTargetedOffersRateCodes();

            // If user has a past guest number cookie and the targeted rate offers cookie doesn't exist
            // then get targeted rate offers for the qualifying past guest number;
            if (typeof (targetedRateCodes) === "undefined" && profilePastGuestNumber) {
                // Make an ajax call and set the targeted rate offers cookie
                var isPastGuestNumbValid = self.CheckPastGuestNumberValidity(profilePastGuestNumber);
                if (isPastGuestNumbValid) {
                    $(self).trigger("PopulateTargetedOffersTab", [{}]);
                    showResults = true;
                } else {
                    $(".offers-pastguest .messages").show();
                }
                //CheckPastGuestValidAndGetResults(profilePastGuestNumber);
            }
            if (typeof (targetedRateCodes) !== "undefined") {
                // These are the targeted offers rate code for the past guest # entered by user (which could be different than the one in his profile)
                $(self).trigger("PopulateTargetedOffersTab", [{}]);
                showResults = true;
            }
        } else {
            $('#past-guest-number1').val('');
        }
        return showResults;
    };

    function updateLastInvalidPastGuestNumber(pgnum) {
        var pgnuminval = $(lastInvalidPastGuestNumberFound);
        if (pgnuminval) {
            pgnuminval.val(pgnum);
        }
    }

    function IsNumeric(input) { return (input - 0) == input && input.length > 0; }
}