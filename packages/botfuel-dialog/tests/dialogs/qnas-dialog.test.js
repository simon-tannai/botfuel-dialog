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

const Bot = require('../../src/bot');
const QnasDialog = require('../../src/dialogs/qnas-dialog');
const MemoryBrain = require('../../src/brains/memory-brain');
const TEST_CONFIG = require('../../src/config').getConfiguration({
  adapter: { name: 'shell' },
});

const TEST_BOT = new Bot(TEST_CONFIG);

describe('QnasDialog', () => {
  const brain = new MemoryBrain(TEST_CONFIG);
  const dialog = new QnasDialog(TEST_BOT, TEST_CONFIG, brain);
  const answers = [[{ value: 'answer' }]];

  test('should return the complete action', async () => {
    const action = await dialog.execute({}, { answers });
    expect(action).toEqual({
      name: QnasDialog.ACTION_COMPLETE,
    });
  });
});
