import Ember from 'ember';
import AuthenticatedGuestRouteMixin from 'lavo-mobile/mixins/authenticated-guest-route-mixin';
const { Route } = Ember;

export default Route.extend(AuthenticatedGuestRouteMixin, {
  model() {
    return {
        newOrdersCount: 0,
        historyOrdersCount: 0,
        activeOrdersCount: 0
    };
  },
  actions: {
    goBack() {
      window.history.go(-1);
    }
  }
});
