const bizSdk = require('facebook-nodejs-business-sdk');
const crypto = require('crypto');

const result = require('dotenv').config();

const partnerBusinessAdminAccessToken = process.env.BUSINESS_ADMIN_ACCESS_TOKEN;
const partnerBusinessId = process.env.BUSINESS_ID;
const appId = process.env.APP_ID;

const Business = bizSdk.Business;
const User = bizSdk.User;
const AdsPixel = bizSdk.AdsPixel;
const SystemUser = bizSdk.SystemUser;
const FacebookAdsApi = bizSdk.FacebookAdsApi;

async function generateClientSystemUserAccessToken(clientAccessToken, pixelId) {
    console.log(clientAccessToken);
    console.log(pixelId);
    const api = FacebookAdsApi.init(clientAccessToken);
    api.setDebug(true);
    const pixel = await new AdsPixel(pixelId).read([AdsPixel.Fields.owner_business]);
    const pixelBusiness = await new Business(pixel.owner_business.id);
    const result = await new Business(partnerBusinessId).createManagedBusiness(null, {existing_client_business_id: pixelBusiness.id});
    FacebookAdsApi.init(partnerBusinessAdminAccessToken);
    console.log("partner access token: ", partnerBusinessAdminAccessToken);
    const accessTokenResponse = await new Business(pixelBusiness.id).createAccessToken(null, {
        system_user_name: 'jamesttestuser1',
        scope: 'ads_read',
        app_id: appId,
    });
    const createdAccessToken = accessTokenResponse.access_token;
    const suAPI = FacebookAdsApi.init(createdAccessToken);
    const systemUser = await suAPI.call('GET', ['me']);
    FacebookAdsApi.init(clientAccessToken);
    const res = await new AdsPixel(pixelId).createAssignedUser(null, {tasks: ['EDIT'], user: systemUser.id})

    return createdAccessToken;
}
module.exports = generateClientSystemUserAccessToken;
