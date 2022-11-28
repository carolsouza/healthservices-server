import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Usuarios } from './Usuarios';
@Entity()
export class Anamnese {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  diabetes: boolean;

  @Column()
  oncologico: boolean;

  @Column()
  cardiaco: boolean;

  @Column()
  tabagista: boolean;

  @Column()
  etilista: boolean;

  @Column()
  covid: boolean;

  @Column()
  exercio_fisico: boolean;

  @Column()
  uso_medicacao: boolean;

  @Column()
  exame_period: boolean;

  @Column()
  exame_period_ultim: Date;

  @Column()
  alergia_med: boolean;

  @Column()
  alergia_med_nome: string;

  @Column()
  funcionamento_intestino: string;

  @Column()
  hipertensao: boolean;

  @Column()
  email: string;

  // Relations //
  @OneToOne(() => Usuarios, (user) => user.email, {
    cascade: false,
  })
  public usuarios: Usuarios;
}
