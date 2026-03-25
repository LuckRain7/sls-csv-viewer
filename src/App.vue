<script setup>
import { computed, ref, watch } from "vue";
import { extractCsvColumns } from "./utils/csv";
import JsonModal from "./components/JsonModal.vue";
import OpIcon from "./components/OpIcon.vue";
import SettingsModal from "./components/SettingsModal.vue";
import ErrorPanel from "./components/ErrorPanel.vue";
import ExportBar from "./components/ExportBar.vue";

const selectedFileName = ref("");
const loading = ref(false);
const errorMsg = ref("");
const missingColumns = ref([]);
const records = ref([]);
/** data 中包含「出错」的 logIndex 列表，用于在解析后红色提示 */
const dataErrorLogIndexes = ref([]);

const jsonModalOpen = ref(false);
const jsonModalData = ref("");
const jsonModalLogIndex = ref("");
const jsonModalTime = ref("");

const settingsOpen = ref(false);
const hideRequestData = ref(loadHideRequestData());

const rowCount = computed(() => records.value.length);

const HIDE_REQUEST_DATA_STORAGE_KEY = "sls-look:hideRequestData";

function loadHideRequestData() {
    try {
        const v = window?.localStorage?.getItem(HIDE_REQUEST_DATA_STORAGE_KEY);
        if (v === "1") return true;
        if (v === "0") return false;
        return false;
    } catch (e) {
        return false;
    }
}

watch(hideRequestData, (v) => {
    try {
        window?.localStorage?.setItem(
            HIDE_REQUEST_DATA_STORAGE_KEY,
            v ? "1" : "0"
        );
    } catch (e) {
        // ignore
    }
});

function openSettings() {
    settingsOpen.value = true;
}

function closeSettings() {
    settingsOpen.value = false;
}

function displayData(raw) {
    const s = typeof raw === "string" ? raw : String(raw ?? "");
    if (!hideRequestData.value) return s;
    if (!s) return "";
    return /user-agent/i.test(s) ? "[request hidden]" : s;
}

function openJsonModal(row) {
    jsonModalData.value = displayData(row.data ?? "");
    jsonModalLogIndex.value = row.logIndex ?? "";
    jsonModalTime.value = row.time ?? "";
    jsonModalOpen.value = true;
}

function closeJsonModal() {
    jsonModalOpen.value = false;
}

function toggleRowHighlight(rowId) {
    const idx = records.value.findIndex((r) => r._rowId === rowId);
    if (idx === -1) return;
    const cur = records.value[idx];
    records.value[idx] = { ...cur, _highlight: !cur._highlight };
}

function deleteRow(rowId) {
    records.value = records.value.filter((r) => r._rowId !== rowId);
}

function scrollToLogIndex(logIndex) {
    const el = document.getElementById(`row-log-${logIndex}`);
    if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}

/** 遍历 data，检查是否包含「出错」，将对应 logIndex 写入 dataErrorLogIndexes 供页面红色提示 */
function checkDataForError(dataList) {
    if (!Array.isArray(dataList) || dataList.length === 0) {
        dataErrorLogIndexes.value = [];
        return;
    }
    dataErrorLogIndexes.value = dataList
        .filter((r) => String(r.data ?? "").includes("出错"))
        .map((r) => r.logIndex ?? "(无)");
}

async function parseFile(file) {
    records.value = [];
    missingColumns.value = [];
    errorMsg.value = "";
    dataErrorLogIndexes.value = [];

    if (!file) return;
    selectedFileName.value = file.name;

    loading.value = true;
    try {
        const text = await file.text();
        const res = extractCsvColumns(text, ["data", "logIndex", "time"]);
        records.value = res.records
            .slice()
            .sort((a, b) => {
                const ai = Number(a.logIndex);
                const bi = Number(b.logIndex);
                const av = Number.isFinite(ai) ? ai : Number.POSITIVE_INFINITY;
                const bv = Number.isFinite(bi) ? bi : Number.POSITIVE_INFINITY;
                return av - bv;
            })
            .map((r, idx) => ({
                ...r,
                _rowId: `${r.logIndex ?? ""}__${r.time ?? ""}__${idx}`,
                _highlight: false,
            }));
        missingColumns.value = res.missingColumns;
        if (res.missingColumns.length) {
            errorMsg.value = `CSV 表头缺少列：${res.missingColumns.join(", ")}`;
        }
        checkDataForError(records.value);
    } catch (err) {
        errorMsg.value = err instanceof Error ? err.message : "解析失败";
    } finally {
        loading.value = false;
    }
}

async function onChooseFile(e) {
    const file = e.target.files?.[0];
    await parseFile(file);
    e.target.value = "";
}

const dragging = ref(false);
let dragLeaveTimer = null;

function onDragOver(e) {
    if (records.value.length) return;
    e.preventDefault();
    clearTimeout(dragLeaveTimer);
    dragging.value = true;
}

function onDragLeave() {
    dragLeaveTimer = setTimeout(() => {
        dragging.value = false;
    }, 50);
}

function onDrop(e) {
    if (records.value.length) return;
    e.preventDefault();
    dragging.value = false;
    const file = e.dataTransfer?.files?.[0];
    if (file && /\.(csv|txt)$/i.test(file.name)) {
        parseFile(file);
    } else if (file) {
        errorMsg.value = "请拖入 CSV 文件";
    }
}
</script>

<template>
    <div
        class="page"
        @dragover="onDragOver"
        @dragleave="onDragLeave"
        @drop="onDrop"
    >
        <header class="header">
            <div class="headerLeft">
                <h1 class="title">CSV 解析（data / logIndex / time）</h1>
                <p class="desc">
                    选择 CSV 文件后，本页面会在浏览器中解析并仅展示这三列。
                </p>
            </div>
            <button
                class="opBtn icon headerSettingsBtn"
                type="button"
                aria-label="打开设置"
                title="设置"
                @click="openSettings"
            >
                <OpIcon name="settings" />
            </button>
        </header>

        <section class="panel">
            <div class="file">
                <div class="filePick">
                    <input
                        class="filePickInput"
                        type="file"
                        accept=".csv,text/csv"
                        @change="onChooseFile"
                    />
                    <span class="fileBtn">选择 CSV 文件</span>
                </div>
                <span class="fileName" :title="selectedFileName">
                    {{ selectedFileName || "未选择文件" }}
                </span>
            </div>

            <div v-if="!records.length" class="dropHint">
                或将 CSV 文件拖拽到此页面
            </div>

            <div class="meta">
                <span v-if="loading">解析中…</span>
                <span v-else-if="rowCount">已解析 {{ rowCount }} 行</span>
            </div>

            <ExportBar v-if="records.length" :records="records" />

            <div v-if="errorMsg" class="error">{{ errorMsg }}</div>
            <div v-else-if="missingColumns.length" class="warn">
                表头缺少：{{ missingColumns.join(", ") }}
            </div>
        </section>

        <section v-if="records.length" class="tableWrap">
            <table class="table">
                <thead>
                    <tr>
                        <th class="colTime">time</th>
                        <th class="colIndex">logIndex</th>
                        <th>data</th>
                        <th class="colOp">操作</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="r in records"
                        :key="r._rowId"
                        :id="`row-log-${r.logIndex}`"
                        :class="{ isHighlighted: r._highlight }"
                    >
                        <td class="mono">{{ r.time }}</td>
                        <td class="mono">{{ r.logIndex }}</td>
                        <td class="dataCell">
                            <pre class="dataPre">{{ displayData(r.data) }}</pre>
                        </td>
                        <td class="opCell">
                            <button
                                class="opBtn icon"
                                type="button"
                                aria-label="查看 data 的 JSON"
                                title="查看 JSON"
                                @click="openJsonModal(r)"
                            >
                                <OpIcon name="json" />
                            </button>
                            <button
                                class="opBtn warn icon"
                                type="button"
                                aria-label="标黄该行"
                                :title="r._highlight ? '取消标黄' : '标黄该行'"
                                @click="toggleRowHighlight(r._rowId)"
                            >
                                <OpIcon name="highlight" />
                            </button>
                            <button
                                class="opBtn danger icon"
                                type="button"
                                aria-label="删除该行"
                                title="删除该行"
                                @click="deleteRow(r._rowId)"
                            >
                                <OpIcon name="delete" />
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </section>

        <ErrorPanel
            :log-indexes="dataErrorLogIndexes"
            @jump="scrollToLogIndex"
        />

        <JsonModal
            :open="jsonModalOpen"
            :data="jsonModalData"
            :log-index="jsonModalLogIndex"
            :time="jsonModalTime"
            @close="closeJsonModal"
        />
        <SettingsModal
            :open="settingsOpen"
            v-model:hideRequestData="hideRequestData"
            @close="closeSettings"
        />

        <div v-if="dragging" class="dropOverlay">
            <div class="dropOverlayInner">
                <span class="dropOverlayIcon">&#128206;</span>
                <span>释放以解析 CSV 文件</span>
            </div>
        </div>
    </div>
</template>

<style scoped src="./App.css"></style>
