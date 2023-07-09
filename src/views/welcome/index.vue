<script setup lang="ts">
import dayjs from "dayjs";
import { getReleases } from "@/api/list";
// import { useWindowSize } from "@vueuse/core";
import { ref, markRaw } from "vue";
import { randomColor } from "@pureadmin/utils";
import { useRenderFlicker } from "@/components/ReFlicker";

defineOptions({
  name: "Welcome"
});

const list = ref();
const loading = ref<boolean>(true);
// const { version } = __APP_INFO__.pkg;
// const titleClass = computed(() => {
//   return ["text-base", "font-medium"];
// });

// const { height } = useWindowSize();

setTimeout(() => {
  loading.value = !loading.value;
}, 800);

getReleases().then(({ data }) => {
  list.value = data.list.map(v => {
    return {
      content: v.body,
      timestamp: dayjs(v.published_at).format("YYYY/MM/DD hh:mm:ss A"),
      icon: markRaw(
        useRenderFlicker({
          background: randomColor({ type: "hex" }) as string
        })
      )
    };
  });
});
</script>

<template>
  <div OnlineBoardGamesShop />
</template>

<style lang="scss" scoped>
:deep(.el-timeline-item) {
  margin: 6px 0 0 6px;
}

.main-content {
  margin: 20px 20px 0 !important;
}
</style>
