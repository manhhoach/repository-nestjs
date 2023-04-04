import { Column, Entity, PrimaryGeneratedColumn, CreateDateColumn, BeforeInsert, BeforeUpdate, BaseEntity } from 'typeorm';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ default: 0 })
    type: number;

    @CreateDateColumn()
    createdAt: Date;

    @BeforeUpdate()
    @BeforeInsert()
    hashPassword() {
        if (this.password) {
            const salt = genSaltSync(10);
            this.password = hashSync(this.password, salt);
        }
    }

    comparePassword(password: string): boolean {
        return compareSync(password, this.password);
    }

}