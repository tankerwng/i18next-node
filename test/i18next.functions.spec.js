//////////////////////
// HINT
//
// you need to replace 'fetchOne' with 'fetchOne' to use this on server
//

var i18n = require('../index')
  , expect = require('expect.js')
  , sinon = require('sinon');

describe('i18next.functions', function() {

  var opts;

  beforeEach(function(done) {
    opts = {
      lng: 'en-US',
      fallbackLng: 'dev',
      load: 'all',
      preload: [],
      supportedLngs: [],
      lowerCaseLng: false,
      ns: 'translation',
      fallbackToDefaultNS: false,
      resGetPath: 'test/locales/__lng__/__ns__.json',
      resSetPath: 'test/locales/__lng__/new.__ns__.json',
      saveMissing: false,
      resStore: false,
      getAsync: false,
      returnObjectTrees: false,
      interpolationPrefix: '__',
      interpolationSuffix: '__',
      postProcess: '',
      debug: false
    };

    i18n.init(opts, function(t) {
      i18n.sync.resStore = {};
      done();
    });
  });

  describe('setting language', function() {
  
    beforeEach(function(done) {
      i18n.init(i18n.functions.extend(opts, {
        resStore: {
          'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } },
          'de-DE': { translation: { 'simpleTest': 'ok_from_de-DE' } }
        }
      }), function(t) { done(); } );
    });
  
    it('it should provide resources for set language', function(done) {
      expect(i18n.t('simpleTest')).to.be('ok_from_en-US');
  
      i18n.setLng('de-DE', function(t) {
          expect(t('simpleTest')).to.be('ok_from_de-DE');
          done();
      });
  
    });
  
  });

  describe('preloading multiple languages', function() {
  
    var spy; 
  
    beforeEach(function(done) {
      spy = sinon.spy(i18n.sync, 'fetchOne');
      i18n.init(opts, function(t) { done(); });
    });
  
    afterEach(function() {
      spy.restore();
    });
  
    it('it should preload resources for languages', function(done) {
      spy.reset();
      if (i18n.sync.resStore) i18n.sync.resStore = {}; // to reset for test on server!
      i18n.preload('de-DE', function(t) {
        expect(spy.callCount).to.be(5); // en-US, en, de-DE, de, dev
        done();
      });
  
    });
  
  });

  describe('postprocessing tranlation', function() {
  
    describe('having a postprocessor', function() {
  
      before(function(){
        i18n.addPostProcessor('myProcessor', function(val, key, opts) {
          return 'ok_from_postprocessor';
        });
      });
  
      beforeEach(function(done) {
        i18n.init(i18n.functions.extend(opts, {
          resStore: {
            'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } },
            'de-DE': { translation: { 'simpleTest': 'ok_from_de-DE' } }
          }
        }), function(t) { done(); } );
      });
  
      it('it should postprocess the translation by passing in postProcess name to t function', function() {
        expect(i18n.t('simpleTest', {postProcess: 'myProcessor'})).to.be('ok_from_postprocessor');
      });
  
      describe('or setting it as default on init', function() {
  
        beforeEach(function(done) {
          i18n.init(i18n.functions.extend(opts, {
            resStore: {
              'en-US': { translation: { 'simpleTest': 'ok_from_en-US' } },
              'de-DE': { translation: { 'simpleTest': 'ok_from_de-DE' } }
            },
            postProcess: 'myProcessor'
          }), function(t) { done(); } );
        });
  
        it('it should postprocess the translation by default', function() {
          expect(i18n.t('simpleTest')).to.be('ok_from_postprocessor');
        });
  
      });
  
    });
  
  });

  // functions/functions.postmissing.spec.js

});