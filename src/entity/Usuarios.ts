import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Anamnese } from './Anamnese';
import { Consulta } from './Consulta';
import { Resultados } from './Resultados';
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

  // Relations //
  @OneToOne(() => Anamnese, (anamnese) => anamnese.email, {
    cascade: false,
  })
  @JoinColumn()
  public anamnese: Anamnese;

  @OneToMany(() => Consulta, (consulta) => consulta.email, {
    cascade: false,
  })
  public consulta: Consulta[];
}
