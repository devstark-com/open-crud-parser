require('colors')
const { formatQuery, formatOrderBy } = require('./index')(['birds', 'insect'])

const query = {
  where1: {
    AND: [{ name: 'parrot' }, { id_in: [1, 2] }],
    slug_in: ['slug-b', 'slug-c', 'slug-d', 'slug-e'],
    name_not: 'No such name',
    name_gte: 'A',
    birds_every: {
      slug_not_in: ['slug-a'],
      name_gte: 'A'
    },
    insect_is_null: true
  },
  where2: {
    OR: [
      { type_not_in: ['mammal', 'fish'] },
      { AND: [{ id: 1 }, { name: 'pigeon' }] }
    ],
    AND: [{ name: 'parrot' }, { id_in: [1, 2] }],
    slug_in: ['slug-b', 'slug-c', 'slug-d', 'slug-e'],
    name_not: 'No such name',
    name_gte: 'A',
    birds_every: {
      slug_not_in: ['slug-a'],
      name_gte: 'A'
    }
  },
  orderBy: 'name_desc'
}

const results = {
  where1: [{
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
  }],
  where2: [{
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
  }],
  orderBy: [{
    column: 'name',
    order: 'desc'
  }]
}

console.log(
  'First where case: ',
  JSON.stringify(results.where1) === JSON.stringify(formatQuery(query.where1))
    ? 'ok'.green
    : 'error'.red
)

console.log(
  'Second where case: ',
  JSON.stringify(results.where2) === JSON.stringify(formatQuery(query.where2))
    ? 'ok'.green
    : 'error'.red
)

console.log(
  'Order by case: ',
  JSON.stringify(results.orderBy) === JSON.stringify(formatOrderBy(query.orderBy))
    ? 'ok'.green
    : 'error'.red
)
