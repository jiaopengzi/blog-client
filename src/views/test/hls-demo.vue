<template>
  <div class="video-container">
    <video ref="video" class="custom-video" controls>
      <track src="http://10.10.2.222:8081/api/v1/uploads/zimu.vtt" kind="subtitles" srclang="cn" label="中文" default />
    </video>
    <div class="controls">
      <button @click="togglePlayPause">{{ isPlaying ? 'Pause' : 'Play' }}</button>
      <input type="range" min="0" :max="duration" v-model="currentTime" @input="seekVideo" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'TestVue' })
import { ref, onMounted } from 'vue';
import Hls from 'hls.js';
import type { HlsConfig, LoaderConfiguration, LoaderCallbacks, LoaderContext, LoaderStats } from 'hls.js';
import type { KeyLoaderContext } from 'custom-hls';
import { playKeyDecryptAES2Bin } from '@/utils/encrypt';

const video = ref<HTMLVideoElement | null>(null);

const isPlaying = ref(false);
const duration = ref(0);
const currentTime = ref(0);

const togglePlayPause = () => {
  if (video.value) {
    if (isPlaying.value) {
      video.value.pause();
    } else {
      video.value.play();
    }
    isPlaying.value = !isPlaying.value;
  }
};

const seekVideo = () => {
  if (video.value) {
    video.value.currentTime = currentTime.value;
    video.value.controls = true;
    video.value.loop = true;
    video.value.play();
    video.value?.requestFullscreen();
  }
};

class CustomKeyLoader extends Hls.DefaultConfig.loader {
  constructor(config: HlsConfig) {
    super(config);
  }

  load(context: KeyLoaderContext, config: LoaderConfiguration, callbacks: LoaderCallbacks<LoaderContext>): void {
    console.log('context:', context);
    console.log('config:', config);
    console.log('callbacks:', callbacks);

    const loaderStats: LoaderStats = {
      aborted: false,
      loaded: 0,
      retry: 0,
      total: 0,
      chunkCount: 0,
      bwEstimate: 0,
      loading: {
        start: window.performance.now(),
        first: 0,
        end: 0,
      },
      parsing: {
        start: 0,
        end: 0,
      },
      buffering: {
        start: 0,
        first: 0,
        end: 0,
      },
    };

    if (context.keyInfo) {
      fetch(context.keyInfo.decryptdata.uri)
        .then(response => {
          loaderStats.loading.first = window.performance.now();
          return response.json();
        })
        .then(data => {
          loaderStats.loading.end = window.performance.now();

          if (data.code === 8603) {
            const decryptedKey = this.decryptKey(data.data);
            context.keyInfo.decryptdata.key = decryptedKey;

            callbacks.onSuccess({ url: "", data: decryptedKey.buffer }, loaderStats, context, null);
          } else {
            callbacks.onError({ code: data.code, text: data.msg }, context, null, loaderStats);
          }
        })
        .catch(error => {
          loaderStats.loading.end = window.performance.now();
          callbacks.onError({ code: 500, text: error.message }, context, null, loaderStats);
        });
    } else {
      // 对于未加密的视频，直接调用父类的 load 方法
      super.load(context, config, callbacks);
    }
  }

  decryptKey(encryptedKey: string): Uint8Array {
    const KeyBin = playKeyDecryptAES2Bin(encryptedKey);
    return KeyBin;
  }
}

onMounted(async () => {
  const videoSrcEndpoint = 'http://10.10.2.222:8081/api/v1/video/3-8de13d3c/2k';

  try {
    const response = await fetch(videoSrcEndpoint);
    const result = await response.json();

    if (result.code === 8602) {
      const { base_url, m3u8 } = result.data;
      const videoSrc = m3u8.replace(/_url_/g, base_url + "/");

      const blob = new Blob([videoSrc], { type: 'application/vnd.apple.mpegurl' });
      const blobUrl = URL.createObjectURL(blob);

      if (Hls.isSupported()) {
        const hls = new Hls({
          loader: CustomKeyLoader
        });

        hls.loadSource(blobUrl);
        hls.attachMedia(video.value!);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          video.value!.play();
          duration.value = video.value!.duration;
        });
      } else if (video.value!.canPlayType('application/vnd.apple.mpegurl')) {
        video.value!.src = blobUrl;
        video.value!.addEventListener('loadedmetadata', function () {
          video.value!.play();
          duration.value = video.value!.duration;
        });
      }

      video.value!.addEventListener('timeupdate', () => {
        currentTime.value = video.value!.currentTime;
      });
    } else {
      console.error(`Error fetching video source: ${result.msg}`);
    }
  } catch (error) {
    console.error('Error fetching video source:', error);
  }
});
</script>




<style scoped lang="scss">
.video-container {
  position: relative;
  width: 100%;
}

.custom-video {
  width: 100%;
  height: auto;
}

.controls {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(0, 0, 0, 0.5);
  padding: 10px;
  border-radius: 5px;
}

.controls button {
  background: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}

.controls input[type="range"] {
  flex: 1;
  margin: 0 10px;
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 5px;
  background: #ddd;
  border-radius: 5px;
  outline: none;
  opacity: 0.7;
  transition: opacity .2s;
}

.controls input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
}

.controls input[type="range"]::-moz-range-thumb {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #fff;
  cursor: pointer;
}
</style>
