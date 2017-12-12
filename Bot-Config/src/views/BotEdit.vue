<template>
  <bt-page-container pageTitle="Bot Details">
    <md-layout md-flex="100">
      <md-layout md-flex>
        <h1 class="bt-header-1">{{ bot.name }}</h1>
      </md-layout>
      <md-layout md-flex="20" md-vertical-align="center">
        <bt-switch :initial="bot.running" @click="toggleBot(bot)" theme="white" />
      </md-layout>
    </md-layout>

    <md-layout md-column v-if="bot.template === 'FAQ-Bot'">
      <bt-form-section :header="$t('shared.lblBotConfiguration')">
        <bt-input v-model="bot.name" type="text" :placeholder="$t('shared.phName')" />
        <bt-input v-model="bot.greeting" type="text" :placeholder="$t('shared.phGreeting')" />
        <bt-select v-model="bot.environment" :values="environments" />
      </bt-form-section>

      <bt-form-section :header="$t('shared.lblDialogueConfiguration')">
        <div class="bt-card">
          <div class="bt-card-header">
            <input v-model="newIntent.name" :placeholder="$t('botEdit.phQuestion')" />
          </div>
          <div class="bt-card-body">
            <md-layout md-flex="100">
              <md-layout md-flex="50" md-column>
                <span class="bt-card-subtitle">{{ $t('botEdit.lblIfUserSays') }}</span>
                <div class="bt-card-utterances">
                  <input :placeholder="$t('botEdit.phUtterance')" class="bt-card-utterance"
                    v-for="(utterance, index) in newIntent.utterances" v-model="utterance.text" :key="index"
                    @keyup="checkNewUtterance($event, newIntent, index)" />
                </div>
              </md-layout>
              <md-layout md-flex md-column md-vertical-align="end" md-align="start">
                <span class="bt-card-subtitle">{{ $t('botEdit.lblReplyWith') }}</span>
                <div class="bt-card-answer-config">
                  <input v-model="newIntent.answer.value" :placeholder="answerPlaceholder(newIntent)" class="bt-card-answer" />

                  <md-layout md-align="end">
                    <md-button-toggle md-single class="bt-button-toggle">
                      <md-button class="md-icon-button" :class="newIntent.answer.type === 'text' ? 'md-toggle' : ''"
                        @click="newIntent.answer.type = 'text'">
                        <md-icon>title</md-icon>
                      </md-button>
                      <md-button class="md-icon-button" :class="newIntent.answer.type === 'link' ? 'md-toggle' : ''"
                        @click="newIntent.answer.type = 'link'">
                        <md-icon>link</md-icon>
                      </md-button>
                      <md-button class="md-icon-button" :class="newIntent.answer.type === 'skill' ? 'md-toggle' : ''"
                        @click="newIntent.answer.type = 'skill'">
                        <img src="/static/forward-icon.png" />
                      </md-button>
                    </md-button-toggle>
                  </md-layout>
                </div>
              </md-layout>
            </md-layout>
            <md-layout>
              <bt-button @click="addIntent" class="bt-card-action">{{ $t('botEdit.btnSaveIntent') }}</bt-button>
            </md-layout>
          </div>
        </div>
      </bt-form-section>

      <div v-for="(intent, index) in bot.intents" :key="index" class="bt-card">
          <div class="bt-card-header">
            <input v-model="intent.name" :placeholder="$t('botEdit.phQuestion')" />
          </div>
          <div class="bt-card-body">
            <md-layout md-flex="100">
              <md-layout md-flex="50" md-column>
                <span class="bt-card-subtitle">{{ $t('botEdit.lblIfUserSays') }}</span>
                <div class="bt-card-utterances">
                  <input :placeholder="$t('botEdit.phUtterance')" class="bt-card-utterance"
                    v-for="(utterance, index) in intent.utterances" v-model="utterance.text" :key="index"
                    @keyup="checkNewUtterance($event, intent, index)" />
                </div>
              </md-layout>
              <md-layout md-flex md-column md-vertical-align="end" md-align="start">
                <span class="bt-card-subtitle">{{ $t('botEdit.lblReplyWith') }}</span>
                <div class="bt-card-answer-config">
                  <input v-model="intent.answer.value" :placeholder="answerPlaceholder(intent)" class="bt-card-answer" />

                  <md-layout md-align="end">
                    <md-button-toggle md-single class="bt-button-toggle">
                      <md-button class="md-icon-button" :class="intent.answer.type === 'text' ? 'md-toggle' : ''"
                        @click="intent.answer.type = 'text'">
                        <md-icon>title</md-icon>
                      </md-button>
                      <md-button class="md-icon-button" :class="intent.answer.type === 'link' ? 'md-toggle' : ''"
                        @click="intent.answer.type = 'link'">
                        <md-icon>link</md-icon>
                      </md-button>
                      <md-button class="md-icon-button" :class="intent.answer.type === 'skill' ? 'md-toggle' : ''"
                        @click="intent.answer.type = 'skill'">
                        <img src="/static/forward-icon.png" />
                      </md-button>
                    </md-button-toggle>
                  </md-layout>
                </div>
              </md-layout>
            </md-layout>
            <md-layout>
              <bt-button @click="deleteIntent(index)" class="bt-card-action" theme="red">{{ $t('botEdit.btnDeleteIntent') }}</bt-button>
            </md-layout>
          </div>
        </div>

      <md-layout md-row>
        <bt-button @click="deleteBot" theme="red" align="start">{{ $t('botEdit.btnDeleteBot') }}</bt-button>
        <bt-button theme="orange">{{ $t('botEdit.btnTesting') }}</bt-button>
      </md-layout>
    </md-layout>

    <md-layout md-column v-if="bot.template === 'Welcome-Bot'">
      <bt-form-section :header="$t('shared.lblBotConfiguration')">
        <bt-input v-model="bot.name" type="text" :placeholder="$t('shared.phName')" />
        <bt-input v-model="bot.greeting" type="text" :placeholder="$t('shared.phGreeting')" />
        <bt-select v-model="bot.environment" :values="environments" />
      </bt-form-section>

      <bt-form-section :header="$t('shared.lblDialogueConfiguration')" :helpText="welcomeBotHelp">
        <div class="bt-tree">
          <bt-tree-node :node="bot.dialogTree.root" isRoot="true" />
        </div>
      </bt-form-section>

      <md-layout md-row class="bt-page-controls">
        <bt-button @click="deleteBot" theme="red" align="start">{{ $t('botEdit.btnDeleteBot') }}</bt-button>
        <bt-button theme="orange">{{ $t('botEdit.btnTesting') }}</bt-button>
      </md-layout>
    </md-layout>

    <bt-fab @click="saveBot">
      <md-icon>save</md-icon>
    </bt-fab>

    <md-snackbar ref="snackbar" md-position="top center">
      <span>{{ flashMessage }}</span>
    </md-snackbar>

  </bt-page-container>
</template>

<script>
import PageContainer from '@/components/layout/PageContainer'
import FormSection from '@/components/core/FormSection'
import FloatingActionButton from '@/components/core/FloatingActionButton'
import TreeNode from '@/components/edit/TreeNode'
import Button from '@/components/core/Button'
import Input from '@/components/core/Input'
import Select from '@/components/core/Select'
import Switch from '@/components/core/Switch'

import RuntimeService from '@/services/RuntimeService'

export default {
  name: 'bot-edit',
  components: {
    'bt-page-container': PageContainer,
    'bt-form-section': FormSection,
    'bt-fab': FloatingActionButton,
    'bt-tree-node': TreeNode,
    'bt-button': Button,
    'bt-input': Input,
    'bt-select': Select,
    'bt-switch': Switch
  },
  data () {
    return {
      bot: {},
      newIntent: {
        name: '',
        answer: {
          type: 'text',
          value: ''
        },
        utterances: [
          {
            text: ''
          }
        ]
      },
      flashMessage: 'wat'
    }
  },
  created () {
    this.fetchData()
  },
  computed: {
    welcomeBotHelp () {
      return `
        <strong>Dialogue configuration</strong><br>
        The dialogue configuration allows you to configure which issues your bot is able to assist users with.<br>
        <br>
        This can be done by creating text nodes which represent the different options a user has.<br>
        <br>
        To create your first node, simply click the plus button next to the conversation node.<br>
        You can create a multiple choice menu by attaching multiple nodes to another node.<br>
        If a node only has a single node attached to it, that node will be used as the answer to the node it is attached to.<br>
        <br>
        To forward the user to another skill, for instance the FAQ bot, simply enter the corresponding skill ID and prefix it with 'SKILL_'<br>
        <br>
        <strong>Example</strong><br>
        Conversation<br>
        &nbsp;&nbsp;1. Forgot password<br>
        &nbsp;&nbsp;&nbsp;&nbsp;http://reset.password.com<br>
        &nbsp;&nbsp;2. I have a question<br>
        &nbsp;&nbsp;&nbsp;&nbsp;SKILL_123123123<br>
        <br>
        A bot with this configuration will greet the user and then allow him to either choose the option "1. Forgot Password" or "2. I have a question".<br>
        <br>
        If the user enters "1", the bot will send him the configured link.<br>
        If the user enters "2", the bot will forward him to the configured skill.
      `
    },
    environments () {
      return [
        'Staging',
        'Production'
      ]
    }
  },
  methods: {
    fetchData () {
      const { userId, botId } = this.$route.params

      RuntimeService.findBotById(userId, botId).then((data) => {
        this.bot = data
      })
    },

    addUtterance (intent) {
      let newUtterance = { text: '', intentName: intent.name }
      intent.utterances.push(newUtterance)
    },

    checkNewUtterance ($event, intent, index) {
      if (index === (intent.utterances.length - 1) && $event.keyCode >= 49 && $event.keyCode <= 90) {
        this.addUtterance(intent)
      }
    },

    addIntent () {
      this.bot.intents.push({
        name: this.newIntent.name,
        answer: {
          type: this.newIntent.answer.type,
          value: this.newIntent.answer.value
        },
        utterances: this.newIntent.utterances
      })
      this.newIntent.name = ''
      this.newIntent.answer = {
        type: 'text',
        value: ''
      }
      this.newIntent.utterances = [{ text: '', intentName: '' }]
    },

    deleteIntent (index) {
      this.bot.intents.splice(index, 1)
    },

    saveBot () {
      const { userId } = this.$route.params

      this.bot.intents.forEach((intent) => {
        intent.utterances.forEach((utterance) => {
          utterance.intentName = intent.name
        })
      })

      RuntimeService.updateBot(userId, this.bot).then((data) => {
        if (data.success) {
          this.flashMessage = this.$t('botEdit.infoBotSaved')
        } else {
          this.flashMessage = data.message || this.$t('core.unknownError')
        }
        this.$refs.snackbar.open()
      })
    },

    deleteBot () {
      const { userId, botId } = this.$route.params

      RuntimeService.deleteBot(userId, botId).then((data) => {
        if (data.success) {
          this.$router.push({
            name: 'Overview',
            params: { userId }
          })
        } else {
          this.flashMessage = data.message
          this.$refs.snackbar.open()
        }
      })
    },

    toggleBot (bot) {
      RuntimeService.toggleBot(this.$route.params.userId, bot).then((data) => {
        if (data.success) {
          this.fetchData()
        }
      })
    },

    answerPlaceholder (intent) {
      if (intent.answer.type === 'text') {
        return this.$t('botEdit.phTextInput')
      }

      if (intent.answer.type === 'link') {
        return this.$t('botEdit.phLinkInput')
      }

      if (intent.answer.type === 'skill') {
        return this.$t('botEdit.phSkillInput')
      }
    }
  }
}
</script>

<style>
.bt-tree {
  width: 500px;
}

.bt-page-controls {
  margin-top: 48px;
}
</style>
