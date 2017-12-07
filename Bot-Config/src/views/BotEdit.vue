<template>
  <bt-page-container pageTitle="Bot Details">
    <md-layout md-flex="100">
      <h1 class="bt-header-1">{{ bot.name }}</h1>
    </md-layout>
    <bt-flash-message ref="flashMessage" />
    <md-layout md-column v-if="bot.template === 'FAQ-Bot'">
      <bt-form-section header="Bot configuration">
        <bt-input v-model="bot.name" type="text" placeholder="Name" />
        <bt-input v-model="bot.greeting" type="text" placeholder="Greeting" />
      </bt-form-section>

      <bt-form-section header="Dialogue configuration">
        <div class="bt-card">
          <div class="bt-card-header">
            <input v-model="newIntent.name" placeholder="Intent name" />
          </div>
          <div class="bt-card-body">
            <md-layout md-flex="100">
              <md-layout md-flex="50" md-column>
                <span class="bt-card-subtitle">If user says something like</span>
                <div class="bt-card-utterances">
                  <input placeholder="Type utterance" class="bt-card-utterance"
                    v-for="(utterance, index) in newIntent.utterances" v-model="utterance.text" :key="index"
                    @keyup="checkNewUtterance($event, newIntent, index)" />
                </div>
              </md-layout>
              <md-layout md-flex md-column md-vertical-align="end" md-align="start">
                <span class="bt-card-subtitle">Reply with</span>
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
                        <md-icon>android</md-icon>
                      </md-button>
                    </md-button-toggle>
                  </md-layout>
                </div>
              </md-layout>
            </md-layout>
            <md-layout>
              <bt-button @click="addIntent" class="bt-card-action">Save Intent</bt-button>
            </md-layout>
          </div>
        </div>
      </bt-form-section>

      <div v-for="(intent, index) in bot.intents" :key="index" class="bt-card">
          <div class="bt-card-header">
            <input v-model="intent.name" placeholder="Enter title" />
          </div>
          <div class="bt-card-body">
            <md-layout md-flex="100">
              <md-layout md-flex="50" md-column>
                <span class="bt-card-subtitle">If user says something like</span>
                <div class="bt-card-utterances">
                  <input placeholder="Type utterance" class="bt-card-utterance"
                    v-for="(utterance, index) in intent.utterances" v-model="utterance.text" :key="index"
                    @keyup="checkNewUtterance($event, intent, index)" />
                </div>
              </md-layout>
              <md-layout md-flex md-column md-vertical-align="end" md-align="start">
                <span class="bt-card-subtitle">Reply with</span>
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
                        <md-icon>android</md-icon>
                      </md-button>
                    </md-button-toggle>
                  </md-layout>
                </div>
              </md-layout>
            </md-layout>
            <md-layout>
              <bt-button @click="deleteIntent(index)" class="bt-card-action" theme="red">Delete Intent</bt-button>
            </md-layout>
          </div>
        </div>

      <md-layout md-row>
        <bt-button @click="deleteBot" theme="red" align="start">Delete Bot</bt-button>
        <bt-button @click="saveBot" theme="orange">Save Bot</bt-button>
      </md-layout>
    </md-layout>

    <md-layout md-column v-if="bot.template === 'Welcome-Bot'">
      <bt-form-section header="Bot configuration">
        <bt-input v-model="bot.name" type="text" placeholder="Name" />
        <bt-input v-model="bot.greeting" type="text" placeholder="Greeting" />
      </bt-form-section>

      <bt-form-section header="Dialog configuration">
        <div class="bt-tree">
          <bt-tree-node :node="bot.dialogTree.root" isRoot="true" />
        </div>
      </bt-form-section>

      <md-layout md-row class="bt-page-controls">
        <bt-button @click="deleteBot" theme="red" align="start">Delete Bot</bt-button>
        <bt-button @click="saveBot" theme="orange">Save Bot</bt-button>
      </md-layout>
    </md-layout>
  </bt-page-container>
</template>

<script>
import PageContainer from '@/components/layout/PageContainer'
import FormSection from '@/components/core/FormSection'
import FlashMessage from '@/components/core/FlashMessage'
import TreeNode from '@/components/edit/TreeNode'
import Button from '@/components/core/Button'
import Input from '@/components/core/Input'

import RuntimeService from '@/services/RuntimeService'

export default {
  name: 'bot-edit',
  components: {
    'bt-page-container': PageContainer,
    'bt-form-section': FormSection,
    'bt-flash-message': FlashMessage,
    'bt-tree-node': TreeNode,
    'bt-button': Button,
    'bt-input': Input
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
      }
    }
  },
  created () {
    this.fetchData()
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
          this.$refs.flashMessage.setType('info')
          this.$refs.flashMessage.pushMessage('Bot saved.')
        } else {
          this.$refs.flashMessage.setType('error')
          this.$refs.flashMessage.pushMessage(data.message)
        }
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
          this.$refs.flashMessage.setType('error')
          this.$refs.flashMessage.pushMessage(data.message)
        }
      })
    },

    answerPlaceholder (intent) {
      if (intent.answer.type === 'text') {
        return 'Type answer'
      }

      if (intent.answer.type === 'link') {
        return 'Type link'
      }

      if (intent.answer.type === 'skill') {
        return 'Type skill'
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
