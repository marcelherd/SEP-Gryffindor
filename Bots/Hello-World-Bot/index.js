const { Agent } = require('node-agent-sdk');
// Used to transform the existing callback based functions into promise based functions
const { promisify } = require('util');
// Loading .env File which contains all enviroment variables with values
const { config } = require('dotenv');
config();

function timeout(ms = 3000) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class GreetingBot {
    constructor(accountID = process.env.LP_ACCOUNT, username = process.env.LP_USER, password = process.env.LP_PASS, csds = process.env.LP_CSDS) {
        this.accountId = accountID;
        this.username = username;
        this.password = password;
        this.csds = csds;
        this.isConnected = false;
        this.core = new Agent({ accountId: accountID, username: username, password: password, csdsDomain: csds });
        this.openConversations = {};

        this.init();
    }

    /**
     * Initialized the event handler.
     */
    init() {
        this.core.on('connected', () => { this.isConnected = true; });

        this.core.on('error', err => {
            this.isConnected = false;
            console.error('Connection to UMS closed with err', err.message);
        });

        this.core.on('closed', reason => {
            this.isConnected = false;
            console.error('Connection to UMS closed with reason', reason);
            this.core.reconnect(reason !== 4401 || reason !== 4407);
        });

        this.core.on('cqm.ExConversationChangeNotification', body => {
            body.changes
                .filter(change => change.type === 'UPSERT' && !this.openConversations[change.result.convId])
                .forEach(async change => {
                    this.openConversations[change.result.convId] = change.result.conversationDetails;
                    await this.joinConversation(change.result.convId, 'MANAGER');
                    await this.sendMessage(change.result.convId, "Hello World!");
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
        if (!this.core) this.core = new Agent({ accountId: this.accountId, username: this.username, password: this.password, 'csdsDomain': this.csds });

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
    shutdown() {
        this.core.dispose();
        this.core.removeAllListeners();
        this.core = null;
    }

    //-- Private Methods --//


    /**
     * This functions allows the agent to subscribe to conversation.
     * It wraps the original SDK function to make it easier to use.
     * @param {string} convState the conversation state for which should be subscribed
     * @param {boolean} agentOnly if set it will only subscribe to conversation in which the agent is or which are suitable for his skills
     */
    async subscribeToConversations(convState = 'OPEN', agentOnly = false) {
        if (!this.isConnected) return;
        return await this.core.subscribeExConversations({ 'convState': [convState] });
    }

    /**
     * This functions allows to set the state of the agent, this is important for the routing of incomming messages.
     * It wraps the original SDK function to make it easier to use.
     * @param {string} state state of the agent (ONLINE,OFFLINE,AWAY)
     */
    async setStateOfAgent(state = 'ONLINE') {
        if (!this.isConnected) return;
        return await this.core.setAgentState({ availability: state });
    }

    /**
     * This function is used to join a conversation.
     * It wraps the original SDK function to make it easier to use.
     * @param {string} conversationId id of the conversation which should be joined
     * @param {string} role role of the agent (AGENT, MANAGER)
     */
    async joinConversation(conversationId, role = 'AGENT') {
        if (!this.isConnected) return;
        return await this.core.updateConversationField({
            'conversationId': conversationId,
            'conversationField': [{
                'field': 'ParticipantsChange',
                'type': 'ADD',
                'role': role
            }]
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
        return await this.core.publishEvent({
            dialogId: conversationId,
            event: {
                type: 'ContentEvent',
                contentType: 'text/plain',
                message: message
            }
        });
    }
}


console.log('Initializing the hello world bot...');
let bot = new GreetingBot(); // This will use the values set in the process.env
console.log('Starting the hello world bot...');
bot.start()
    .then(_ => console.log('Hello world bot is now up an running!'));