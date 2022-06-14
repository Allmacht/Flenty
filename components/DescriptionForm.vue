<template>
    <tiptap-vuetify :value="description" :extensions="extensions"/>
</template>

<script>

 import {
        TiptapVuetify,
        Heading,
        Bold,
        Italic,
        Strike,
        Underline,
        Code,
        Paragraph,
        BulletList,
        OrderedList,
        ListItem,
        Link,
        Blockquote,
        HardBreak,
        HorizontalRule,
        History
    } from "tiptap-vuetify";

import { defineComponent } from '@nuxtjs/composition-api';

export default defineComponent({

    components: { TiptapVuetify },

    props:{
        description:{
            required:true,
            type:String,
            default:`<h3>Agrega una descripción...</h3>`
        }
    },

    setup() {
        const extensions   = [
                History,
                Blockquote,
                Link,
                Underline,
                Strike,
                Italic,
                ListItem,
                BulletList,
                OrderedList,
                [
                    Heading,
                    {
                    options: {
                        levels: [1, 2, 3],
                    },
                    },
                ],
                Bold,
                Link,
                Code,
                HorizontalRule,
                Paragraph,
                HardBreak,
        ]

        return {
            extensions
        }
    },
})

</script>