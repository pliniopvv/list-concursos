import { Entity, PrimaryGeneratedColumn, Column, Unique, Index } from "typeorm";

@Entity()
export class Concurso {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    link: string;

    @Column()
    data: string;

    @Column()
    descricao: string;

    @Column()
    @Index({unique: true})
    md5: string;
}
