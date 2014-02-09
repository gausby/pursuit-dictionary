/* global module require console */
'use strict';

var dictionary = require('../lib/pursuit-dictionary'),
    pursuitCore = require('pursuit-core'),
    testSet = require('./data.json')
;

var pursuit = pursuitCore({
    dictionary: dictionary,
    negation: '!not'
});

var pursuitNotOptimized = pursuitCore({
    dictionary: dictionary,
    negation: '!not',
    optimize: false
});


var query = [
    {
        'name': {
            'last': {
                beginsWith: 'P',
                endsWith: 'son'
            }
        },
        'age': {
            greaterThanOrEqualTo: 21,
            lessThan: 68
        },
        'gender': {
            equals: 'Female'
        },
        'occupation': { equals: 'Rehabilitation Services Director' }
    },
    {
        'name': { first: {equals: 'Ian' } },
        'age': { greaterThanOrEqualTo: 21, lessThan: 90 },
        'gender': { equals: 'Male' },
        'occupation': { contains: 'Business' }
    }
];

var optimized = pursuit(query);
var nonOptimized = pursuitNotOptimized(query);

module.exports = {
    name: 'Pursuit',
    onComplete: function() {
        console.log(
            'Optimized found:', testSet.filter(optimized).length,
            'Non-optimized found:', testSet.filter(nonOptimized).length
        );
    },
    tests: {
        'optimized': {
            fn: function() {
                testSet.filter(optimized);
                return;
            }
        },
        'non-optimized': {
            fn: function() {
                testSet.filter(nonOptimized);
                return;
            }
        }
    }
};
