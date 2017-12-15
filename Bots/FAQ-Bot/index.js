const {
  Agent,
} = require('node-agent-sdk');
// Used to transform the existing callback based functions into promise based functions
const {
  promisify,
} = require('util');
// Loading .env File which contains all enviroment letiables with values
const {
  config,
} = require('dotenv');
const LuisService = require('./services/LuisService');
const IntentService = require('./services/IntentService');
const rp = require('request-promise');
const http = require('http');

http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('It works');
}).listen(5000);

let botConfig = JSON.parse(process.env.NODE_ENV_CONFIG);
const user = JSON.parse(process.env.NODE_ENV_USER);



config();


function timeout(ms = 3000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Build the first Tree with greeting an options
 */

const greetTheCustomer = () => {

  return botConfig.greeting;
};

const incrementConvCounter = async () => {
  const options = {
    uri: `http://141.19.157.115:3000/api/v1/manage/public/users/${user._id}/bots/${botConfig._id}/conversation`,
    json: true,
  };
  try {
    const response = await rp.get(options);
    return response;
  } catch (err) {
    throw err;
  }
};

const incrementTransferCounter = async () => {
  const options = {
    uri: `http://141.19.157.115:3000/api/v1/manage/public/users/${user._id}/bots/${botConfig._id}/forward`,
    json: true,
  };
  try {
    const response = await rp.get(options);
    return response;
  } catch (err) {
    throw err;
  }
};

class FAQBot {
  constructor(accountID, username = 'daniele', password = '456rtz456rtz', csds = process.env.LP_CSDS) {
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
    this.core.on('ms.MessagingEventNotification', async (body) => {
      const { role } = body.changes[0].originatorMetadata;
      if (!body.changes[0].__isMe && role !== 'ASSIGNED_AGENT' && role !== 'MANAGER' && this.openConversations[body.dialogId] !== undefined && this.openConversations[body.dialogId].skillId === '1000666232') {
        try {
          const intents = await LuisService.getIntent(body.changes[0].event.message);
          const topScoringIntent = intents.topScoringIntent.intent;
          const answer = await IntentService.compareIntent(topScoringIntent);
          if (!answer) {
            if (body.changes[0].event.message === 'human') {
              // transfer to human somehow
              try {
                incrementTransferCounter();
             } catch (err) {
               throw err;
             }
              this.core.updateConversationField({
                conversationId: body.dialogId,
                conversationField: [
                  {
                    field: 'Skill',
                    type: 'UPDATE',
                    skill: 1007877832,
                  },
                  {
                    field: 'ParticipantsChange',
                    type: 'REMOVE',
                    role: 'MANAGER',
                    userId: this.core.agentId,
                  }],
              });
              this.openConversations[body.dialogId].skillId = 'human';
            } else { this.sendMessage(body.dialogId, 'I did not understand. Please try again with different phrasing or type human if you would like to be transferred to a human agent'); }
            console.log('Something went wrong! Please transfer to Human');
          } else if (answer.type === 'link') {
            this.sendLink(body.dialogId, answer.value, topScoringIntent);
          } else if (answer.type === 'skill') {
            this.core.updateConversationField({
              conversationId: body.dialogId,
              conversationField: [
                {
                  field: 'Skill',
                  type: 'UPDATE',
                  skill: answer.value,
                },
                {
                  field: 'ParticipantsChange',
                  type: 'REMOVE',
                  role: 'MANAGER',
                  userId: this.core.agentId,
                }],
            });
            this.openConversations[body.dialogId].skillId = answer.value;
          } else {
            this.sendMessage(body.dialogId, answer.value);
          }
        } catch (err) {
          console.log(err);
        }
      }
    });
    this.core.on('cqm.ExConversationChangeNotification', (body) => {
      body.changes
        .filter(change => change.type === 'UPSERT' && !this.openConversations[change.result.convId])
        .forEach(async (change) => {
          if (change.result.conversationDetails.skillId === '1000666232') {
            this.openConversations[change.result.convId] = change.result.conversationDetails;
            await this.joinConversation(change.result.convId, 'ASSIGNED_AGENT');
            await this.sendMessage(change.result.convId, await greetTheCustomer());
          }
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
  async subscribeToConversations(convState = 'OPEN', agentOnly = true) {
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
  async joinConversation(conversationId, role = 'AGENT') {
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
    return this.core.publishEvent({
      dialogId: conversationId,
      event: {
        type: 'ContentEvent',
        contentType: 'text/plain',
        message,
      },
    });
  }

  async sendLink(conversationId, message, topScoringIntent) {
    if (!this.isConnected) return;
    return this.core.publishEvent({
      dialogId: conversationId,
      event: {
        type: 'RichContentEvent',
        content: {
          type: 'button',
          tooltpip: 'button tooltip',
          title: topScoringIntent,
          click: {
            actions: [
              {
                type: 'link',
                name: 'Reset Password',
                uri: message,
              },
            ],
          },
        },
      },
    });
  }
}
console.log('Initializing the FAQ bot...');
let bot;
console.dir(user);
if (botConfig.environment === 'Staging') {
  bot = new FAQBot(user.stagingId || user.brandId);

  if (!user.stagingId) {
    console.log('[WARNING] No StagingId set, deploying bot to production instead.');
  }
}
else {
  console.log(botConfig);
  bot = new FAQBot(user.brandId);
}
// This will use the values set in the process.env
console.log('Starting the FAQ bot...');
module.exports = bot.start()
  .then(_ => console.log('FAQ bot is now up an running!'));
