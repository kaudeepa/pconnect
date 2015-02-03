/**
 * The code herein is exposed to both carnival.com and the booking engine.  The
 * intent is this is the repository for global functions and values throughout.
 * @module Carnival.Globals
 * @requires jQuery
 * @namespace Carnival
 */

/**
 * A utility function that creates namespaces.
 * @method InitializeCarnivalGlobal
 */
jQuery.namespace = function ()
{
    var o = null;
    var i, j, d;
    for (i = 0; i < arguments.length; i = i + 1)
    {
        d = arguments[i].split(".");
        o = window;
        for (j = 0; j < d.length; j = j + 1)
        {
            o[d[j]] = o[d[j]] || {};
            o = o[d[j]];
        }
    }
    return o;
};

// ------------- Create Carnival's namespaces ----------
$.namespace('Carnival.BookingEngine.Stateroom');
$.namespace('Carnival.BookingEngine.SailingSearch');
$.namespace('Carnival.Web.Specials');
$.namespace('Carnival.Globals');
$.namespace('Carnival.SiteCore.LandingPage');
$.namespace('Carnival.SiteCore.FindACruise');
$.namespace('Carnival.AppResources');
// -----------------------------------------------------

/**
 * Returns the past guest number if it exists.
 * @method Carnival.Globals.UserIsLoggedIn
 * @return string
 */
Carnival.Globals.GetProfilePastGuestNumber = function GetProfilePastGuestNumber()
{
    var lsPageGuestNumber;
    if (Carnival.Globals.UserIsLoggedIn())
    {
        var lsCookieString = "";

        // Note that 'PastGuestNumber' and 'TARGETEDOFFERS_COOKIE_NAME' both have a past guest # in them, but they are not the same;
        lsCookieString = $.cookie('PastGuestNumber');
        if (lsCookieString != null && lsCookieString.length > 0)
        {
            lsPageGuestNumber = lsCookieString.split('&')[0];
        }
    }
    return lsPageGuestNumber;
};

/**
 * Returns true only if user is fully logged in.
 * @method Carnival.Globals.UserIsFullyLoggedIn
 * @return bool
 */
Carnival.Globals.UserIsLoggedIn = function UserIsLoggedIn()
{
    return !(!$.cookie("MSCSAuth") && $.cookie("AnonymousUser"));
};

/**
 * This function allows JavaScript to load external scripts.
 * @method Carnival.Globals.AppendScript
 * @return null
 */
Carnival.Globals.UserIsFullyLoggedIn = function UserIsFullyLoggedIn()
{
    return $.cookie("MSCSAuth");
};

/**
* This function allows JavaScript to load external scripts.
* @method Carnival.Globals.AppendScript
* @return null
*/
Carnival.Globals.AppendScript = function _AppendScript(asSrc)
{
    try
    {
        var loScript = document.createElement('script');
        loScript.type = "text/javascript";
        loScript.src = asSrc;
        document.getElementsByTagName('head')[0].appendChild(loScript);
    }
    catch (aoXcp)
    {}
};

Carnival.Globals.AppendScript("/common/cclus/js/header/Carnival.Live.js");

// utility to parse url from string
String.prototype.toLocation = function () {
    var a = document.createElement('a');
    a.href = this;
    return a;
};