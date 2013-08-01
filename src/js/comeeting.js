(function() {
  var ComeetingNotifier, URL,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  URL = {
    REDIRECT: "chrome-extension://" + APPLICATION_ID + "/callback.html",
    AUTHORIZE: "https://www.co-meeting.com/oauth/authorize",
    TOKEN: "https://www.co-meeting.com/oauth/token",
    FETCH: 'https://www.co-meeting.com/api/v1/groups/my'
  };

  ComeetingNotifier = (function() {
    function ComeetingNotifier() {
      this.refreshToken = __bind(this.refreshToken, this);
      this.accessToken = __bind(this.accessToken, this);
      this.fetchUnreadCount = __bind(this.fetchUnreadCount, this);
      this.claimRefreshToken = __bind(this.claimRefreshToken, this);
      this.claimAccessToken = __bind(this.claimAccessToken, this);
      this.ajaxSettings = __bind(this.ajaxSettings, this);
      this.ajaxSettings();
    }

    ComeetingNotifier.prototype.ajaxSettings = function() {
      var _this = this;
      $.ajaxSetup({
        beforeSend: function(xhr) {
          if (_this.isAuthenticated()) {
            xhr.setRequestHeader("Authorization", "Bearer " + _this.accessToken().get());
          }
        },
        cache: false,
        error: function(jqXHR, state, statusText) {
          throw new Error("" + state + ":" + jqXHR.status + " " + statusText);
        }
      });
    };

    ComeetingNotifier.prototype.getAuthorizationUrl = function() {
      return URL.AUTHORIZE + "?response_type=code&client_id=" + OAUTH_CONSUMER_KEY + "&redirect_uri=" + URL.REDIRECT;
    };

    ComeetingNotifier.prototype.claimAccessToken = function(code, callback) {
      var result,
        _this = this;
      result = $.ajax({
        url: URL.TOKEN,
        type: "POST",
        data: {
          grant_type: "authorization_code",
          code: code,
          client_id: OAUTH_CONSUMER_KEY,
          client_secret: OAUTH_CONSUMER_SECRET,
          redirect_uri: URL.REDIRECT
        }
      });
      result.done(function(accessToken) {
        if (!accessToken) {
          console.debug("accessToken is empty");
          return;
        }
        _this.oauthToken.set(accessToken);
        if (_.isFunction(callback)) {
          return callback();
        }
      });
    };

    ComeetingNotifier.prototype.claimRefreshToken = function(callback) {
      var refreshToken, result,
        _this = this;
      refreshToken = this.refreshToken.get();
      if (!refreshToken) {
        return;
      }
      result = $.ajax({
        url: URL.TOKEN,
        type: "POST",
        data: {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
          client_id: OAUTH_CONSUMER_KEY,
          client_secret: OAUTH_CONSUMER_SECRET,
          redirect_uri: URL.REDIRECT
        }
      });
      result.done(function(accessToken) {
        if (!accessToken) {
          console.debug("accessToken is empty");
          return;
        }
        _this.oauthToken.set(accessToken);
        return _this.fetchUnreadCount(callback, {
          refresh: true
        });
      });
    };

    ComeetingNotifier.prototype.fetchUnreadCount = function(callback, options) {
      var result,
        _this = this;
      if (!this.isAuthenticated()) {
        if (_.isFunction(callback)) {
          callback();
          return;
        }
      }
      if (!this.isExpiresIn(new Date())) {
        if (options.refrash) {
          if (_.isFunction(callback)) {
            callback();
            return;
          }
        }
        claimRefreshToken(callback);
      }
      result = $.ajax({
        url: URL.FETCH,
        type: "GET"
      });
      return result.done(function(data) {
        var group, groupList, unreadCount, _i, _len, _ref;
        if (((data != null ? data.result : void 0) != null) && !_.isArray(data.result.groups)) {
          console.debug("groupList is not Array");
          console.debug(data);
          return;
        }
        groupList = data.result.groups;
        unreadCount = 0;
        _this.groupList.set(groupList);
        _ref = _this.groupList;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          group = _ref[_i];
          unreadCount = _this.countUpUnread(unreadCount, group);
        }
        if (_.isFunction(callback)) {
          callback(unreadCount);
        }
      });
    };

    ComeetingNotifier.prototype.countUpUnread = function(unreadCount, group) {
      if (!_.isObject(group)) {
        console.debug("group is not Object: " + group);
        return unreadCount;
      }
      if (group.unread_off === true) {
        return unreadCont;
      }
      if (!_.isNumber(group.unread_off)) {
        console.debug("group.unread_off is not Number: " + group.unread_off);
        return unreadCont;
      }
      return unreadCount + group.unread_off;
    };

    ComeetingNotifier.prototype.isAuthenticated = function() {
      return !!this.oauthToken.get();
    };

    ComeetingNotifier.prototype.isExpiresIn = function(now) {
      var oauthToken;
      if (!_.isDate(now)) {
        throw new Error("module.isAuthenticated():now is not Date: " + now);
      }
      oauthToken = this.oauthToken.get();
      return (parseInt(oauthToken.createAt, 10)) + (parseInt(oauthToken.expires_in, 10)) * 1000 >= now.getTime();
    };

    ComeetingNotifier.prototype.clearAuthorization = function() {
      this.groupList.clear();
      return this.oauthToken.clear();
    };

    ComeetingNotifier.prototype.groupList = {
      KEY_NAME: "groupList",
      get: function() {
        var _groupList;
        _groupList = localStorage.getItem(this.KEY_NAME);
        if (!_groupList) {
          console.debug("groupList is empty: " + _groupList);
        }
        if (!_.isArray(_groupList)) {
          console.debug("groupList is not Array: " + _groupList);
        }
        if (_groupList) {
          return JSON.parse(_groupList);
        } else {
          return void 0;
        }
      },
      set: function(_groupList) {
        if (!_groupList) {
          console.debug("groupList is empty: " + _groupList);
        }
        localStorage.setItem(this.KEY_NAME, JSON.stringify(_groupList));
        return _groupList;
      },
      clear: function() {
        localStorage.setItem(this.KEY_NAME, "");
      }
    };

    ComeetingNotifier.prototype.oauthToken = {
      KEY_NAME: "oauthToken",
      get: function() {
        var _oauthToken;
        _oauthToken = localStorage.getItem(this.KEY_NAME);
        if (!_oauthToken) {
          console.debug("oauthToken is empty: " + _oauthToken);
        }
        if (_oauthToken) {
          return JSON.parse(_oauthToken);
        } else {
          return void 0;
        }
      },
      set: function(_oauthToken) {
        if (!_oauthToken) {
          console.debug("oauthTokenis empty: " + _oauthToken);
        }
        _oauthToken.createAt = new Date().getTime();
        localStorage.setItem(this.KEY_NAME, JSON.stringify(_oauthToken));
        return _oauthToken;
      },
      clear: function() {
        localStorage.setItem(this.KEY_NAME, "");
      }
    };

    ComeetingNotifier.prototype.accessToken = function() {
      var _this = this;
      return {
        get: function() {
          var _oauthToken;
          _oauthToken = _this.oauthToken.get();
          if (!(_oauthToken != null ? _oauthToken.access_token : void 0)) {
            console.debug("access_token  is empty: " + _oauthToken);
          }
          return _oauthToken.access_token;
        }
      };
    };

    ComeetingNotifier.prototype.refreshToken = function() {
      var _this = this;
      return {
        get: function() {
          var _oauthToken;
          _oauthToken = _this.oauthToken.get();
          if (!(_oauthToken != null ? _oauthToken.refresh_token : void 0)) {
            console.debug("refresh_token is empty: " + _oauthToken);
          }
          return _oauthToken.refresh_token;
        }
      };
    };

    return ComeetingNotifier;

  })();

  window.comeetingNotifier = new ComeetingNotifier();

}).call(this);
