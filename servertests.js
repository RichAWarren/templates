const tape = require('tape');
const shot = require('shot');
const handler = require('../src/handler.js');
const makePost = require('../src/makePost.js');
const getPost = require('../src/getPost.js');
const createUserRecord = require('../src/createUserRecord.js');


tape('tests for / endpoint', t => {
  shot.inject(handler, { method: 'get', url: '/' }, (res) => {
    t.equal(res.statusCode, 200, '/ has status code of 200');
    t.ok(res.payload.includes('<title>dashbird</title>'), 'finds the correct file (Website)');
    t.equal(res.headers['Content-Type'], 'text/html', 'response type is html');
    t.end();
  });
});

tape('Test post function', t => {
  let postIdToTest = null;

  const fakePost = {
    date: 'Wed Jul 13 2016 08:54:44 GMT 0100 (BST)',
    text: 'I hope we can get our app working by #Friday',
    hashtags: '#Friday'
  }

  makePost(fakePost, setPostIdToTest);

  function setPostIdToTest (postid) {
    postIdToTest = postid;
    getPost.getPostById(postIdToTest, function(post){
      t.deepEqual(post,
        { date: new Date('Wed Jul 13 2016'),
          hashtags: '#Friday',
          postid: postIdToTest,
          text: 'I hope we can get our app working by #Friday',
          time: '08:54:44',
          username: null },
      'makePost should send a post to the database');
      t.end();
    });
  }
});

tape('if new user gets created', t => {
  const randomUserName = String(Math.random());

  const fakeUser = {
    userName: randomUserName,
    email: 'a@g.com',
    password: 'isanidiot'
  }

  createUserRecord(fakeUser, testUserName);

  function testUserName(userName) {
    t.equal(userName, fakeUser.userName, 'usernames match');
    t.end();
  }

})

tape('checking if the same user name can be added twice', t => {
  const randomUserName = String(Math.random());

  const fakeUser = {
    userName: randomUserName,
    email: 'a@g.com',
    password: 'isanidiot'
  }

  const errorMessage = `Key (username)=(${randomUserName}) already exists.`;
  createUserRecord(fakeUser, function(){});
  createUserRecord(fakeUser, checkDuplicates);

  function checkDuplicates(reply) {
    t.equals(reply.detail, errorMessage, 'no duplicates in the username column');
    t.end();
  }

})

// tape('Test get function', t => {
//   let postIds = [];
//
//   const fakePostArray = [{
//     date: 'Wed Jul 13 2016 08:54:44 GMT 0100 (BST)',
//     text: 'I hope we can get our app working by #Friday',
//     hashtags: '#Friday'
//   },{
//     date: 'Wed Jul 13 2016 08:54:44 GMT 0100 (BST)',
//     text: 'I hope we can get our app working by #Friday',
//     hashtags: '#Friday'
//   },{
//     date: 'Wed Jul 13 2016 08:54:44 GMT 0100 (BST)',
//     text: 'I hope we can get our app working by #Friday',
//     hashtags: '#Friday'
//   },{
//     date: 'Wed Jul 13 2016 08:54:44 GMT 0100 (BST)',
//     text: 'I hope we can get our app working by #Friday',
//     hashtags: '#Friday'
//   },{
//     date: 'Wed Jul 13 2016 08:54:44 GMT 0100 (BST)',
//     text: 'I hope we can get our app working by #Friday',
//     hashtags: '#Friday'
//   }]
//
//   fakePostArray.forEach(function(post){
//     makePost(post, setPostIdsToRetrieve);
//   });
//
//   function setPostIdToTest (postid) {
//     postIdToTest = postid;
//     getPostById(postIdToTest, function(post){
//       t.deepEqual(post,
//         { date: new Date('Wed Jul 13 2016'),
//           hashtags: '#Friday',
//           postid: postIdToTest,
//           text: 'I hope we can get our app working by #Friday',
//           time: '08:54:44',
//           username: null },
//       'makePost should send a post to the database');
//       t.end();
//     });
//   }
// });
