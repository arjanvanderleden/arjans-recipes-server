import { Application, ServerParams, RunResult } from "./application/application";
import { createRepositoryRouter } from "./routes/create-repository-router";
import { RecipeRepository } from "./repository/recipe-repository";

const createServer = async () => {

    const repRouter = createRepositoryRouter(new RecipeRepository('./data/recipes.json'));

    const application = new Application()
    .addLogger()
    // .useMiddlewares([json])
    .addRoutes('/api', repRouter)
    .addErrorResponses()
    return application;
}
const init = (application: Application) => application.init();
const run = (params: ServerParams) => (application: Application) => application.run(params)
const logAddress = ({port, address}:RunResult) => console.log(`Server is listening at address http://${address}:${port}/api/recipe`)
const catchError = (error: Error) => {
    console.log(error);
    process.exit(0);
}

createServer()
    .then(init)
    .then(run({port: 8001, host: '127.0.0.1'}))
    .then(logAddress)
    .catch(catchError)