<template>
    <div>
        <v-app-bar flat :color="$store.state.primary" dark>
            <v-toolbar-title>
                <v-icon left>mdi-plus</v-icon>
                Nuevo proyecto
            </v-toolbar-title>
        </v-app-bar>

        <v-window v-model="step">
            <v-window-item :value="1">
                <v-container>
                    <v-row justify="center" align="center">
                        <v-col cols="12" xl="7" class="my-10 font-weight-black">
                            Seleccione el tipo de proyecto
                        </v-col>
                        <v-col cols="12" xl="7" v-for="projectType in projectTypes" :key="projectType.id">
                            <v-card hover class="mb-3" @click="() => { form.project_type_id = projectType.id; step = 2; }">
                                <v-card-text class="py-0">
                                    <v-row justify="center" align="center">
                                        <v-col cols="3">
                                            <v-img class="mx-auto" :src="domain+projectType.image" width="120px"></v-img>
                                        </v-col>
                                        <v-col cols="6" class="py-0">
                                            <div>
                                                <span class="text-h5 font-weight-black">{{ projectType.name }}</span><br>
                                                <span>{{ projectType.description }}</span>
                                            </div>
                                        </v-col>
                                        <v-col class="text-center" cols="3">
                                            <v-icon>mdi-chevron-right</v-icon>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-window-item>

            <v-window-item :value="2">
                <v-container>
                    <v-row justify="center" align="center">
                        <v-col cols="12" xl="7" class="mt-10 mb-1 font-weight-black">
                            Ingrese la información requerida
                        </v-col>
                        <v-col cols="12" xl="7">
                            <v-card flat>
                                <v-form ref="information_form">
                                    <v-card-text class="py-0 px-0">

                                        <v-card-subtitle class="px-0">Información general</v-card-subtitle>

                                        <v-row no-gutters>
                                            <v-col class="py-0" cols="12">
                                                <v-row>
                                                    <v-col cols="4">
                                                        <v-text-field v-model="form.key" :rules="[required]" filled label="Key">
                                                            <template v-slot:append-outer>
                                                                <v-tooltip right>
                                                                    <template v-slot:activator="{ attrs, on }">
                                                                        <v-icon :color="$store.state.primary" v-bind="attrs" v-on="on">mdi-information</v-icon>
                                                                    </template>
                                                                    <span>Elija un prefijo descriptivo <br> para las claves de las Issues del <br> proyecto.</span>
                                                                </v-tooltip>
                                                            </template>
                                                        </v-text-field>
                                                    </v-col>

                                                    <v-col cols="8">
                                                        <v-menu offset-y :close-on-content-click="false">
                                                            <template v-slot:activator="{ attrs, on }">
                                                                <v-img class="ml-auto" :src="image" max-width="60" v-bind="attrs" v-on="on"></v-img>
                                                            </template>

                                                            <v-card>
                                                                <v-card-text class="text-center">
                                                                    <v-color-picker v-model="color"></v-color-picker>
                                                                    <v-switch v-model="rounded" label="Redondeado"></v-switch>
                                                                </v-card-text>
                                                            </v-card>

                                                        </v-menu>
                                                    </v-col>
                                                </v-row>
                                            </v-col>
                                            <v-col class="py-0" cols="12">
                                                <v-text-field v-model="form.name" :rules="[required]" filled label="Nombre del proyecto"></v-text-field>
                                            </v-col>

                                            <v-row>
                                                <v-col>
                                                    <v-menu v-model="start_date_menu" offset-y :close-on-content-click="false" transition="scale-transition" min-width="auto">
                                                        <template v-slot:activator="{ attrs, on }">
                                                            <v-text-field v-model="form.start_date" :rules="[required]" label="Fecha de inicio" filled v-bind="attrs" v-on="on" readonly></v-text-field>
                                                        </template>

                                                        <v-date-picker no-title v-model="form.start_date" @input="start_date_menu = false"></v-date-picker>
                                                    </v-menu>
                                                </v-col>
                                                <v-col>
                                                    <v-menu v-model="end_date_menu" offset-y :close-on-content-click="false" transition="scale-transition" min-width="auto">
                                                        <template v-slot:activator="{ attrs, on }">
                                                            <v-text-field v-model="form.end_date" :rules="[required]" label="Fecha estimada de termino" filled v-bind="attrs" v-on="on" readonly></v-text-field>
                                                        </template>

                                                        <v-date-picker no-title v-model="form.end_date" @input="end_date_menu = false"></v-date-picker>
                                                    </v-menu>
                                                </v-col>
                                            </v-row>
                                        </v-row>

                                        <v-card-subtitle class="px-0">Planta</v-card-subtitle>

                                        <v-row no-gutters>
                                            <v-row>
                                                <v-col cols="12" xl="6">
                                                    <v-select v-model="form.company_id" :items="companies" item-text="name" item-value="id" label="Planta" filled :rules="[required]" @change="handleChangeCompany"></v-select>
                                                </v-col>
                                                <v-col cols="12" xl="6">
                                                    <v-select v-model="form.line_id" :items="lines" item-text="name" item-value="id" label="Línea" no-data-text="Seleccione una planta" filled :rules="[required]"></v-select>
                                                </v-col>
                                            </v-row>
                                        </v-row>

                                        <v-card-subtitle class="px-0">Clientes</v-card-subtitle>

                                        <v-row no-gutters>
                                            <v-select :items="clients" item-text="name" item-value="id" filled no-data-text="Selecciona una planta" label="Cliente"></v-select>
                                        </v-row>
                                    </v-card-text>
                                    <v-card-actions class="px-0">
                                        <v-btn text @click="step = 1">
                                            <v-icon left>mdi-chevron-left</v-icon>
                                            atrás
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn @click="checkInformationForm()" text>
                                            Continuar
                                            <v-icon right>mdi-chevron-right</v-icon>
                                        </v-btn>
                                    </v-card-actions>
                                </v-form>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-window-item>

        </v-window>

    </div>
</template>

<script>
    import { ref, reactive, useAsync, computed, useContext } from '@nuxtjs/composition-api'

    export default {

        layout:"app",
        middleware:"auth",

        setup() {

            const { $axios } = useContext()
            const domain     = process.env.API_DOMAIN
            const image_url  = "https://ui-avatars.com/api/?"

            let step             = ref(1)
            let information_form = ref(null)
            let start_date_menu  = ref(false)
            let end_date_menu    = ref(false)
            let color            = ref("")
            let rounded          = ref(true)
            let lines            = ref([])
            let clients          = ref([]) 
            let form             = reactive({
                key :"",
                name:"",
                uuid:"",
                slug:"",
                status:"",
                end_date:"",
                line_id:"",
                start_date:"",
                company_id:"",
                project_type_id : "",
            })

            let image  = computed(() => {
                let key         = form.key ? form.key : 'project'
                let set_color   = color.value ? color.value.substring(1) : 'random'
                    
                return `${image_url}rounded=${rounded.value}&background=${set_color}&name=${key}&format=svg`
            })


            const projectTypes = useAsync(async () => { 
                let response = await $axios.get('/api/project-types')
                return response.data.data
            })

            const companies  = useAsync(async () => {
                let response = await $axios.get('/api/companies')
                return response.data.data
            })

            const required = value => {
                return !!value || 'el campo es requerido'
            }

            const handleChangeCompany = async () => {
                if(form.company_id === ""){
                    lines.value = []
                    return
                }

                let response  = await($axios.get('/api/clients', { params:{ company_id:form.company_id } }))
                clients.value = response.data.data

                response      = await $axios.get('/api/lines', { params:{ company_id:form.company_id } })
                lines.value   = response.data.data
            }

            const checkInformationForm = async () => {
                if(!information_form.value.validate()) return
                
                alert(form.key)
            }

            return {
                step,
                form,
                lines,
                color,
                image,
                domain,
                rounded,
                clients,
                required,
                companies,
                projectTypes,
                end_date_menu,
                start_date_menu,
                information_form,
                handleChangeCompany,
                checkInformationForm,
            }

        },
    }
</script>