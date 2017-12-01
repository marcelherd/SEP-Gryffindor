<template>
  <bt-page-container pageTitle="Bot Details">
    <md-layout md-flex="100">
      <h1 class="bt-header-1">{{ bot.name }}</h1>
    </md-layout>
    <bt-flash-message ref="flashMessage" />
    <md-layout md-column>
      <bt-form-section header="Bot configuration">
        <bt-input v-model="bot.name" type="text" placeholder="Name" />
        <bt-input v-model="bot.greeting" type="text" placeholder="Greeting" />
      </bt-form-section>

      <bt-form-section header="Dialogue configuration">
        <div class="bt-card">
          <div class="bt-card-header">
            <input v-model="newIntent.name" placeholder="Enter title" />
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
                <div>
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
                <div>
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
              <bt-button @click="deleteIntent(index)" class="bt-card-action">Delete Intent</bt-button>
            </md-layout>
          </div>
        </div>

      <bt-button @click="save" theme="orange">Save Bot</bt-button>
    </md-layout>
  </bt-page-container>
</template>

<script>
import PageContainer from '@/components/layout/PageContainer'
import FormSection from '@/components/core/FormSection'
import FlashMessage from '@/components/core/FlashMessage'
import Button from '@/components/core/Button'
import Input from '@/components/core/Input'

import RuntimeService from '@/services/RuntimeService'

export default {
  name: 'bot-edit',
  components: {
    'bt-page-container': PageContainer,
    'bt-form-section': FormSection,
    'bt-flash-message': FlashMessage,
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

    save () {
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
.bt-card {
  box-shadow: rgba(0, 0, 0, 0.11) 2px 4px 29px 5px;
  margin-bottom: 48px;
}

.bt-card input:focus {
  outline: 0;
}

.bt-card input:focus {
  background-color: #FAD232;
}

.bt-card-header {
  padding: 12px;
  padding-left: 20px;
  background-color: #FAD232;
  font-size: 24px;
}

.bt-card-header input {
  border: 0;
  background-color: transparent;
  font-size: 24px;
  outline: 0;
}

.bt-card-body {
  padding: 12px;
  padding-left: 20px;
}

.bt-card-subtitle {
  color: #aaa;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 10px;
}

.bt-card-utterance {
  border: 2px solid black;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 8px;
  font-size: 16px;
}

.bt-card-utterance:first-child {
  border-radius: 8px;
  border-bottom-left-radius: 0;
}

.bt-card-utterance:last-of-type {
  border-radius: 8px;
  border-top-left-radius: 0;
}

.bt-card-utterance:only-of-type {
  border-radius: 8px !important;
}

.bt-card-utterances input {
  display: block;
  margin-bottom: 6px;
}

.bt-card-answer {
  border: 2px solid black;
  border-radius: 8px;
  border-bottom-left-radius: 0;
  padding: 8px;
  font-size: 16px;
}

.bt-button-toggle {
  padding: 8px;
}

.bt-button-toggle .md-button:hover {
  background-color: #F9F2AE !important;
}

.bt-button-toggle .md-button.md-toggle {
  background-color: #FAD232;
}

.bt-card-action {
  margin-top: 20px;
}

.bt-card-header ::-webkit-input-placeholder {
  color: #888;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-position: under;
}
.bt-card-header ::-moz-placeholder {
  color: #888;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-position: under;
}
.bt-card-header ::-ms-placeholder {
  color: #888;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-position: under;
}
.bt-card-header ::placeholder {
  color: #888;
  text-decoration: underline;
  text-decoration-style: dashed;
  text-underline-position: under;
}

::-webkit-input-placeholder {
    color:#BDBDBD;
}
::-moz-placeholder {
    color:#BDBDBD;
}
::-ms-placeholder {
    color:#BDBDBD;
}
::placeholder {
    color:#BDBDBD;
}
</style>
