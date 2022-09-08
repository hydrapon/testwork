import { Request } from "express";

import { UserAuthDto } from "../dto/user-auth.dto";

export interface IUserAuthRequest extends Request {
  user: UserAuthDto;
}
