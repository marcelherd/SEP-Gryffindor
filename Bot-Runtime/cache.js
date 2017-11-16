/**
 * This module stores bot objects in memory.
 *
 * @module cache
 */

const cache = {
  currentId: 1,
  bots: [{
    id: 1,
    name: 'My First Bot',
    template: 'Welcome-Bot',
    status: 'NOT_RUNNING',
    tree: {
      root: {
        data: 'Options',
        children: [
          {
            data: '325325532',
            children: [

            ],
            id: 1,
          },
        ],
        id: 0,
      },
      nodeID: 1,
    },
  },
  ],
};

module.exports = cache;
