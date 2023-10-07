import {
    DataSource,
    DeepPartial,
    EntityTarget,
    FindOptionsWhere,
    ObjectId,
    ObjectLiteral,
    Repository
} from "typeorm";
import { DB } from ".";

export class DBActions {
    tableName: EntityTarget<ObjectLiteral>;
    db: DataSource | undefined;
    repository!: Repository<ObjectLiteral>;
    constructor(tableName: EntityTarget<ObjectLiteral>) {
        this.tableName = tableName;
    }

    async init() {
        if (!this.db || !this.repository) {
            this.db = await DB();
            this.repository = this.db.getRepository(this.tableName);
        }
    }

    async getAll() {
        try {
            await this.init()
            return this.repository.find(); // Utiliza la función `find()` para obtener todos los registros
        } catch (error) {
            throw error;
        }
    }

    async getById(id: string) {
        try {
            await this.init()
            return this.repository.findOne({ where: { id } }); // Utiliza la función `findOne()` para obtener el registro por su id
        } catch (error) {
            throw error;
        }
    }

    async getBy(by: string, value: any) {
        try {
            await this.init()
            return this.repository.findOne({ where: { [by]: value } }); // Utiliza la función `findOne()` con condiciones de búsqueda
        } catch (error) {
            throw error;
        }
    }

    async getManyBy(by: string, value: any) {
        try {
            await this.init()
            return this.repository.find({ where: { [by]: value } }); // Utiliza la función `findOne()` con condiciones de búsqueda
        } catch (error) {
            throw error;
        }
    }

    async create(data: DeepPartial<ObjectLiteral>) {
        try {
            await this.init()
            const entity = this.repository.create(data);
            const result = (await this.repository.save(entity)); // Utiliza la función `save()` para insertar el nuevo registro
            return { insertedId: result.id, DB_RES: result };
        } catch (error) {
            throw error;
        }
    }

    async createMany(dataList: DeepPartial<ObjectLiteral>[]) {
        try {
            // const entities = dataList.map(data => this.repository.create(data));
            await this.init()
            const result = await this.repository.save(this.repository.create(dataList)); // Utiliza la función `save()` para insertar varios registros
            const insertedIds = result.map(entity => entity[0].id);
            return { insertedIds, DB_RES: result };
        } catch (error) {
            throw error;
        }
    }

    async update(id: string | number | FindOptionsWhere<ObjectLiteral> | Date | ObjectId | string[] | number[] | Date[] | ObjectId[], data: {}) {
        try {
            await this.init()
            const DB_RES = await this.repository.update(id, data); // Utiliza la función `update()` para actualizar el registro
            return { DB_RES };
        } catch (error) {
            throw error;
        }
    }

    async updateWhereIs(where: any, is: any, data: {}) {
        try {
            await this.init()
            const DB_RES = await this.repository.update({ [where]: is }, data); // Utiliza la función `update()` con condiciones de búsqueda
            return { DB_RES };
        } catch (error) {
            throw error;
        }
    }

    async upsertWhereIs(where: any, is: any, data: {}) {
        try {
            await this.init();

            // Buscar el registro con la condición de búsqueda
            const existingRecord = await this.repository.findOne({ where: { [where]: is } });

            if (existingRecord) {
                // Si el registro existe, actualizamos sus propiedades combinando los datos existentes con los nuevos datos
                const updatedData = { ...existingRecord, ...data };
                await this.repository.save(updatedData);
            } else {
                // Si el registro no existe, creamos uno nuevo con los datos proporcionados
                const newData = { ...data, ...{ [where]: is } };
                await this.repository.save(newData);
            }

            return {
                success: true,
                data: { [where]: is, ...data } // Datos actualizados o insertados
            };
        } catch (error) {
            throw error;
        }
    }

    async delete(id: string | number | string[] | Date | ObjectId | FindOptionsWhere<ObjectLiteral> | number[] | Date[] | ObjectId[]) {
        try {
            await this.init()
            const DB_RES = await this.repository.delete(id); // Utiliza la función `delete()` para eliminar el registro por su id
            return { DB_RES };
        } catch (error) {
            throw error;
        }
    }

    async deleteWhereIs(where: any, is: any) {
        try {
            await this.init()
            const DB_RES = await this.repository.delete({ [where]: is }); // Utiliza la función `delete()` con condiciones de búsqueda
            return { DB_RES };
        } catch (error) {
            throw error;
        }
    }

    async deleteMany(ids: string[] | number[] | Date[] | ObjectId[]) {
        try {
            await this.init()
            const DB_RES = await this.repository.delete(ids); // Utiliza la función `delete()` para eliminar varios registros por sus ids
            return { DB_RES };
        } catch (error) {
            throw error;
        }
    }

    async getRelatedObjects(id: string, relations: string[]) {
        try {
            await this.init();
            return await this.repository.findOne({ where: { id }, relations });
        } catch (error) {
            throw error;
        }
    }

    async getRelatedObjectsWhereIs(where: any, is: any, relations: string[]) {
        try {
            await this.init();
            return await this.repository.findOne({ where: { [where]: is }, relations });
        } catch (error) {
            throw error;
        }
    }
}