import { Recipe, AmountType } from "arjans-recipe-models";
import { LocalFileRepository } from "./local-file-repository";

export class RecipeRepository extends LocalFileRepository<Recipe> {

}