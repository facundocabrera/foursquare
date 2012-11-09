var AUTH_BASE = "https://foursquare.com/";
var CLIENT_ID = "3BI3XD4EPTSID5MRQWM0I2B1ME0R0W1RQ4KBYCVPCAH2E1DW";
var API_BASE = "https://api.foursquare.com/";

var token = null;

function displayResult(result) {
    console.log(result);
}

function doAuthRedirect() {
    var redirect = window.location.href.replace(window.location.hash, '');

    var url = AUTH_BASE + 'oauth2/authenticate?response_type=token&client_id=' + CLIENT_ID + 
              '&redirect_uri=' + encodeURIComponent(redirect) + 
              '&state=' + encodeURIComponent($.bbq.getState('req') || 'users/self');

    window.location.href = url;
}

function zeroPad(num) {
    if (num < 10) {
        return '0' + num;
    } else {
        return num;
    }
}

function makeRequest(query) {
    var tokenParam = ((query.indexOf('?') > -1) ? '&' : '?') + 'oauth_token=' + token;
    var date = new Date();
    var versionParam = '&v=' + (date.getYear() + 1900) + zeroPad(date.getMonth() + 1) + zeroPad(date.getDate());
    var url = API_BASE + 'v2/' + query + tokenParam + versionParam;
    
    if (url.indexOf("callback=") > 0) {
        throw 'Invalid URL.';
    }

    $.getJSON(url.replace('?', '?callback=?&'), {}, displayResult);
}

function changeQuery() {
    $.bbq.pushState({'req': $('#query').val()});
}

function onHashChange(e) {
    if ($.bbq.getState('access_token')) {
        // If there is a token in the state, consume it
        token = $.bbq.getState('access_token');
        var state = $.bbq.getState('state') || '';
        $.bbq.pushState({'req': state}, 2);
    } else if ($.bbq.getState('error')) {
    // TODO: Handle error
    } else if (token) {
        // If we have a token, try to use it
        var query = $.bbq.getState('req');
        if (query) {
            makeRequest('users/self');
        }
    } else {
        doAuthRedirect();
    }
}

$(function() {
    $(window).bind('hashchange', onHashChange);
    $(window).trigger('hashchange');
});