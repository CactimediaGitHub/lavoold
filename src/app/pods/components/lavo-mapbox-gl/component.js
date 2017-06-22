import MapboxGL from 'ember-cli-mapbox-gl/components/x-mapbox-map';

export default MapboxGL.extend({
  willDestroyElement() {
    const cnv = this.$('canvas')[0];
    const gl = cnv.getContext('webgl');
    gl.getExtension('WEBGL_lose_context').loseContext();
    this._super(...arguments);
  }
});
