export class TokenReponseDto {
  constructor(accessToken: string) {
    this.token = accessToken;
  }

  readonly token: string;
  readonly expire: number = Number(process.env["ACCESS_TOKEN_TTL"]);
}
