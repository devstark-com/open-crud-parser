# OpenCRUD Parser

Library for parsing GraphQL queries builded by OpenCRUD standard.
Standard may be found here: https://www.opencrud.org/

## Installation

```bash
npm i git+https://github.com/devstark-com/open-crud-parser.git
```

## Usage

Assume you have similar `where` and `orderBy` queries: 

```js
queryArgs = {
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
}
```

an query will be parsed to:

```js
const openCrudParser = require('open-crud-parser')(['insects', 'birds'])

const formattedQuery = formatQuery(query.where1)

formattedQuery === [{
  slug: [{
    value: ['slug-b', 'slug-c', 'slug-d', 'slug-e'],
    negation: false,
    modifier: 'in'
  }],
  name: [{
      value: 'No such name',
      negation: true,
      modifier: 'equals'
    },
    {
      value: 'A',
      negation: false,
      modifier: 'gte'
    },
    {
      value: 'parrot',
      negation: false,
      modifier: 'equals'
    }
  ],
  id: [{
    value: [1, 2],
    negation: false,
    modifier: 'in'
  }],
  related: {
    birds: {
      value: [{
        'birds.slug': [{
          value: ['slug-a'],
          negation: true,
          modifier: 'in'
        }],
        'birds.name': [{
          value: 'A',
          negation: false,
          modifier: 'gte'
        }]
      }],
      modifier: 'every'
    },
    insect: {
      value: [{}],
      modifier: 'is_null'
    }
  }
}]

const formattedQuery = formatQuery(query.where2)

formattedQuery === [{
    slug: [{
      value: ['slug-b', 'slug-c', 'slug-d', 'slug-e'],
      negation: false,
      modifier: 'in'
    }],
    name: [{
        value: 'No such name',
        negation: true,
        modifier: 'equals'
      },
      {
        value: 'A',
        negation: false,
        modifier: 'gte'
      },
      {
        value: 'parrot',
        negation: false,
        modifier: 'equals'
      }
    ],
    type: [{
      value: ['mammal', 'fish'],
      negation: true,
      modifier: 'in'
    }],
    id: [{
      value: [1, 2],
      negation: false,
      modifier: 'in'
    }],
    related: {
      birds: {
        value: [{
          'birds.slug': [{
            value: ['slug-a'],
            negation: true,
            modifier: 'in'
          }],
          'birds.name': [{
            value: 'A',
            negation: false,
            modifier: 'gte'
          }]
        }],
        modifier: 'every'
      }
    }
  },
  {
    slug: [{
      value: ['slug-b', 'slug-c', 'slug-d', 'slug-e'],
      negation: false,
      modifier: 'in'
    }],
    name: [{
        value: 'No such name',
        negation: true,
        modifier: 'equals'
      },
      {
        value: 'A',
        negation: false,
        modifier: 'gte'
      },
      {
        value: 'pigeon',
        negation: false,
        modifier: 'equals'
      }
    ],
    id: [{
      value: 1,
      negation: false,
      modifier: 'equals'
    }],
    related: {
      birds: {
        value: [{
          'birds.slug': [{
            value: ['slug-a'],
            negation: true,
            modifier: 'in'
          }],
          'birds.name': [{
            value: 'A',
            negation: false,
            modifier: 'gte'
          }]
        }],
        modifier: 'every'
      }
    }
  }
]



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
