(function() {
  var Options, TEMPLATE_SRC, options,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  TEMPLATE_SRC = '<div class="row account">\n<div class="col-lg-2 account-avatar"><img src="<%=icon_url%>" class="img-circle"></div>\n<div class="col-lg-3 account-name"><%-name%>(<%-screen_name%>)</div>\n<div class="col-lg-2 account-button"></div>\n</div>';

  Options = (function() {
    var bg, comeetingNotifier;

    bg = chrome.extension.getBackgroundPage().bg;

    comeetingNotifier = chrome.extension.getBackgroundPage().comeetingNotifier;

    function Options() {
      this.assignEventHandlers = __bind(this.assignEventHandlers, this);
      var _this = this;
      window.addEventListener("load", function() {
        _this.start();
      });
    }

    Options.prototype.start = function() {
      this.assignMessages();
      this.render();
      this.assignEventHandlers();
    };

    Options.prototype.render = function() {
      var isAuthenticated;
      isAuthenticated = comeetingNotifier.isAuthenticated();
      $(".js-btn-addAccount").prop("disabled", isAuthenticated);
      $(".js-btn-disable").prop("disabled", !isAuthenticated);
      if (isAuthenticated) {
        $(".account-list").html(_.template(TEMPLATE_SRC, bg.getAccountInfo()));
      } else {
        $(".account-list").html("");
      }
    };

    Options.prototype.assignMessages = function() {};

    Options.prototype.assignEventHandlers = function() {
      var _this = this;
      $(".js-btn-addAccount").on("click", function(e) {
        e.preventDefault();
        window.open(comeetingNotifier.getAuthorizationUrl());
        setTimeout(function() {
          return _this.render();
        }, 5000);
      });
      $(".js-btn-disable").on("click", function(e) {
        e.preventDefault();
        bg.disableAuthorization();
        _this.render();
      });
    };

    return Options;

  })();

  options = new Options();

}).call(this);
