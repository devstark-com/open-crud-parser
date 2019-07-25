# OpenCRUD Parser

Library for parsing GraphQL queries builded by OpenCRUD standard.
Standard may be found here: https://www.opencrud.org/

## Usage

Assume you have similar `where` and `orderBy` queries: 

```js
animal({
  where1: {
    AND: [{ name: "parrot" }, { id_in: [1, 2] }]
    slug_in: ["slug-b", "slug-c", "slug-d", "slug-e"]
    name_not: "No such name"
    name_gte: "A"
    birds_every: {
      slug_not_in: ["slug-a"]
      name_gte: "A"
    },
    insect_is_null: true
  },
  where2: {
    OR: [
      { type_not_in: ["mammal", "fish"] },
      { AND: [{ id: 1 }, { name: "pigeon" }] }
    ]
    AND: [{ name: "parrot" }, { id_in: [1, 2] }]
    slug_in: ["slug-b", "slug-c", "slug-d", "slug-e"]
    name_not: "No such name"
    name_gte: "A"
    birds_every: {
      slug_not_in: ["slug-a"]
      name_gte: "A"
    }
  },
  orderBy: name_desc
}) {
  id
  name
  slug
  type
  birds {
    id
    name
    slug
  }
}
```

an query will be parsed:

```js
const openCrudParser = require('open-crud-parser')

const formattedQuery = formatQuery(query.where1)

formattedQuery === [{
  name: [{
    value: 'No such name',
    negation: true,
    modifier: 'equals'
  }, {
    value: 'A',
    negation: false,
    modifier: 'gte'
  }],
  isAnimal: [{
    value: true,
    negation: true,
    modifier: 'equals'
  }],
  slug: [{
    value: ['slug-b', 'slug-c', 'slug-d', 'slug-e'],
    negation: false,
    modifier: 'in'
  }],
  related: {
    birds: {
      value: [{ // the same object as root but will never contain relation property
        slug: [{
          value: ['slug-a'],
          negation: true,
          modifier: 'in'
        }],
        name: [{
          value: 'A',
          negation: false,
          modifier: 'gte'
        }]
      }]
      modifier: 'every'
    },
    insect: {
      value: true
      modifier: 'every'
    } 
  }
}]

const formattedQuery = formatQuery(query.where2)

formattedQuery === [{
  type: [{
    value: ['mammal', 'fish'], // from first OR element
    negation: true,
    modifier: 'in'
  }],
  name: [{
    value: 'parrot', // from top level AND
    negation: false,
    modifier: 'equals'
  }, {
    value: 'No such name',
    negation: true,
    modifier: 'equals'
  }, {
    value: 'A',
    negation: false,
    modifier: 'gte'
  }],
  id: [{
    value: [1, 2],  // from top level AND
    negation: false,
    modifier: 'in'
  }],
  isAnimal: [{
    value: true,
    negation: true,
    modifier: 'equals'
  }],
  slug: [{
    value: ['slug-b', 'slug-c', 'slug-d', 'slug-e'],
    negation: false,
    modifier: 'in'
  }],
  related: {
    birds: {
      value: [{ // the same object as root but will never contain relation property
        slug: [{
          value: ['slug-a'],
          negation: true,
          modifier: 'in'
        }],
        name: [{
          value: 'A',
          negation: false,
          modifier: 'gte'
        }]
      }]
      modifier: 'every'
    } 
  }
}, {
  id: [{
    value: 1, // from second OR element
    negation: false,
    modifier: 'equals'
  }]
  name: [{
    value: 'pigeon', // from second OR element
    negation: false,
    modifier: 'equals'
  }, {
    value: 'No such name',
    negation: true,
    modifier: 'equals'
  }, {
    value: 'A',
    negation: false,
    modifier: 'gte'
  }],
  isAnimal: [{
    value: true,
    negation: true,
    modifier: 'equals'
  }],
  slug: [{
    value: ["slug-b", "slug-c", "slug-d", "slug-e"],
    negation: false,
    modifier: 'in'
  }],
  related: {
    birds: {
      value: [{ // the same object as root but will never contain relation property
        slug: [{
          value: ['slug-a'],
          negation: true,
          modifier: 'in'
        }],
        name: [{
          value: 'A',
          negation: false,
          modifier: 'gte'
        }]
      }]
      modifier: 'every'
    } 
  }
}]



const formattedOrderBy = formatOrderBy(query.orderBy)

formattedOrderBy === [{
  column: 'name',
  order: 'desc'
}]
```

## How it works

`formatWhere` creates new array element based on top level query arguments plus
each element contained in OR statement(so in the result will as much elements as in OR statement).
If there is no OR statement in result array will be only one element

This library parses your schema field names by following scheme:

```
# formatWhere
name_not_gte: String

[name-itself]_[negation?]_[modifier]

# formatOrderBy
name_desc

[column]_[order]
```
