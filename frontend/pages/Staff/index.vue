<template>
    <v-container>
        <v-card>
            <v-sheet class="pa-5 text-center">
                <h1 class="font-weight-bold">DashBoard - Staff</h1>
            </v-sheet>
            <v-card-text>
                <v-row>
                    <v-col md="4"  v-for="b in box" cols="12">
                        <v-card :elevation="5" rounded class="pa-5 py-4">
                            <div class="text-center text-h5">{{ b.title }}</div>
                            <div class="text-center text-h5">{{ b.value }}</div>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col md="4"  v-for="b in box2" cols="12">
                        <v-card :elevation="5" rounded class="pa-5 py-4">
                            <div class="text-center text-h5">{{ b.title }}</div>
                            <div class="text-center text-h5">{{ b.value }}</div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script setup lang="ts">
import axios from 'axios';
import { api } from '~/API/base';

const box = ref([])
const box2 = ref([])

const fetch = async()=>{
    const token = localStorage.getItem('token')
    try {
        const res = await axios.get(`${api}/dash/staff`,{headers:{Authorization:`Bearer ${token}`}})
        box.value = res.data.box
        box2.value = res.data.box2
    } catch (error) {
        console.error('Error get Dash',error)
    }
}
onMounted(fetch)
</script>

<style scoped>

</style>