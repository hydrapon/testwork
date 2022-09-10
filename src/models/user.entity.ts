import { Column, Entity, Index, JoinTable, ManyToMany, OneToMany, PrimaryColumn } from "typeorm";

import { TagEntity } from "./tag.entity";

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

  @OneToMany(() => TagEntity, (tag) => tag.creator)
  userTags: TagEntity[];

  @ManyToMany(() => TagEntity, (tag) => tag.creator, { cascade: ["insert", "remove"] })
  @JoinTable({
    name: "user_tag",
    joinColumns: [{ name: "user_uid", referencedColumnName: "uid" }],
    inverseJoinColumns: [{ name: "tag_id", referencedColumnName: "id" }],
    schema: "public",
  })
  tags: TagEntity[];
}
