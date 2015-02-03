// JavaScript Document
searchMiniResultsURL = "/CMS/Search2/Default.aspx";

var targetedOffersMgr;

$(document).ready(function () {
    targetedOffersMgr = new Carnival.BookingEngine.SailingSearch.TargetedOffersManager({ LastInvalidPastGuestNumberFound: '#LastInvalidPGNumberFound' });
    $('.sprite-icon-help13x13').cclqtip('<img style="margin-right: 5px" src="/cms/pageelements/2010/new-header/img/icon-help13x13.gif" alt="" /><span style="font-weight: bold;color:#0f65b8" >Number of Travelers Notice:</span>', '<span style="color:#898989" >The number of travelers is per stateroom. Only one stateroom can be booked at a time.</span>', 'topRight', 'bottomLeft', null, null);
    /* dropdown code */

    // assign ID of dropdown lists
    dateRange = true;

    ddlStartDate = $("#ddl-from");    // select for months
    ddlEndDate = $("#ddl-to");
    ddlPorts = $("#ddl-port");     // select for ports
    ddlShips = $("#ddl-ship");     // select for ship
    ddlDestinations = $("#ddl-destination");       // select for destinations	
    ddlCruiseLengths = $("#ddl-duration");    // select for cruise lengths
    ddlNumGuests = $("#ddl-numGuests");     // select for num guests

    chkSenior = $("#chk-over");                  // checkbox for senior
    chkMilitary = $('#chk-military');                  // checkbox for senior
    chkPastGuest = $("#chk-past");            // checkbox for past guest
    ddlStateResidence = $("#ddl-state");

    chkPastGuestEnable = $("#past-guest-optional");

    setSpecialItemDefaultsFromRateCriteriaCookie();

    if ($("#chk-past").is(':checked')) {
        $("#past-guest-lookup").show();
    }
    else {
        $("#past-guest-lookup").hide();
    }

    chkSenior.click(specialRatesChanged);
    chkMilitary.click(specialRatesChanged);
    chkPastGuest.click(function (e) {
        specialRatesChanged();
        var opt = $(this);
        if (opt.is(':checked')) {
            $("#past-guest-lookup").show();
        }
        else {
            $("#past-guest-lookup").hide();
        }
        //$("#past-guest-lookup").toggle();
    });

    

    $("#find-cruise #past-guest-number").keypress(function (e) {
        if (e == null) { // ie
            keycode = event.keyCode;
        } else { // mozilla
            keycode = e.which;
        }
        if (e.keyCode == 13) {
            $('#find-cruise #past-guest-submit').trigger('click');
            e.preventDefault();
            e.stopPropagation();

            return false;
        }
    });

    $('#find-cruise #past-guest-submit').click(function (event) {
        var llPastGuestNumber = $('#find-cruise #past-guest-number').val();
        if (!checkPgNumberValidity(true)) {
            return false;
        }
        // var isPastGuestNumValid = pastGuestNumValid(llPastGuestNumber);
        $("#find-cruise #past-guest-lookup .pastGuestNumInvalid").hide();
        //calls the service that checks the validity for past guest number and sets the HTTPCookie for targeted offers
        var isPastGuestNumValid = targetedOffersMgr.CheckPastGuestNumberValidity(llPastGuestNumber);
        if (!isPastGuestNumValid)
            $("#find-cruise #past-guest-lookup .pastGuestNumInvalid").show();
        if (isPastGuestNumValid) {
            $("#find-cruise #past-guest-lookup").hide();
        }
        event.preventDefault();
        event.stopPropagation();

        return false;
    });

    $("#find-cruise #past-guest-lookup input#past-guest-optional,#find-cruise #past-guest-lookup  label[for='past-guest-optional']").click(function () {
        var opt = $("#find-cruise #past-guest-optional");
        var txtbox = $("#find-cruise #past-guest-number");
        var btnsubmit = $("#find-cruise #past-guest-submit");
        txtbox.val('');
        //toggles past-guest-number txtbox and submit btn
        if (opt.is(':checked')) {
            txtbox.attr("disabled", true);
            toggleClass(txtbox, 'pgnum-na', 'pgnum-enable');

            btnsubmit.attr("disabled", true);
            toggleClass(btnsubmit, 'past-guest-submit-na', 'past-guest-submit');

            $("#find-cruise #past-guest-lookup .pastGuestNumInvalid").hide();
            $("#find-cruise #past-guest-lookup .past-guest-forgot").hide();
            //var success = ClearTargetedOffersCookie();
            // Clears the targeted offers cookie (HTTPCookie)
            var success = targetedOffersMgr.ClearTargetedOffersCookie();
        }
        else {
            toggleClass(txtbox, 'pgnum-enable', 'pgnum-na');

            txtbox.attr("disabled", false);
            toggleClass(btnsubmit, 'past-guest-submit', 'past-guest-submit-na');

            btnsubmit.attr("disabled", false);
            $("#find-cruise #past-guest-lookup .past-guest-forgot").show();
        }
    });

    ResetLists();
    //console.debug("month %o ports %o destination %o length %o", ddlMonths, ddlPorts, ddlDestinations, ddlCruiseLengths);		
    Search(null, fixDropdowns, Failed);

});

function toggleClass(obj, addClass, removeClass) {
    if (obj.hasClass(removeClass)) {
        obj.removeClass(removeClass);
    }
    if (!obj.hasClass(addClass)) {
        obj.addClass(addClass);
    }
}


function GetPastGuestNumberFromCookie()
{
    var profilePastGuestCookieName = 'PastGuestNumber';
    var profilePastGuestNumber = "";
    var pastGuestNumber;
    try {
        var enteredPastGuestNumber = targetedOffersMgr.getEnteredPastGuestNumber();
        profilePastGuestNumber = Carnival.Globals.GetProfilePastGuestNumber();
        if (enteredPastGuestNumber)
            pastGuestNumber = enteredPastGuestNumber;
        else
            pastGuestNumber = profilePastGuestNumber;
    }
    catch (aoXcp)
    {
    }

    if (pastGuestNumber)
        return pastGuestNumber;
    else
        return '';
}

function setSpecialItemDefaultsFromRateCriteriaCookie()
{
    var discountObj = GetRateCriteriaCookie();
    var loPastGuestTextBox = $("#past-guest-number");
    var btnsubmit = $("#find-cruise #past-guest-submit");
    try
    {
        if (discountObj.Senior == "Y")
        {
            chkSenior.attr("checked", "checked");
        }
if (discountObj.Military == "Y") {
            chkMilitary.attr("checked", "checked");
        }
        if (discountObj.PastGuest == "Y")
        {
            chkPastGuest.attr("checked", "checked");
        }
        if (discountObj.StateCode)
        {
            ddlStateResidence.val(discountObj.StateCode);
        }
        if (discountObj.PGEnable == "Y")
        {
            //checks the past guest optional checkbox,toggles past-guest-number txtbox and submit btn
            chkPastGuestEnable.attr("checked", "checked");
            loPastGuestTextBox.attr("disabled", true);
            toggleClass(loPastGuestTextBox, 'pgnum-na', 'pgnum-enable');

            btnsubmit.attr("disabled", true);
            toggleClass(btnsubmit, 'past-guest-submit-na', 'past-guest-submit');

            $("#find-cruise #past-guest-lookup .past-guest-forgot").hide();
            loPastGuestTextBox.val('');
        }
        else {
            toggleClass(loPastGuestTextBox, 'pgnum-enable', 'pgnum-na');
            loPastGuestTextBox.attr("disabled", false);
            loPastGuestTextBox.attr("value", GetPastGuestNumberFromCookie());

            toggleClass(btnsubmit, 'past-guest-submit', 'past-guest-submit-na');
            btnsubmit.attr("disabled", false);

            var pastguestnumber = targetedOffersMgr.getEnteredPastGuestNumber();
            if (pastguestnumber) {
                $('#past-guest-number').val(pastguestnumber);
            }
        }

        
    }
    catch(e)
    {
    }
}

function fixDropdowns(response)
{

    //ddlMonthsTo.html(ddlMonths.html()) ;

    //console.log("fixDropdowns call back");
    Success(response);
    //console.log("success finished");

}


function checkPgNumberValidity(isSubmitBttn) {
    var _val = $('#find-cruise #past-guest-number').val();
    var isValid;
    if (isSubmitBttn) {
        if (_val == '') {
            isValid = false;
        }
        else
            isValid = IsNumeric(_val);
    }
    else {
        if ($("#past-guest-optional").is(':checked')) {
            return true;
        }
        if (_val == '') {
            isValid = true;
        }
        else
            isValid = IsNumeric(_val);
    }
    if (!isValid) {
        $('#find-cruise #past-guest-number').val('');
        $("#past-guest-lookup .pastGuestNumInvalid").show();
    }
    else {
          var invalpg = targetedOffersMgr.LastInvalidPastGuestNumber();
          if (_val != invalpg && invalpg != '') {
              $("#past-guest-lookup .pastGuestNumInvalid").hide();
          }
      }
      return isValid;
}
function IsNumeric(input) { return (input - 0) == input && input.length > 0; }


/* =jQuery Plugins*/
(function($)
{
    /* = plug-in : overlabel */
    $.fn.overlabel = function(options)
    {
        var opts = $.extend({}, $.fn.overlabel.defaults, options);
        var selection = this.filter('label[for]').map(function()
        {
            var label = $(this);
            var id = label.attr('for');
            var field = $('#' + id);
            if (!field)
            {
                return;
            }
            var o = $.meta ? $.extend({}, opts, label.data()) : opts;
            label.addClass(o.label_class);
            var hide_label = function()
            {
                label.css(o.hide_css)
            };
            var show_label = function()
            {
                this.value || label.css(o.show_css)
            };
            $(field).parent().addClass(o.wrapper_class).end().focus(hide_label).blur(show_label).each(hide_label).each(show_label);
            return this;
        });
        return opts.filter ? selection : selection.end();
    };
    $.fn.overlabel.defaults = {
        label_class: 'overlabel-apply',
        wrapper_class: 'overlabel-wrapper',
        hide_css: { 'display': 'none' },
        show_css: { 'display': 'block' },
        filter: false
    };
    /* =plug-in : fix-png */
    $.fn.fixpng = function()
    {
        var hack = {
            isOldIE: $.browser.msie && $.browser.version < 7,

            filter: function(src)
            {
                return "progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src='" + src + "');";
            }
        };
        return this.each(function()
        {
            if (hack.isOldIE)
            {
                var $$ = $(this);
                if ($$.attr('src'))
                {
                    var span = document.createElement('span');
                    $(span).attr({
                                id: $$.attr('id'), className: $$.attr('class')
                            });
                    $(span).css({
                                display: 'inline-block', width: $$.width(), height: $$.height(), filter: hack.filter($$.attr('src')), float: $$.attr('align') == 'left' ? 'left' : ($$.attr('align') == 'right' ? 'right' : 'none')
                            });
                    this.outerHTML = span.outerHTML;
                }
            }
        });
    };
})(jQuery);

