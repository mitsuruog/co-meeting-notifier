/**
 * @fileoverview Make the group list when call from browser action triggered.
 * @copyright mitsuruog 2013
 * @author mitsuruog <mitsuru.ogawa.jp@gmail.com>
 * @license MIT
 *
 * @module js/popup.js
 */
(function () {
	'use strict';

	var Popup = function() {

		var module = {};
		var bg = chrome.extension.getBackgroundPage().bg;
		var comeetingNotifier = chrome.extension.getBackgroundPage().comeetingNotifier;

		function initialize () {

			window.addEventListener("load", function (e) {
				module.start();
			});

		}

		module.tmpl = function (template) {

			var templateString = '' +
				'<li class="group">' +
				'<span class="group_unread_counts label label-info"><%- unread_counts %></span>' +
				'<a href="<%= url %>" class="group_link btn-link" target="_blank">' +
				'<span class="group_name"><%- name %></span>' +
				'</a>' +
				'</li>';
			var fn = _.template(templateString);

			return fn(template);

		};

		module.start = function () {

			module.assignMessages();
			module.render();
			module.assignEventHandlers();

		};

		module.assignMessages = function () {

		};

		module.render = function () {

			var $groupList = $('.groupList');
			var groupList = comeetingNotifier.groupList.get();
			var html = '';

			_.each(groupList, function (group) {
				group.unread_counts = group.unread_counts || '';
				html += module.tmpl(group);
			});

			$groupList.html(html);

		};

		module.assignEventHandlers = function () {

		};

		initialize();

		return module;

	};
	new Popup();

})();