export class ShopifyUrlHelper {
    static getSignInUrl(redirectUrl: string, customerId: string, idpIdentifier: string, userAccessToken: string): string {
        return `https://store.xecurify.com/moas/broker/login/jwt/callback/${customerId}/${idpIdentifier}/${userAccessToken}?relay=https://store.xecurify.com/moas/broker/login/shopify/https://optimallyme.myshopify.com/account?redirect_endpoint=${redirectUrl}`;
    }
}