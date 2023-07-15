<template>
  <svg viewBox="0 16 600 448">
    <defs>
      <polygon id="8gon" points="1,0 0.7071067811865476,0.7071067811865475 0,1 -0.7071067811865475,0.7071067811865476 -1,0 -0.7071067811865477,-0.7071067811865475 0,-1 0.7071067811865474,-0.7071067811865477 1,0" />
    </defs>
    <g :transform="transform" :stroke-width="lw">
      <rect :x="bg.x" :y="bg.y" :width="bg.w" :height="bg.h" :fill="bg.fill" />
      <g v-for="c in buttons" :key="c.id">
        <circle :cx="c.x" :cy="c.y" :r="c.r" fill="none" :stroke="c.color" />
      </g>
      <g v-for="c in sticks" :key="c.id">
        <use :stroke-width="lw/c.stroke.scale" :transform="c.stroke.transform" :stroke="c.stroke.color" fill="none" href="#8gon" />
        <circle :cx="c.fill.x" :cy="c.fill.y" :r="c.fill.r" :fill="c.fill.color" stroke="none" />
      </g>
      <g v-for="c in triggers" :key="c.id">
        <rect
          :x="c.stroke.x" :y="c.stroke.y" :width="c.stroke.w" :height="c.stroke.h"
          :stroke="c.stroke.color" fill="none"
        />
        <rect
          :x="c.fill.x" :y="c.fill.y" :width="c.fill.w" :height="c.fill.h"
          :fill="c.fill.color" stroke="none"
        />
      </g>
    </g>
  </svg>
</template>

<script>
import {rgbaI2S, cI2S} from '../utils.js';

export default {
  props: {
    config: Object,
  },
  computed: {
    transform() {
      const {x, y, height} = this.config;
      return `scale(0.9375,1) translate(${x||0}, ${y||0}) scale(${(height||0)/120})`;
    },
    lw() {
      const {lw} = this.config;
      return lw/6;
    },
    bg() {
      const {bgRGB, bgA, bgLeft, bgRight, bgTop, bgBot} = this.config;
      return {
        x: bgLeft,
        y: bgTop,
        w: bgRight - bgLeft,
        h: bgBot - bgTop,
        fill: rgbaI2S(bgRGB, bgA),
      };
    },
    buttons() {
      return this.config.buttons.map(c => ({
        ...c,
        color: cI2S(c.c),
      }));
    },
    sticks() {
      return this.config.sticks.map(c => ({
        id: c.id,
        stroke: {
          transform: `translate(${c.x||0}, ${c.y||0}) scale(${c.rS||0})`,
          scale: c.rS,
          color: cI2S(c.cS),
        },
        fill: {
          x: c.x,
          y: c.y,
          r: c.rF,
          color: cI2S(c.cF),
        },
      }));
    },
    triggers() {
      const {cTF, cTS, triggers} = this.config;
      return triggers.map(c => ({
        fill: {
          color: cI2S(cTF),
          x: c.w > 0 ? c.x : c.x+c.wa,
          y: c.y0,
          w: Math.abs(c.wa),
          h: c.y1-c.y0,
        },
        stroke: {
          color: cI2S(cTS),
          x: c.w > 0 ? c.x : c.x+c.w,
          y: c.y0,
          w: Math.abs(c.w),
          h: c.y1-c.y0,
        },
      }));
    },
  },
}
</script>

<style scoped>
svg {
  width: 600px;
  height: 448px;
  position: absolute;
  top: 16px;
}
</style>
