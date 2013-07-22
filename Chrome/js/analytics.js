(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
	(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-42623492-1', 'co-meeting-notifier.com');
ga('send', 'pageview');

/**
 * send error message
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

	ga('send', 'event', 'error', 'JSError', {'message': sendMessage});
};