import { Recipe, AmountType, Media } from "arjans-recipe-models";
const recipes = [{
    id: '1234-456-dfgdfg',
    title: 'Brussels sprouts',
    description: 'recipe dscription',
    creator: {
        email: 'creator@example.com'
    },
    dateCreated: (new Date()).toISOString(),
    ingredients: [{
        amount: 1,
        amountType: AmountType.Piece,
        ingredient: {
            name: 'egg',
            category: 'poultry',
            id: '1234-345-dfgdfg',
        }
    }],
    instructions: [{
        text: "Wash the eggs",
        durationSeconds: 5 * 60,
    }],
    media: [],
},
{
    title: 'Brussels sprouts',
    id: '1234-456-dfgdfg',
    description: 'recipe dscription',
    dateCreated: (new Date()).toISOString(),
    creator: {
        email: 'creator@example.com'
    },
    ingredients: [{
        amount: 1,
        amountType: AmountType.Piece,
        ingredient: {
            name: 'egg',
            category: 'poultry',
            id: '1234-345-dfgdfg',
        }
    }],
    instructions: [{
        text: "Wash the eggs",
        durationSeconds: 5 * 60,
    }],
    media: [],
}]

