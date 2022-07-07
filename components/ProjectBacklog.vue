<template>
    <div>
        <v-col class="px-0 py-0 mb-2" cols="12">
            <v-row justify="center" align="center">
                <v-col>
                    <h4>
                        Backlog
                        <span style="font-size: 15px" class="ml-2 text--disabled">{{ issues.length }} Tareas</span>
                    </h4>
                </v-col>
                <v-col class="text-right" v-if="issues && issues.length > 0">
                    <v-btn class="text-capitalize" text :color="$store.state.primary" @click="newIssueDialog = true">
                        <v-icon left>mdi-plus</v-icon>
                        Crear tarea
                    </v-btn>

                    <v-menu offset-y>
                        <template v-slot:activator="{ attrs, on }">
                            <v-icon v-bind="attrs" v-on="on">mdi-dots-vertical</v-icon>
                        </template>
                    </v-menu>
                </v-col>
            </v-row>
        </v-col>

        <v-card :loading="loading" outlined>
            <v-card-text v-if="!loading" class="px-0 py-0">

                <template v-if="issues.length === 0">
                    <div class="text-center py-4">
                        <h4>No tienes ninguna tarea creada.</h4>
                        <v-btn class="text-capitalize" text :color="$store.state.primary" @click="newIssueDialog = true">
                            <v-icon left>mdi-plus</v-icon>
                            Crear tarea
                        </v-btn>
                    </div>
                </template>

                <template v-else>
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
                </template>

            </v-card-text>

            <v-card-text v-else class="text-center">
                 <v-progress-circular indeterminate :color="$store.state.primary"></v-progress-circular>
                <h4>Espere...</h4>
            </v-card-text>
        </v-card>

        <new-issue
            :key_app="$route.params.key"
            :project="$route.params.uuid"
            @changeDialog="() => { newIssueDialog = !newIssueDialog }"
            :dialog.sync="newIssueDialog"
        ></new-issue>

    </div>
</template>

<script>
import { ref, defineComponent, useContext, useRoute, onMounted, useRouter } from '@nuxtjs/composition-api'

export default defineComponent({
    setup() {

        const { $axios, $notify } = useContext()
        const route               = useRoute()
        const router              = useRouter()
        const api_domain          = process.env.API_DOMAIN
        
        let newIssueDialog = ref(false)
        let issues         = ref([])
        let loading        = ref(true)

        onMounted(() => {
            $nuxt.$on('reload-issues', () => { getIssues() })
            getIssues()
        })

        let getIssues = async () => {

            loading.value = true

            try{
                let response  = await $axios.get(`/api/issues/${route.value.params.key}/${route.value.params.uuid}`)
                issues.value  = response.data.data
                loading.value = false

            }catch($err){

                loading.value = false

                $notify.error({
                    title:"Error",
                    message:"Error al obtener las tareas, intente más tarde."
                })
            
            }
        }
        
        let handleClickIssue = issue => {
            router.push(`/issues/${route.value.params.key}/${route.value.params.uuid}/${issue.key}`)
        }

        return{
            issues,
            loading,
            api_domain,
            newIssueDialog,
            handleClickIssue
        }

    },  
})
</script>
