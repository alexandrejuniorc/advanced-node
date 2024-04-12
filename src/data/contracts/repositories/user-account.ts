export interface LoadUserAccountRepository {
  load: (
    params: LoadUserAccountRepository.Params
  ) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export interface Params {
    email: string
  }

  export type Result =
    | undefined
    | {
      id: string
      name?: string
    }
}

export interface SaveFacebookAccountRepository {
  saveWithFacebook: (
    params: SaveFacebookAccountRepository.Params
  ) => Promise<LoadUserAccountRepository.Result>
}

export namespace SaveFacebookAccountRepository {
  export interface Params {
    id?: string
    facebookId: string
    email: string
    name: string
  }

  export type Result = undefined
}
