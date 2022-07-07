<template>
    <div v-if="sprint">
        <v-col cols="12" class="px-0">
            <v-row justify="center" align="center">
                <v-col>
                    <h4>{{ sprint.name }}</h4>
                    <small class="text--disabled">
                        {{ `${sprint.initial_date} - ${sprint.projected_end_date}` }}
                    </small>
                </v-col>
                <v-col class="text-right">
                    <v-btn class="text-capitalize" :color="$store.state.primary" text dark @click="toBoard">
                        <v-icon left>mdi-table</v-icon>
                        Tablero
                    </v-btn>
                </v-col>
            </v-row>
        </v-col>

        <v-col cols="12" class="px-0 py-0">
            <v-card v-if="loading && issues && issues.length === 0" loading outlined>
                <v-card-text class="text-center py-7">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    <span class="ml-3">Cargando, espere...</span>
                </v-card-text>
            </v-card>

            <v-card v-if="loading === false && issues.length === 0" outlined>
                <v-card-text class="text-center text--disabled">
                    <h4>No ha asignado tareas al Sprint</h4>
                </v-card-text>
            </v-card>

            <v-card v-else outlined>
                <v-list class="py-0" dense>
                    <v-list-item-group>
                        <template v-for="(issue, index) in issues">
                            <v-list-item :key="issue.key" @click="handleClickIssue(issue)">

                                <v-list-item-icon>
                                    <v-img :src="`${api_domain}${issue.issue_type.image}`"></v-img>
                                </v-list-item-icon>

                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ issue.summary }}

                                        <span class="ml-2" style="float:right">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ attrs, on }">
                                                    <v-img :src="`${api_domain}${issue.priority.image}`" v-bind="attrs" v-on="on" max-width="16px"></v-img>
                                                </template>

                                                <span>{{ issue.priority.name }}</span>
                                            </v-tooltip>
                                        </span>

                                        <span v-if="issue.assignee" class="ml-2" style="float:right">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ attrs, on }">
                                                    <v-img :src="`https://ui-avatars.com/api/?rounded=true&background=random&name=${issue.assignee.name}`" v-bind="attrs" v-on="on" max-width="16px"></v-img>
                                                </template>

                                                <span>{{ issue.assignee.name }}</span>
                                            </v-tooltip>
                                        </span>

                                        <span style="float:right">
                                            {{ issue.key }}
                                        </span>

                                    </v-list-item-title>
                                </v-list-item-content>
                                
                            </v-list-item>

                            <v-divider v-if="index < issues.length - 1" :key="'divider-'+issue.key"></v-divider>
                        </template>
                    </v-list-item-group>
                </v-list>
            </v-card>
        </v-col>
    </div>
</template>

<script>
import { defineComponent, onMounted, ref, useContext, useRoute, useRouter } from '@nuxtjs/composition-api'

export default defineComponent({

    props:{
        sprint:{
            required:true,
            type:Object,
        }
    },  

    setup(props) {

        const { $axios }  = useContext()
        const route       = useRoute()
        const router      = useRouter()
        const api_domain  = process.env.API_DOMAIN
        
        let issues  = ref([])
        let loading = ref(true)

        onMounted(() => getIssues())

        const getIssues = async () => {

            try{
                const response = await $axios.get(`/api/issues-sprint/issues/${route.value.params.uuid}/${props.sprint.key}`)
                issues.value = response.data.data
            }
            catch(err){
                
            }
            finally{
                loading.value = false
            }
            
        }

        let handleClickIssue = issue => {
            router.push(`/issues/${route.value.params.key}/${route.value.params.uuid}/${issue.key}`)
        }

        const toBoard = () => {
            router.push(`/board/${route.value.params.key}/${route.value.params.uuid}/${props.sprint.key}`)
        }

        return {
            issues,
            loading,
            toBoard,
            api_domain,
            handleClickIssue,
        }
    },
})
</script>
