export interface LoadUserAccountRepository {
  load: (params: LoadUserAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export interface Params {
    email: string
  }

  export type Result = undefined
}

export interface CreateFacebookAccountRepository {
  createFromFacebook: (params: CreateFacebookAccountRepository.Params) => Promise<LoadUserAccountRepository.Result>
}

export namespace CreateFacebookAccountRepository {
  export interface Params {
    facebookId: string
    email: string
    name: string
  }

  export type Result = undefined
}
