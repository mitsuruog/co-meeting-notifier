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

	var comeetingNotifier = new ComeetingNotifier();

	if (location.href.match(/code=(\S*)/)) {

		var code = location.href.match(/code=(\S*)/)[1];

		comeetingNotifier.claimAccessToken(code);

	}

})();