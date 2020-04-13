import { Repository, WithId } from "./repository";
import * as fse from 'fs-extra';
import * as path from 'path';

export class LocalFileRepository<T extends WithId> implements Repository<T> {

    constructor (private fileName: string) {
        console.log(JSON.stringify(this.items, null, 2))
    }

    protected items:T[] = [];

    private async load() {
        if (await fse.pathExists(this.fileName)) {
            this.items = await fse.readJSON(this.fileName);
        }
    }

    private async save() {
        await fse.ensureDir(path.dirname(this.fileName));
        await fse.writeJSON(this.fileName, this.items, {spaces: 2});
    }

    async init () {
        await this.load();
        console.log(JSON.stringify(this.items, null, 2))

    }

    private add = async (item: T): Promise<T> => {
        this.items.push(item);
        await this.save();
        return item;
    }

    private update = async (item: T): Promise<T> => {
        const itemIndex = this.items.findIndex(i => i.id === item.id)
        this.items.splice(itemIndex,1,item);
        await this.save();
        return item;
    }

    upsert = async (item: T): Promise<T> => {
        return item.id ? this.update(item) : this.add(item);
    }

    delete = async (id: string): Promise<string | undefined> => {
        const itemIndex = this.items.findIndex(i => i.id === id)
        this.items.splice(itemIndex, 1)
        await this.save();
        return itemIndex === -1 ? undefined : this.items.splice(itemIndex, 1)[0].id
    }

    get = async () => {
        return Promise.resolve(this.items)
    };

    getById = async (id: string) => Promise.resolve(this.items.find(item => item.id === id));
}