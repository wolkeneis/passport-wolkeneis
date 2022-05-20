import { Request } from "express-serve-static-core";
import OAuth2Strategy, { InternalOAuthError, StrategyOptionsWithRequest, VerifyFunctionWithRequest } from "passport-oauth2";

export interface WolkeneisStrategyOptionsWithRequest extends StrategyOptionsWithRequest {
  userProfileUrl: string;
}

export default class WolkeneisStrategy extends OAuth2Strategy {
  private _userProfileUrl: string;

  constructor(options: WolkeneisStrategyOptionsWithRequest, verify: VerifyFunctionWithRequest) {
    options.authorizationURL = options.authorizationURL ?? "https://moos.wolkeneis.dev/oauth2/authorize";
    options.tokenURL = options.tokenURL ?? "https://moos.wolkeneis.dev/oauth2/token";
    options.scopeSeparator = options.scopeSeparator ?? " ";

    super(options, verify);

    this.name = "wolkeneis";
    this._userProfileUrl = options.userProfileUrl || "https://moos.wolkeneis.dev/api/v1/application/profile";
  }

  authenticate(request: Request, options?: any) {
    if (request.query && request.query.denied) {
      return this.fail();
    }
    super.authenticate(request, options);
  }

  userProfile(accessToken: string, done: (error?: Error | null, profile?: any) => void): void {
    this._oauth2.get(this._userProfileUrl, accessToken, (error, body) => {
      if (error) {
        return done(new InternalOAuthError("Failed to fetch the user profile.", error));
      }

      let data: any;
      try {
        data = JSON.parse(body as string);
      } catch (error) {
        return done(new Error("Failed to parse the user profile."));
      }

      const profile = data;
      profile.provider = "wolkeneis";
      profile.fetchedAt = Date.now();
      return done(null, profile);
    });
  }
}
