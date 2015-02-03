// attach the global error handler
$(document).ajaxError(function (XMLHttpRequest, textStatus, errorThrown) {
    // de-serialize the json string into a json object
    var errorJsonObj;
    try { errorJsonObj = eval("(" + textStatus.responseText + ")"); } catch (e) { }

    if (errorJsonObj) {
        // alert('Message: ' + errorJsonObj.Exception + " \nStackTrace: " + errorJsonObj.StackTrace + " \nMachineName: " + errorJsonObj.MachineName);
        if (errorJsonObj.Exception == "Session Expired") {
            document.location.href = "/BookingEngine/Base/SessionExpired";
            return;
        }
    }

    var redir = true;
    try { if (errorThrown.url.toLowerCase().indexOf("bookingengine") == -1) { redir = false; } } catch (e) { }
    if(redir === true) document.location.href = "/BookingEngine/Base/Error";
});

// this will append the antiforgery token to all post ajax calls;
$(document).ajaxSend(function (e, xhr, settings) {
    if (settings.type && settings.type.toLowerCase() != 'get') {
        var tokenName = '__RequestVerificationToken';
        // get the value of the antiforgery token
        var tokenValue = encodeURIComponent($('input[name=' + tokenName + ']', 'div#' + tokenName).val());
        // append the token's name and value to the data to be sent to server
        if (settings.data) {
            try {

                if ($.isArray(settings.data)) {
                    for (var obj in settings.data) {
                        if (obj[tokenName])
                            return;
                    }
                    settings.data.push({ name: tokenName, value: tokenValue });
                }
                else if (isJSON(settings.data)) {
                    if (settings.data[tokenName])
                        return;
                    settings.data[tokenName] = tokenValue;
                }
                else {
                    if (settings.data.indexOf(tokenName) != -1)
                        return;
                    settings.data += "&" + tokenName + "=" + tokenValue;
                }
            }
            catch (e) {

            }
        }
    }
});

// --- utility function (uses jquery.json-2.2.js) ---
function isJSON(obj) {
    var string = $.toJSON(obj);
    return string.indexOf('{') > -1;
}

function getQueryVariable(variable) {
    if (!(unescape(location.href).indexOf("?") == -1)) {
        var query = location.href.split("?");
        var vars = query[1].split("&");
        var ok = false;
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0].toLowerCase() == variable.toLowerCase()) {
                ok = true; return pair[1];
            }
        }
        if (!(ok)) { return "undefined"; }
    }
    else { return "undefined"; }
}

function isNotEmpty(value) {
    if (value != null && value.replace(/^\s*|\s*$/g, '').length > 0)
        return true;
    else
        return false;
}

function urlToObj(url) {
    var obj = {};
    obj.params = {};

    var temp = url.split("?");
    var path = temp[0];
    var paramsTemp = temp[1];
    if (paramsTemp) {
        obj["path"] = temp[0];
        paramsArr = paramsTemp.split("&");
        obj.params.length = paramsArr.length;
        var tempArr = null;
        for (var i = 0, len = paramsArr.length; i < len; i++) {
            tempArr = paramsArr[i].split("=");
            obj.params[tempArr[0]] = tempArr[1];
        }
    }
    return obj;
} // end urlToObj

function objectToString(o) {
    var str = "";
    for (var i in o)
        str += i + "=" + o[i] + "&";
    return str;
} // end objectToString