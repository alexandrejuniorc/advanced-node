export interface LoadFacebookUserApi {
  loadUser: (token: LoadFacebookUserApi.Params) => Promise<LoadFacebookUserApi.Result>
}

export namespace LoadFacebookUserApi {
  export interface Params {
    token: string
  }
  export type Result = undefined | {
    facebookId: string
    email: string
    name: string
  }
}
