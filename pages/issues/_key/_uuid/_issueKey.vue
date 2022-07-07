<template>
    <v-container v-if="issue">
        <v-row class="pb-10" align="start" justify="start">
            <v-col cols="12" xl="7" lg="7" class="px-10">
                <v-row justify="center" align="center">
                    <v-col cols="12">
                        <v-breadcrumbs class="px-0" :items="items"></v-breadcrumbs>
                    </v-col>
                    
                    <v-col cols="12">
                        <v-row justify="center" align="center">
                            <v-col cols="12" xl="10" sm="8" xs="12">
                                <v-img style="float:left" class="mr-1"  :src="`${apiDomain}${issue.issue_type.image}`" width="35px"></v-img>
                                <h2 :style="{ 'color': $store.state.primary }">
                                    {{ `(${issue.key}) ${issue.summary}` }}
                                </h2>
                            </v-col>
                            <v-col cols="12" xl="2" sm="4" xs="12" class="text-right">
                                <span class="text--disabled mr-2">
                                    {{ (progress > 0 && progress < 100) ? 'En progreso' : 'Pendiente' }}
                                </span>
                                <v-progress-circular color="teal" :value="progress" :size="40" :width="6"></v-progress-circular>
                            </v-col>
                        </v-row>
                    </v-col>
                    
                    <v-col cols="12" class="mt-3">
                        <h4 class="mb-2">
                            Descripción
                            <span style="float:right">
                                <v-tooltip v-if="!editDescription" bottom>
                                    <template v-slot:activator="{ attrs, on }">
                                        <v-icon @click="editDescription = !editDescription" v-bind="attrs" v-on="on" :color="$store.state.primary">mdi-square-edit-outline</v-icon>
                                    </template>

                                    <span>Editar</span>
                                </v-tooltip>

                                <v-btn v-else small @click="updateDescription" :color="$store.state.primary" dark>Actualizar</v-btn>
                            </span>
                        </h4>
                        <v-card class="px-0" outlined>
                            <v-card-text v-if="!editDescription" class="py-8" v-html="issue.description"></v-card-text>
                            <description-form v-else :description="issue.description" @setDescription="(n) => { editedDescription = n }"></description-form>
                        </v-card>
                    </v-col>

                    <v-col cols="12">
                        <issue-files :issue="issue"></issue-files>
                    </v-col>

                    <v-col cols="12">
                        <issue-subtasks :issue="issue" :project="$route.params.uuid"></issue-subtasks>
                    </v-col>

                    <v-col cols="12">
                        <h4 class="mb-2">Actividad</h4>
                        <v-card class="px-0" outlined>
                            <v-card-text class="px-0 py-0">
                                <v-tabs v-model="tab">
                                    <v-tab v-for="tab in tabs" :key="tab">{{ tab }}</v-tab>
                                </v-tabs>

                                <v-divider></v-divider>

                                <v-tabs-items v-model="tab">
                                    <v-tab-item :value="0">
                                        <issue-comments :projectKey="$route.params.key" :project="$route.params.uuid" :issue="$route.params.issueKey"></issue-comments>
                                    </v-tab-item>

                                    <v-tab-item :value="1">
                                        1
                                    </v-tab-item>
                                </v-tabs-items>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>

            <v-col cols="12" xl="5" lg="5" class="px-8" style="position:sticky !important; top:80px">
                <v-row justify="center" align="center">
                    <v-col cols="12" class="text-right">
                        <v-menu offset-y>
                            <template v-slot:activator="{ attrs, on }">
                                <v-icon v-bind="attrs" v-on="on" large :color="$store.state.primary">mdi-dots-horizontal</v-icon>
                            </template>
                        </v-menu>
                    </v-col>

                    <v-col cols="12">
                        <issue-sprint :issue="issue"></issue-sprint>
                    </v-col>

                    <v-col cols="12">
                        <v-card outlined>
                            <v-card-title style="font-size:16px" class="py-2">
                                Detalles
                                <v-spacer></v-spacer>
                                <v-btn icon @click="showDetails = !showDetails">
                                    <v-icon>
                                        {{ showDetails ? 'mdi-chevron-up' : 'mdi-chevron-down' }}
                                    </v-icon>
                                </v-btn>
                            </v-card-title>

                            <v-divider></v-divider>

                            <v-expand-transition>
                                <div v-show="showDetails">
                                    <v-simple-table>
                                        <template v-slot:default>
                                            <tbody>
                                                <tr>
                                                    <th>Asignado</th>
                                                    <td>
                                                        <v-list-item class="px-0">
                                                            <v-list-item-avatar>
                                                                <v-img :src="`https://ui-avatars.com/api/?rounded=true&background=random&name=${issue.assignee.name}`"></v-img>
                                                            </v-list-item-avatar>

                                                            <v-list-item-content>
                                                                <v-list-item-title>{{ issue.assignee.name }}</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th>Revisión</th>
                                                    <td>
                                                        <v-list-item class="px-0">
                                                            <v-list-item-avatar>
                                                                <v-img :src="`https://ui-avatars.com/api/?rounded=true&background=random&name=${issue.reporter.name}`"></v-img>
                                                            </v-list-item-avatar>

                                                            <v-list-item-content>
                                                                <v-list-item-title>{{ issue.reporter.name }}</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th>Duración estimada</th>
                                                    <td>
                                                        <v-chip :color="$store.state.primary" dark>
                                                            {{ issue.duration }} hrs.
                                                        </v-chip>
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <th>Prioridad</th>
                                                    <td>
                                                        <v-list-item class="px-0">
                                                            <v-list-item-avatar>
                                                                <v-img :src="`${apiDomain}${issue.priority.image}`" max-width="16px"></v-img>
                                                            </v-list-item-avatar>

                                                            <v-list-item-content>
                                                                <v-list-item-title>{{ issue.priority.name }}</v-list-item-title>
                                                            </v-list-item-content>
                                                        </v-list-item>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                </div>
                            </v-expand-transition>
                        </v-card>
                    </v-col>

                    <v-col cols="12">
                        <v-card outlined>
                            <v-card-title style="font-size:16px" class="py-2">
                                Fechas
                                <v-spacer></v-spacer>
                                <v-btn icon @click="showDates = !showDates">
                                    <v-icon>{{ showDates ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
                                </v-btn>
                            </v-card-title>

                            <v-divider></v-divider>
                            
                            <v-expand-transition>
                                <div v-show="showDates">
                                    <v-simple-table>
                                        <template v-slot:default>
                                            <tbody>
                                                <tr>
                                                    <th>Creación</th>
                                                    <td>{{ issue.created_at }}</td>
                                                </tr>
                                                <tr v-if="issue.initial_date">
                                                    <th>Iniciado</th>
                                                    <td></td>
                                                </tr>
                                                <tr v-if="issue.projected_end_date">
                                                    <th>Final estimado</th>
                                                    <td></td>
                                                </tr>
                                                <tr v-if="issue.end_date">
                                                    <th>Final</th>
                                                    <td></td>
                                                </tr>
                                                <tr>
                                                    <th>Modificación</th>
                                                    <td>{{ issue.updated_at }}</td>
                                                </tr>
                                            </tbody>
                                        </template>
                                    </v-simple-table>
                                </div>
                            </v-expand-transition>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<style>
    .v-list-item__title{
        font-size: 14px;
    }
</style>

<script>
import { computed, defineComponent, onMounted, ref, useContext, useRoute } from '@nuxtjs/composition-api'

export default defineComponent({

    layout:'app',
    middleware:'auth',

    head:{},

    setup() {

        const { $axios, $notify } = useContext()
        const route               = useRoute()
        const apiDomain           = process.env.API_DOMAIN
        
        let items             = ref([])
        let issue             = ref(null)
        let tab               = ref(0)
        let showDetails       = ref(true)
        let showDates         = ref(true)
        let tabs              = ['Comentarios', 'Historial']
        let editDescription   = ref(false)
        let editedDescription = ref("")

        onMounted(() => {
            breadcrumbs()
            getIssue()
        })

        const getIssue = async () => {
            let response = await $axios.get(`/api/issues/${route.value.params.key}/${route.value.params.uuid}/${route.value.params.issueKey}`, { params:{ all_data:true } })
            issue.value = response.data.data
        }

        const progress = computed(() => {
            if(!issue.value) return 0

            if(!issue.value.subtasks || issue.value.subtasks.length === 0){
                if(issue.value.status === 'CREATED') return 0
                if(issue.value.status !== 'CANCELED') return 50
            }
        })

        let breadcrumbs = async () => {

            try{

                let response = await $axios.get(`/api/projects/${route.value.params.key}/${route.value.params.uuid}`, { params:{ all_data:true } })

                items.value.push(
                    {
                        text: response.data.data.key,
                        disabled: true,
                        href: '',
                    },

                    {
                        text: response.data.data.name,
                        disabled: false,
                        to: `/projects/${response.data.data.key}/${response.data.data.id}`,
                    },

                    {
                        text: route.value.params.issueKey,
                        disabled: true,
                        to: ''
                    }
                )

            }catch(err){

                $notify.error({
                    title:"Error",
                    message:"Error al procesar la solicitud, intente más tarde."
                })

            }
        }

        let updateDescription = async () => {
            try{
                await $axios.put(`/api/issues/update/description/${route.value.params.key}/${route.value.params.uuid}/${route.value.params.issueKey}`, { description: editedDescription.value })
                getIssue()
            }
            catch(err){

                console.log(err)

                if(err.response.status === 403){
                    $notify.error({
                        title:"Error",
                        message:"No tiene los permisos necesarios para realizar esta acción."
                    })

                    return
                }

                $notify.error({
                    title:"Error",
                    message:"Ha ocurrido un error al procesar su solicitud, intente más tarde."
                })

            }
            finally{
                editDescription.value = false
            }
        }


        return {
            tab,
            tabs,
            issue,
            items,
            progress,
            apiDomain,
            showDates,
            showDetails,
            editDescription,
            editedDescription,
            updateDescription,
        }

    },
})
</script>