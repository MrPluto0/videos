<script setup lang="ts">
import { onMounted, reactive, watch, ref } from 'vue';
import Hls from 'hls.js';
import Dash from 'dashjs';
import { getVideos } from '../apis/videos'
import { useRoute } from 'vue-router';

interface IVideo {
  feedurl: string;
  nickname: string;
  description: string;
  avatar: string;
}

const HlsVideoRef = ref()
const DashVideoRef = ref()
const route = useRoute()
const form = reactive({
  type: 'mp4' as 'mp4' | 'hls' | 'dash',
  algorithm: 'abrThroughput',
  id: 0,
  video: {} as IVideo,
  videos: [] as IVideo[]
})

const Algorithms = [
  {
    value: 'abrThroughput',
    label: 'abrThroughput'
  },
  {
    value: 'abrBola',
    label: 'abrBola',
  },
  {
    value: 'abrDynamic',
    label: 'abrDynamic'
  },
  {
    value: 'abrL2A',
    label: 'abrL2A'
  },
  {
    value: 'abrLoLP',
    label: 'abrLoLP'
  }
]
const VideoTypes = [
  {
    value: 'mp4',
    label: 'MP4'
  },
  {
    value: 'hls',
    label: 'HLS'
  },
  {
    value: 'dash',
    label: 'DASH'
  }
]

const updateType = async (type: 'mp4' | 'hls' | 'dash') => {
  let res: IVideo[] = await getVideos(type);
  form.videos = res;
  form.type = type;
  form.video = res[form.id]

  let target = res[form.id];
  switch (type) {
    case 'mp4':
      break;
    case 'hls':
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.attachMedia(HlsVideoRef.value);
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
          hls.loadSource(target.feedurl);
        });
      }
      break;
    case 'dash':
      let player = Dash.MediaPlayer().create();
      player.updateSettings({
        streaming: {
          abr: {
            ABRStrategy: form.algorithm as "abrThroughput" | "abrBola" | "abrDynamic" | "abrL2A" | "abrLoLP"
          }
        }
      });
      player.initialize(DashVideoRef.value, target.feedurl, true);
      break
  }
}

watch(() => [form.type, form.id, form.algorithm], () => {
  console.log('[video change]', form.type, form.id);

  updateType(form.type)
})

onMounted(() => {
  const type = route.query.type || 'mp4';
  updateType(type as 'mp4' | 'hls' | 'dash')
})
</script>

<template>
  <div class="main clearfix">
    <div class="control">
      <div>
        <span style="margin-right: 10px;">视频类型</span>
        <el-select style="width: 150px;background-color: rgba(13, 22, 53, .5);" v-model="form.type" class="m-2"
          placeholder="Select" size="large">
          <el-option v-for="item in VideoTypes" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>

      <div v-if="form.type === 'dash'" style="margin-left: 50px;">
        <span style="margin-right: 10px;">Abr算法</span>
        <el-select style="width: 150px;background-color: rgba(13, 22, 53, .5);" v-model="form.algorithm" class="m-2"
          placeholder="Select" size="large">
          <el-option v-for="item in Algorithms" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
    </div>

    <div class="flex">
      <div class="v">
        <video v-if="form.type === 'hls'" ref="HlsVideoRef" width="1200" height="700" controls></video>
        <video v-else-if="form.type === 'mp4'" width="1200" height="700" controls :src="form.video.feedurl || ''" />
        <video v-else-if="form.type === 'dash'" ref="DashVideoRef" width="1200" height="700" controls />
      </div>
      <el-card class="list">
        <template #header>
          Video List
        </template>
        <el-scrollbar height="600px" class="videos">
          <div class="video" v-for="(v, i) in form.videos" :key="i">
            <div @click="() => form.id = i">
              <el-image :src="v.avatar" />
              <div style="text-align: center">
                <span class="name">{{ v.nickname }}</span>
                <span class="desc">{{ v.description }}</span>
              </div>
            </div>
          </div>
        </el-scrollbar>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.main {
  background-image: url(../assets/background.jpg);
  background-size: cover;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.flex {
  display: flex;
}

.v {
  margin: 50px 0 0 50px;
}

.list {
  margin: 50px;
  width: 20vw;
}

.control {
  margin: 50px 0 0 50px;
  display: flex;
}

.box-card {
  margin-bottom: 20px;
}

.video {
  margin-bottom: 20px;
}

.name {
  font-size: 16px;
  margin-right: 10px;
}

.desc {
  color: #999;
  font-size: 13px;
}

#xg {
  width: 1000px;
  margin: 50px;
}
</style>
