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

export const getPlaceTypeLastWordSingular = (placeType) => {
  switch (placeType) {
    case 'us-state': 
    case 'mexico-state':
      return 'state';
    case 'canada-state':
      return 'province';
    case 'country':
      return 'country';
    default:
      return '';
  }  
}

export const getFullProperPlaceType = (placeType, capitalize) => {
  switch (placeType) {
    case 'us-state': 
      return capitalize ? 'US States' : 'US states';
    case 'mexico-state':
      return capitalize ? 'Mexican States' : 'Mexican states';
    case 'canada-state':
      return capitalize ? 'Canadian Provinces' : 'Canadian provinces';
    case 'country':
      return capitalize ? 'Countries' : 'countries';
    default:
      return '';
  }  
}

export const getYouveOrUserHas = (username, capitalize) => {
  return !username || username === 'my' ? (capitalize ? 'You\'ve' : 'you\'ve') : username + ' has';
}
