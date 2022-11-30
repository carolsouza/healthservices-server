import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from "typeorm";
import { Usuarios } from "./Usuarios";

@Entity()
export class Resultados {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dataCad: Date;

  @Column()
  idAnamnese: number;

  @Column()
  gravidade: string;

  @Column()
  idConsulta: number;

  @Column()
  idUser: number;
}
