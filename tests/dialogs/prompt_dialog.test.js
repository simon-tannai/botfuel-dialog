const expect = require('expect.js');
const PromptDialog = require('../../src/dialogs/prompt_dialog');
const MemoryBrain = require('../../src/brains/memory/memory_brain');

const TEST_USER = 1;

class TestPromptDialog extends PromptDialog {
  constructor(brain, responses, parameters) {
    super({}, brain, responses, parameters);
  }

  text(id, label, parameters) {
    this.responses.push({id, label, parameters});
  }
}

describe('PromptDialog', function() {
  it('when given no entity, should ask for both', async function() {
    const brain = new MemoryBrain();
    await brain.initUserIfNecessary(TEST_USER);
    const prompt = new TestPromptDialog(brain, [], {
      namespace: 'testdialog',
      entities: { dim1: {}, dim2: {} },
    });
    await prompt.execute(TEST_USER, []);
    expect(prompt.responses).to.eql([
      {
        id: TEST_USER,
        label: 'entity_ask',
        parameters: { entity: 'dim1' },
      },
      {
        id: TEST_USER,
        label: 'entity_ask',
        parameters: { entity: 'dim2' },
      },
    ]);
    const user = await brain.getUser(TEST_USER);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1).to.be(undefined);
    expect(user.conversations[0].testdialog.dim2).to.be(undefined);
  });

  it('when given a first entity, should ask for the second one', async function() {
    const brain = new MemoryBrain();
    await brain.initUserIfNecessary(TEST_USER);
    const prompt = new TestPromptDialog(brain, [], {
      namespace: 'testdialog',
      entities: { dim1: {}, dim2: {} },
    });
    await prompt.execute(TEST_USER, [ { dim: 'dim1' } ]);
    expect(prompt.responses).to.eql([
      {
        id: TEST_USER,
        label: 'entity_confirm',
        parameters: { entity: { dim: 'dim1' } },
      },
      {
        id: TEST_USER,
        label: 'entity_ask',
        parameters: { entity: 'dim2' },
      },
    ]);
    const user = await brain.getUser(TEST_USER);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1.dim).to.be('dim1');
    expect(user.conversations[0].testdialog.dim2).to.be(undefined);
  });

  it('when given both entity, should ask none', async function() {
    const brain = new MemoryBrain();
    await brain.initUserIfNecessary(TEST_USER);
    const prompt = new TestPromptDialog(brain, [], {
      namespace: 'testdialog',
      entities: { dim1: {}, dim2: {} },
    });
    await prompt.execute(TEST_USER, [ { dim: 'dim1' },  { dim: 'dim2' } ]);
    expect(prompt.responses).to.eql([
      {
        id: TEST_USER,
        label: 'entity_confirm',
        parameters: { entity: { dim: 'dim1' } },
      },
      {
        id: TEST_USER,
        label: 'entity_confirm',
        parameters: { entity: { dim: 'dim2' } },
      },
    ]);
    const user = await brain.getUser(TEST_USER);
    expect(user.conversations.length).to.be(1);
    expect(user.conversations[0].testdialog.dim1.dim).to.be('dim1');
    expect(user.conversations[0].testdialog.dim2.dim).to.be('dim2');
  });
});