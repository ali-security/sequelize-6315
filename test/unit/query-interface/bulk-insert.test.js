const { DataTypes } = require('sequelize');
const sinon = require('sinon');
const { expectsql, sequelize } = require('../../support');
const { stubQueryRun } = require('./stub-query-run');

describe('QueryInterface#bulkInsert', () => {
  const User = sequelize.define('User', {
    firstName: DataTypes.STRING
  }, { timestamps: false });

  afterEach(() => {
    sinon.restore();
  });

  // you'll find more replacement tests in query-generator tests
  it('does not parse replacements outside of raw sql', async () => {
    const getSql = stubQueryRun();

    await sequelize.getQueryInterface().bulkInsert(User.tableName, [{
      firstName: ':injection'
    }], {
      replacements: {
        injection: 'raw sql'
      }
    });

    expectsql(getSql(), {
      default: 'INSERT INTO [Users] ([firstName]) VALUES (\':injection\');',
      mssql: 'INSERT INTO [Users] ([firstName]) VALUES (N\':injection\');'
    });
  });
});
