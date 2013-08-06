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
      chrome.browserAction.onClicked.addListener(function() {
        chrome.browserAction.setPopup({
          popup: "popup.html"
        });
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
          _this.render("" + unreadCount, [65, 131, 196, 255], chrome.i18n.getMessage("name"));
        } else if (unreadCount === 0) {
          _this.render("", [65, 131, 196, 255], chrome.i18n.getMessage("name"));
        } else {
          _this.render(":(", [166, 41, 41, 255], chrome.i18n.getMessage("not_authenticated"));
        }
      });
    };

    Background.prototype.disableAuthorization = function() {
      comeetingNotifier.clearAuthorization();
      chrome.browserAction.setPopup({
        popup: ""
      });
    };

    Background.prototype.getAccountInfo = function() {
      return comeetingNotifier.accounts.get();
    };

    return Background;

  })();

  window.bg = new Background();

  window.bg.fetch();

}).call(this);
