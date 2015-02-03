/* dependencies: jquery, jquery_query..., easyXDM, json2 */
Carnival.LoginComponent = function (paramsObj)
{
    /*
    userNameTextBoxId,
    passwordTextBoxId,
    loginButtonId,
    logOutButtonId,
    errorLabelId,
    secureHost,
    isAjax,
    isCrossDomain,
    ajaxSuccessCallbackFunc,
    returnUrlSuccess,
    returnUrlFailure,
    isInsideIFrame
    */


    var $userName = $("#" + paramsObj.userNameTextBoxId);
    var $password = $("#" + paramsObj.passwordTextBoxId);
    var $loginBttn = $("#" + paramsObj.loginButtonId);
    var $logOutBttn = $("#" + paramsObj.logOutButtonId);
    var $errorLabelId = $("#" + paramsObj.errorLabelId);
    var $form = $("#" + paramsObj.formId);

    if (!paramsObj.secureHost && $form.length > 0)
    {
        var formUrl = $form.attr('action').toString().toLocation();
        paramsObj.secureHost = "https://" + formUrl.hostname;
    }

    var loginUrl = paramsObj.secureHost + "/bookedguest/guestmanagement/mycarnival/logon";

    if ($userName.length == 0 || $password.length == 0 || $loginBttn.length == 0)
    {
        alert('Error initializing login component');
        return;
    }

    var querystringErrors = $.query.get('errors');
    if (querystringErrors && querystringErrors.length > 0 && $errorLabelId.length > 0)
        $errorLabelId.text(querystringErrors);
    
    var querystringIsPostback = $.query.get('isPostback');
    if (querystringIsPostback && querystringIsPostback.length > 0) {
        if (paramsObj.isInsideIFrame) {
            try {
                parent.document.location = parent.document.location;
            } catch (e)
            {
                alert('Unable to access parent document.');
            }
        }
    }

    // check if it's a cross domain call we need to set up easyXDM socket
    var loginUrlLocation = loginUrl.toLocation();
    // we're in cross domain mode if the 'host' or 'protocol' properties of the current url and loginUrl don't match
    var isCrossDomain = document.location.protocol != loginUrlLocation.protocol || document.location.host != loginUrlLocation.host;
    var xhr;

    //    if (isCrossDomain) {
    //        xhr = new easyXDM.Rpc({
    //            remote: paramsObj.secureHost + "/bookedguest/scripts2/easyXDM/cors/index.html"
    //        }, {
    //            remote: {
    //                request: {} // request is exposed by /cors/
    //            }
    //        });

    //    }

    if (paramsObj.formId && paramsObj.useJQueryValidation) {

        // jquery validation (the userNameTextBoxId and passwordTextBoxId must also be the names of the fields, not just ids)
        $userName.attr('name', paramsObj.userNameTextBoxId);
        $password.attr('name', paramsObj.passwordTextBoxId);

        var validationParams = {};
        validationParams.rules = {};
        validationParams.rules[paramsObj.userNameTextBoxId] = { required: true };
        validationParams.rules[paramsObj.passwordTextBoxId] = { required: true };
        validationParams.messages = {};
        validationParams.messages[paramsObj.userNameTextBoxId] = {
           
            required: function (element, validator) { return "Email address is required"; }
        };
        validationParams.messages[paramsObj.passwordTextBoxId] = {
            required: function (element, validator) { return "Password is required"; }
        };
        validationParams.errorPlacement = function (error, element) {
            //alert(element + ": " + error);
        };

        $form.validate(validationParams);
    }

    // register submit button callback
    $loginBttn.click(submitLoginForm);

    function submitLoginForm()
    {

        var error1 = "";
        var error2 = "";

        jQuery.validator.messages.required = false;

        // *********** validate fields
        if (!paramsObj.useJQueryValidation) {

            if ($userName.val().length == 0 || $userName.val() == "Email / Username")
                error1 += "Please enter a user name. ";
            if ($password.val().length == 0)
                error2 += "Please enter a password.";

            if (error1.length > 0 || error2.length > 0) {
                if (paramsObj.errorLabelId)
                    $errorLabelId.html(error1 + error2);
                else {
                    // jquery validation is off and
                    // no errors label was provided
                    if (error1.length > 0)
                        $userName.addClass('error');

                    if (error2.length > 0)
                        $password.addClass('error');
                }


                return false;
            }
        } else
        {
            if (!$form.valid())
                return false;
        }


        // *********** populate the object with the values to be sent to the server
        // the property names on this object must match the property names in the login model object used by the login action method
        var formParams = {
            UserNameOrLoyaltyNum: $userName.val(),
            Password: $password.val(),
            IsUsingLoyaltyNum: false, // To do: pending requirement on how the UI will handle this
            IsAjax: paramsObj.isAjax ? paramsObj.isAjax : false,
            ReturnUrlSuccess: paramsObj.returnUrlSuccess ? paramsObj.returnUrlSuccess : "",
            ReturnUrlFailure: paramsObj.returnUrlFailure ? paramsObj.returnUrlFailure : "",
            IsCrossDomain: isCrossDomain
        };

        // default success return url (if there's a ReturnUrl in the query string and none was passed to this constructor, use it
        if (!paramsObj.ReturnUrlSuccess || paramsObj.ReturnUrlSuccess.length == 0)
        {
            formParams.ReturnUrlSuccess = $.query.get("ReturnUrl");
        }

        if (!paramsObj.ReturnUrlSuccess || paramsObj.ReturnUrlSuccess.length == 0)
        {
            var currentUrl = document.location.href;
            //try{ currentUrl = document.location.href.split(".com")[1];} catch (xcp) {}

            formParams.ReturnUrlSuccess = currentUrl;
        }

        // default failure return url (if none was passed, and this is not an ajax call then return back to this url)
        if (!paramsObj.isAjax && (!paramsObj.ReturnUrlFailure || paramsObj.ReturnUrlFailure.length == 0) && !paramsObj.isInsideIFrame)
        {
            formParams.ReturnUrlFailure = "/bookedguest/guestmanagement/mycarnival/logon";
        }

        // ************* submit form (either regular page post or ajax)
        if (!formParams.IsAjax)
        {
            // create a form with proper fields
            var form = buildLoginForm(formParams);

            // append form to document
            document.body.appendChild(form);

            // submit the form (the whole page will refresh)
            form.submit();

        } else
        {
            if (!isCrossDomain)
            {
                // submit values via ajax
                $.ajax({
                    url: loginUrl,
                    type: "POST",
                    data: formParams,
                    success: ajaxCallback
                });
            } else
            {
                //                xhr.request({
                //                    url: loginUrl,
                //                    method: "POST",
                //                    data: formParams
                //                }, function (response) {
                //                    ajaxCallback(jQuery.parseJSON(response.data));
                //                });   
                alert('Cross Domain requests not supported. Set isAjax flag to false and do a regular post.');
            }
        }

        return false;
    }

    function buildLoginForm(formParams)
    {
        var loginForm = document.createElement("form");
        loginForm.action = loginUrl;
        loginForm.method = "POST";
        //loginForm.target = iframeTarget;
        loginForm.style.display = "none";

        for (var i in formParams)
        {
            var hidden = document.createElement('input');
            hidden.setAttribute('type', 'hidden');
            hidden.setAttribute('name', i);
            hidden.setAttribute('value', formParams[i]);
            try
            {
                loginForm.appendChild(hidden);
            } catch (err)
            {
            }
        }

        return loginForm;
    }

    ;


    function ajaxCallback(dataFromServer)
    {

        // if the consumer passed a custom ajax success handler then invoke it and pass the server data object to it
        if (paramsObj.ajaxSuccessCallbackFunc)
        {
            paramsObj.ajaxSuccessCallbackFunc(dataFromServer);
        }

        if (!dataFromServer.success)
        {
            if (paramsObj.errorLabelId)
                $errorLabelId.html("Errors: " + dataFromServer.errors.toString().replace(";", "\n"));
            else
                alert(dataFromServer.errors);

            if (paramsObj.returnUrlFailure)
                document.location.href = paramsObj.returnUrlFailure;
            return;
        }


        // if server passed a url to redirect to then redirect page
        if (dataFromServer.returnUrl)
        {
            if (paramsObj.isInsideIFrame)
            {
                try
                {
                    parent.document.location.href = dataFromServer.ReturnUrl;
                } catch (e)
                {
                    alert('Unable to access parent document.');
                }
            } else
            {
                document.location.href = dataFromServer.ReturnUrl;
            }

        }
    }

};

// utility to parse url from string
String.prototype.toLocation = function () {
    var a = document.createElement('a');
    a.href = this;
    return a;
};

