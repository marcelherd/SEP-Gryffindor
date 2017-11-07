<script>
export default {
  data () {
    return {
      initialValue: 'My initial value'
    }
  },
  methods: {
    fetchFunction (param) {
      // param = { queryParam: query }

      // 'fetchAutocomplete' should return a Promise.

      // md-autocomplete will call fetchAutocomplete and pass
      // 'param' as an argument.
      // the 'param' is composed by a query param and
      // a query.
    }
  }
}
</script>
