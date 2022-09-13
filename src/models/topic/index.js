const { knex } = require('../../database');
const { WEEK_TABLE_NAME } = require('../week');

const TOPIC_TABLE_NAME = 'topics';

function insertForWeek (weekNumber, topicName) {
  return knex(TOPIC_TABLE_NAME)
    .insert({ week_number: weekNumber, name: topicName })
    .returning('*');
}

function searchTopicWithWeekData (searchTerm) {
  return knex(TOPIC_TABLE_NAME)
    .select(`${TOPIC_TABLE_NAME}.*`)
    .select(`${WEEK_TABLE_NAME}.name as week_name`)
    .leftJoin(
      WEEK_TABLE_NAME,
      `${TOPIC_TABLE_NAME}.week_number`,
      `${WEEK_TABLE_NAME}.number`
    ).where(
      `${TOPIC_TABLE_NAME}.name`, 'LIKE', `%${searchTerm}%`
    );
}

/**
 * @param {string} id
 * @param {{ name?: string, week_number?: number }} updateData
 */
function updateTopicById (id, updateData) {
  return knex(TOPIC_TABLE_NAME)
    .update(updateData)
    .where({ id })
    .returning('*')
}

module.exports = { insertForWeek, searchTopicWithWeekData, updateTopicById, TOPIC_TABLE_NAME }
