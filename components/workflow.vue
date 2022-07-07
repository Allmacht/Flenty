<template>
    <v-col>
        <v-hover v-slot="{ hover }">
            <v-card scrollable elevation="0" color="#f4f5f7">
                <v-card-title class="py-2">
                    {{ workflow.name }}
                    <v-spacer></v-spacer>
                    <v-btn :color="$store.state.primary" icon>
                        <v-icon size="15" v-show="hover">
                            mdi-pencil
                        </v-icon>
                    </v-btn>
                </v-card-title>

                <v-card-text class="px-1" style="min-height: 67vh">
                    <v-card class="mb-2" v-for="issue in issues" outlined :key="issue.id" @click="showIssue(issue)">
                        <v-card-text>
                            <span style="font-size:14px; color:black">
                                {{ issue.summary }}
                            </span>
                        </v-card-text>

                        <v-card-actions>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ attrs, on }">
                                    <v-img class="mr-2" v-bind="attrs" v-on="on" :src="`${apiDomain}${issue.issue_type.image}`" max-width="16px"></v-img>
                                </template>

                                <span>{{ issue.issue_type.name }}</span>
                            </v-tooltip>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ attrs, on }">
                                    <v-img v-bind="attrs" v-on="on" :src="`${apiDomain}${issue.priority.image}`" max-width="16px"></v-img>
                                </template>

                                <span>{{ issue.priority.name }}</span>
                            </v-tooltip>

                            <v-spacer></v-spacer>

                            <span style="font-size:12px">
                                {{ issue.key }}
                            </span>

                            <v-tooltip bottom>
                                <template v-slot:activator="{ attrs, on }">
                                    <v-img 
                                        class="ml-2" 
                                        v-bind="attrs" 
                                        v-on="on" 
                                        :src="`${image_url}background=random&name=${issue.assignee.name}&format=svg&rounded=true`" 
                                        max-width="24px"
                                    ></v-img>
                                </template>

                                <span>{{ issue.assignee.name }}</span>
                            </v-tooltip>
                            
                        </v-card-actions>
                    </v-card>
                </v-card-text>
            </v-card>
        </v-hover>
    </v-col>
</template>

<style scoped>
    .v-card__title{
        font-size: 12px;
        position: sticky;
        top: 160px;
        z-index: 1;
        background-color: #f4f5f7;
    }
</style>

<script>
import { defineComponent, onMounted, ref, useContext, useRoute } from '@nuxtjs/composition-api'

export default defineComponent({

    props:{
        workflow:{
            required:true,
            type:Object,
        }
    },

    emits:['showIssue'],

    setup(props, { emit }) {

        const { $axios, $notify } = useContext()
        const route               = useRoute()
        const apiDomain           = process.env.API_DOMAIN
        const image_url           = "https://ui-avatars.com/api/?"

        let issues = ref([])

        onMounted(() => {
            $nuxt.$on('reload-boards', () => getIssues())
            getIssues()
        })

        const getIssues = async () => {

            try{

                const response = await $axios.get(`/api/workflows/issues/${route.value.params.uuid}/${route.value.params.sprint}/${props.workflow.id}`);
                if(response.data.empty) issues.value = []
                issues.value = response.data.data
                
            }
            catch(err){

                $notify.error({
                    title:"Error",
                    message:"Ha ocurrido un error al procesar su solicitud, intente más tarde."
                })

                return

            }
        }

        const showIssue = issue => emit('showIssue', issue)


        return {
            issues,
            apiDomain,
            image_url,
            showIssue,
        }
       
    },
})
</script>
