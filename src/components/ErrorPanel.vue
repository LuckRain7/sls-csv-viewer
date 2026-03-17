<script setup>
import { ref } from "vue";

const props = defineProps({
    /** 出错的 logIndex 列表 */
    logIndexes: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits([
    /** 用户点击某个 logIndex，父组件负责滚动定位 */
    "jump",
]);

const collapsed = ref(false);
</script>

<template>
    <div v-if="logIndexes.length" class="errorPanel">
        <button
            class="errorPanelHeader"
            type="button"
            @click="collapsed = !collapsed"
        >
            <span class="errorPanelTitle">出错 ({{ logIndexes.length }})</span>
            <span class="errorPanelArrow">{{ collapsed ? "▶" : "▼" }}</span>
        </button>
        <div v-if="!collapsed" class="errorPanelBody">
            <button
                v-for="idx in logIndexes"
                :key="idx"
                class="errorPanelItem"
                type="button"
                @click="emit('jump', idx)"
            >
                {{ idx }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.errorPanel {
    position: fixed;
    left: 16px;
    top: 16px;
    z-index: 100;
    width: 140px;
    background: #fff;
    border: 1px solid #fecaca;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    overflow: hidden;
}

.errorPanelHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 8px 10px;
    background: #fef2f2;
    border: none;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    color: #991b1b;
    text-align: left;
    gap: 6px;
}

.errorPanelHeader:hover {
    background: #fee2e2;
}

.errorPanelTitle {
    flex: 1;
    min-width: 0;
}

.errorPanelArrow {
    font-size: 10px;
    flex-shrink: 0;
}

.errorPanelBody {
    display: flex;
    flex-direction: column;
    max-height: 320px;
    overflow-y: auto;
    padding: 4px 0;
}

.errorPanelItem {
    display: block;
    width: 100%;
    padding: 5px 10px;
    background: none;
    border: none;
    text-align: left;
    font-size: 12px;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
        "Liberation Mono", "Courier New", monospace;
    color: #b91c1c;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.errorPanelItem:hover {
    background: #fef2f2;
    text-decoration: underline;
}
</style>
