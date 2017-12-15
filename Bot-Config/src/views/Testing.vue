<template>
  <bt-page-container :pageTitle="$t('testing.lblPageTitle', { name: bot.name })">
    <div class="bt-chat">
      <div class="bt-chat-header">
        <div class="bt-chat-icon">
          <img src="https://media.licdn.com/mpr/mpr/shrink_200_200/AAIAAgDGAAAAAQAAAAAAAAsvAAAAJGI2YTc2MmFjLTJjZDQtNDc0Yy05OWFiLWRmN2RhZDNmZGQ5MQ.png" />
        </div>
        <div class="bt-chat-details">
          <span>{{ bot.name }}</span>
        </div>
        <div class="bt-chat-status">
          <span>{{ $t('testing.lblOnline') }}</span>
        </div>

        <div class="bt-chat-logout" @click="back">
          <span>{{ $t('menu.btnLogout') }}</span>
        </div>
      </div>
      <div class="bt-chat-body">
        <div class="bt-chat-timestamp">
          <span>{{ timestamp }}</span>
        </div>
        <div class="bt-chat-message" :class="message.type" v-for="(message, index) in messages" :key="index">
          <div class="bt-chat-icon" v-if="showIcon(index)">
            <img src="/static/robot-icon.png" />
          </div>
          <div class="bt-chat-speechbubble" :class="message.type">
            <span>{{ message.content }}</span>
          </div>
          <div class="bt-chat-bot-name" v-if="showName(index)">
            <span>{{ bot.name }}</span>
          </div>
        </div>
      </div>
      <div class="bt-chat-footer">
        <input class="bt-chat-input" v-model="newMessage" :placeholder="$t('testing.phInput')" @keyup.enter="sendMessage" ref="input" />
        <button class="bt-chat-submit" @click="sendMessage">
          <md-icon>send</md-icon>
        </button>
      </div>
    </div>
  </bt-page-container>
</template>

<script>
import PageContainer from '@/components/layout/PageContainer'

import RuntimeService from '@/services/RuntimeService'

export default {
  name: 'testing',
  components: {
    'bt-page-container': PageContainer
  },
  data () {
    return {
      bot: {},
      timestamp: '',
      newMessage: '',
      messages: [],
      socket: null,
      openConvs: {},
      mounted: null
    }
  },
  created () {
    this.fetchData()
    this.initTimestamp()
  },
  mounted () {
    this.$refs.input.focus()
    this.prepareToConnect()
    this.mounted = Date.now()
  },
  methods: {
    fetchData () {
      const { userId, botId } = this.$route.params

      RuntimeService.findBotById(userId, botId).then((data) => {
        this.bot = data
      })
    },

    initTimestamp () {
      const now = new Date()
      const hours = ('0' + now.getHours()).slice(-2)
      const minutes = ('0' + now.getMinutes()).slice(-2)

      this.timestamp = `${hours}:${minutes}`
    },

    prepareToConnect () {
      const user = this.$store.getters.user
      const account = (this.bot.environment === 'Staging' ? user.stagingId : user.brandId)

      window.LPUtils.getJWT(account).then((jwt) => {
        window.LPUtils.getDomain(account, 'asyncMessagingEnt').then((umsDomain) => {
          window.LPWs.connect(`wss://${umsDomain}/ws_api/account/${account}/messaging/consumer?v=3`).then((openedSocket) => {
            this.socket = openedSocket
            return this.handleOpenedSocket(openedSocket, jwt)
          }, (errorOpening) => {
            console.log('error opening connection ' + errorOpening)
            this.prepareToConnect()
          })
        })
      }, (errorGettingJwt) => {
        console.log('error ' + errorGettingJwt + ' getting jwt for account ' + account)
      })
    },

    handleOpenedSocket (socket, jwt) {
      console.log('connection is opened.')

      const apiRequestTypes = ['cqm.SubscribeExConversations',
        'ms.PublishEvent', 'cm.ConsumerRequestConversation',
        'ms.SubscribeMessagingEvents', 'InitConnection', 'cm.UpdateConversationField']

      socket.registerRequests(apiRequestTypes)

      const me = this.myId(jwt)

      socket.initConnection({}, [{ 'type': '.ams.headers.ConsumerAuthentication', 'jwt': jwt }])
      socket.onNotification(this.withType('MessagingEvent'), (body) => {
        return body.changes.forEach((change) => {
          // Do not display chat history
          if ((this.mounted - change.serverTimestamp) > 100) {
            return
          }

          switch (change.event.type) {
            case 'ContentEvent':
              this.messages.push({
                type: (change.originatorId === me ? 'sent' : 'received'),
                content: change.event.message
              })
          }
        })
      })

      // subscribe to open conversations metadata
      socket.subscribeExConversations({
        'convState': ['OPEN']
      }).then((res) => {
        socket.onNotification(this.withSubscriptionID(res.body.subscriptionId), (notificationBody) => {
          return this.handleConversationNotification(socket, notificationBody, this.openConvs)
        })
      })
    },

    handleConversationNotification (socket, notificationBody, openConvs) {
      notificationBody.changes.forEach((change) => {
        if (change.type === 'UPSERT') {
          if (!openConvs[change.result.convId]) {
            openConvs[change.result.convId] = change.result
            socket.subscribeMessagingEvents({
              fromSeq: 0,
              dialogId: change.result.convId
            })
          }
        }
      })
    },

    withSubscriptionID (subscriptionID) {
      return (notif) => {
        return notif.body.subscriptionId === subscriptionID
      }
    },

    withType (type) {
      return (notif) => {
        return notif.type.includes(type)
      }
    },

    myId (jwt) {
      return JSON.parse(atob(jwt.split('.')[1])).sub
    },

    sendMessage () {
      if (Object.keys(this.openConvs)[0]) {
        this.publishTo(this.socket, Object.keys(this.openConvs)[0])
      } else {
        this.socket.consumerRequestConversation().then((res) => {
          return this.publishTo(this.socket, res.body.conversationId)
        })
      }
    },

    publishTo (socket, convID) {
      socket.publishEvent({
        dialogId: convID,
        event: {
          type: 'ContentEvent',
          contentType: 'text/plain',
          message: this.newMessage
        }
      }).then((res) => {
        this.newMessage = ''
      })
    },

    back () {
      const { userId, botId } = this.$route.params

      this.$router.push({
        name: 'BotEdit',
        params: { userId, botId }
      })
    },

    showName (index) {
      const message = this.messages[index]

      if (message.type === 'sent') {
        return false
      }

      if (index === this.messages.length - 1) {
        return true
      }

      if (this.messages[index + 1].type === 'received') {
        return false
      }

      return true
    },

    showIcon (index) {
      if (index === 0 && this.messages[index].type !== 'received') {
        return false
      }

      if (this.messages[index - 1].type === 'sent' && this.messages[index].type !== 'sent') {
        return true
      }

      return false
    }
  }
}
</script>

<style>
.bt-chat {
	width: 350px;
	height: 75vh;
	position: relative;
	box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.24);
  overflow-x: hidden;
  overflow-y: auto;
}

.bt-chat-header {
  height: 70px;
  background-color: #FAD232;
  padding: 15px 10px 10px 10px;
  box-shadow: 0px 0px 15px 0px rgba(0,0,0,0.24);
	box-sizing: border-box;
}

.bt-chat-icon {
  width: 38px;
  height: 38px;
  border: 1px solid #DDD;
  border-radius: 38px;
	overflow: hidden;
	position: absolute;
}

.bt-chat-details,
.bt-chat-status {
  margin-left: 50px;
}

.bt-chat-details {
	display: inline-block;
  font-size: 16px;
}

.bt-chat-status {
  font-size: 10px;
}

.bt-chat-logout {
  position: absolute;
  top: 15px;
  right: 15px;
  float: right;
	font-weight: 700;
  text-transform: uppercase;
	letter-spacing: 1px;
	font-size: 10px;
	padding: 1px 7px 1px 7px;
	color: #555;
	cursor: pointer;
  border-radius: 5px;
	background-color: rgba(255,255,255,0.5);
}

.bt-chat-logout:hover {
	background-color: rgba(255,255,255,.7);
}

.bt-chat-body {
  padding: 15px 10px 10px 10px;
	box-sizing: border-box;
}

.bt-chat-timestamp {
	text-transform: uppercase;
	font-size: 10px;
	letter-spacing: 1px;
	font-weight: bold;
	color: #AAA;
	text-align: center;
	width: 100%;
	margin-bottom: 10px;
}

.bt-chat-message {
  display: block;
	width: 100%;
	clear: both;
}

.bt-chat-message.received {
  margin-bottom: 15px;
}

.bt-chat-speechbubble {
  padding: 10px;
	border-radius: 15px;
	display: inline-block;
	max-width: 200px;
}

.bt-chat-speechbubble.sent {
  background-color: black;
	color: white;
	float: right;
  display: block;
  margin-bottom: 25px;
}

.bt-chat-speechbubble.received {
	border: 1px solid #FAD232;
	margin-left: 50px;
}

.bt-chat-bot-name {
  width: 100%;
	font-size: 10px;
	display: block;
	margin-left: 55px;
}

.bt-chat-footer {
  background-color: #FAD232;
  width: 100%;
  bottom: 0;
  position: absolute;
  padding: 15px 10px 10px 10px;
	box-sizing: border-box;
}

.bt-chat-input {
  width: 280px;
  height: 38px;
  padding: 10px;
  border-radius: 15px;
  float: left;
  border: 0;
  font-size: 16px;
}

.bt-chat-input:focus {
  outline: 0;
}

.bt-chat-submit {
  border: 0;
  background: transparent;
  width: 38px;
  height: 38px;
  border-radius: 20px;
  text-align: center;
  background-color: black;
  color: white;
  float: right;
}

.bt-chat-submit:hover {
  cursor: pointer;
  background-color: #555;
}
</style>
