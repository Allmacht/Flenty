<template>
    <v-container>
        <v-row justify="center" align="center">
            <v-col class="px-0 py-0">
                <v-menu offset-y v-if="sprint">
                    <template v-slot:activator="{ attrs, on }">
                        <v-btn
                        :loading="loading_workflow" 
                        :color="workflow.final_workflow ? 'success' : $store.state.primary" 
                        class="text-capitalize" 
                        v-bind="attrs" 
                        v-on="on"
                        :dark="!workflow.final_workflow"
                        small
                        >
                            {{ workflow ? workflow.name : 'Workflow'  }}
                            <v-icon right>mdi-chevron-down</v-icon>
                        </v-btn>
                    </template>

                    <v-list dense>
                        <v-list-item-group>
                            <template  v-for="item in workflows">
                                <v-list-item v-if="item.id !== workflow.id" :key="item.id" @click="setWorkflow(item)">
                                    <v-list-item-content>
                                        <v-chip 
                                        label 
                                        small
                                        :color="item.final_workflow ? 'success' : $store.state.primary"
                                        :dark="!item.final_workflow"
                                        >
                                            {{ item.name }}
                                        </v-chip>
                                    </v-list-item-content>
                                </v-list-item>
                            </template>
                        </v-list-item-group>
                    </v-list>
                </v-menu>
            </v-col>

            <v-col class="px-0 py-0 text-right">
                <v-menu offset-y class="mr-auto">
                    <template v-slot:activator="{ attrs, on }">
                        <v-btn 
                            :loading="loading_sprint" 
                            class="text-capitalize" 
                            v-bind="attrs" 
                            v-on="on" 
                            :color="$store.state.primary"
                            :disabled="disabled"
                            text
                        >
                            <strong>
                                {{ null === sprint ? 'Asignar sprint' : sprint.name }}
                            </strong>
                        </v-btn>
                    </template>
        
                    <v-list>
                        <template v-if="null === sprint">
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Para continuar</v-list-item-title>
                                    <v-list-item-subtitle>Asigne la tarea a un spring activo</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
            
                            <v-divider v-if="sprints && sprints.length > 0"></v-divider>
                        </template>

                        <template v-else>

                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title>Cambiar Sprint</v-list-item-title>
                                    <v-list-item-subtitle>Seleccione a que sprint cambiar la tarea</v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
            
                            <v-divider v-if="sprints && sprints.length > 0"></v-divider>

                        </template>
        
                        <v-list-item v-for="sprint in sprints" :key="sprint.id" @click="setSprint(sprint)">
                            <v-list-item-icon class="mx-0">
                                <v-icon :color="$store.state.primary">mdi-circle-small</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>{{ sprint.name }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>

                        <template v-if="null !== sprint">
                            <v-divider></v-divider>

                            <v-list-item  @click="removeSprint()">
                                <v-list-item-content>
                                    <v-list-item-title>Remover de sprint</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </template>


                    </v-list>
                </v-menu>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { defineComponent, onMounted, ref, useAsync, useContext, useRoute } from '@nuxtjs/composition-api'

export default defineComponent({

    props:{
        issue:{
            required:true,
            type:Object,
        },

        disabled:{
            required:false,
            type:Boolean,
            default:false,
        }
    },

    setup(props) {

        const { $axios, $notify } = useContext()
        const route               = useRoute()

        let loading_sprint   = ref(false)
        let loading_workflow = ref(false)
        let sprint           = ref(null)
        let workflow         = ref(null)
        let workflows        = ref([])

        onMounted(() => getSprint())
        
        const sprints = useAsync(async () => {
            const response = await $axios.get(`/api/sprints/${route.value.params.key}/${route.value.params.uuid}`)
            return response.data.data
        })

        const getSprint = async () => {
            
            try{
                let response   = await $axios.get(`/api/issues-sprint/issue/${route.value.params.uuid}/${props.issue.key}`)
                sprint.value   = response.data.data.sprint
                workflow.value = response.data.data.workflow

                getWorkflows(sprint.value.key)
            }
            catch(err){

                sprint.value   = null
                workflow.value = null

                if(err.response.status === 422) return

                $notify.error({
                    title:"Error",
                    message:"Ha ocurrido un error al procesar su solicitud, intente más tarde",
                })
            }
        }

        const setSprint = async (sprint) => {

            loading_sprint.value = true

            try{
                const form = {}
                form.sprint  = sprint.key
                form.project = route.value.params.uuid,
                form.issue   = props.issue.key

                await $axios.post('/api/issues-sprint/store', form)
                getSprint()

            }
            catch(err){

                if(err.response?.status === 403)
                {
                    $notify.error({
                        title:"Error",
                        message:"No cuentas con los permisos necesarios para realizar esta acción",
                    })

                    return
                }

                $notify.error({
                    title:"Error",
                    message:"Ha ocurrido un error al procesar su solicitud, intente más tarde.",
                })
                
            }
            finally{
                loading_sprint.value = false
            }
        }

        const removeSprint = async () => {
            try{
                await $axios.delete(`/api/issues-sprint/delete/${route.value.params.uuid}/${sprint.value.key}/${props.issue.key}`);
                getSprint()
            }
            catch(err){

                if(err.response?.status === 403){
                    $notify.error({
                        title:"Error",
                        message:"No cuentas con los permisos necesarios para realizar esta acción."
                    })

                    return
                }

                $notify.error({
                    title:"Error",
                    message:"Ha ocurrido un error al procesar su solicitud."
                })

            }
        }

        const getWorkflows = async (key) => {
            try{
                const response = await $axios.get(`/api/workflows/${route.value.params.uuid}/${key}`)
                workflows.value = response.data.data
            }
            catch(err){
                if(err.response.status === 403){
                    $notify.error({
                        title:"Error",
                        message:"No cuentas con los permisos necesarios para realizar esta acción."
                    })

                    return
                }

                $notify.error({
                    title:"Error",
                    message:"Ha ocurrido un error al procesar su solicitud."
                })
            }
        }

        const setWorkflow = async (workflow) => {

            loading_workflow.value = true

            try{

                await $axios.put(`/api/issues-sprint/update/${route.value.params.uuid}/${sprint.value.key}/${props.issue.key}`, { workflow: workflow.id })
                $nuxt.$emit('reload-boards')
                getSprint()

            }
            catch(err){

                if(err.response?.status === 403)
                {
                    $notify.error({
                        title:"Error",
                        message:"No cuentas con los permisos necesarios para realizar esta acción",
                    })

                    return
                }

                $notify.error({
                    title:"Error",
                    message:"Ha ocurrido un error al procesar su solicitud, intente más tarde.",
                })

            }
            finally{
                loading_workflow.value = false
            }
        }

        return {
            sprint,
            sprints,
            workflow,
            workflows,
            setSprint,
            setWorkflow,
            removeSprint,
            loading_sprint,
            loading_workflow,
        }

    },
})
</script>
