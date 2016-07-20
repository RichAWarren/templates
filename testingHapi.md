### Testing with Lab

If you're new to Testing Driven Development (**TDD**) read: https://github.com/dwyl/learn-tdd (_first_)  
and then come back to this tutorial!

If you've done functional or unit testing in previous
programming projects you will be at home with Lab.

Lab borrows *heavily* from [Mocha](https://github.com/mochajs/mocha),
so if you followed our
[learn-mocha](https://github.com/docdis/learn-mocha) tutorial this should all be familiar.

(Using the code we wrote above in the **Validation with Joi** section with a minor addition)
An example of testing with Lab:

```js
var Lab = require("lab");           // load Lab module
var lab = exports.lab = Lab.script(); //export test script
var Code = require("code");		 //assertion library
var server = require("../index.js"); // our index.js from above

lab.experiment("Basic HTTP Tests", function() {
	// tests
	lab.test("GET /{yourname*} (endpoint test)", function(done) {
		var options = {
			method: "GET",
			url: "/Timmy"
		};
		// server.inject lets you similate an http request
		server.inject(options, function(response) {
			Code.expect(response.statusCode).to.equal(200);  //  Expect http response status code to be 200 ("Ok")
			Code.expect(response.result).to.have.length(12); // Expect result to be "Hello Timmy!" (12 chars long)
			server.stop(done);  // done() callback is required to end the test.
		});
	});
});
```
First we create a *test suite* for our test **Lab.experiment**
(the _first argument_ is the name of of the test suite "Basic HTTP Tests")

Next is a basic test that calls the only route we have `/{yourname}`
in this case **GET /Timmy**.  
We expect to receive a **200** http status code and the response body to be
the text "Hello Timmy!".

1. Create a **new directory** in your project called **test**
2. Create a **new file** called **test.js** in the **./test** dir
3. Type out or copy-paste the above code into **test.js**
4. Open your package.json file
5. Add a **scripts** section to the package.json file with the following:
```
  "scripts": {
    "test": "lab -c"
  }
```
6. Save the package.json file
7. run the **npm test** script from your command line to execute the tests

The result should look something like this:

<img width="287" alt="Hapi testing with Lab 100% coverage" src="https://cloud.githubusercontent.com/assets/4185328/10119715/6232f530-6495-11e5-86ef-17d2bd61795a.png">

Note how the test script has a ** -c** flag above
this give us the **code coverage**.

We have **100% code coverage** so we can move on to our next test!

> How do you think we would write a test for an error?
> (hint: have a look inside ./test/test.js and see the second test :)

### Note on Testing: Tape is Simpler than Lab+Code

> *While* ***Lab*** *is really* ***Good*** *and is the "official" testing
framework used by Hapi*, *we* ***prefer***  
*the* ***simplicity***
> *of* [***tape***](https://github.com/substack/tape);
> we find our tests are simpler to write/read/understand. #YMMV
> Also we *prefer* to use a *separate* & *specialised* module for tracking
test coverage: [istanbul](https://github.com/dwyl/learn-istanbul)
which we find does a [better job](https://github.com/hapijs/lab/issues/401) at tracking coverage...

The preceding `Lab` test can be re-written (*simplified*) in `Tape` as:

```js
var test   = require('tape');
var server = require("../index.js"); // our index.js from above

test("Basic HTTP Tests - GET /{yourname*}", function(t) { // t
	var options = {
		method: "GET",
		url: "/Timmy"
	};
	// server.inject lets you similate an http request
	server.inject(options, function(response) {
		t.equal(response.statusCode, 200);  //  Expect http response status code to be 200 ("Ok")
		t.equal(response.result.length, 12); // Expect result to be "Hello Timmy!" (12 chars long)
		server.stop(t.end); // t.end() callback is required to end the test in tape
	});
});
```
These tests are *functionally equivalent* in that they test *exactly* the
same *outcome*. Decide for yourself which one you prefer for readability
and maintainability in your projects.
