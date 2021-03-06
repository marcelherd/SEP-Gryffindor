/**
 * This module is reponsible for realising the Welcome bot's logic
 * @author Daniel Eggert
 * @module Welcome-Bot/index.js
 */

// Used to transform the existing callback based functions into promise based functions
const {
  promisify,
} = require('util');
const http = require('http');


const {
  Agent,
} = require('node-agent-sdk');
// Loading .env File which contains all enviroment letiables with values

const rp = require('request-promise');


http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('It works');
}).listen(5000);

const botConfig = JSON.parse(process.env.NODE_ENV_CONFIG);
const user = JSON.parse(process.env.NODE_ENV_USER);

const {
  root,
} = botConfig.dialogTree;
let node = root;
let lastnode = root;
let greeting = false;
let theLast = false;

const timeout = (ms = 2000) => new Promise(resolve => setTimeout(resolve, ms));
/**
 * Increment the Bot statistic
 */
const incrementConvCounter = async () => {
  const options = {
    uri: `http://${process.env.NODE_ENV_HOST || 'localhost'}:3000/api/v1/manage/public/users/${user._id}/bots/${botConfig._id}/conversation`,
    json: true,
  };
  try {
    const response = await rp.get(options);
    return response;
  } catch (err) {
    throw err;
  }
};
/**
 * Increment the Bot statistic
 */
const incrementTransferCounter = async () => {
  const options = {
    uri: `http://${process.env.NODE_ENV_HOST || 'localhost'}:3000/api/v1/manage/public/users/${user._id}/bots/${botConfig._id}/forward`,
    json: true,
  };
  try {
    const response = await rp.get(options);
    return response;
  } catch (err) {
    throw err;
  }
};
/**
 * Send the Step before
 */
function lastStep() {
  node = lastnode;
  let counter = 0;
  let answer = 'Please choose one of the Operations:\n\t';
  while (counter < lastnode.children.length) {
    answer += `${lastnode.children[counter].data}\n\t`;
    counter++;
  }
  return answer;
}


/**
 * This functions goes deeper in thee tree.
 * If it is a Skilltransfer it returns an empty string an activate the transfer.
 * @param {integer} optionNumber the number whose child was chosen
 */
function nextStep(optionNumber) {
  let answer = '';
  if (node.children[optionNumber - 1].children[0] != undefined) {
    lastnode = node;
    node = node.children[optionNumber - 1];
    if (node.children[0].children[0] == undefined) {
      theLast = true;
    }
    answer = node.children[0].data;
  } else {
    let counter = 0;
    answer = 'This is no Option please select one of the following options:\n\t';
    while (counter < node.children.length) {
      answer += `${node.children[counter].data}\n\t`;
      counter++;
    }
  }
  return answer;
}
/**
 * Build the first Tree with greeting an options
 */

const buildFirstTree = () => {
  let answer = '';
  let counter = 0;
  answer += `${botConfig.greeting}\n\t`;
  while (counter < root.children.length) {
    answer += `${root.children[counter].data}\n\t`;

    counter++;
  }

  return answer;
};
/**
 * select the operations number and give the new Option
 */
const repeatStep = () => {
  let counter = 0;
  let answer = '';
  if (greeting) {
    answer = buildFirstTree();
    greeting = false;
  } else {
    answer = 'I raff nix. Please repeat your answer:\n\t';
    while (counter < node.children.length) {
      answer += `${node.children[counter].data}\n\t`;

      counter++;
    }
  }
  return answer;
};
/**
 * Test if the Bot must transfer to another Bot/Agent
 */
const skillTransfer = (answer) => {
  console.log(answer);
  if (answer.includes('SKILL')) {
    return true;
  }
  return false;
};
/**
 * Find out the SkillId
 */
const getSkill = (answer) => {
  let newSkill = answer.split('_')[1];
  newSkill = parseInt(newSkill, 10);
  return newSkill;
};

class WelcomeBot {
  constructor(accountID, username, password, csds = process.env.LP_CSDS) {
    this.accountId = accountID;
    this.username = username;
    this.password = password;

    this.isConnected = false;
    this.core = new Agent({
      accountId: accountID,
      username,
      password,
      csdsDomain: csds,
    });
    this.openConversations = {};


    this.init();
  }

  /**
   * Initialized the event handler.
   */
  init() {
    this.core.on('connected', () => {
      this.isConnected = true;
    });

    this.core.on('error', (err) => {
      this.isConnected = false;
      console.error('Connection to UMS closed with err', err.message);
    });

    this.core.on('closed', (reason) => {
      this.isConnected = false;
      console.error('Connection to UMS closed with reason', reason);
      this.core.reconnect(reason !== 4401 || reason !== 4407);
    });
    /**
     * This function is used to find out what the consumer wants and send him the right message
     * Which later get consumed by other functions.
     */
    this.core.on('ms.MessagingEventNotification', (body) => {
      if (!body.changes[0].__isMe && body.changes[0].originatorMetadata.role !== 'ASSIGNED_AGENT' && this.openConversations[body.dialogId].skillId === '-1') {
        if (!Number.isNaN(body.changes[0].event.message) &&
          body.changes[0].event.message < node.children.length +
          1 && body.changes[0].event.message > 0) {
          const answer = nextStep(body.changes[0].event.message);
          if (node.children.length === 1 && theLast) {
            node = root;
            greeting = true;
            theLast = false;
          }
          if (!skillTransfer(answer)) {
            this.sendMessage(body.dialogId, answer);
          } else {
            try {
              incrementTransferCounter();
            } catch (err) {
              console.log(err);
              throw err;
            }
            const newSkill = getSkill(answer);
            this.core.updateConversationField({
              conversationId: body.dialogId,
              conversationField: [{
                field: 'Skill',
                type: 'UPDATE',
                skill: newSkill,
              },
              {
                field: 'ParticipantsChange',
                type: 'REMOVE',
                role: 'MANAGER',
                userId: this.core.agentId,
              },
              ],
            });

            this.openConversations[body.dialogId].skillId = newSkill;
          }
        } else if (body.changes[0].event.message === 'back') {
          this.sendMessage(body.dialogId, lastStep());
        } else {
          this.sendMessage(body.dialogId, repeatStep());
        }
      }
    });

    this.core.on('cqm.ExConversationChangeNotification', (body) => {
      body.changes
        .filter(change => change.type === 'UPSERT' && !this.openConversations[change.result.convId])
        .forEach(async (change) => {
          this.isConnected = true;
          node = root;
          this.openConversations[change.result.convId] = change.result.conversationDetails;
          await this.joinConversation(change.result.convId, 'MANAGER');
          await this.sendMessage(change.result.convId, buildFirstTree());
        });

      body.changes
        .filter(change => change.type === 'DELETE' && this.openConversations[change.result.convId])
        .forEach(change => delete this.openConversations[change.result.convId]);
    });

    this.promisifyFunctions();
  }

  /**
   * Utility function which transform the used SDK function into promised based once.
   * Which later get consumed by other functions.
   */
  promisifyFunctions() {
    this.subscribeExConversations = promisify(this.core.subscribeExConversations);
    this.publishEvent = promisify(this.core.publishEvent);
    this.setAgentState = promisify(this.core.setAgentState);
    this.updateConversationField = promisify(this.core.updateConversationField);
  }

  /**
   * Starts the bot.
   */
  async start() {
    if (!this.core) {
      this.core = new Agent({
        accountId: this.accountId,
        username: this.username,
        password: this.password,
        csdsDomain: this.csds,
      });
    }

    while (!this.isConnected) {
      await timeout(3000);
    }

    let response;
    response = await this.setStateOfAgent('AWAY');
    response = await this.subscribeToConversations();
  }


  /**
   * Shutsdown the bot
   */
  stop() {
    this.core.dispose();
    this.core.removeAllListeners();
    this.core = null;
  }

  // -- Private Methods --//


  /**
   * This functions allows the agent to subscribe to conversation.
   * It wraps the original SDK function to make it easier to use.
   * @param {string} convState the conversation state for which should be subscribed
   * @param {boolean} agentOnly if set it will only subscribe to conversation in which the agent is or which are suitable for his skills
   */
  async subscribeToConversations(convState = 'OPEN', agentOnly = false) {
    if (!this.isConnected) return;
    return this.core.subscribeExConversations({
      convState: [convState],
    });
  }

  /**
   * This functions allows to set the state of the agent, this is important for the routing of incomming messages.
   * It wraps the original SDK function to make it easier to use.
   * @param {string} state state of the agent (ONLINE,OFFLINE,AWAY)
   */
  async setStateOfAgent(state = 'ONLINE') {
    if (!this.isConnected) return;
    return this.core.setAgentState({
      availability: state,
    });
  }


  /**
   * This function is used to join a conversation.
   * It wraps the original SDK function to make it easier to use.
   * @param {string} conversationId id of the conversation which should be joined
   * @param {string} role role of the agent (AGENT, MANAGER)
   */
  async joinConversation(conversationId, role = 'MANAGER') {
    if (!this.isConnected) return;
    try {
      await incrementConvCounter();
    } catch (err) {
      throw err;
    }
    return this.core.updateConversationField({
      conversationId,
      conversationField: [{
        field: 'ParticipantsChange',
        type: 'ADD',
        role,
      }],
    });
  }

  /**
   * This function allows sending text messages to the specified conversation.
   * It wraps the original SDK function to make it easier to use.
   * @param {string} conversationId id of the conversation which should be joined
   * @param {string} message text message which will be sent to the client
   */
  async sendMessage(conversationId, message) {
    if (!this.isConnected) return;
    await timeout();
    if (message.includes('http')) {
      return this.sendLink(conversationId, message);
    }
    return this.core.publishEvent({
      dialogId: conversationId,
      event: {
        type: 'ContentEvent',
        contentType: 'text/plain',
        message,
      },
    });
  }
  /**
   * This function allows sending Links to the specified conversation.
   * It wraps the original SDK function to make it easier to use.
   * @param {string} conversationId id of the conversation which should be joined
   * @param {string} message text message which will be sent to the client
   */
  async sendLink(conversationId, message) {
    if (!this.isConnected) return;
    const index = message.indexOf('http');
    const link = message.substr(index, (message.length) - 1);
    return this.core.publishEvent({
      dialogId: conversationId,
      event: {
        type: 'RichContentEvent',
        content: {
          type: 'vertical',
          elements: [{
            type: 'horizontal',
            elements: [{
              type: 'button',
              title: 'TrialButton',
              tooltip: 'Try it out',
              click: {
                actions: [{
                  type: 'link',
                  name: 'TrialButton',
                  uri: link,
                }],
              },
            }],
          }],
        },
      },
    });
  }
}
console.log('Initializing the Welcome bot...');
let bot;
if (botConfig.environment === 'Staging') {
  bot = new WelcomeBot(user.stagingId || user.brandId, user.username, user.password);

  if (!user.stagingId) {
    console.log('[WARNING] No StagingId set, deploying bot to production instead.');
  }
} else {
  console.log(botConfig);
  bot = new WelcomeBot(user.brandId, user.username, user.password);
}
console.log('Starting the Welcome bot...');
module.exports = bot.start()
  .then(_ => console.log('Welcome bot is now up an running!'));
