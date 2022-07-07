<template>
    <v-dialog v-model="dialog" scrollable max-width="800" persistent>
        <v-card :loading="loading" :disabled="loading">
            <v-card-title>
                Crear Sprint
                <v-spacer></v-spacer>
                <v-btn icon @click="onClose">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </v-card-title>

            <v-form ref="form" v-on:submit.prevent="onSubmit">
                <v-card-text>
                        <v-col cols="12" xl="5" class="px-0">
                            <v-menu v-model="startDateDialog" transition="scale-transition" min-width="auto" offset-y>
                                <template v-slot:activator="{ attrs, on }">
                                    <v-text-field 
                                        label="Fecha inicial" 
                                        v-model="data.initial_date" 
                                        clearable
                                        :rules="[required]"
                                        v-bind="attrs" 
                                        v-on="on" 
                                        readonly 
                                        filled
                                        append-outer-icon="mdi-calendar-range"
                                    ></v-text-field>
                                </template>
                                
                                <v-date-picker v-model="data.initial_date"></v-date-picker>
                            </v-menu>

                            <v-menu v-model="ProjectedEndtDateDialog" transition="scale-transition" min-width="auto" offset-y>
                                <template v-slot:activator="{ attrs, on }">
                                    <v-text-field 
                                        label="Fecha inicial" 
                                        v-model="data.projected_end_date" 
                                        clearable
                                        :rules="[required]"
                                        v-bind="attrs" 
                                        v-on="on" 
                                        readonly 
                                        filled
                                        append-outer-icon="mdi-calendar-range"
                                    ></v-text-field>
                                </template>
                                
                                <v-date-picker v-model="data.projected_end_date"></v-date-picker>
                            </v-menu>
                        </v-col>

                        <v-text-field v-model="data.name" filled label="Nombre del Sprint" :rules="[required]"></v-text-field>
                        <v-textarea v-model="data.goal" filled label="Objetivo" placeholder="Objetivo general del Sprint"></v-textarea>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text @click="onClose">Cancelar</v-btn>
                    <v-btn type="submit" :color="$store.state.primary" :loading="loading" dark>Crear</v-btn>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script>
import { computed, defineComponent, reactive, ref, useContext } from '@nuxtjs/composition-api'

export default defineComponent({
    
    props:{
        projectKey:{
            required:true,
            type:String,
        },

        project:{
            required:true,
            type:String,
        },

        dialog:{
            required:true,
            type:Boolean,
            default:false,
        }
    },

    emits:['close'],
    
    setup(props, { emit }) {

        const { $axios, $notify } = useContext()
        
        let form                    = ref(null)
        let loading                 = ref(false)
        let startDateDialog         = ref(false)
        let ProjectedEndtDateDialog = ref(false)
        let data                    = reactive({
            initial_date       : "",
            projected_end_date : "",
            name               : "",
            goal               : "",
        })

        let dialogState = computed(() => props.dialog)

        const required = value => !!value || 'La información es requerida'

        let onSubmit = async () => {

            if(!form.value.validate()) return

            loading.value = true

            try{
                await $axios.post(`/api/sprints/store/${props.projectKey}/${props.project}`, data)
                $nuxt.$emit('reload-sprints')
                onClose()
            }
            catch(err){
                if(err.response.status === 403){
                    $notify.error({
                        title:"Error",
                        message:"No tienes los permisos necesarios para realizar esta acción."
                    })
                }
            }
            finally{
                loading.value = false
            }
        }

        const onClose = () => {
            form.value.reset()
            emit('close')
        }


        return {
            form,
            data,
            onClose,
            loading,
            onSubmit,
            required,
            dialogState,
            startDateDialog,
            ProjectedEndtDateDialog,
        }

    },
})
</script>
