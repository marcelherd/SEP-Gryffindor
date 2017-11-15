<<template>
  <page-content page-title="Templates">
    <h2> Select Template </h2>
     <md-layout md-gutter="24">
    <md-layout md-flex-xsmall="100" md-flex-small="100" md-flex-medium="50" md-flex="25" v-for="template in this.templates">
      <md-card>
        <md-card-media>
          <img src="/static/robot.jpeg">
       </md-card-media>

        <md-card-header>
          <div class="md-title">{{template}}</div>
        </md-card-header>

        <md-card-actions>
          <router-link tag="md-button"
              :to="{ name: 'Create', params: { template: template }}">
          <md-button :template="template">Select</md-button>
          </router-link>
        </md-card-actions>
      </md-card>
      </md-layout>
      </md-layout>
  </page-content>
</template>

<script>

/**
 * This component implements the Bot Template Selection
 *
 * @module components/TemplateSelection
 */
import PageContent from '@/components/layout/PageContent'

export default {
  name: 'TemplateSelection',
  components: {
    'page-content': PageContent
  },
  data () {
    return {
      templates: []
    }
  },
  created () {
    // Fetches the template data whenever this component is instantiated
    this.fetchData()
  },
  methods: {
    /*
    *fetches available Bot Templates from the Bot marketplace
    */
    fetchData () {
      fetch('http://localhost:4000/api/v1/discover')
        .then(response => response.json())
        .then(data => {
          this.templates = data
        })
    }
  }

}
</script>
