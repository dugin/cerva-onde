export class UserModel {

  constructor(public name: string,
              public email: string,
              public photoURL: string,
              public gender: string,
              public provider: string,
              public uid: string)
  {

  }
}
