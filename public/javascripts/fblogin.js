// Copyright 2004-present Facebook. All Rights Reserved.
const appId = '543434039867366';
const isDebugMode = true;
const scopes =
  'ads_management,ads_read,manage_business_extension,business_management';
const jsVersion = 'v6.0';


// FBE Config state
let fbeConfig = {};

const appSecret = 'dfee24d963c6937c1756d0ebe9c0aa6f';
function getHash(message){
    var hash = CryptoJS.HmacSHA256(message, appSecret);
    console.log('hash: ', hash);
    var hashInHex = CryptoJS.enc.Hex.stringify(hash);
    console.log('hash: ', hashInHex);
    return hashInHex;
};

window.fbAsyncInit = function() {
  // FB JavaScript SDK configuration and setup
  FB.init({
    appId: appId, // FB App ID
    cookie: true, // enable cookies to allow the server to access the session
    xfbml: false, // parse social plugins on this page
    version: jsVersion, // use graph api version
  });
};

// Load the JavaScript SDK asynchronously
(function(d, s, id) {
  var js,
    fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s);
  js.id = id;
  js.src = '//connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
})(document, 'script', 'facebook-jssdk');

// Facebook login with JavaScript SDK
function fbLogin() {
  FB.login(
    function(response) {
      console.log(response);
      const accessToken = response.authResponse.accessToken;
      const pixelID = document.getElementById("pixelID").value;
      fetch(`https://localhost:3000/ssapiSetup?token=${accessToken}&pixel=${pixelID}`)
      .then(response => response.json())
        .then(response => {
          console.log('access token', response);
          const tokenNode = document.getElementById('tokenOut');
          tokenNode.textContent = response;
          });
    },
    {
      scope: ['business_management','ads_management']
    },
  );
}
