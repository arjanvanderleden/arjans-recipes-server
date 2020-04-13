import express, {Request, Response, NextFunction } from 'express';
import { Repository, WithId, RepositryInitializer } from '../repository/repository';

const itemFromBody = <T>(req: Request) => req.body as T;

const get = <T extends WithId>(repository: Repository<T>) => async (req: Request<{}>, res: Response<any>, next: NextFunction) => {
    res.json(await repository.get())
}

const getById = <T extends WithId>(repository: Repository<T>) => async (req: Request<{id: string}>, res: Response<T | string>, next: NextFunction) => {
   const {id} = req.params;
   const item = await repository.getById(id);
   return item ? res.json(item) : res.status(404).send(`not found item with id ${id}`)
}

const addNew = <T extends WithId>(repository: Repository<T>) => async (req: Request<{}>, res: Response<T | string>, next: NextFunction) => {
    const newitem: T = itemFromBody<T>(req);
    const addedItem = await repository.upsert(newitem);
    return addedItem ? res.json(addedItem) : res.status(500).send(`problems saveing item ${JSON.stringify(newitem)}`)
}

const update = <T extends WithId>(repository: Repository<T>) => async (req: Request<{id: string}>, res: Response<T | string>, next: NextFunction) => {
    const changedItem: T = itemFromBody<T>(req);
    const updatedItem = await repository.upsert(changedItem);
    return updatedItem ? res.json(updatedItem) : res.status(404).send(`problems saveing item with id ${changedItem.id}`)
}

const deleteItem = <T extends WithId>(repository: Repository<T>) => async (req: Request<{id: string}>, res: Response<string>, next: NextFunction) => {
    const {id} = req.params;
    const deletedId = repository.delete(id);
    return deletedId ? deletedId : res.status(404).send(`problems deleting item with id ${id}`)
}

export const createRepositoryRouter = <T>(repository: Repository<T>) => {
    const init: RepositryInitializer = repository.init.bind(repository);
    const router = express.Router();
    router.get('/:id', getById(repository))
    router.get('/', get(repository))
    router.put('/', addNew(repository));
    router.post('/:id', update(repository));
    router.delete('/:id', deleteItem(repository));

    return {init, router};
}


