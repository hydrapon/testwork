export class JwtPayloadDto {
  readonly uid: string;

  constructor(uid: string) {
    this.uid = uid;
  }
}
