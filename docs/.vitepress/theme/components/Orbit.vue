<script setup>
import { computed } from 'vue'

const props = defineProps({
  /**
   * The radius of the orbit in pixels
   */
  radius: {
    type: Number,
    default: 50,
  },
  /**
   * Animation duration in seconds
   */
  duration: {
    type: Number,
    default: 20,
  },
  /**
   * Animation delay in seconds
   */
  delay: {
    type: Number,
    default: 0,
  },
  /**
   * Animation direction: 'normal' or 'reverse'
   */
  direction: {
    type: String,
    default: 'normal',
    validator: (value) => ['normal', 'reverse'].includes(value),
  },
  /**
   * Show orbit path
   */
  path: {
    type: Boolean,
    default: true,
  },
})

const orbitStyle = computed(() => ({
  '--radius': `${props.radius}px`,
  '--duration': `${props.duration}s`,
  '--delay': `${props.delay}s`,
  '--direction': props.direction,
}))

const pathStyle = computed(() => ({
  width: `${props.radius * 2}px`,
  height: `${props.radius * 2}px`,
}))
</script>

<template>
  <div class="orbit-container" :style="orbitStyle">
    <div v-if="path" class="orbit-path" :style="pathStyle" />

    <div class="orbit-item">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.orbit-container {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
}

.orbit-path {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  border: 1px dashed rgba(99, 102, 241, 0.25);
  pointer-events: none;
}

.dark .orbit-path {
  border-color: rgba(139, 92, 246, 0.3);
}

.orbit-item {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: orbit var(--duration) linear infinite;
  animation-delay: var(--delay);
  animation-direction: var(--direction);
  z-index: 10;
}

@keyframes orbit {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) translateX(var(--radius)) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg) translateX(var(--radius)) rotate(-360deg);
  }
}
</style>

