<script setup>
const props = defineProps({
    open: { type: Boolean, default: false },
    hideRequestData: { type: Boolean, default: false },
});

const emit = defineEmits(["close", "update:hideRequestData"]);

function close() {
    emit("close");
}

function onToggle(e) {
    emit("update:hideRequestData", Boolean(e.target?.checked));
}
</script>

<template>
    <teleport to="body">
        <div v-if="open" class="settingsMask" @click.self="close">
            <div
                class="settingsModal"
                role="dialog"
                aria-modal="true"
                aria-label="设置"
            >
                <div class="settingsHeader">
                    <div class="settingsTitle">设置</div>
                    <button
                        class="settingsClose"
                        type="button"
                        aria-label="关闭"
                        @click="close"
                    >
                        <span aria-hidden="true">×</span>
                    </button>
                </div>
                <div class="settingsBody">
                    <div class="settingRow">
                        <div class="settingText">
                            <div class="settingName">隐藏请求数据</div>
                            <div class="settingDesc">
                                data 包含 User-Agent 时，隐藏数据
                            </div>
                        </div>
                        <label class="switch">
                            <input
                                :checked="hideRequestData"
                                type="checkbox"
                                aria-label="隐藏请求数据"
                                @change="onToggle"
                            />
                            <span class="switchSlider" aria-hidden="true" />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </teleport>
</template>

<style scoped>
.settingsMask {
    position: fixed;
    inset: 0;
    background: rgba(17, 24, 39, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 999;
}

.settingsModal {
    width: min(520px, 100%);
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
    overflow: hidden;
}

.settingsHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 12px 12px 14px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
}

.settingsTitle {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
}

.settingsClose {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background: #fff;
    font-size: 18px;
    line-height: 1;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.settingsBody {
    padding: 14px;
}

.settingRow {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 10px;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
}

.settingText {
    min-width: 0;
}

.settingName {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
}

.settingDesc {
    margin-top: 4px;
    font-size: 12px;
    color: #6b7280;
}

.switch {
    position: relative;
    display: inline-flex;
    align-items: center;
}

.switch input {
    position: absolute;
    opacity: 0;
    width: 1px;
    height: 1px;
}

.switchSlider {
    width: 42px;
    height: 24px;
    border-radius: 999px;
    background: #e5e7eb;
    border: 1px solid #d1d5db;
    position: relative;
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;
}

.switchSlider::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 2px;
    width: 18px;
    height: 18px;
    border-radius: 999px;
    background: #fff;
    border: 1px solid #d1d5db;
    transform: translateY(-50%);
    transition: transform 0.15s ease;
}

.switch input:checked + .switchSlider {
    background: #111827;
    border-color: #111827;
}

.switch input:checked + .switchSlider::after {
    transform: translate(18px, -50%);
    border-color: #111827;
}
</style>
