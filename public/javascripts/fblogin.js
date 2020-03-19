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
    external_business_id: externalBusinessId,
    timezone: timezone,
    currency: currency,
    business_vertical: businessVertical,
  },
  business_config: {
    business: {
      name: defaultBusinessName,
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
