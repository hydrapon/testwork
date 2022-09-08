import { Column, Entity, Index, PrimaryColumn } from "typeorm";

@Index("uni_m_email", ["email"], { unique: true })
@Index("uni_m_nickname", ["nickname"], { unique: true })
@Index("uni_m_uid", ["uid"], { unique: true })
@Entity("user", { schema: "public" })
export class UserEntity {
  @PrimaryColumn({ type: "uuid", name: "uid" })
  uid: string;

  @Column("character varying", { name: "email", length: 100 })
  email: string;

  @Column("character varying", { name: "password", length: 100 })
  password: string;

  @Column("character varying", { name: "nickname", length: 30 })
  nickname: string;
}
