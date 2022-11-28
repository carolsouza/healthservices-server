import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Usuarios } from "./Usuarios";


@Entity()
export class Resultados {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dataCad: Date;

  @Column()
  idTriagem: number;

  @Column()
  gravidade: string;

  @Column()
  especialidade: string;

  @Column()
  localidade: string;

}
