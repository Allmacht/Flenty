<template>
    <tiptap-vuetify v-model="des" :extensions="extensions"/>
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

import { ref, defineComponent, watchEffect } from '@nuxtjs/composition-api';

export default defineComponent({

    components: { TiptapVuetify },
    emits:['setDescription'],

    props:{
        description:{
            required:true,
            type:String,
            default:`<h3>Agrega una descripción...</h3>`
        }
    },

    setup(props, { emit }) {

        let des = ref(props.description)

        const extensions = [
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


        watchEffect(() => {
            emit('setDescription', des.value)
        })

        return {
            des,
            extensions
        }
    },
})

</script>
<style>
.tiptap-vuetify-editor__content{
    min-height: 500px;
}
</style>