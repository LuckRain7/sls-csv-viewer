<script setup>
import { computed, ref } from "vue";

const props = defineProps({
    open: { type: Boolean, default: false },
    data: { type: String, default: "" },
    logIndex: { type: [String, Number], default: "" },
    time: { type: String, default: "" },
});

const emit = defineEmits(["close"]);

const title = computed(
    () => `data JSON（logIndex=${props.logIndex || "-"}，time=${props.time || "-"}）`
);

const copied = ref(false);

const parsed = computed(() => {
    try {
        const w = JSON.parse(props.data || "{}");
        const v = deepParseJson(w);
        return { ok: true, text: JSON.stringify(v, null, 2) };
    } catch (e) {
        const msg = e instanceof Error ? e.message : "JSON 解析失败";
        return {
            ok: false,
            text: `JSON 解析失败：${msg}\n\n原始 data：\n${props.data ?? ""}`,
        };
    }
});

function deepParseJson(obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }

    // 如果是数组，递归处理每个元素
    if (Array.isArray(obj)) {
        return obj.map(deepParseJson);
    }

    // 如果是对象，遍历每个 key
    const result = {};
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            let value = obj[key];

            // 如果值是字符串，尝试解析为 JSON
            if (typeof value === "string") {
                try {
                    const parsed = JSON.parse(value);
                    // 只有解析成功且结果是对象或数组时才替换
                    if (typeof parsed === "object" && parsed !== null) {
                        value = deepParseJson(parsed); // 递归解析内部结构
                    }
                } catch (e) {
                    // 不是有效 JSON，保留原字符串
                }
            } else {
                // 非字符串，递归处理
                value = deepParseJson(value);
            }

            result[key] = value;
        }
    }

    return result;
}

function close() {
    emit("close");
}

async function copyToClipboard(text) {
    if (typeof text !== "string") return false;
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (e) {
        // ignore and fallback
    }

    try {
        const el = document.createElement("textarea");
        el.value = text;
        el.setAttribute("readonly", "true");
        el.style.position = "fixed";
        el.style.left = "-9999px";
        el.style.top = "0";
        document.body.appendChild(el);
        el.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(el);
        return ok;
    } catch (e) {
        return false;
    }
}

async function onCopy() {
    const ok = await copyToClipboard(parsed.value.text);
    if (!ok) return;
    copied.value = true;
    window.setTimeout(() => {
        copied.value = false;
    }, 1200);
}
</script>

<template>
    <teleport to="body">
        <div v-if="open" class="modalMask" @click.self="close">
            <div
                class="modal"
                role="dialog"
                aria-modal="true"
                :aria-label="title"
            >
                <div class="modalHeader">
                    <div class="modalTitle">{{ title }}</div>
                    <div class="modalActions">
                        <button
                            class="modalBtn"
                            type="button"
                            aria-label="复制"
                            :title="copied ? '已复制' : '复制'"
                            @click="onCopy"
                        >
                            {{ copied ? "已复制" : "复制" }}
                        </button>
                        <button
                            class="modalClose"
                            type="button"
                            aria-label="关闭"
                            @click="close"
                        >
                            <span aria-hidden="true">×</span>
                        </button>
                    </div>
                </div>
                <div class="modalBody">
                    <pre :class="['modalPre', parsed.ok ? '' : 'isError']">{{
                        parsed.text
                    }}</pre>
                </div>
            </div>
        </div>
    </teleport>
</template>

<style scoped>
.modalMask {
    position: fixed;
    inset: 0;
    background: rgba(17, 24, 39, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 999;
}

.modal {
    width: min(900px, 100%);
    max-height: min(80vh, 720px);
    background: #fff;
    border-radius: 12px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.modalHeader {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 12px 12px 14px;
    border-bottom: 1px solid #e5e7eb;
    background: #f9fafb;
}

.modalTitle {
    font-size: 13px;
    font-weight: 600;
    color: #111827;
}

.modalActions {
    display: inline-flex;
    align-items: center;
    gap: 10px;
}

.modalBtn {
    height: 32px;
    padding: 0 12px;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    background: #fff;
    font-size: 12px;
    line-height: 1;
    cursor: pointer;
    color: #111827;
}

.modalClose {
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

.modalBody {
    padding: 12px;
    overflow: auto;
}

.modalPre {
    margin: 0;
    white-space: pre;
    font-size: 12px;
    line-height: 1.45;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
        "Liberation Mono", "Courier New", monospace;
}

.modalPre.isError {
    color: #991b1b;
}
</style>
