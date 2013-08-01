(function() {
  var Background, UPDATE_INTERVAL,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  UPDATE_INTERVAL = 1000 * 60;

  Background = (function() {
    function Background() {
      this.fetch = __bind(this.fetch, this);
      this.assignEventHandlers();
      setInterval(this.fetch, UPDATE_INTERVAL);
    }

    Background.prototype.assignEventHandlers = function() {
      return chrome.browserAction.onClicked.addListener(function() {
        if (!comeetingNotifier.isAuthenticated()) {
          window.open(comeetingNotifier.getAuthorizationUrl());
        } else {
          chrome.browserAction.setPopup({
            popup: "popup.html"
          });
        }
      });
    };

    Background.prototype.render = function(badge, color, title) {
      chrome.browserAction.setBadgeText({
        text: badge
      });
      chrome.browserAction.setBadgeBackgroundColor({
        color: color
      });
      chrome.browserAction.setTitle({
        title: title
      });
    };

    Background.prototype.fetch = function() {
      var _this = this;
      comeetingNotifier.fetchUnreadCount(function(unreadCount) {
        if ((unreadCount != null) > 0) {
          _this.render("" + unreadCount, [65, 131, 196, 255], "co-meetiong Notifier");
        } else if (unreadCount === 0) {
          _this.render("", [65, 131, 196, 255], "co-meetiong Notifier");
        } else {
          _this.render(":(", [166, 41, 41, 255], "You have to be connected to the internet and logged into co-meetiong");
        }
      });
    };

    return Background;

  })();

  window.bg = new Background();

  window.bg.fetch();

}).call(this);
