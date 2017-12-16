<template>
  <bt-page-container pageTitle="Bot Details">
    <md-layout md-flex="100">
      <md-layout md-flex>
        <h1 class="bt-header-1">{{ bot.name }}</h1>
      </md-layout>
      <md-layout md-flex="20" md-vertical-align="center">
        <bt-switch :initial="bot.running" @click="toggleBot" theme="white" />
      </md-layout>
    </md-layout>

    <md-layout md-column v-if="bot.template === 'FAQ-Bot'">
      <bt-form-section :header="$t('shared.lblBotConfiguration')">
        <bt-input v-model="bot.name" type="text" :placeholder="$t('shared.phName')" required="true" />
        <bt-input v-model="bot.greeting" type="text" :placeholder="$t('shared.phGreeting')" required="true" />
        <bt-select v-model="bot.environment" :values="environments" :label="$t('botEdit.lblTargetEnvironment')" />
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
              <bt-button @click="deleteIntent(index)" class="bt-card-action" theme="red" :confirmation="$t('botEdit.confirmIntentDelete')">{{ $t('botEdit.btnDeleteIntent') }}</bt-button>
            </md-layout>
          </div>
        </div>

      <md-layout md-row>
        <bt-button @click="deleteBot" theme="red" align="start" :confirmation="$t('botEdit.confirmBotDelete')">{{ $t('botEdit.btnDeleteBot') }}</bt-button>
        <bt-button @click="testing" theme="orange">{{ $t('botEdit.btnTesting') }}</bt-button>
      </md-layout>
    </md-layout>

    <md-layout md-column v-if="bot.template === 'Welcome-Bot'">
      <bt-form-section :header="$t('shared.lblBotConfiguration')">
        <bt-input v-model="bot.name" type="text" :placeholder="$t('shared.phName')" />
        <bt-input v-model="bot.greeting" type="text" :placeholder="$t('shared.phGreeting')" />
        <bt-select v-model="bot.environment" :values="environments" :label="$t('botEdit.lblTargetEnvironment')" />
      </bt-form-section>

      <bt-form-section :header="$t('shared.lblDialogueConfiguration')">
        <div class="bt-tree">
          <bt-tree-node :node="bot.dialogTree.root" :isRoot="bot.greeting" />
        </div>
      </bt-form-section>

      <md-layout md-row class="bt-page-controls">
        <bt-button @click="deleteBot" theme="red" align="start" :confirmation="$t('botEdit.confirmBotDelete')">{{ $t('botEdit.btnDeleteBot') }}</bt-button>
        <bt-button @click="testing" theme="orange">{{ $t('botEdit.btnTesting') }}</bt-button>
      </md-layout>
    </md-layout>

    <a @click="home" class="bt-back-button">
      <md-icon>
        arrow_back
      </md-icon>
    </a>

    <bt-fab @click="saveBot">
      <md-icon>save</md-icon>
    </bt-fab>

    <md-snackbar ref="snackbar" md-position="top center">
      <span>{{ flashMessage }}</span>
    </md-snackbar>

    <div class="bt-overlay" v-if="showOverlay">
      <div class="bt-overlay-content">
        <span>{{ $t('botEdit.lblCurrentlyTesting') }}</span>
      </div>
    </div>

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

/**
 * The bot edit view.
 *
 * @author Marcel Herd
 * @module views/BotEdit
 */
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
      flashMessage: '',
      showOverlay: false
    }
  },
  created () {
    this.fetchData()
  },
  computed: {
    environments () {
      return [
        'Staging',
        'Production'
      ]
    }
  },
  methods: {
    /**
     * Fetches the bot that is being edited.
     *
     * @method fetchData
     */
    fetchData () {
      const { userId, botId } = this.$route.params

      RuntimeService.findBotById(userId, botId).then((data) => {
        this.bot = data
      })
    },

    /**
     * Adds a new utterance to the given intent.
     *
     * @method addUtterance
     * @param {Object} intent - the intent which should have a new utterance
     */
    addUtterance (intent) {
      let newUtterance = { text: '', intentName: intent.name }
      intent.utterances.push(newUtterance)
    },

    /**
     * Checks whether a new utterance should be added to the given intent while typing in another utterance.
     *
     * @method checkNewUtterance
     * @param {event} $event - the keyup event
     * @param {Object} intent - the intent to which a new utterance might be added
     * @param {Number} index - the index of the utterance that is being typed into
     */
    checkNewUtterance ($event, intent, index) {
      if (index === (intent.utterances.length - 1) && $event.keyCode >= 49 && $event.keyCode <= 90) {
        this.addUtterance(intent)
      }
    },

    /**
     * Adds a new intent to the bot that is being edited.
     *
     * @method addIntent
     */
    addIntent () {
      this.bot.intents.push({
        name: this.newIntent.name || this.$t('botEdit.phQuestion'),
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

    /**
     * Deletes the intent at the given index.
     *
     * @method deleteIndex
     * @param {Number} index - the index of the intent
     */
    deleteIntent (index) {
      this.bot.intents.splice(index, 1)
    },

    /**
     * Saves all changes made to the bot.
     *
     * @method saveBot
     */
    saveBot () {
      if (this.bot.template === 'FAQ-Bot') {
        this.showOverlay = true
      }

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
        this.showOverlay = false
      })
    },

    /**
     * Deletes the bot that is being edited.
     * If successful, it forwards to the overview page.
     * Otherwise, it displays an error in the snackbar.
     *
     * @method deleteBot
     */
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

    /**
     * Toggles (starts/stops) the bot that is being edited.
     *
     * @method toggleBot
     */
    toggleBot () {
      RuntimeService.toggleBot(this.$route.params.userId, this.bot).then((data) => {
        if (data.success) {
          this.fetchData()
        }
      })
    },

    /**
     * Determines the answer input placeholder for the given intent, depending on the intent's type.
     *
     * @method answerPlaceholder
     * @param {Object} intent
     */
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
    },

    /**
     * Navigates to the overview page.
     *
     * @method home
     */
    home () {
      this.$router.push({
        name: 'Overview',
        params: { userId: this.$store.getters.user._id }
      })
    },

    /**
     * Navigates to the live testing page.
     *
     * @method testing
     */
    testing () {
      const { userId, botId } = this.$route.params

      this.$router.push({
        name: 'Testing',
        params: { userId, botId }
      })
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
