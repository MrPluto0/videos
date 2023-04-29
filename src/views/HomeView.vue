<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getIntros } from '../apis/intro'

const router = useRouter()
const intros = ref<any>({})

const jump = (type: string) => {
  router.push(`/videos?type=${type}`)
}

onMounted(async () => {
  // intros.value = await getIntros()
})
</script>

<template>
  <div class="main">
    <div class="left col" @click="jump('mp4')">
      <div class="title">MP4</div>
      <div class="intro">{{ intros["mp4"] || 'Some introduction for MP4' }}</div>
    </div>
    <div class="middle col" @click="jump('hls')">
      <div class="title">HLS</div>
      <div class="intro">{{ intros["hls"] || 'Some introduction for HLS' }}</div>
    </div>
    <div class="right col" @click="jump('dash')">
      <div class="title">MPEG-DASH</div>
      <div class="intro">{{ intros["dash"] || 'Some introduction for MPEG-DASH' }} </div>
    </div>
  </div>
</template>

<style scoped>
.main {
  background-image: url(../assets/background.jpg);
  background-size: cover;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: auto;
}

.title {
  font-size: 25px;
  margin-top: 40vh;
  margin-bottom: 20px
}

.left {
  background-color: rgba(15, 14, 14, 0.7);
}

.middle {
  background-color: rgba(114, 79, 78, 0.5);
}

.right {
  background-color: rgba(67, 78, 67, 0.6);
}

.col {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  color: white;
  padding: 30px;
  box-sizing: border-box;
  text-align: justify;
}
</style>