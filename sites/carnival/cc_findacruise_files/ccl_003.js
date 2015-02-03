/**
* jQuery DoubleTap
* Custom touch-screen events
* for iPads, iPhones, and iPod touches
* https://github.com/technoweenie/jquery.doubletap
*
* Copyright (c) 2010-* rick olson
*/
(function (c) { var d = { swipeTolerance: 40 }; var a = function (e, f) { this.target = c(e); this.touch = f; this.startX = this.currentX = f.screenX; this.startY = this.currentY = f.screenY; this.eventType = null }; a.options = {}; a.latestTap = null; a.prototype.move = function (e) { this.currentX = e.screenX; this.currentY = e.screenY }; a.prototype.process = function () { var e = this.currentX - this.startX; var f = this.currentY - this.startY; if (e == 0 && f == 0) { this.checkForDoubleTap() } else { if (Math.abs(f) > a.options.swipeTolerance && Math.abs(f) > Math.abs(e)) { this.eventType = f > 0 ? "swipedown" : "swipeup"; this.target.trigger("swipe", [this]) } else { if (Math.abs(e) > a.options.swipeTolerance) { this.eventType = e > 0 ? "swiperight" : "swipeleft"; this.target.trigger("swipe", [this]) } } } if (this.eventType) { this.target.trigger(this.eventType, [this]) } this.target.trigger("touch", [this]) }; a.prototype.checkForDoubleTap = function () { if (a.latestTap) { if ((new Date() - a.latestTap) < 400) { this.eventType = "doubletap" } } if (!this.eventType) { this.eventType = "tap" } a.latestTap = new Date() }; var b = function (f, e) { a.options = c.extend(d, e); f.bind("touchstart", this.touchStart); f.bind("touchmove", this.touchMove); f.bind("touchcancel", this.touchCancel); f.bind("touchend", this.touchEnd) }; b.prototype.touchStart = function (e) { var f = this; b.eachTouch(e, function (g) { b.touches[g.identifier] = new a(f, g) }) }; b.prototype.touchMove = function (e) { b.eachTouch(e, function (g) { var f = b.touches[g.identifier]; if (f) { f.move(g) } }) }; b.prototype.touchCancel = function (e) { b.eachTouch(e, function (f) { b.purge(f, true) }) }; b.prototype.touchEnd = function (e) { b.eachTouch(e, function (f) { b.purge(f) }) }; b.touches = {}; b.purge = function (g, e) { if (!e) { var f = b.touches[g.identifier]; if (f) { f.process() } } delete b.touches[g.identifier] }; b.eachTouch = function (e, h) { var e = e.originalEvent; var f = e.changedTouches.length; for (var g = 0; g < f; g++) { h(e.changedTouches[g]) } }; c.fn.addSwipeEvents = function (e, f) { if (!f && jQuery.isFunction(e)) { f = e; e = null } new b(this, e); if (f) { this.bind("touch", f) } return this } })(jQuery);

var travelAdvisoryCookieName = 'CCLTravelAdvisoryCookie';
var travelAdvisoryCookieNamePrefix = 'TravelAdvisory';

var ccl_header = {

    flyoutClosing: false,

    showFlyout: function (elem) {

        var header = $("#ccl_header"),
			ul = header.find(".navigation"),
			li = elem.parent(),
			lis = header.find(".navigation li").not(li),
			id = elem[0].id,
			wrapper = header.find(".flyout-wrapper"),
			flyout = wrapper.find(".flyout." + id),
			flyouts = wrapper.find(".flyout").not(flyout),
			hpContent = $("#ccl_homepage .homepage-content");

        lis.removeClass("active");
        flyouts.hide();


        // check if the tab hovered over is one that needs to be personalized
        if (id == 'manage' || id == 'vifp') {
            // bind to the 'SectionReady' event (do this only once)
            if (!header.attr('SectionReadyEventBound')) {
                // let the 'cclHeaderPersonalizer' notify us of when the section is ready for further processing (we might have to wait for ajax calls to complete)
                $(cclHeaderPersonalizer).bind('SectionReady', function (ev, flyout2) {
                    if (flyout2) {
                        // if the section (flyout2) is defined then process it further (note that we're passing 'flyout2' returned by the cclHeaderPersonalizer)
                        ccl_header.showFlyout_part2(header, ul, li, lis, id, wrapper, $(flyout2), flyouts, hpContent);
                    } else {
                        // if no section was returned then just hide flyouts
                        ccl_header.hideFlyouts();
                    }
                });

                header.attr('SectionReadyEventBound', 'Y');
            }
            // initiate the necessary personalization logic
            cclHeaderPersonalizer.PersonalizeTabs(elem, li);

        }
        else {
            // this is a regular tab that needs no personalization
            li.addClass("active");
            ccl_header.showFlyout_part2(header, ul, li, lis, id, wrapper, flyout, flyouts, hpContent);
        }

    },
    // this method has logic that needs to run only after corresponding sections have been personalized
    showFlyout_part2: function (header, ul, li, lis, id, wrapper, flyout, flyouts, hpContent) {

        flyout.show();

        ccl_header.unPIE(ul);

        if (!wrapper.hasClass("expanded")) {

            if (hpContent.length) {

                hpContent.find(".banner-rotator .slideshow").cycle("pause");
                hpContent.delay(80).animate({ "margin-top": "0" }, 60, function () { });

                wrapper.stop(false, true).slideDown("fast", "linear", function () {
                    wrapper.addClass("expanded").css("height", wrapper.height() + "px");
                    ccl_header.PIE(ul);
                    ccl_header.equalizeSectionHeights(flyout);
                    hpContent.find(".banner-rotator .slideshow").cycle("resume");
                });


            } else {

                wrapper.stop(false, true).slideDown("fast", "linear", function () {
                    wrapper.addClass("expanded").css("height", wrapper.height() + "px");
                    ccl_header.PIE(ul);
                    ccl_header.equalizeSectionHeights(flyout);
                });

            }

        } else {
            var newHeight = 0;
            flyout.each(function () {
                var h = $(this).height();
                newHeight += (h + 90);
            });
            ccl_header.unPIE(ul);
            ccl_header.PIE(ul);
            ccl_header.equalizeSectionHeights(flyout);
            wrapper.animate({ height: newHeight + "px" }, 150, "linear");
        }

    },

    hideFlyouts: function () {

        var header = $("#ccl_header"),
			ul = header.find(".navigation"),
			lis = ul.find("li"),
			wrapper = header.find(".flyout-wrapper"),
			flyouts = wrapper.find(".flyout"),
			hpContent = $("#ccl_homepage .homepage-content");

        ccl_header.unPIE(ul);

        if (wrapper.hasClass("expanded") && !ccl_header.flyoutClosing) {
            lis.removeClass("active");
            ccl_header.flyoutClosing = true;


            if (hpContent.length) {
                hpContent.find(".banner-rotator .slideshow").cycle("pause");
                hpContent.animate({ "margin-top": "-62px" }, 50, "linear");
            }

            wrapper.stop(false, true).slideUp("fast", "linear", function () {
                flyouts.hide();
                wrapper.removeClass("expanded").removeAttr("style");
                ccl_header.flyoutClosing = false;

                ccl_header.PIE(ul);
                ccl_header.adjustHeight(25);
                if (hpContent.length) {
                    hpContent.find(".banner-rotator .slideshow").cycle("resume");
                }
            });
        } else {
            lis.removeClass("active");
            flyouts.hide();
            wrapper.stop().removeClass("expanded").hide().removeAttr("style");
            ccl_header.flyoutClosing = false;
            if (hpContent.length) {
                hpContent.stop(true, false).css("margin-top", "-62px");
            }
            ccl_header.PIE(ul);
            ccl_header.adjustHeight(25);
        }
    },

    PIEelements: "#ccl_header .header-top, #ccl_header ul.navigation, #ccl_header ul.navigation li.first-child, #ccl_header .site-search, #ccl_homepage #ccl_header .trans-wrap",

    initPIE: function () {
        if (window.PIE) {
            $(ccl_header.PIEelements).each(function () {
                PIE.attach(this);
            });
        }
    },

    killPIE: function () {
        if (window.PIE) {
            $(ccl_header.PIEelements).each(function () {
                PIE.detach(this);
            });
        }
    },

    PIE: function (elem) {
        if (window.PIE) {
            PIE.attach(elem[0]);
        }
    },

    unPIE: function (elem) {
        if (window.PIE) {
            PIE.detach(elem[0]);
        }
    },

    originalHeight: 0,

    adjustHeight: function (pad) {
        if ($.browser.msie && parseInt($.browser.version, 10) < 8) {
            var height = $(document).height(),
				 btm = $("#ccl_header .top-section");

            if (height > (ccl_header.originalHeight + pad)) {
                btm.css("margin-bottom", "1px");
                setTimeout(function () {
                    btm.css("margin-bottom", "0");
                }, 50);
            }
        }
    },

    supportPH: function (ctx) {

        if (!ctx) {
            ctx = "#ccl_header";
        }

        //        $("input[placeholder]").each(function () {
        //            $(this).watermark($(this).attr('placeholder'));
        //        });


        var phSupport = ("placeholder" in document.createElement("input"));

        $("*[placeholder][type!=password]", ctx).each(function () {
            var o = $(this),
            ph = o.attr("placeholder");

            o.val(ph).focus(function () {
                if (o.val() == ph) { o.val(""); }
            }).blur(function () {
                if (o.val() == "") { o.val(ph); }
            }).removeAttr("placeholder");
        });


        $("#ccl_header input[type=password]").each(function () {
            if ($(this).parent().is(".pw-wrap")) {
                var o = $(this),
                ph = o.attr("placeholder"),
                id = o.attr("id");

                if (!$("label[for=" + id + "]").length) {
                    lbl = $('<label for="' + id + '">' + ph + '</label>');

                    if (o.hasClass("error")) {
                        o.parent().addClass("error");
                    }

                    // JA: commented this out because IE was rendering the placeholder label on top of the text box value causing jumbled txt (bug 19925)
                    //if (phSupport) {
                    o.removeAttr("placeholder");
                    //}

                    o.before(lbl).focus(function () {
                        o.prev().hide();
                    }).blur(function () {
                        if (o.val() == "") { o.prev().show(); }
                    });

                    o.val() == "" ? o.prev().show() : o.prev().hide();
                }
            }
        });

    },

    equalizeSectionHeights: function (flyout) {

        flyout.each(function () {
            var fo = $(this);

            if (!fo.hasClass("equalized")) {
                var sects = fo.find(".section"),
					maxHeight = 0;

                sects.each(function () {
                    if ($(this).height() > maxHeight) { maxHeight = $(this).height(); }
                });

                sects.css("height", maxHeight + "px");
                fo.addClass("equalized");
            }

        });

    },

    dynamicallyLoadFlyoutContent: function (data, tabId, ctx) {
        var headerFlyoutContentWebMethodUrl = "/Service/RenderHeaderFlyoutContent.aspx/GetHeaderFlyoutContentForTab";
        // asynchrounously load header flyout content for tab with tabId from RenderHeaderFlyoutContent.aspx/GetHeaderFlyoutContent web method
        $.ajax({
            type: "POST",
            url: headerFlyoutContentWebMethodUrl,
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                //populate the flyout data in the respective tab in the header
                var $tab = ctx.find('.flyout-wrapper .' + tabId);
                $tab.html(response.d);
                ccl_header.supportPH($tab);
                ccl_header.setHoverStatesOfFlyoutImages($tab);
                if ($.browser.msie && parseInt($.browser.version) <= 9) {
                    $tab.find('.icon-blurb').click(function () {
                        location.href = $(this).attr('href');
                    });
                }
                $tab.find(".flyout-close").click(function () {
                    ccl_header.hideFlyouts();
                    return false;
                });
                $tab.find('img').each(function () {
                    var $img = $(this);
                    var imgsrc = $img.attr('src');
                    var idxof = imgsrc.indexOf('~/media');
                    if (idxof == 0) {
                        $img.attr('src', '/' + imgsrc);
                    } else if (idxof > 0 && $.browser.msie && imgsrc.indexOf('/~/media') != 0) {
                        $img.attr('src', '/' + imgsrc.substring(idxof));
                    }
                });
            },
            error: function () {
                var error = "error";
            }
        });
    },

    setHoverStatesOfFlyoutImages: function (ctx) {
        // changing the image src on hover for the flyout images
        ctx.find('.icon-blurb img').hover(function () {
            var o = $(this);
            var hoverSrc = o.parents('.icon').find('input[name=IconOnHover]').val();
            o.attr('src', hoverSrc);
        },
    function () {
        var o = $(this);
        var originalSrc = o.parents('.icon').find('input[name=OriginalIcon]').val();
        o.attr('src', originalSrc);
    });
    },

    dynamicallyLoadAdvisoryContent: function (data, ctx) {
        var advisoryContentWebMethodUrl = "/Service/RenderHeaderAdvisoryContent.aspx/GetHeaderAdvisoryContent";
        // asynchrounously load header flyout content for tab with tabId from RenderHeaderFlyoutContent.aspx/GetHeaderFlyoutContent web method
        $.ajax({
            type: "POST",
            url: advisoryContentWebMethodUrl,
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                //populate the advisory data in the header
                var $advisoryWrapper = ctx.find('.message-bar');
                $advisoryWrapper.html(response.d);

                //////////////////////////////////////////////////////
                // "hide" message bar
                //////////////////////////////////////////////////////	
                ctx.find(".message-bar-close").click(function () {
                    $(this).parents('.inner').slideUp("fast");
                    //set  the cookie value for this travel advisory to false after they click on close
                    var cookieIdentifier = travelAdvisoryCookieNamePrefix + $(this).parents('.inner').find('input[name=cookieIdentifier]').val();
                    ccl_header.setCookie(travelAdvisoryCookieName, cookieIdentifier, 'false');

                    return false;
                });

                //////////////////////////////////////////////////////
                // setting the urgency level color code and cookie for the travel advisories in the header
                //////////////////////////////////////////////////////		
                ccl_header.setTravelAdvisoryColorCodeAndCookie(ctx);

            },
            error: function () {
                var error = "error";
            }
        });
    },

    setTravelAdvisoryColorCodeAndCookie: function (ctx) {

        var travelAdvisoryCookie = $.cookie(travelAdvisoryCookieName);
        ctx.find("input[name=UrgencyLevelColorCode]").each(function () {
            var o = $(this);
            var $advisory = o.parents('.inner');
            //set the backgroundColor for the travel advisory as per UrgencyLevelColorCode
            $advisory.find('h4').css('backgroundColor', o.val());

            //set the travel advisory cookies
            //cookieIdentifier is to give each advisory cookieitem a unique name
            var cookieIdentifier = travelAdvisoryCookieNamePrefix + $advisory.find('input[name=cookieIdentifier]').val();
            if (!travelAdvisoryCookie) {
                //initially turn them on
                ccl_header.setCookie(travelAdvisoryCookieName, cookieIdentifier, 'true');
            }
            else {
                $advisory.hide();
                var arr = travelAdvisoryCookie.split('&');
                for (var i = 0; i < arr.length; i++) {
                    if (arr[i].indexOf(cookieIdentifier) > -1 && arr[i].split('=')[1] == 'true') {
                        $advisory.show();
                    }
                }
            }


        });
        ctx.find(".message-bar").slideDown();

    },
    //this generic function sets the cookieitem to cookie value for a given cookie
    setCookie: function (cookieName, cookieItemName, cookieVal) {
        var cookieStr = $.cookie(cookieName);
        cookieStr = ccl_header.setCookieStringItem(cookieStr, cookieItemName, cookieVal);
        var options = ccl_header.getCookieOptions();
        $.cookie(cookieName, cookieStr, options);
    },
    //this is the generic function, and could be used to set cookiestring for any cookie
    setCookieStringItem: function (cookiestring, cookieItem, cookieVal) {
        if (cookiestring != null) {
            if (cookiestring.indexOf(cookieItem) == -1) cookiestring = cookiestring + ((cookiestring.charAt(cookiestring.length - 1) == "&") ? "" : "&") + cookieItem + "=" + cookieVal;
            else {
                if (cookiestring.indexOf(cookieItem + "=" + cookieVal) == -1) {
                    var cookieArr = cookiestring.split("&");
                    for (var i = 0; i < cookieArr.length; i++) {
                        if (cookieArr[i].indexOf(cookieItem) > -1) cookieArr[i] = cookieItem + "=" + cookieVal;
                    }
                    cookiestring = cookieArr.join("&");
                }
            }
        }
        else
            cookiestring = cookieItem + "=" + cookieVal;
        return cookiestring;
    },
    //this is the generic function, and could be used to set cookie options
    getCookieOptions: function () {
        var options =
    {
        path: '/',
        expires: 90
    };
        var domain = ccl_header.getCookieDomain();
        if (domain.length > 0) options =
    {
        path: '/',
        expires: 90,
        domain: domain
    };
        return options;
    },
    getCookieDomain: function () {
        var domain = document.domain;
        if (domain == "localhost") return "";
        if (domain.indexOf(".com") > 0) {
            if (domain.indexOf(".") < domain.indexOf(".com")) domain = domain.substr(domain.indexOf(".") + 1);
            return domain;
        }
        else
            return "";

    },

    launchPopup: function (url, prefix, aiWidth, aiHeight) {
        /// <summary>Launches a popup.</summary>
        /// <param name="url" type="string">The URL to be loaded.</param>
        /// <param name="prefix" type="string">The class name to assign to the resulting popup for CSS support.</param>
        /// <param name="aiWidth" type="int">The width of the popup | 375 if not supplied.</param>
        /// <param name="aiHeight" type="int">The height of the popup | 335 if not supplied.</param>
        /// <returns type="void">Returns nothing, but launches the popup.</returns>
        // Handle default if not supplied
        if (aiWidth == null) {
            aiWidth = 375;
        }
        if (aiHeight == null) {
            aiHeight = 335;
        }
        if (!prefix) {
            return false;
        }
        var pop = $('<div class="' + prefix + '-popup popup-forgot"><a class="close" href="#">X</a><div class="inner"><iframe id="' + prefix + '-iframe" width="' + aiWidth + '" height="' + aiHeight + '" src="' + url + '" frameborder="0" style="width: ' + aiWidth + 'px!important; height: ' + aiHeight + 'px!important;"></iframe></div></div>');
        var overlay = $('<div class="popup-forgot-overlay"></div>');

        $("body").append(overlay, pop);
        pop.find(".close").click(function () {
            pop.add(overlay).remove();
            //notify the parent that iframe is closed
            if ($.browser.msie && parseInt($.browser.version) <= 9) {
                parent.$(parent.document).trigger('IframeClosed', [{}]);
            }
            return false;
        });
        overlay.click(function () {
            pop.remove();
            overlay.remove();
            return false;
        });
        ccl_header.positionPopup(pop);
        $(window).bind("resize scroll", function () {
            ccl_header.positionPopup(pop);
        });
    },

    positionPopup: function (popup) {
        var winW = $(window).width(),
        winH = $(window).height(),
        popW = popup.width() + 16,
        popH = popup.height() + 16,
        scrollTop = $(window).scrollTop();
        var posLeft = (winW - popW) / 2;
        var posTop = scrollTop + 25;
        if (popH < winH) {
            posTop = (winH - popH) / 2 + scrollTop;
        }
        popup.css({
            "top": posTop + "px",
            "left": posLeft + "px"
        });
    }

};


//////////////

$(function () {

    var header = $("#ccl_header"),
	wrapper = header.find(".flyout-wrapper");

    function IE7Fix() {
        // Completely hacktastic, but resolves IE7 specific DIV placement after jQuery animation
        $("div.header-top").css("zoom", "0.999");
        $("div.header-top").css("zoom", "1.000");
    }
    //////////////////////////////////////////////////////
    // show/hide login flyout
    //////////////////////////////////////////////////////	
    var $loginLink = header.find("#ccl_header_expand-login-link");
    $loginLink.click(function () {
        var o = $(this),
			par = o.parent(),
			top = header.find(".top-section"),
			flyout = header.find(".login-flyout");

        if (!o.hasClass("not-a-link")) {
            if (!par.hasClass("active")) {
                par.addClass("active");
                top.addClass("flyout-expanded");

                if ($.browser.msie && parseInt($.browser.version) == "7") {
                    flyout.slideDown("fast", IE7Fix);
                } else {
                    flyout.slideDown("fast");
                }
            } else {
                flyout.slideUp("fast", function () {
                    par.removeClass("active");
                    top.removeClass("flyout-expanded");
                });
            }
        }

        return false;
    });


    //////////////////////////////////////////////////////
    // show flyouts
    //////////////////////////////////////////////////////

    // open on click logic
    header.find("a.flyout").bind("click", function () {

        if ($(this).parent().hasClass("active")) {
            ccl_header.hideFlyouts();
        } else {
            ccl_header.showFlyout($(this));
        }
        return false;

    }); /* .bind("mouseenter",function(){
		if(wrapper.hasClass("expanded")){
			ccl_header.showFlyout($(this));
		}
	}); */

    // open on hover logic
    /* 	header.find("a.flyout").bind("mouseenter",function(){

    ccl_header.showFlyout($(this));
		
    }).addSwipeEvents().bind("tap",function(evt,touch){
			
    $(this).unbind("click").bind("click",function(){
    return false;
    });
		
    if(!$(this).parent().hasClass("active")){
    ccl_header.showFlyout($(this));
    } else {
    ccl_header.hideFlyouts();
    }
			
    });	 */


    //////////////////////////////////////////////////////
    // hide flyouts
    //////////////////////////////////////////////////////	

    /* 	header.find(".bottom-section").bind("mouseleave",function(){
		
    ccl_header.hideFlyouts();
		
    }); */

    header.find(".flyout-close").click(function () {
        ccl_header.hideFlyouts();
        return false;
    });

    header.find(".navigation li a").not(".flyout").bind("mouseenter", function () {
        ccl_header.hideFlyouts();
    });



    //////////////////////////////////////////////////////
    // support Placeholder
    //////////////////////////////////////////////////////		
    ccl_header.supportPH();

    //////////////////////////////////////////////////////
    // init PIE
    //////////////////////////////////////////////////////		
    ccl_header.initPIE();
    $(window).load(function () {
        setTimeout(function () {
            if (window.PIE && $(document).width() > 2000) {
                ccl_header.killPIE();
                ccl_header.initPIE();
            }
        }, 1000);
    });

    //////////////////////////////////////////////////////
    // get original document height
    //////////////////////////////////////////////////////		
    $(window).load(function () {
        ccl_header.originalHeight = $(document).height();
    });

    //    //////////////////////////////////////////////////////
    //    // dynamic loading of the flyout content in the header( this works only for 'PlanAndBook','Explore', and 'Special' tabs)
    //    //////////////////////////////////////////////////////		
    header.find('.navigation li').one('mouseover', function () {
        var o = $(this);
        var tabId = o.find('.flyout').attr('id');
        var flyoutIds = $('input[name=FlyoutId]').val();
        if (tabId == "PlanAndBook" || tabId == "Explore" || tabId == "Special") {
            ccl_header.dynamicallyLoadFlyoutContent("{'tabId' : " + "'" + tabId + "'" + "}", tabId, header);
        }
    });



    //////////////////////////////////////////////////////
    ccl_header.dynamicallyLoadAdvisoryContent('{}', header);
    //////////////////////////////////////////////////////

    header.find("#ccl_header_site-search").live("keypress", function (event) {
        if (event.keyCode == 13) {
            $("#ccl_header_site-search-submit").click();
            event.stopPropagation();
            event.preventDefault();
        }
    });
    //----------------------------------//
});
