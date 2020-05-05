export const getPlaceTypeLastWord = (placeType) => {
  switch (placeType) {
    case 'us-state': 
    case 'mexico-state':
      return 'states';
    case 'canada-state':
      return 'provinces';
    case 'country':
      return 'countries';
    default:
      return '';
  }
}

export const getFullProperPlaceType = (placeType) => {
  switch (placeType) {
    case 'us-state': 
      return 'US States';
    case 'mexico-state':
      return 'Mexican Sates';
    case 'canada-state':
      return 'Canadian Provinces';
    case 'country':
      return 'Countries';
    default:
      return '';
  }  
}
