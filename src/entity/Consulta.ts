import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Usuarios } from "./Usuarios";
@Entity()
export class Consulta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dor_cabeca: boolean;

  @Column()
  febre: boolean;

  @Column()
  nausea: boolean;

  @Column()
  campo_extra: string;

  @Column()
  especialidade: string;

  @Column()
  data_consulta: Date;

  @Column()
  horario: Date;

  @Column({ nullable: false, default: true })
  status: boolean;

  @Column()
  email: string;

  @Column({ nullable: false })
  usuariosId: number;
}
