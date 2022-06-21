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
                                            <v-img class="mx-auto" :src="api_domain+projectType.image" width="120px"></v-img>
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
                                                        <v-text-field v-model="form.key" :rules="[required, maxLength]" filled label="Key">
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
                                                            <v-text-field v-model="form.initial_date" :rules="[required]" label="Fecha de inicio" filled v-bind="attrs" v-on="on" readonly></v-text-field>
                                                        </template>

                                                        <v-date-picker no-title v-model="form.initial_date" @input="start_date_menu = false"></v-date-picker>
                                                    </v-menu>
                                                </v-col>
                                                <v-col>
                                                    <v-menu v-model="end_date_menu" offset-y :close-on-content-click="false" transition="scale-transition" min-width="auto">
                                                        <template v-slot:activator="{ attrs, on }">
                                                            <v-text-field v-model="form.projected_end_date" :rules="[required]" label="Fecha estimada de termino" filled v-bind="attrs" v-on="on" readonly></v-text-field>
                                                        </template>

                                                        <v-date-picker no-title v-model="form.projected_end_date" @input="end_date_menu = false"></v-date-picker>
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
                                            <v-select v-model="form.client_id" :items="clients" item-text="name" item-value="id" filled no-data-text="Selecciona una planta" label="Cliente" :rules="[required]"></v-select>
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

            <v-window-item :value="3">
                <v-container>
                    <v-row justify="center" align="center">
                        <v-col cols="12" xl="7" class="mt-10 mb-1 font-weight-black">
                            Ingrese una descripción del proyecto
                        </v-col>
                        <v-col cols="12" xl="7">
                            <v-card :disabled="loading" flat>
                                <v-card-text class="px-0">
                                    <description-form @setDescription="(n) => { form.description = n }" :description="description"></description-form>
                                </v-card-text>
                                <v-card-actions>
                                        <v-btn text @click="step = 2" :disabled="loading">
                                            <v-icon left>mdi-chevron-left</v-icon>
                                            atrás
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn text @click="submit" :disabled="loading">
                                            Continuar
                                            <v-icon right>mdi-chevron-right</v-icon>
                                        </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>
            </v-window-item>

            <v-window-item :value="4">

                <v-container>
                    <v-row justify="center" align="center">
                        <v-col cols="12" xl="7" class="mt-10 mb-1 text-center">
                            <h1>Proyecto creado correctamente! 🎉</h1>
                        </v-col>
                        <v-col cols="12" xl="7">
                            <v-card flat>
                                <v-card-title>
                                    invita a tu equipo a unirse
                                    <v-spacer></v-spacer>
                                    <v-img :src="form.image" max-width="60"></v-img>
                                </v-card-title>
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-card outlined>
                                                <v-card-subtitle>Inivitar por enlace</v-card-subtitle>
                                                <v-card-text>
                                                    <v-text-field :value="invitationLink" class="py-3" hide-details outlined readonly append-icon="mdi-content-copy"></v-text-field>
                                                </v-card-text>
                                            </v-card>

                                            <v-card class="mt-4" outlined>
                                                <v-card-subtitle>invitar por correo electrónico</v-card-subtitle>
                                                <v-card-text>
                                                    <v-row v-for="(member, index) in team" :key="index">
                                                        <v-col cols="8">
                                                            <v-text-field v-model="member.email" hide-details label="Correo electrónico" filled>
                                                                <template v-if="team.length > 1" v-slot:prepend>
                                                                    <v-icon @click="deleteMemberOfTeam(index)" color="red">mdi-close</v-icon>
                                                                </template>
                                                            </v-text-field>
                                                        </v-col>
                                                        <v-col cols="4">
                                                            <v-select v-model="member.role" :items="roles" item-text="text" item-value="role" hide-details label="Rol" filled></v-select>
                                                        </v-col>
                                                    </v-row>
                                                </v-card-text>
                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
                                                    <v-btn text :color="$store.state.primary" @click="addMemberToTeam" class="text-lowercase">Agregar otro</v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn @click="inviteMembers" text>
                                        Finalizar
                                        <v-icon>mdi-chevron-right</v-icon>
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-container>

            </v-window-item>

        </v-window>

        <v-overlay class="text-center" v-model="loading">
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <v-progress-circular indeterminate size="64"></v-progress-circular>
                    </v-col>

                    <v-col cols="12">
                        Creando proyecto, por favor espere..
                    </v-col>
                </v-row>
            </v-container>
        </v-overlay>

    </div>
</template>

<script>
    import { ref, reactive, useAsync, computed, useContext } from '@nuxtjs/composition-api'

    export default {

        layout:"app",
        middleware:"auth",

        head:{
            title:"Nuevo proyecto"
        },

        setup() {

            const { $axios, $notify, $auth } = useContext()
            const api_domain                 = process.env.API_DOMAIN
            const base_domain                = process.env.BASE_DOMAIN
            const image_url                  = "https://ui-avatars.com/api/?"

            let step             = ref(4)
            let information_form = ref(null)
            let start_date_menu  = ref(false)
            let end_date_menu    = ref(false)
            let color            = ref("")
            let loading          = ref(false)
            let rounded          = ref(true)
            let lines            = ref([])
            let clients          = ref([])
            let team             = ref([{ email:"", role:"" }])
            let roles            = ref([{ role:"Collaborator", text:"Colaborador" }, { role:"Agent", text:"Agente" }])
            let form             = reactive({
                key               :"",
                name              :"",
                uuid              :"",
                slug              :"",
                image             :"",
                description       :"",
                initial_date      :"",
                projected_end_date:"",
                owner_id          :$auth.user.id,
                qa_id             :$auth.user.id,
                status            :"IN PROCESS",
                line_id           :"",
                client_id         :"",
                company_id        :"",
                project_type_id   :"",
            })

            let image = computed(() => {
                let key         = form.key ? form.key : 'project'
                let set_color   = color.value ? color.value.substring(1) : 'random'
                let url         = `${image_url}rounded=${rounded.value}&background=${set_color}&name=${key}&format=svg`
                form.image      = url
                    
                return url
            })

            let description = computed(() => {
                return `<h3>Proyecto "${form.name}"</h3><p>Agrege una descripción al proyecto...</p>`
            })

            let invitationLink = computed(() => {
                return `${base_domain}/register/?project=${form.uuid}`
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

            const maxLength = value => {
                return value.length <= 4 || 'La clave no debe ser mayor a 4 caracteres'
            }

            const handleChangeCompany = async () => {
                if(form.company_id === ""){
                    lines.value = []
                    return
                }

                let response  = await $axios.get('/api/clients', { params:{ company_id:form.company_id, full_data:true } })
                clients.value = response.data.data

                response      = await $axios.get('/api/lines', { params:{ company_id:form.company_id } })
                lines.value   = response.data.data
            }

            const checkInformationForm = async () => {
                if(!information_form.value.validate()) return
                
                try{

                    await $axios.post('/api/projects', form, { params:{ only_validation:true } })
                    step.value = 3

                }
                
                catch(err){
                    if(err.response && err.response.data.errors){
                        for(let prop in err.response.data.errors){
                            err.response.data.errors[prop].forEach(message => {
                                $notify.error({
                                    title:"Error",
                                    message:message
                                })
                            })
                        }
                    }
                }
            }

            const submit = async () => {
                loading.value = true

                try{

                    let response  = await $axios.post('/api/projects', form)
                    form.uuid     = response.data.data.id
                    loading.value = false
                    step.value    = 4

                }catch(err){

                    loading.value = false

                    if(err.response && err.response.data.errors){
                        for(let prop in err.response.data.errors){
                            err.response.data.errors[prop].forEach(message => {
                                $notify.error({
                                    title:"Error",
                                    message:message
                                })
                            })
                        }

                        return
                    }

                    $notify.error({
                        title:"Error",
                        message:"Ha ocurrido un error, intente más tarde."
                    })

                }
            }

            const addMemberToTeam = () => {
                team.value.push({ email:"", role:"", project_id:"" })
            }

            const deleteMemberOfTeam = index => {
                console.log(team)
                team.value.splice(index, 1)
            }

            const inviteMembers = async () => {

                let empty = true

                team.value.forEach(member => {
                    if(member.email !== '' && member.role !== '')
                    {
                        empty = false
                    }
                })

                if(!empty){

                    let data         = {}
                    data.project     = form.uuid
                    data.invitations = team.value

                    try{

                        $axios.post('', data)

                    }catch(err){

                        console.log(err)
                        
                    }
                }
            }



            return {
                step,
                form,
                team,
                lines,
                roles,
                color,
                image,
                submit,
                rounded,
                loading,
                clients,
                required,
                companies,
                maxLength,
                api_domain,
                description,
                projectTypes,
                end_date_menu,
                inviteMembers,
                invitationLink,
                start_date_menu,
                addMemberToTeam,
                information_form,
                deleteMemberOfTeam,
                handleChangeCompany,
                checkInformationForm,
            }

        },
    }
</script>