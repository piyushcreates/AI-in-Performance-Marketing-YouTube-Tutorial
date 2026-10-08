// Meta Pixel loader. Does nothing until metaPixelId is set in config.js.
(function () {
  var id = (window.SITE_CONFIG || {}).metaPixelId;
  window.track = function (event, params, eventId) {
    if (window.fbq) fbq("track", event, params || {}, eventId ? { eventID: eventId } : undefined);
    else if (window.console) console.debug("[track]", event, params || {});
  };
  window.trackCustom = function (event, params, eventId) {
    if (window.fbq) fbq("trackCustom", event, params || {}, eventId ? { eventID: eventId } : undefined);
    else if (window.console) console.debug("[trackCustom]", event, params || {});
  };
  if (!id) return;
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq("init", id);
  // Pixel's own PageView is fired by each page via track("PageView") so it fires exactly once.
  var ns = document.createElement("noscript");
  ns.innerHTML = '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=' + id + '&ev=PageView&noscript=1"/>';
  document.addEventListener("DOMContentLoaded", function () { document.body.appendChild(ns); });
})();
