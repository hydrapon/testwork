export class UserAuthDto {
  public readonly uid: string;
  public readonly email: string;

  constructor(uid: string, email: string) {
    this.uid = uid;
    this.email = email;
  }
}
