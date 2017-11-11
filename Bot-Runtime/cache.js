const cache = {
  currentId: 2,
  bots: [
    {
      id: 1,
      name: 'First Bot',
      template: 'Welcome-Bot',
      status: 'NOT_RUNNING',
    },
    {
      id: 2,
      name: 'Second Bot',
      template: 'FAQ-Bot',
      status: 'RUNNING',
    },
  ],
};

module.exports = cache;
