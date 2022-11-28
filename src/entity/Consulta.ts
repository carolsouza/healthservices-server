import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Usuarios } from './Usuarios';
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

  @Column()
  email: string;

  // Relations //
  @ManyToOne(() => Usuarios, (usuario) => usuario.email, {
    cascade: false,
  })
  public usuarios: Usuarios;
}
