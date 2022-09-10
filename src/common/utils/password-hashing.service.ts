import * as bcrypt from "bcrypt";

export class PasswordHash {
  public static generatePasswordHash(password: string): Promise<string> {
    return bcrypt.hash(password, Number(process.env["PASSWORD_SALT_ROUNDS"]));
  }
}
