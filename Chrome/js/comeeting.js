var ComeetingNotifier = function () {
	'use strict';

	var authURL = {
		redirect: 'chrome-extension://cbimlnfniojlclokgpkfmljddpjjjjcl/callback.html',
		authorize: 'https://www.co-meeting.com/oauth/authorize',
		token: 'https://www.co-meeting.com/oauth/token'
	}

	var NOTIFICATIONS_URL = 'https://www.co-meeting.com/api/v1/groups/my';

	var module = {};

	module.claimAuthorization = function () {

		var authorizeUrl = authURL.authorize;
		authorizeUrl += '?response_type=code';
		authorizeUrl += '&client_id=' + OAUTH_CONSUMER_KEY;
		authorizeUrl += '&redirect_uri=' + authURL.redirect;

		window.open(authorizeUrl);

	};

	module.claimAccessToken = function (code) {

		var data = {
			grant_type: 'authorization_code',
			code: code,
			client_id: OAUTH_CONSUMER_KEY,
			client_secret: OAUTH_CONSUMER_SECRET,
			redirect_uri: authURL.redirect
		};

		$.post(authURL.token, data, function (data) {

			if (!data || !data.access_token) {
				console.debug('access_token is not String');
				return;
			}

			localStorage.setItem({
				oauth_token: data.access_token,
				expires_in: data.expires_in
			});

		});

	};

	module.getGroupList = function () {
		var groupList = JSON.parse(localStorage.getItem("groupList"));
		if (!_.isArray(groupList)) {
			console.debug('groupList is not Object');
		}
		return groupList;
	}

	module.setGroupList = function (groupList) {
		if (!groupList) {
			console.debug('groupList is empty');
		}
		localStorage.setItem("groupList", JSON.stringify(groupList));
	}

	module.getToken = function () {
		var token = localStorage.getItem("oauth_token");
		if (!token) {
			console.debug('access_token is not String');
		}
		return token;
	}

	module.isAuthenticated = function () {
		var token = localStorage.getItem("oauth_token");
		if (!token) {
			console.debug('access_token is not String');
		}
		return !!token;
	}

	module.comeetingNotifCount = function (callback) {

		if (!this.isAuthenticated()) {
			callback();
			return;
		}
		;

		var self = this,
			token = this.getToken();

		var settings = {
			url: NOTIFICATIONS_URL,
			type: 'GET'
		};

		settings.beforeSend = function (xhr) {
			xhr.setRequestHeader('Authorization', 'Bearer ' + token);
		};

		$.ajax(settings)
			.done(function (data) {

				var groups = data.result.groups;
				var unreadCount = 0;

				self.setGroupList(groups);

				_.each(groups, function (group) {
					unreadCount += group.unread_counts;
				});

				callback(unreadCount);

			}).fail(function (jqXHR, state, statusText) {

				console.log(state + ':' + jqXHR.status + ' ' + statusText);
				callback();

			});

	};

	return module;

};