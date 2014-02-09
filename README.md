Pursuit Dictionary
======================
Pursuit is a fast Object Property Matching Language written for Node. It compiles a given query into JavaScript code for optimal performance when checking many objects for certain characteristics. All compiled functions returns a boolean value, making them useful in filter functions.

This project implements a set of functions used to build [Pursuit](http://https://github.com/gausby/pursuit).

This project is heavily inspired by [Mathias Buus](https://github.com/mafintosh)'s [CopenhagenJS](http://copenhagenjs.dk/) talk on [JSON query compilation](https://github.com/mafintosh/json-query-compilation).


## Usage
The following usage examples require the `pursuit` function to be build with [Pursuit Core](https://github.com/gausby/pursuit-core/) with the following configuration.

```javascript
var pursuitCore = require('pursuit-core');

var pursuit = pursuitCore({
    dictionary: require('pursuit-dictionary'),
    negation: '!not'
});
```

Get [Pursuit](https://github.com/gausby/pursuit/) if you just want to use pursuit with the standard configuration.


### `equals`
Will check for equality.

```javascript
var test = pursuit({
    foo: {
        equals: 5
    }
});

[{foo: 0}, {foo: 5}, {foo: 10}].filter(test); // [{foo: 5}]
```

Comparison can be done with any type that can be compared using the `===` operator.

```javascript
var test = pursuit({
    foo: {
        equals: 'bar'
    }
});

[{foo: 'foo'}, {foo: 'bar'}, {foo: 'baz'}].filter(test); // [{foo: 'bar'}]
```

### `greaterThan`
Will check if a number (or any other type that can be compared with the `>` operator) is greater than the compiled value.

```javascript
var test = pursuit({
    foo: { greaterThan: 5 }
});

[{foo: 0}, {foo: 5}, {foo: 10}].filter(test); // [{foo: 10}]
```

### `greaterThanOrEqualTo`
Will check if a number (or any other type that can be compared with the `>=` operator) is greater than, or equal to, the compiled value.

```javascript
var test = pursuit({
    foo: { greaterThanOrEqualTo: 5 }
});

[{foo: 0}, {foo: 5}, {foo: 10}].filter(test); // [{foo: 5}, {foo: 10}]
```

### `lessThan`
Will check if a number (or any other type that can be compared with the `<` operator) is less than the compiled value.

```javascript
var test = pursuit({
    foo: { lessThan: 5 }
});

[{foo: 0}, {foo: 5}, {foo: 10}].filter(test); // [{foo: 0}]
```

### `lessThanOrEqualTo`
Will check if a number (or any other type that can be compared with the `<=` operator) is less than, or equal to, the compiled value.

```javascript
var test = pursuit({
    foo: { lessThanOrEqualTo: 5 }
});

[{foo: 0}, {foo: 5}, {foo: 10}].filter(test); // [{foo: 0}, {foo: 5}]
```

### `contains`
Will check if a string contains the given value.

```javascript
var test = pursuit({
    foo: { contains: 'b' }
});

[{foo: 'abc'}, {foo: 'bac'}, {foo: 'acd'}].filter(test); // [{foo: 'abc'}, {foo: 'bac'}]
```

### `beginsWith`
Will check if a string begins with the given value.

```javascript
var test = pursuit({
    foo: { beginsWith: 'ba' }
});

[{foo: 'abc'}, {foo: 'bac'}, {foo: 'acd'}].filter(test); // [{foo: 'bac'}]
```

### `endsWith`
Will check if a string ends with the given value.

```javascript
var test = pursuit({
    foo: { endsWith: 'ac' }
});

[{foo: 'abc'}, {foo: 'bac'}, {foo: 'acd'}].filter(test); // [{foo: 'bac'}]
```

### `typeOf`
Will check if the input is of a certain JavaScript type.

```javascript
var test = pursuit({
    foo: { typeOf: 'string' }
});

[{foo: 'abc'}, {foo: 5}, {foo: false}].filter(test); // [{foo: 'abc'}]
```

It can check for the following types: `string`, `number`, `object`, `boolean`, `array`, and `null`.

The test for `object` does not return true for `null` values. At the time being `object` return true for arrays. I do not know if it should stay that way.


### `isSet`
Will check if the key is set to a value (everything but `null` or `undefined`) on an object; value can be `true` for set; and or `false` for not set.

```javascript
var test = pursuit({
    foo: { isSet: true },
    bar: { isSet: false }
});


[{foo: 1}, {bar: 2}, {foo: 3, bar: null}].filter(test) // [{foo: 1}, {foo: 3, bar: null}]
```

**Notice**, `isSet` will return true if the set value is set to anything but `undefined` or `null`. Falsy values like `0`, `false` and `""` (the empty string) will return `true`.


### `hasBeenTouched`
Will check if a key has been set on an object. It will return true even if the value is set to `undefined` or `null`. It will always return `true` (or `false` if set to check if a value has not been touched) if the key is the root object:

```javascript
var test = pursuit({ hasBeenTouched: true });
test(undefined); // true
```

It is more useful in nested objects.

```javascript
var test = pursuit({ foo: { hasBeenTouched: true }});
[{foo: null, bar: 1}, { bar: 1 }, {foo: 2}].filter(test); // [{foo: null, bar: 1}, {foo: 2}]
```

In most cases you would use the `isSet` function that return true for any value except undefined or null.


## Development
After cloning the project you will have to run `npm install` in the project root. This will install the various grunt plugins and other dependencies.


### QA tools
The QA tools rely on the [Grunt](http://gruntjs.com) task runner. To run any of these tools, you will need the grunt-cli installed globally on your system. This is easily done by typing the following in a terminal.

$ npm install grunt-cli -g

The unit tests will need the [Buster](http://busterjs.org/) unit test framework.

$ npm install -g buster

These two commands will install the buster and grunt commands on your system. These can be removed by typing `npm uninstall buster -g` and `npm uninstall grunt-cli -g`.


#### Unit Tests
If you haven't all ready install the Grunt CLI tools and have a look at the grunt configuration file in the root of the project.

When developing you want to run the script watcher. Navigate to the project root and type the following in your terminal.

$ grunt watch:scripts

This will run the jshint and tests each time a file has been modified.


#### Benchmarks
You can run the benchmarks by running `grunt benchmark`. This will output some simple benchmarks to `*project-root*/benchmark`.

The tests use a static data set, data.json, located in the benchmark folder. If you want a bigger data set a new one can be created by changing the number of times the random person generator is run in the `random-person.js`-file and run it by typing `node random-person.js` in a terminal.

Notice, these benchmarks are only usable if they are run on the same computer, because it measures the time a task takes. The parameters that could influence this vary from system to system. That said, if you run benchmarks once in a while, while trying to optimize the speed of the library, it should give you some insights. Some insights are better than none.


#### Generating Documentation
The project uses YUIDocs that can be generated by running `grunt docs`. This will create a site with documentation in a folder called `docs/` in the project root which can be served on port 8888 by typing `grunt connect:docs`. If you want to generate docs on file modification you can run `grunt watch:docs`.


## License
The MIT License (MIT)

Copyright (c) 2014 Martin Gausby

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
