<script setup>
defineProps({
    name: {
        type: String,
        required: true,
        validator: (v) => ["json", "highlight", "delete", "settings"].includes(v),
    },
});
</script>

<template>
    <svg
        class="opIcon"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
    >
        <template v-if="name === 'json'">
            <path
                d="M8 5c-2 0-3 1-3 3v2c0 1-1 2-2 2 1 0 2 1 2 2v2c0 2 1 3 3 3"
            />
            <path
                d="M16 5c2 0 3 1 3 3v2c0 1 1 2 2 2-1 0-2 1-2 2v2c0 2-1 3-3 3"
            />
        </template>
        <template v-else-if="name === 'highlight'">
            <path d="M3 21h6" />
            <path d="M14.5 3.5l6 6" />
            <path d="M4 14L14.5 3.5l6 6L10 20H4v-6z" />
        </template>
        <template v-else-if="name === 'settings'">
            <path
                d="M12 1.5l1.05 2.42c.58.1 1.14.32 1.66.62l2.43-1.03 1.6 2.77-2.06 1.37c.08.62.08 1.26 0 1.88l2.06 1.37-1.6 2.77-2.43-1.03c-.52.3-1.08.52-1.66.62L12 22.5l-1.05-2.42c-.58-.1-1.14-.32-1.66-.62l-2.43 1.03-1.6-2.77 2.06-1.37a6.7 6.7 0 0 1 0-1.88L5.26 6.3l1.6-2.77 2.43 1.03c.52-.3 1.08-.52 1.66-.62L12 1.5z"
            />
            <path d="M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        </template>
        <template v-else>
            <path d="M6 6l12 12" />
            <path d="M18 6L6 18" />
        </template>
    </svg>
</template>
