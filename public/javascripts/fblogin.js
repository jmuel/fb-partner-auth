window.fbAsyncInit = function() {
    FB.init({
      appId            : '139396274150780',
      autoLogAppEvents : true,
      xfbml            : true,
      version          : 'v6.0'
    });
  };

const pixel = 2556460854617705;

	
// FBE Config state
let fbeConfig = {};

//FBE Business Config
const extras = {
  setup: {
    external_business_id: 'test_id',
    timezone: 'America/Manaus',
    currency: 'USD',
    business_vertical: 'ECOMMERCE',
  },
  business_config: {
    business: {
      name: 'test_business',
    },
  },
  repeat: false,
};

FB.login(
    function(response) {
      console.log(response);
    },
    {
      scope: scopes,
      extras: extras,
    },
);
