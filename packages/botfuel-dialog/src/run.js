#!/usr/bin/env node
/**
 * Copyright (c) 2017 - present, Botfuel (https://www.botfuel.io).
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require('babel-polyfill');

const logger = require('logtown')('Run');
const Bot = require('./bot');
const { resolveConfigFile } = require('./config');

/**
 * Logs an error
 * @param {Error} error - the error
 * @returns {null}
 */
function logError(error) {
  logger.error(error.message, error.stack);
}

// log stack trace on unhandled promise rejection
process.on('unhandledRejection', logError);

(async () => {
  try {
    const config = resolveConfigFile(process.argv[2]);
    await new Bot(config).run();
  } catch (e) {
    logError(e);
    process.exit(0);
  }
})();
