import * as bcrypt from "bcrypt";

export class PasswordHash {
  public static generatePasswordHash(password: string, saltRounds: number): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }
}
