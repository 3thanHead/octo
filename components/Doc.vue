<script lang="ts">
import moment from 'moment'
import CoreDivider from '#root/components/CoreDivider.vue'
import { DISCARD_DOCUMENT, RESTORE_DOCUMENT } from '#root/src/store/actions'
import { toHtml } from '#root/src/utils/markdown'

export default {
  components: {
    CoreDivider,
  },
  props: {
    text: {
      required: true,
      type: String,
    },
    id: String,
    updatedAt: Date,
    discardedAt: {
      required: false,
      type: Date as PropType<Date | null>,
    },
    allowDiscard: Boolean,
  },
  setup(props) {
    const html = computed(() => {
      const rawHtml = toHtml(props.text)

      if (rawHtml.includes('href')) {
        // Todo: Figure out how to intercept links in micromark.
        return rawHtml.replace(/href=".*?"/g, '')
      }

      return rawHtml
    })

    return {
      html,
    }
  },
  computed: {
    updated() {
      return `Updated on ${moment(this.updatedAt).format('ddd, MMM Do, YYYY [at] h:mm A')}`
    },
  },
  methods: {
    discard() {
      this.$store.dispatch(DISCARD_DOCUMENT, { id: this.id })
    },
    restore() {
      this.$store.dispatch(RESTORE_DOCUMENT, { id: this.id })
    },
  },
}
</script>

<template>
  <CoreLayer
    class="relative flex flex-col min-w-0 rounded text-sm overflow-hidden cursor-pointer bg-layer"
    data-test-doc
  >
    <CoreLayer class="flex-grow flex-shrink overflow-hidden">
      <CoreProse class="p-4 prose-sm" v-html="html" />
    </CoreLayer>
    <CoreDivider class="mx-2" />
    <div class="flex items-center justify-between p-4">
      <p class="text-layer-muted">
        {{ updated }}
      </p>
      <div v-if="allowDiscard">
        <CoreButton v-if="discardedAt" class="text-sm" @click.stop="restore">
          <Icon name="Trash" />
          <span>Restore</span>
        </CoreButton>
        <CoreButton v-else class="text-sm text-red-500" @click.stop="discard">
          <Icon name="Trash" />
          <span>Discard</span>
        </CoreButton>
      </div>
    </div>
  </CoreLayer>
</template>
