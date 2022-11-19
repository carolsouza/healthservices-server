import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';

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
  ciclo_menstrual: string;

  @Column()
  anticoncepcional: boolean;

  @Column()
  hipertensao: boolean;

  @Column()
  email: string;

  // Relations //
  /*@OneToOne((type) => User, (user) => user.email, { cascade: false })
  user: User;*/
}
