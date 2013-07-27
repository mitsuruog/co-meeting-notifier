/**
 * @fileoverview Core module that authorization and call to co-meeting API.
 * @copyright mitsuruog 2013
 * @author mitsuruog <mitsuru.ogawa.jp@gmail.com>
 * @license MIT
 *
 * @return {{}}
 * @constructor
 *
 * @module js/comeeting.js
 */
var ComeetingNotifier = function() {

	var module = {};
	var URL = {
		REDIRECT: 'chrome-extension://' + APPLICATION_ID + '/callback.html',
		AUTHORIZE: 'https://www.co-meeting.com/oauth/authorize',
		TOKEN: 'https://www.co-meeting.com/oauth/token',
		FETCH: 'https://www.co-meeting.com/api/v1/groups/my'
	};

	function initialize() {

		$.ajaxSetup({
			beforeSend: function (xhr) {
				if (module.isAuthenticated()) {
					xhr.setRequestHeader('Authorization', 'Bearer ' + module.accessToken.get());
				}
			},
			cache: false,
			error: function (jqXHR, state, statusText){
				console.log(state + ':' + jqXHR.status + ' ' + statusText);
				throw new Error(state + ':' + jqXHR.status + ' ' + statusText);
			}
		});

	}

	module.getAuthorizationUrl = function () {

		var authorizeUrl = URL.AUTHORIZE;
		authorizeUrl += '?response_type=code';
		authorizeUrl += '&client_id=' + OAUTH_CONSUMER_KEY;
		authorizeUrl += '&redirect_uri=' + URL.REDIRECT;

		return authorizeUrl;

	};

	module.claimAccessToken = function (code) {

		var settings = {
			url: URL.TOKEN,
			type: 'POST'
		};

		settings.data = {
			grant_type: 'authorization_code',
			code: code,
			client_id: OAUTH_CONSUMER_KEY,
			client_secret: OAUTH_CONSUMER_SECRET,
			redirect_uri: URL.REDIRECT
		};

		$.ajax(settings)
			.done(function (accessToken) {

				if (!accessToken) {
					console.debug('accessToken is empty');
					return;
				}
				module.oauthToken.set(accessToken);

			});
	};

	module.claimRefreshToken = function (callback) {

		var refreshToken = module.refreshToken.get();
		if (!refreshToken) return;

		var settings = {
			url: URL.TOKEN,
			type: 'POST'
		};

		settings.data = {
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
			client_id: OAUTH_CONSUMER_KEY,
			client_secret: OAUTH_CONSUMER_SECRET
		};

		$.ajax(settings)
			.done(function (accessToken) {

				if (!accessToken) {
					console.debug('accessToken is empty');
					return;
				}
				module.oauthToken.set(accessToken);
				module.fetchUnreadCount(callback, {refresh: true});

			});

	};

	module.fetchUnreadCount = function (callback, options) {

		options = options || {};

		if (!module.isAuthenticated()) {
			callback();
			return;
		}

		if(!module.isExpiresIn(new Date())){
			//refresh token
			if(options.refrash) {
				callback();
				return;
			}
			module.claimRefreshToken(callback);
		}

		var settings = {
			url: URL.FETCH,
			type: 'GET'
		};

		$.ajax(settings)
			.done(function (data) {

				if (!data || !data.result || !_.isArray(data.result.groups)) {
					console.debug('groupList is not Array');
					console.debug(data);
					return;
				}

				var groupList = data.result.groups;
				var unreadCount = 0;

				module.groupList.set(groupList);

				_.each(groupList, function (group) {
					unreadCount = module.countUpUnread(unreadCount, group);
				});

				callback(unreadCount);

			});

	};

	module.countUpUnread = function(unreadCount, group){

		unreadCount = _.isNumber(unreadCount) ? unreadCount: 0;

		if(!_.isObject(group)) {
			console.debug('group is not Object:' + group);
			return unreadCount;
		}

		if(group.unread_off === true) return unreadCount;
		if(!_.isNumber(group.unread_counts)) {
			console.debug('group.unread_counts is not Number:' + group.unread_counts);
			return unreadCount;
		}
		return unreadCount + group.unread_counts;

	};

	module.isAuthenticated = function () {
		return !!module.oauthToken.get();
	};

	module.isExpiresIn = function (now){
		if(!_.isDate(now)){
			throw new Error('module.isAuthenticated():now is not Date:' + now);
		}
		var oauthToken = module.oauthToken.get();
		return (parseInt(oauthToken.createAt, 10) + parseInt(oauthToken.expires_in, 10) * 1000) >= now.getTime();
	};

	module.clearAuthorization = function(){
		module.groupList.clear();
		module.oauthToken.clear();
	};

	module.groupList = {
		KEY_NAME: 'groupList',
		get: function () {
			var groupList = localStorage.getItem(this.KEY_NAME);
			if (!groupList) {
				console.debug('groupList is empty');
			}
			if (!_.isArray(groupList)) {
				console.debug('groupList is not Array');
			}
			return groupList ? JSON.parse(groupList) : void 0;
		},
		set: function (groupList) {
			if (!groupList) {
				console.debug('groupList is empty');
			}
			localStorage.setItem(this.KEY_NAME, JSON.stringify(groupList));
		},
		clear: function(){
			localStorage.setItem(this.KEY_NAME, '');
		}
	};

	module.oauthToken = {
		KEY_NAME: 'oauthToken',
		get: function () {
			var oauthToken = localStorage.getItem(this.KEY_NAME);
			if (!oauthToken) {
				console.debug('oauthToken is empty');
			}
			return oauthToken ? JSON.parse(oauthToken) : void 0;
		},
		set: function (oauthToken) {
			if (!oauthToken) {
				console.debug('oauthToken is empty');
			}
			oauthToken.createAt = new Date().getTime();
			localStorage.setItem(this.KEY_NAME, JSON.stringify(oauthToken));
		},
		clear: function(){
			localStorage.setItem(this.KEY_NAME, '');
		}
	};

	module.accessToken = {
		get: function () {
			var oauthToken = module.oauthToken.get();
			if (!oauthToken || !oauthToken.access_token) {
				console.debug('access_token is not String');
			}
			return oauthToken.access_token;
		}
	};

	module.refreshToken = {
		get: function () {
			var oauthToken =  module.oauthToken.get();
			if (!oauthToken || !oauthToken.refresh_token) {
				console.debug('refresh_token is not String');
			}
			return oauthToken.refresh_token;
		}
	};

	initialize();

	return module;

};
var comeetingNotifier = new ComeetingNotifier();