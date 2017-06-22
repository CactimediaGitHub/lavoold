import Ember from 'ember';
import { FIXTURE_IMAGE } from 'lavo-mobile/constants';
const { Component, computed, Handlebars: { SafeString } } = Ember;

export default Component.extend({
  classNames: ['item'],
  attributeBindings: ['style'],

  vendor: null,
  style: computed('avatar', function() {
    return new SafeString(`background-image: url(${this.get('vendor').getAvatar() || FIXTURE_IMAGE })`);
  }),

  click() {
    if (this.attrs.onClick) {
      this.attrs.onClick();
    }
  }
});
