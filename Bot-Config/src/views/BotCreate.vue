<template>
  <bt-page-container pageTitle="Bot details">
    <md-layout md-flex="100">
      <h1 class="bt-header-1">Feed the {{ bot.template }}</h1>
    </md-layout>
    <md-layout md-column>
      <bt-form-section header="Bot configuration">
        <bt-input v-model="bot.name" type="text" placeholder="Name" />
        <bt-input v-model="bot.greeting" type="text" placeholder="Greeting" />
      </bt-form-section>

      <bt-form-section header="Dialog Tree">
        <div class="bt-dialog-tree">
          <div class="bt-tree-node bt-root-node">
            <span class="bt-tree-node-title">Greeting</span>
            <div class="bt-tree-node-children">
              <div class="bt-tree-node bt-intent-node">
                <span class="bt-tree-node-title">Password forgotten</span>
                <span class="bt-tree-node-answer">"Use this link to reset your password"</span>
                <div class="bt-tree-node-children">
                  <div class="bt-tree-node bt-utterance-node">
                    <span class="bt-tree-node-title">
                      <md-icon>person</md-icon>
                      I forgot my password
                    </span>
                    <div class="bt-tree-node-children"></div>
                  </div>
                  <div class="bt-tree-node bt-utterance-node">
                    <span class="bt-tree-node-title">
                      <md-icon>person</md-icon>
                      I have forgotten my password
                      </span>
                    <div class="bt-tree-node-children"></div>
                  </div>
                </div>
              </div>
              <div class="bt-tree-node bt-intent-node">
                <span class="bt-tree-node-title">Username forgotten</span>
                <div class="bt-tree-node-children"></div>
              </div>
            </div>
          </div>
        </div>
      </bt-form-section>

      <bt-button @click="save" theme="orange">Save</bt-button>
    </md-layout>
  </bt-page-container>
</template>

<script>
import PageContainer from '@/components/layout/PageContainer'
import FormSection from '@/components/core/FormSection'
import Button from '@/components/core/Button'
import Input from '@/components/core/Input'

import RuntimeService from '@/services/RuntimeService'

export default {
  name: 'bot-create',
  components: {
    'bt-page-container': PageContainer,
    'bt-form-section': FormSection,
    'bt-button': Button,
    'bt-input': Input
  },
  data () {
    return {
      bot: {
        name: '',
        greeting: '',
        template: this.$route.params.template
      }
    }
  },
  methods: {
    save () {
      const userId = this.$store.getters.user._id

      RuntimeService.saveBot(userId, this.bot)
        .then((data) => {
          this.$router.push({
            name: 'BotEdit',
            params: {
              userId,
              botId: data.message._id
            }
          })
        })
    }
  }
}
</script>

<style>
.bt-dialog-tree {
  margin-top: 20px;
}

.bt-tree-node-title {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.bt-root-node > .bt-tree-node-title {
  border: 1px solid #636363;
  color: #636363;
}

.bt-root-node > .bt-tree-node-title:hover {
  cursor: pointer;
  background-color: #636363;
  color: white;
}

.bt-intent-node > .bt-tree-node-title {
  border: 1px solid #6363FF;
  color: #6363FF;
}

.bt-intent-node > .bt-tree-node-answer {
  color: #6363FF;
}

.bt-intent-node > .bt-tree-node-title:hover {
  cursor: pointer;
  background-color: #6363FF;
  color: white;
}

.bt-utterance-node > .bt-tree-node-title {
  border: 1px solid #FF8729;
  border-top-right-radius: 0px;
  color: #FF8729;
}

.bt-utterance-node > .bt-tree-node-title:hover {
  cursor: pointer;
  background-color: #FF8729;
  color: white;
}

.bt-tree-node-title,
.bt-tree-node-answer {
  padding: 8px;
  border-radius: 16px;
}

.bt-tree-node .bt-tree-node-children {
  margin-top: 25px;
  padding-left: 25px;
}
</style>
