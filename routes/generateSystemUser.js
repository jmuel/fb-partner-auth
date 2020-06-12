const bizSdk = require('facebook-nodejs-business-sdk');
const crypto = require('crypto');

const result = require('dotenv').config();

const partnerBusinessAdminAccessToken = process.env.BUSINESS_ADMIN_ACCESS_TOKEN;
const partnerBusinessId = process.env.BUSINESS_ID;
const appId = process.env.APP_ID;
const appSecret = process.env.APP_SECRET;

const Business = bizSdk.Business;
const User = bizSdk.User;
const AdsPixel = bizSdk.AdsPixel;
const SystemUser = bizSdk.SystemUser;
const FacebookAdsApi = bizSdk.FacebookAdsApi;

function generateHMAC(clientAccessToken) {
    return crypto.createHmac("sha256", appSecret).update(clientAccessToken).digest("hex");
}

async function generateClientSystemUserAccessToken(clientAccessToken, pixelId) {
    // initialize the api with the client's access token
    const api = FacebookAdsApi.init(clientAccessToken);
    api.setDebug(true);
    const pixel = await new AdsPixel(pixelId).read([AdsPixel.Fields.owner_business]);
    const pixelBusiness = await new Business(pixel.owner_business.id);
    // generate the OBO relationship with the client and partner business.
    const result = await new Business(partnerBusinessId).createManagedBusiness(null, {existing_client_business_id: pixelBusiness.id});

    FacebookAdsApi.init(partnerBusinessAdminAccessToken);
    // generate the OBO system user
    const accessTokenResponse = await new Business(pixelBusiness.id).createAccessToken(null, {
        system_user_name: 'Partner Created System User 2',
        scope: 'ads_read',
        app_id: appId,
    });
    const createdAccessToken = accessTokenResponse.access_token;
    // if we couldn't generate an access token pick a system user and do it manually.
    if (!createdAccessToken) {
        // switch back to the client's access token
        FacebookAdsApi.init(clientAccessToken);
        const systemUsers = await pixelBusiness.getSystemUsers([SystemUser.Fields.id]);
        if (!systemUsers || systemUsers.length === 0) {
            return {}; // if OBO didn't work and there's no system users then there's an error we haven't handled
        }
        // get a system user
        const systemUserId = systemUsers[0].id;
        // assign that system user to the pixel
        const res = await new AdsPixel(pixelId).createAssignedUser(null, {tasks: ['EDIT'], user: systemUserId});
        // generate an app proof
        const proof = generateHMAC(clientAccessToken);
        // generate the access token for the user
        const createdAccessToken = await new User(systemUserId).createAccessToken(null, {
            scope: 'ads_read',
            appsecret_proof: proof,
            business_app: appId,
        });
        return createdAccessToken.access_token;

    } else {
        const suAPI = FacebookAdsApi.init(createdAccessToken);

        const systemUser = await suAPI.call('GET', ['me']);
        FacebookAdsApi.init(clientAccessToken);
        const res = await new AdsPixel(pixelId).createAssignedUser(null, {tasks: ['EDIT'], user: systemUser.id});
        return createdAccessToken;
    }


}
module.exports = generateClientSystemUserAccessToken;
