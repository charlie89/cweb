/**
 * @namespace Shows Notifications
 */
c.notify = function(n) {
    var msg = {};
    if (typeof(n) == "string") {
        msg = {
            text: n
        };
    } else {
        msg = n;
    }
    $.notify_osd.create(msg);
};

// set standard settings
$.notify_osd.setup({ // set default settings
    'text': 'jNotifyOSD Notification System',
    'icon': '',
    'sticky': false,
    'timeout': 8,
    'dismissable': false,
    'click_through': true
});