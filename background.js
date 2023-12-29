

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnrvymSH1dWmvZ6uCV7GSzGPA8kMz4HW8",
  authDomain: "certify-a47d4.firebaseapp.com",
  databaseURL: "https://certify-a47d4.firebaseio.com",
  projectId: "certify-a47d4",
  storageBucket: "certify-a47d4.appspot.com",
  messagingSenderId: "700596544480",
  appId: "1:700596544480:web:6c7a96baf5fac1331c8185",
  measurementId: "G-SVT63EN3BL"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

var menu = [];

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.contentScriptQuery == 'menu') {
    menu = [];
    db.collection('menu')
      .orderBy('order', 'asc')
      .get()
      .then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          // doc.data() is never undefined for query doc snapshots
          menu.push({ id: doc.id, ...doc.data() });
        });

        sendResponse(menu);
      })
      .catch(function(error) {
        alert(error);
        sendResponse([]);
      });
  }

  if (request.contentScriptQuery == 'getPost') {
    sendResponse({ name: 'hello' });
  }

  if (request.contentScriptQuery == 'addPost') {
    alert('add: ' + request.postId);

    db.collection('posts')
      .doc(request.postId)
      .set({
        name: 'Tweet ID ' + request.postId,
        createAt: Date.now()
      })
      .then(function(docRef) {
        alert('succss');
        alert('Document written with ID: ', docRef);
        sendResponse(docRef);
      })
      .catch(function(error) {
        sendResponse(error);
      });
  }

  return true;
});
