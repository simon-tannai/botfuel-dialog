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

const logger = require('logtown')('RegexExtractor');
const Extractor = require('./extractor');
const ExtractorError = require('../errors/extractor-error');

/**
 * Entity extraction regex based extractor.
 */
class RegexExtractor extends Extractor {
  /**
   * @constructor
   * @param {Object} parameters - the extractor parameters
   */
  constructor(parameters) {
    if (!RegexExtractor.hasValidPattern(parameters.regex)) {
      throw new ExtractorError(`the "regex" parameter can't be "${parameters.regex}"`);
    }
    super(parameters);
  }

  /** @inheritDoc */
  async compute(sentence) {
    logger.debug('compute', sentence);
    // ensure regex has global flag to find all matches
    const regex = RegexExtractor.ensureGlobalRegex(this.parameters.regex);
    const entities = [];
    let match;
    console.log('regex', regex);
    while ((match = regex.exec(sentence))) {
      entities.push({
        dim: this.parameters.dimension,
        body: match[0],
        values: [{ value: match[0] }],
        start: match.index,
        end: match.index + match[0].length,
      });
    }
    return entities;
  }

  static ensureGlobalRegex(pattern) {
    const parts = pattern.toString().split('/');
    const regex = parts.length > 1 ? parts[1] : pattern;
    const flags = parts.length > 1 ? parts[2] : '';
    try {
      console.log('ensureGlobalRegex', parts, regex, flags);
      return new RegExp(regex, flags.indexOf('g') === -1 ? `g${flags}` : flags);
    } catch (e) {
      logger.error('Regex is not valid');
      throw new Error(e);
    }
  }

  static hasValidPattern(regex) {
    const exclusions = [undefined, null, ''];
    return exclusions.indexOf(regex) === -1;
  }
}

module.exports = RegexExtractor;
