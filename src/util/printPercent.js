export default function (portion, total) {
  return ((portion / total) * 100).toFixed(2) + '%';
}
