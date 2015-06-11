(function() {
  var Callback, callback;

  Callback = (function() {
    function Callback() {
      var _this = this;
      window.addEventListener("load", function() {
        return _this.start();
      });
    }

    Callback.prototype.start = function() {
      this.assignMessages();
      this.assignEventHandlers();
    };

    Callback.prototype.assignMessages = function() {};

    Callback.prototype.assignEventHandlers = function() {
      var code,
        _this = this;
      if (!location.href.match(/code=(\S*)/)) {
        throw new Error("Authorization Code is empty");
      }
      code = location.href.match(/code=(\S*)/)[1];
      window.comeetingNotifier.claimAccessToken(code, function() {
        console.log("claimAccessToken :)");
        return window.comeetingNotifier.fetchMe(function() {
          console.log("fetchMe :)");
          return window.close();
        });
      });
      $(".js-authenticated-close").on("click", function(e) {
        e.preventDefault();
        return window.close();
      });
    };

    return Callback;

  })();

  callback = new Callback();

}).call(this);
