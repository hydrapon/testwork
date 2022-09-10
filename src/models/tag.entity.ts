import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { UserEntity } from "./user.entity";

@Index("uni_m_id", ["id"], { unique: true })
@Index("uni_tag_name", ["name"], { unique: true })
@Entity("tag", { schema: "public" })
export class TagEntity {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("character varying", { name: "name", length: 40 })
  name: string;

  @Column("integer", { name: "sortOrder", default: () => 0 })
  sortOrder: number;

  @ManyToOne(() => UserEntity, (user) => user.uid)
  @JoinColumn([{ name: "creator", referencedColumnName: "uid" }])
  creator: UserEntity;
}
