<template>
	<v-app>
		<v-main>
			<Nuxt />
    	</v-main>
  	</v-app>
</template>


<script>
    export default {
        middleware: 'auth',
        auth: 'guest',
    }
</script>

<style scoped>

    .v-toolbar__title{
        font-weight: 700 !important;
        font-size: 40px;
    }

    @media screen and (min-width: 1264px){

        .v-bar-title{
            padding: 0 300px 0 300px;
        }
    }


</style>