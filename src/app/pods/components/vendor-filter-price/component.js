import Ember from 'ember';

const { get, Component } = Ember;

export default Component.extend({
  sort: null,
  routeName: null,
  items: null,
  services: null,
  selectedItemId: null,
  selectedServiceId: null,

  actions: {
    done() {
      get(this, 'done')(this.getProperties('sort', 'routeName', 'selectedItemId', 'selectedServiceId'));
    }
  }
});
