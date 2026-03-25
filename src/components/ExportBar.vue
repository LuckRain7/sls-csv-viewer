<script setup>
import { ref } from "vue";

const props = defineProps({
    records: {
        type: Array,
        required: true,
    },
});

const exportFrom = ref("");
const exportTo = ref("");

function escapeCsvField(v) {
    const s = String(v ?? "");
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
}

function exportCsv() {
    const from = Number(exportFrom.value);
    const to = Number(exportTo.value);
    if (!Number.isFinite(from) || !Number.isFinite(to) || from > to) {
        alert("请输入有效的 logIndex 范围（起始 ≤ 结束）");
        return;
    }
    const filtered = props.records.filter((r) => {
        const idx = Number(r.logIndex);
        return Number.isFinite(idx) && idx >= from && idx <= to;
    });
    if (!filtered.length) {
        alert("该范围内没有日志记录");
        return;
    }
    const header = "time,logIndex,data";
    const csvRows = filtered.map((r) =>
        [
            escapeCsvField(r.time),
            escapeCsvField(r.logIndex),
            escapeCsvField(r.data),
        ].join(",")
    );
    const csvContent = [header, ...csvRows].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
        type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = getFileName(from, to);
    a.click();
    URL.revokeObjectURL(url);
}

function getFileName(from, to) {
    const now = new Date().toISOString();
    return `logs_${from}-${to}_${now}.csv`;
}
</script>

<template>
    <div class="exportBar">
        <span class="exportLabel">导出范围</span>
        <input
            v-model="exportFrom"
            class="exportInput"
            type="number"
            placeholder="起始 logIndex"
        />
        <span class="exportDash">–</span>
        <input
            v-model="exportTo"
            class="exportInput"
            type="number"
            placeholder="结束 logIndex"
        />
        <button class="exportBtn" type="button" @click="exportCsv">
            导出 CSV
        </button>
    </div>
</template>

<style scoped>
.exportBar {
    margin-top: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
}

.exportLabel {
    font-size: 13px;
    color: #374151;
    font-weight: 500;
}

.exportInput {
    width: 120px;
    height: 32px;
    padding: 0 8px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 13px;
    color: #111827;
    outline: none;
}

.exportInput:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.15);
}

.exportDash {
    color: #9ca3af;
    font-size: 14px;
}

.exportBtn {
    height: 32px;
    padding: 0 14px;
    border-radius: 6px;
    border: 1px solid #4f46e5;
    background: #4f46e5;
    color: #fff;
    font-size: 13px;
    cursor: pointer;
}

.exportBtn:hover {
    background: #4338ca;
}
</style>
