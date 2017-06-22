import Ember from 'ember';

const { get, isEqual } = Ember;
const countryTypes = JSON.stringify(["country", "political"]);
const cityTypes = JSON.stringify(["locality", "political"]);

export default function parseGeocodingResponse(response) {
  let city, country;

  get(response, 'results.0.address_components').forEach( component => {
    if(isEqual(JSON.stringify(get(component, 'types')), countryTypes)) {
      country = get(component, 'short_name');
    }
    if(isEqual(JSON.stringify(get(component, 'types')), cityTypes)) {
      city = get(component, 'short_name');
    }
  });

  return city?`${city}, ${country}`:country;
}
