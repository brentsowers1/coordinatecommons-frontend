export default function (placeType) {
  switch (placeType) {
    case 'us-state': 
    case 'mexico-state':
      return 'states';
    case 'canada-state':
      return 'provinces';
    case 'country':
      return 'countries';
  }
}
