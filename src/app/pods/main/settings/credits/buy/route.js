import Ember from 'ember';
import {ROUTE_SETTINGS_CREDITS, ROUTE_SETTINGS_CREDITS_FAILURE} from 'lavo-mobile/constants';

const {get, set, Route, inject: {service}, RSVP} = Ember;

export default Route.extend({
  ajax: service(),
  state: service(),

  model() {
    return RSVP.hash({
      cards: this.store.findAll('card'),
      credits: 0,
      selectedCard: null,
      card: null
    });
  },
  rejectResponse(message){
    return {
      data: {
        attributes: {
          ['response-message']: message
        }
      }
    }
  },
  actions: {
    decrementCredit(model) {
      const value = (get(model, 'credits')) - 100;

      set(model, 'credits', value > 0 ? value : 0);
    },

    incrementCredit(model) {
      set(model, 'credits', (get(model, 'credits')) + 100);
    },

    selectCard(model, card, value) {
      set(model, 'card', value ? card : null);
    },

    removeCard(model, card) {
      let confirm = get(this, 'dialogWindow.confirm');
      confirm(`Do you want to remove card "${get(card, 'nick')}"?`).then((answer) => {
        if (answer) {
          card.destroyRecord();
        }
      })
    },


    buy(model) {
      const ajax = get(this, 'ajax');
      const {credits, card} = model;
      let prompt = get(this, 'dialogWindow.prompt');
      let alert = get(this, 'dialogWindow.alert')
      switch (true) {
        case !card:
          return alert('No card is selected');
        case credits <= 0:
          return alert('The amount of credits should be more than 0');
      }
      let cvv;
      let pay = (cvv) => {
        if (Ember.isEmpty(cvv)) {
          set(this, 'state.isPending', false);
          return alert('No CVV value provided');
        }
        ajax.post('/purchases', {
          data: {
            type: 'payment-gateway-purchases',
            data: {
              attributes: {
                ['card-token']: get(card, 'token'),
                ['credits-amount']: credits,
                ['card-verification-value']: cvv
              }
            }
          }
        })
          .then((data) => {
            const deferred = RSVP.defer();
            const url = get(data, 'data.attributes.confirmation-url');

            if (!url) {
              if (get(data, 'data.attributes.response-code') === "00044") {
                return card.destroyRecord().then(() => {
                  return RSVP.reject(this.rejectResponse('Your card information is expired.'));
                });
              }
              return RSVP.reject(this.rejectResponse('Confirmation Url is expired'));
            }

            if (!cordova.InAppBrowser) {
              console.error('[ERROR] to test payments, use mobile app.');
            }
            const inAppBrowserRef = cordova.InAppBrowser.open(url, '_blank', 'location=no,hidden=yes');
            inAppBrowserRef.addEventListener('loadstart', (event)=> {
              if (event.url.match("payments/completion")) {
                inAppBrowserRef.close();

                ajax.request(event.url).then((data)=> {
                  let responseCode = get(data, 'data.attributes.response-code');
                  if (responseCode == 14000) {
                    deferred.resolve(data);
                  } else {
                    deferred.reject(data);
                  }
                }).catch((data) => deferred.reject(data));
              }
            });

            inAppBrowserRef.addEventListener('loadstop', ()=> {
              Ember.run.next(() => {
                inAppBrowserRef.executeScript({code: 'localStorage.setItem( "isCard", document.getElementById("card") );localStorage.getItem("isCard")'}, (params) => {
                  if (params[0] !== "null") {
                    inAppBrowserRef.show();
                  }
                });
              });
            });

            return deferred.promise;
          })
          .then((data) => {
            this.transitionTo(ROUTE_SETTINGS_CREDITS);
          })
          .catch((data) => {
            this.transitionTo(ROUTE_SETTINGS_CREDITS_FAILURE, {queryParams: {errorMessage: get(data, 'data.attributes.response-message')}});
          })
          .finally(() => {
            set(this, 'state.isPending', false);
          });
      }

      set(this, 'state.isPending', true);
      if (!get(card, 'firstPurchase')) {
        prompt('Enter CVV for your card').then(pay);
      } else {
        pay(true);
      }
    }
  }
});
