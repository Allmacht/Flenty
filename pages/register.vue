<template>
    <v-container fill-height>
        <v-row justify="center" align="center">
            <v-col cols="12" xl="4" lg="5" md="6" sm="10">
                <v-card :disabled="loading" flat>
                    <v-card-title class="px-0">
                        <h1 class="title-quicksand mb-4" :style="{ 'color' : $store.state.primary }">Flenty</h1>
                        <v-spacer></v-spacer>
                        <span style="font-size: 14px">¿Ya tienes una cuenta? inicia sesión <NuxtLink to="/login">aquí</NuxtLink></span>
                    </v-card-title>
                    <v-card-text class="px-0">
                        <v-form ref="registerForm" v-on:submit.prevent="submit">
                            <v-text-field
                                v-model="form.name"
                                :color="$store.state.primary"
                                label="Nombre completo"
                                :rules="[required]"
                                filled
                            ></v-text-field>

                            <v-text-field
                                v-model.trim="form.email"
                                @keydown.space.prevent
                                :color="$store.state.primary"
                                label="Correo electrónico"
                                :rules="[required, validateEmail]"
                                filled
                            ></v-text-field>

                            <v-text-field
                                type="password"
                                v-model="form.password"
                                :color="$store.state.primary"
                                label="Contraseña"
                                @keyup="form.password_confirmation = ''"
                                :rules="[required, validatePassword]"
                                filled
                            ></v-text-field>

                            <v-text-field
                                type="password"
                                v-model="form.password_confirmation"
                                :color="$store.state.primary"
                                label="Confirmar contraseña"
                                :rules="[required, validatePasswordConfirmation]"
                                filled
                            ></v-text-field>

                            <v-checkbox class="mb-5" style="float:right" v-model="form.terms" :rules="[required]">
                                <template v-slot:label>
                                    Acepto
                                    <span class="ml-1" @click="showTermsAndConditions = true" :style="{ 'color':$store.state.primary }">terminos y condiciones</span>
                                </template>
                            </v-checkbox>


                            <v-btn type="submit" :loading="loading" block class="mt-10" :color="$store.state.primary" dark>Registrarse</v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <terms-and-conditions :show="showTermsAndConditions" @change-show="changeShowTermsAndConditionsDialog()"></terms-and-conditions>

    </v-container>
</template>

<script>

    import { ref, reactive, useContext, useRouter } from '@nuxtjs/composition-api'

    export default {

        auth:'guest',
        layout:'guest',
        middleware:'auth',

        layout:'guest',

        head:{
            title:"Registrate"
        },

        setup(){

            const { $axios, $notify, $auth } = useContext()
            const router                     = useRouter()
            
            let showTermsAndConditions = ref(false)
            let form                   = reactive({ folio: "", name:"", email:"", password:"", password_confirmation:"", terms:false })
            let registerForm           = ref(null)
            let loading                = ref(false)


            //Validations
            const required = v => {
                return !!v || 'El campo es requerido'
            }

            const validateEmail = v => {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'El correo electrónico no es válido'
            }

            const validatePassword = v => {
                return v.length >= 8 || 'La contraseña debe tener al menos 8 caracteres'
            }

            const validatePasswordConfirmation = v => {
                return v === form.password || 'Las contraseñas no coinciden'
            }


            //emits
            const changeShowTermsAndConditionsDialog = () => {
                showTermsAndConditions.value = !showTermsAndConditions.value
            }

            //methods
            const submit = () => {

                if(!registerForm.value.validate()) return

                loading.value = true

                $axios.post('/api/register', form)                
                .then(() => {
                    
                    $auth.loginWith('laravelSanctum', { data: { email:form.email, password:form.password } })
                    .then(() => {
                        router.push('/home')
                    })
                    .catch(error => {
                        router.push('/login')
                    })

                })
                .catch(error => {

                    loading.value = false

                    if(error.response && error.response.data && typeof error.response.data.errors === 'object'){
                        for(let prop in error.response.data.errors){
                            error.response.data.errors[prop].forEach(message => {
                                $notify.error({
                                    title:"Error",
                                    message:message
                                })
                            })
                        }

                        return
                    }

                    else{
                        $notify.error({
                            title:"Error",
                            message:"No podemos procesar la solicitud en este momento, intente más tarde."
                        })
                    }
                })
                
            }


            return{
                form,
                submit, 
                loading,
                required,
                registerForm,
                validateEmail,
                validatePassword,
                showTermsAndConditions,
                validatePasswordConfirmation,
                changeShowTermsAndConditionsDialog,
            }

        }
    }

</script>