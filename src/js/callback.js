(function() {
  var Callback, callback;

  Callback = (function() {
    var bg;

    bg = chrome.extension.getBackgroundPage().bg;

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
      $(".authenticated-message").find('>h3').text(chrome.i18n.getMessage("authenticated")).end().find(".js-authenticated-close").text(chrome.i18n.getMessage("close"));
    };

    Callback.prototype.assignEventHandlers = function() {
      var code,
        _this = this;
      if (!location.href.match(/code=(\S*)/)) {
        throw new Error("Authorization Code is empty");
      }
      code = location.href.match(/code=(\S*)/)[1];
      bg.getAccessToken(code);
      setTimeout(function() {
        chrome.tabs.getCurrent(function(tab) {
          chrome.tabs.remove(tab.id, function() {});
        });
      }, 250);
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
