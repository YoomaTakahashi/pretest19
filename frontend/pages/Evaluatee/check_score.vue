<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <h1 class="font-weight-bold">ตรวจสอบผลการประเมิน</h1>
            </v-col>
            <v-col cols="12">
                <nuxt-link to="/Evaluatee/Score_member"><v-btn color="blue" >ผลการประเมินของผู้รับการประเมินผล</v-btn></nuxt-link>&nbsp;&nbsp;   
                <nuxt-link to="/Evaluatee/Score_commit"><v-btn color="green" >ผลการประเมินของกรรมการประเมิน</v-btn></nuxt-link>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>