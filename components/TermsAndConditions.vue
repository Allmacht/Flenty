<template>
    <v-dialog v-model="show" max-width="800" @click:outside="handleChangeShowProp" scrollable>
        <v-card>
            <v-card-title>
                Terminos y condiciones
            </v-card-title>

            <v-card-text>

            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="handleChangeShowProp" text>Cerrar</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

export default {
    
    props:{
        show:{
            type:Boolean,
            required:true,
            default:false,
        }
    },

    emits:['change-show'],

    setup(props, { emit }){

        const handleChangeShowProp = () => {
            emit('change-show', false)
        }


        return{
            handleChangeShowProp
        }

    }
}
</script>