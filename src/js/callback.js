/**
 * @fileoverview Save to localstorage token when redirecting.
 * @copyright mitsuruog 2013
 * @author mitsuruog <mitsuru.ogawa.jp@gmail.com>
 * @license MIT
 *
 * @module js/callback.js
 */
(function () {
	'use strict';

	var Callback = function(){

		var module = {};
		var bg = chrome.extension.getBackgroundPage().bg;
		var comeetingNotifier = chrome.extension.getBackgroundPage().comeetingNotifier;

		function initialize () {

			window.addEventListener("load", function (e) {
				module.start();
			});

		}

		module.start = function () {

			module.assignMessages();
			module.assignEventHandlers();

		};

		module.assignMessages = function () {

			if(!location.href.match(/code=(\S*)/)) {
				throw new Error('Authorization Code is empty');
			}

			var code =  location.href.match(/code=(\S*)/)[1];
			//TODO need wapper
			comeetingNotifier.claimAccessToken(code);

		};

		module.assignEventHandlers = function () {

			//タブを閉じる
			$('.js-authenticated-close').on('click',function(e){
				e.preventDefault();
				chrome.tabs.getCurrent(function(tab) {
					chrome.tabs.remove(tab.id, function() { });
				});
			});

		};

		initialize();

		return module;

	};
	new Callback();

})();