<template>
    <div>
        <v-container fluid>
            <v-row justify="center" align="center">
                <v-col cols="12" class="px-10" v-if="sprint">
                    <v-row justify="center" align="center">
                        <v-col cols="12">
                            <v-breadcrumbs class="px-0" :items="items"></v-breadcrumbs>
                        </v-col>

                        <v-col cols="12" style="position:sticky; top: 65px; background-color: white; z-index: 1;">
                            <v-row justify="center" align="center">
                                <v-col>
                                    <h1 :style="{ 'color': $store.state.primary }">{{ sprint.name }}</h1>
                                    <small class="text--disabled">
                                        {{ `${sprint.initial_date} - ${sprint.projected_end_date}` }}
                                    </small>
                                </v-col>
                                <v-col class="text-right">
                                    <v-icon :color="$store.state.primary" left>mdi-clock-outline</v-icon>

                                    <v-tooltip bottom>
                                        <template v-slot:activator="{ attrs, on }">
                                            <span v-bind="attrs" v-on="on">
                                                {{ sprint.diff_days }}  {{ sprint.out_of_date ? 'día(s) retrasado' : 'día(s) restante(s)' }}
                                            </span>
                                        </template>

                                        <span>
                                            <span>Fecha de inicio : {{ sprint.initial_date }}</span><br>
                                            <span>Fecha estimada de termino : {{ sprint.projected_end_date }}</span>
                                        </span>
                                    </v-tooltip>

                                    <v-btn class="ml-4" :color="$store.state.primary" dark small>Finalizar sprint</v-btn>

                                    <v-btn :color="$store.state.primary" icon>
                                        <v-icon>mdi-dots-vertical</v-icon>
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-col>

                        <v-col cols="12">
                            <v-row justify="center" align="center">
                                <workflow 
                                    v-for="workflow in workflows"
                                    :key="workflow.id"
                                    :workflow="workflow"
                                    @showIssue="(n) => showIssue(n)"
                                ></workflow>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>

        <v-dialog v-model="issueDialog" scrollable max-width="800" @click:outside="issueShow = null">
            <v-card v-if="issueShow">
                <v-card-title>
                    <v-img :src="`${apiDomain}${issueShow.issue_type.image}`" max-width="24px"></v-img>
                    <span class="mx-2">({{ issueShow.key }})</span>
                    <span>{{ issueShow.summary }}</span>
                </v-card-title>

                <v-card-text>
                    <div class="my-4">
                        <issue-sprint :issue="issueShow" :disabled="true"></issue-sprint>
                    </div>

                    <v-card class="mb-4" outlined>
                        <v-card-text class="py-8" v-html="issueShow.description"></v-card-text>
                    </v-card>
                    
                    <div class="mb-4">
                        <issue-files :issue.sync="issueShow"></issue-files>
                    </div>

                    <div class="mb-4">
                        <issue-subtasks :issue="issueShow" :project="$route.params.uuid"></issue-subtasks>
                    </div>

                    <div class="mb-4">
                        <issue-comments :projectKey="$route.params.key" :project="$route.params.uuid" :issue="issueShow.key"></issue-comments>
                    </div>

                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { defineComponent, onMounted, ref, useContext, useRoute } from '@nuxtjs/composition-api'

export default defineComponent({
    
    layout:'app',
    middleware:'auth',

    head:{},

    setup() {

        const { $axios } = useContext()
        const route      = useRoute()
        const apiDomain  = process.env.API_DOMAIN

        let items       = ref([])
        let sprint      = ref(null)
        let workflows   = ref([])
        let issueDialog = ref(false)
        let issueShow   = ref(null)

        onMounted(() =>{
            breadcrumbs()
            getSprint()
        })

        const getSprint = async () => {
            try{
                const response  = await $axios.get(`/api/sprints/sprint/${route.value.params.uuid}/${route.value.params.sprint}`);
                sprint.value    = response.data.data
                workflows.value = response.data.data.workflows
            }
            catch(err){

            }
        }

        const breadcrumbs = async () => {

            const response = await $axios.get(`/api/projects/${route.value.params.key}/${route.value.params.uuid}`, { params:{ all_data:true } })
            
            items.value.push(
                {
                    text: route.value.params.key,
                    disabled: true,
                    href: '',
                },

                {
                    text: response.data.data.name,
                    disabled: false,
                    to: `/projects/${response.data.data.key}/${response.data.data.id}`,
                },

                {
                    text: route.value.params.sprint,
                    disabled: true,
                    href: '',
                },
            )

        }

        const showIssue = issue => {
            issueShow.value = issue
            issueDialog.value = true
        }

        return {
            items,
            sprint,
            apiDomain,
            workflows,
            issueShow,
            showIssue,
            issueDialog,
        }
    },
})
</script>
