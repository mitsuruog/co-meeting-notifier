var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-42722699-1']);
_gaq.push(['_trackPageview']);

(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = 'https://ssl.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

/* send error message
 * Thanks for @yoheiMune
 * http://www.yoheim.net/blog.php?q=20130703
 * @param message
 * @param fileName
 * @param lineNumber
 */
window.onerror = function (message, fileName, lineNumber) {

	var sendMessage = 'message:' + message +
		', fileName:' + fileName +
		', line:' + lineNumber +
		', href:' + location.href +
		', userAgent:' + window.navigator.userAgent;

	_gaq.push(['_trackEvent', 'JSError', sendMessage]);

};