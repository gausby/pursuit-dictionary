/*jslint maxlen:140*/
/* global require */
'use strict';

var buster = require('buster'),
    dictionary = require('../lib/pursuit-dictionary'),
    pursuitCore = require('pursuit-core')
;

var assert = buster.assert;
var refute = buster.refute;

var pursuit = pursuitCore({
    dictionary: dictionary
});

buster.testCase('The default dictionary', {
    'should be able to check if a key has been touched on an object': function () {
        // by 'touched' we mean 'set to something,' so {foo: null} and {foo: undefined}
        // would return true, where checking if foo is something in the object {bar: 1}
        // would return false.
        var test = [
            {bar: 1}, {foo: 9}, {bar: 0},
            {foo: null}, { foo: undefined }, {foo: ''}
        ];

        assert.equals(
            test.filter(pursuit({foo: {hasBeenTouched: true}})),
            [{foo: 9}, {foo: null}, { foo: undefined }, {foo: ''}]
        );

        assert.equals(
            test.filter(pursuit({foo: {hasBeenTouched: false}})),
            [{bar: 1}, {bar: 0}]
        );

        assert.equals(
            [1, 9, 0, null, undefined, ''].filter(pursuit({hasBeenTouched: true})),
            [1, 9, 0, null, undefined, '']
        );
    },

    'should be able to check if an value has been set on a key (ie: not null or undefined)': function () {
        assert.equals(
            [1, 9, 0, null, undefined, ''].filter(pursuit({isSet: true})),
            [1, 9, 0, '']
        );
        assert.equals(
            [1, 9, 0, null, undefined, ''].filter(pursuit({isSet: false})),
            [null, undefined]
        );
    },

    'should be able to check for equality': function () {
        var query = pursuit({
            foo: { equals: 'bar' }
        });

        assert.isTrue(query({'foo': 'bar'}));
        refute.isTrue(query({'foo': 'baz'}));
    },

    'should be able to test for values greater than': function () {
        var query = pursuit({
            foo: { greaterThan: 5 }
        });

        assert.isTrue(query({'foo': 10}));
        assert.isTrue(query({'foo': 5.01}));
        refute.isTrue(query({'foo': 5}));
        refute.isTrue(query({'foo': 4}));
    },

    'should be able to test for values greater than or equal to': function () {
        var query = pursuit({
            foo: { greaterThanOrEqualTo: 5 }
        });

        assert.isTrue(query({'foo': 5.01}));
        assert.isTrue(query({'foo': 5}));
        refute.isTrue(query({'foo': 4}));
        refute.isTrue(query({'foo': 0}));
    },

    'should be able to test for values less than': function () {
        var query = pursuit({
            foo: { lessThan: 5 }
        });

        assert.isTrue(query({'foo': 1}));
        assert.isTrue(query({'foo': 4.99}));
        refute.isTrue(query({'foo': 5}));
        refute.isTrue(query({'foo': 10}));
    },

    'should be able to test for values less than or equal to': function () {
        var query = pursuit({
            foo: { lessThanOrEqualTo: 5 }
        });

        assert.isTrue(query({'foo': 0}));
        assert.isTrue(query({'foo': 1}));
        assert.isTrue(query({'foo': 4.99}));
        assert.isTrue(query({'foo': 5}));
        refute.isTrue(query({'foo': 5.000001}));
        refute.isTrue(query({'foo': 10}));
    },

    'should be able to test if a string contains a specified substring': function () {
        var query = pursuit({
            foo: { contains: 'b' }
        });

        assert.isTrue(query({'foo': 'abc'}));
        assert.isTrue(query({'foo': 'cab'}));
        assert.isTrue(query({'foo': 'bac'}));
        refute.isTrue(query({'foo': 'acd'}));
    },

    'should be able to test if a string starts with a given string': function () {
        var query = pursuit({
            foo: { beginsWith: 'b' }
        });

        var query2 = pursuit({
            foo: { beginsWith: 'zebra' }
        });

        assert.isTrue(query({'foo': 'banana'}));
        assert.isTrue(query({'foo': 'balloons are fun'}));
        assert.isTrue(query({'foo': 'back in the bay area'}));
        assert.isTrue(query2({'foo': 'zebras can handle quite some attention from other zebras.'}));
        refute.isTrue(query({'foo': 'apples are healthy'}));
        refute.exception(function() { query({'baz': 'foo'}); });
    },

    'should be able to test if a value is of a specific type': function () {
        var isString = pursuit({ foo: { typeOf: 'string' }});
        assert.isTrue(isString({'foo': 'banana'}));
        refute.isTrue(isString({'foo': (new Date())}));
        refute.isTrue(isString({'foo': 5}));

        var isNumber = pursuit({ foo: { typeOf: 'number' } });
        assert.isTrue(isNumber({'foo': 5}));
        assert.isTrue(isNumber({'foo': 0}));

        var isObject = pursuit({ foo: { typeOf: 'object' } });
        assert.isTrue(isObject({'foo': []}));
        assert.isTrue(isObject({'foo': {}}));

        refute.isTrue(isObject({'foo': 1}));
        refute.isTrue(isObject({'foo': null}));
        refute.isTrue(isObject({'foo': undefined}));

        var isBoolean = pursuit({ foo: { typeOf: 'boolean' } });
        assert.isTrue(isBoolean({foo: true}));
        assert.isTrue(isBoolean({foo: false}));

        var isUndefined = pursuit({ foo: { typeOf: 'undefined' } });
        assert.isTrue(isUndefined({foo: undefined}));
        refute.isTrue(isUndefined({foo: null}));

        var isArray = pursuit({ foo: { typeOf: 'array' } });
        assert.isTrue(isArray({foo: [undefined]}));
        refute.isTrue(isArray({foo: {}}));

        var isNull = pursuit({ foo: { typeOf: 'null' } });
        assert.isTrue(isNull({foo: null}));
        refute.isTrue(isNull({foo: undefined}));
        refute.isTrue(isNull({foo: {}}));
    },

    'should be able to test if a string ends a specified substring': function () {
        var query = pursuit({
            foo: { endsWith: 'ab' }
        });

        var query2 = pursuit({
            foo: { endsWith: 'zebra' }
        });

        assert.isTrue(query({'foo': 'bab'}));
        assert.isTrue(query({'foo': 'ab'}));
        assert.isTrue(query({'foo': 'foo zab'}));
        refute.isTrue(query({'foo': 'foo'}));

        assert.isTrue(query2({'foo': 'I wish I had a zebra'}));
    }
});
