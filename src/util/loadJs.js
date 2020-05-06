export default function (src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.crossorigin = true;
  ref.parentNode.insertBefore(script, ref);
}
