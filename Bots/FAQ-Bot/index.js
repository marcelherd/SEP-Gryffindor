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

const botConfig = JSON.parse(process.env.NODE_ENV);


config();


function timeout(ms = 3000) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Build the first Tree with greeting an options
 */

const greetTheCustomer = async () => botConfig.greeting;

class GreetingBot {
  constructor(accountID = '85041411', username = 'daniele', password = '456rtz456rtz', csds = process.env.LP_CSDS) {
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
      if (!body.changes[0].__isMe && body.changes[0].originatorMetadata.role !== 'ASSIGNED_AGENT') {
        const intents = await LuisService.getIntent(body.changes[0].event.message);
        const topScoringIntent = intents.topScoringIntent.intent;
        console.log('best matched intent: ');
        console.log(topScoringIntent);
        const answer = await IntentService.compareIntent(topScoringIntent);
        console.log(answer);


        if (answer === null) {
          console.log('Something went wrong! Please transfer to Human');
        } else {
          this.sendMessage(body.dialogId, answer);
        }


      //   if (!Number.isNaN(body.changes[0].event.message) &&
      //     body.changes[0].event.message < node.children.length +
      //     1 && body.changes[0].event.message > 0) {
      //     this.sendMessage(body.dialogId, nextStep(body.changes[0].event.message));
      //   } else {
      //     this.sendMessage(body.dialogId, repeatStep());
      //   }
      }
    });
    this.core.on('cqm.ExConversationChangeNotification', (body) => {
      body.changes
        .filter(change => change.type === 'UPSERT' && !this.openConversations[change.result.convId])
        .forEach(async(change) => {
          this.openConversations[change.result.convId] = change.result.conversationDetails;
          await this.joinConversation(change.result.convId, 'MANAGER');
          await this.sendMessage(change.result.convId, await greetTheCustomer());
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
    return await this.core.subscribeExConversations({
      convState: [convState]
    });
  }

  /**
   * This functions allows to set the state of the agent, this is important for the routing of incomming messages.
   * It wraps the original SDK function to make it easier to use.
   * @param {string} state state of the agent (ONLINE,OFFLINE,AWAY)
   */
  async setStateOfAgent(state = 'ONLINE') {
    if (!this.isConnected) return;
    return await this.core.setAgentState({
      availability: state
    });
  }

  /**
   * This function is used to join a conversation.
   * It wraps the original SDK function to make it easier to use.
   * @param {string} conversationId id of the conversation which should be joined
   * @param {string} role role of the agent (AGENT, MANAGER)
   */
  async joinConversation(conversationId, role = 'AGENT') {
    // console.log(conversationId);
    if (!this.isConnected) return;
    return await this.core.updateConversationField({
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
    if (message.includes('http')) {
      return await this.sendLink(conversationId, message);
    }
    return  this.core.publishEvent({
      dialogId: conversationId,
      event: {
        type: 'ContentEvent',
        contentType: 'text/plain',
        message,
      },
    });
  }

  async sendLink(conversationId, message) {
    if (!this.isConnected) return;
    const index = message.indexOf('http');
    const link = message.substr(index, (message.length) - 1);
    return await this.core.publishEvent({
      dialogId: conversationId,
      event: {
        type: 'RichContentEvent',
        content: {
          "type": "vertical",
          "elements": [{
            "type": "horizontal",
            "elements": [{
                "type": "button",
                "title": "Buy",
                "tooltip": "Buy this product",
                "click": {
                  "actions": [{
                    "type": "link",
                    "name": "Buy",
                    "uri": "http://www.google.com"
                  }]
                }
              },
              {
                "type": "button",
                "title": "Find similar",
                "tooltip": "store is the thing",
                "click": {
                  "actions": [{
                    "type": "link",
                    "name": "Buy",
                    "uri": "http://www.google.com"
                  }]
                }
              }
            ]
          }, ]
        }
      }
    });
  }
}
console.log('Initializing the hello world bot...');
const bot = new GreetingBot(); // This will use the values set in the process.env
console.log('Starting the hello world bot...');
module.exports = bot.start()
  .then(_ => console.log('Hello world bot is now up an running!'));
