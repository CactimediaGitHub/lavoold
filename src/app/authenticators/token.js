import config from 'lavo-mobile/config/environment';
import Ember from 'ember';
import TokenAuthenticator from 'ember-simple-auth-token/authenticators/token';

export default TokenAuthenticator.extend({
  pushNotification: Ember.inject.service(),
  init() {
    this._super(...arguments);

    this.set('serverTokenEndpoint', `${config.BACKEND.host}/signin`);
  },

  getAuthenticateData(credentials) {
    const authentication = {
      [this.passwordField]: credentials.password,
      [this.identificationField]: credentials.email
    };

    return {
      type: 'signin',
      data: {
        attributes: authentication
      }
    };
  },

  restore(properties) {
    const propertiesObject = Ember.Object.create(properties);

    return new Ember.RSVP.Promise((resolve, reject) => {
      if (!Ember.isEmpty(propertiesObject.get(this.tokenPropertyName))) {
        this.get('pushNotification').registerToken();
        resolve(properties);
      } else {
        reject();
      }
    });
  },
});
