import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  phone: {
    description: 'Phone',
    validators: [
      validator('presence', true),
      validator('length', {
        min: 7,
        max: 13
      })
    ],
  },
  name: validator('presence', true),
  email: {
    description: "Email",
    validators: [
      validator('presence', true),
      validator('format', { type: 'email' })
    ]
  },
});

export default Model.extend(Validations, {
  name: attr(),
  phone: attr(),
  avatar: attr(),
  email: attr(),
  address: attr(),
  lat: attr(),
  lon: attr(),
  cachedAverageRating: attr('number', { defaultValue: 0.0 }),
  cachedTotalReviews: attr('number', { defaultValue: 0 }),
  reviews: hasMany('review'),
  schedules: hasMany('schedule'),
  images: attr(),
  currentUserHasOrders: attr('boolean', { defaultValue: false }),
  canReview: attr('boolean', { defaultValue: false }),
  balance: attr('number', { defaultValue: 0 }),

  getAvatar() {
    return this.get('avatar');
  }
});
