import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Resultados } from "./Resultados";

@Entity()
export class Usuarios {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  email: string;

  @Column()
  dataNascimento: Date;

  @Column()
  genero: string;

  @Column()
  UF: string;

  @Column()
  cidade: string;

  @Column()
  senha: string;

  @Column({ default: null })
  token: string;

  @OneToMany((type) => Resultados, (resultado) => resultado.id, {
    cascade: false,
  })
  resultados: Resultados[];
}
