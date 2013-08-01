(function() {
  var Callback, callback;

  Callback = (function() {
    var bg, comeetingNotifier;

    bg = chrome.extension.getBackgroundPage().bg;

    comeetingNotifier = chrome.extension.getBackgroundPage().comeetingNotifier;

    function Callback() {
      var _this = this;
      window.addEventListener("load", function() {
        _this.start();
      });
    }

    Callback.prototype.start = function() {
      this.assignMessages();
      this.assignEventHandlers();
    };

    Callback.prototype.assignMessages = function() {
      var code;
      if (!location.href.match(/code=(\S*)/)) {
        throw new Error("Authorization Code is empty");
      }
      code = location.href.match(/code=(\S*)/)[1];
      comeetingNotifier.claimAccessToken(code, bg.fetch);
    };

    Callback.prototype.assignEventHandlers = function() {
      var _this = this;
      $(".js-authenticated-close").on("click", function(e) {
        e.preventDefault();
        chrome.tabs.getCurrent(function(tab) {
          chrome.tabs.remove(tab.id, function() {});
        });
      });
    };

    return Callback;

  })();

  callback = new Callback();

}).call(this);
